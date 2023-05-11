import { useLocation } from "react-router-dom";
import AudioRecorderControl from "../components/AudioRecorderControl";
import AudioPlayer from "../components/AudioPlayer"

function KaraokePlayer() {
  const location = useLocation();
  const data = location.state;
  return (
    <div className="App">
      <header className="App-header">
        Wasm Audio Tutorial
      </header>
      <AudioPlayer videoId={data.videoId}/>
      <div className="App-content">
        <AudioRecorderControl />
      </div>
    </div>
  )
}

export default KaraokePlayer;
