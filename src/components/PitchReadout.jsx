function PitchReadout({ running, latestPitch }) {
  return (
    <div className="Pitch-readout">
      {latestPitch
        ? `You are off by: ${latestPitch.toFixed(1)} Hz`
        : running
          ? "Listening..."
          : "Paused"}
    </div>
  );
}

export default PitchReadout;
