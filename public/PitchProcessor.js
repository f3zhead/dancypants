import "./TextEncoder.js";
import init, { WasmPitchDetector } from "./wasm-audio/wasm_audio.js";

class PitchProcessor extends AudioWorkletProcessor {
  constructor() {
    super();

    // Initialized to an array holding a buffer of samples for analysis later -
    // once we know how many samples need to be stored. Meanwhile, an empty
    // array is used, so that early calls to process() with empty channels
    // do not break initialization.
    this.mediaSamples = []
    this.micSamples = []
    this.totalSamples = 0;

    // Listen to events from the PitchNode running on the main thread.
    this.port.onmessage = (event) => this.onmessage(event.data);

    this.detector = null;
    // hacky hack
    this.numAudioSamplesPerAnalysis = 1024
  }

  onmessage(event) {
    if (event.type === "send-wasm-module") {
      // PitchNode has sent us a message containing the Wasm library to load into
      // our context as well as information about the audio device used for
      // recording.
      init(WebAssembly.compile(event.wasmBytes)).then(() => {
        this.port.postMessage({ type: 'wasm-module-loaded' });
      });
    } else if (event.type === 'init-detector') {
      const { sampleRate, numAudioSamplesPerAnalysis } = event;

      // Store this because we use it later to detect when we have enough recorded
      // audio samples for our first analysis.
      this.numAudioSamplesPerAnalysis = numAudioSamplesPerAnalysis;

      this.detector = WasmPitchDetector.new(sampleRate, numAudioSamplesPerAnalysis);

      // Holds a buffer of audio sample values that we'll send to the Wasm module
      // for analysis at regular intervals.
      this.mediaSamples = new Array(numAudioSamplesPerAnalysis).fill(0);
      this.micSamples = new Array(numAudioSamplesPerAnalysis).fill(0);
      this.totalSamples = 0;
    }
  };

  process(inputs, outputs) {
    // inputs contains incoming audio samples for further processing. outputs
    // contains the audio samples resulting from any processing performed by us.
    // Here, we are performing analysis only to detect pitches so do not modify
    // outputs.

    // inputs holds one or more "channels" of samples. For example, a microphone
    // that records "in stereo" would provide two channels. For this simple app,
    // we use assume either "mono" input or the "left" channel if microphone is
    // stereo.

    // console.log(inputs)
    const mediaInputChannels = inputs[0];
    const micInputChannels = inputs[1];


    // inputSamples holds an array of new samples to process.
    const mediaInputSamples = mediaInputChannels[0];
    const micInputSamples = micInputChannels[0];
    // console.log(mediaInputSamples, micInputSamples)

    // only process if we have samples from both the media and microphone
    if (mediaInputSamples.length !== 128 || micInputSamples.length !== 128) {
      console.log('fuck!')
    }

    // In the AudioWorklet spec, process() is called whenever exactly 128 new
    // audio samples have arrived. We simplify the logic for filling up the
    // buffer by making an assumption that the analysis size is 128 samples or
    // larger and is a power of 2.
    console.log("total samples", this.totalSamples)
    console.log("numaudiosamples", this.numAudioSamplesPerAnalysis)
    if (this.totalSamples < this.numAudioSamplesPerAnalysis) {
      console.log("fewer samples than 1024")
      for (let i = 0; i < mediaInputSamples.length; i++) {
        this.mediaSamples[this.totalSamples + i] = mediaInputSamples[i];
        this.micSamples[this.totalSamples + i] = micInputSamples[i]
        // this.totalSamples++
      }
      this.totalSamples += mediaInputSamples.length
    } else {
      console.log("more samples, cycling")
      // Buffer is already full. We do not want the buffer to grow continually,
      // so instead will "cycle" the samples through it so that it always
      // holds the latest ordered samples of length equal to
      // numAudioSamplesPerAnalysis.

      // Shift the existing samples left by the length of new samples (128).
      const numNewSamples = mediaInputSamples.length;
      console.log('numnewsamples', numNewSamples)
      const numExistingSamples = this.mediaSamples.length - numNewSamples;
      console.log("existing samples", numExistingSamples)
      for (let i = 0; i < numExistingSamples; i++) {
        this.mediaSamples[i] = this.mediaSamples[i + numNewSamples];
        this.micSamples[i] = this.micSamples[i + numNewSamples];
      }
      // Add the new samples onto the end, into the 128-wide slot vacated by
      // the previous copy.
      for (let i = 0; i < numNewSamples; i++) {
        this.mediaSamples[numExistingSamples + i] = mediaInputSamples[i];
        this.micSamples[numExistingSamples + i] = micInputSamples[i];
      }
      this.totalSamples += mediaInputSamples.length;
    }

    // Once our buffer has enough samples, pass them to the Wasm pitch detector.
    if (this.totalSamples >= this.numAudioSamplesPerAnalysis && this.detector) {
      console.log("# media samples to be sent", this.mediaSamples.length)
      console.log("# mic samples to be sent", this.micSamples.length)
      const mediaPitch = this.detector.detect_pitch(this.mediaSamples);
      const micPitch = this.detector.detect_pitch(this.micSamples);

      if (mediaPitch !== 0 && micPitch !== 0) {
        this.port.postMessage({ type: "pitchDiff", pitchDiff: Math.abs(mediaPitch - micPitch) });
      }
    }

    // Returning true tells the Audio system to keep going.
    return true;
  }
}

registerProcessor("PitchProcessor", PitchProcessor);
