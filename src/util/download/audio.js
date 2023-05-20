import axios from 'axios';

const SAMPLE_RATE = 44100
const WARNING_DURATION = 30
// const WARNING_MESSAGE = "Currently the model prediction is very slow, please consider to process only signals of less than 30 seconds"

export async function loadRemoteAudio(context, audioLink) {
  const remoteAudioData = await axios.get(audioLink, { responseType: "arraybuffer" })
  const decodedAudioData = await context.decodeAudioData(remoteAudioData)
  return decodedAudioData;
}


export function splitChannels(audioBuffer) {
  return [audioBuffer.getChannelData(0), audioBuffer.getChannelData(1)]
}

// function decodeFile(fileName, arrBuffer) {
//   const audioContext = new AudioContext({ "sampleRate": SAMPLE_RATE })
//   return audioContext.decodeAudioData(arrBuffer,
//     function(data) {
//       const source = audioContext.createBufferSource()
//       source.buffer = data
//       if (source.buffer.sampleRate !== SAMPLE_RATE || source.buffer.numberOfChannels !== 2) {
//         console.log(source.buffer.sampleRate, source.buffer.numberOfChannels)
//         alert("Sorry, we can oly process songs with a 44100 sample rate and 2 channels")
//         throw new Error('Cannot process song')
//       }

//       console.log("Returning decoded files..")
//       return [source.buffer.getChannelData(0), source.buffer.getChannelData(1)]
//       // return [source.buffer.getChannelData(0), source.buffer.getChannelData(1)]
//     }
//     , () => {
//       console.log("Error on decoding audio context")
//     })
// }


// export { readFile }
