import { useLocation } from "react-router-dom";
import { Heading, Box } from '@chakra-ui/react'
import AudioRecorderControl from "../components/AudioRecorderControl";
import AudioPlayer from "../components/AudioPlayer"

function KaraokePlayer() {
  const location = useLocation();
  const data = location.state;
  return (
    <Box>
      <Heading>Now Playing</Heading>
      <AudioPlayer videoData={data} />
      <AudioRecorderControl />
    </Box>
  )
}

export default KaraokePlayer;
