import AudioRecorderControl from "../components/AudioRecorderControl";
import AudioPlayer from "../components/AudioPlayer"
function KaraokePlayer() {
  return (
    <div className="App">
      <header className="App-header">
        Wasm Audio Tutorial
      </header>
      <AudioPlayer />
      <div className="App-content">
        <AudioRecorderControl />
      </div>
    </div>
  )
}

export default KaraokePlayer;
