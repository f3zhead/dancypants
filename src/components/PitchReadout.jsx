import { gradePitch } from '../util/gradescoring'
function PitchReadout({ running, latestPitch }) {
  return (
    <div className="Pitch-readout">
      {latestPitch
        ? `You are off by: ${latestPitch.toFixed(1)} Hz. Singing score: ${gradePitch(latestPitch.toFixed(1))}`
        : running
          ? "Listening..."
          : "Paused"}
    </div>
  );
}

export default PitchReadout;
