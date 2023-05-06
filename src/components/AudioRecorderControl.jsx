import { useState } from 'react'
import PitchReadout from "./PitchReadout";
import { setupAudio } from "../setupAudio";

function AudioRecorderControl() {
  const [audio, setAudio] = useState(undefined);
  const [running, setRunning] = useState(false);
  const [latestPitch, setLatestPitch] = useState(undefined);

  // Initial state. Initialize the web audio once a user gesture on the page
  // has been registered.
  if (!audio) {
    return (
      <button
        onClick={async () => {
          setAudio(await setupAudio(setLatestPitch));
          setRunning(true);
        }}
      >
        Start listening
      </button>
    );
  }

  // Audio already initialized. Suspend / resume based on its current state.
  const { context } = audio;
  return (
    <div>
      <button
        onClick={async () => {
          if (running) {
            await context.suspend();
            setRunning(context.state === "running");
          } else {
            await context.resume();
            setRunning(context.state === "running");
          }
        }}
        disabled={context.state !== "running" && context.state !== "suspended"}
      >
        {running ? "Pause" : "Resume"}
      </button>
      <PitchReadout running={running} latestPitch={latestPitch} />
    </div>
  );
}
export default AudioRecorderControl;
