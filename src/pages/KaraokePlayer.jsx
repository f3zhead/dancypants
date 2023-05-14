import { useLocation } from "react-router-dom";
import AudioRecorderControl from "../components/AudioRecorderControl";
import AudioPlayer from "../components/AudioPlayer"
import { Box, Center, Image, Flex, Badge, Text, Heading } from "@chakra-ui/react"
import background from "../components/logo.png"


function KaraokePlayer( { videoData }) {
  const location = useLocation();
  const data = location.state;
  const myStyle = {
    color: "white",
    backgroundColor: "DodgerBlue",
    padding: "10px",
    fontFamily: "Sans-Serif"
  };
  return (
    <Center h="100vh">
      <Box p="5" maxW="320px" borderWidth="1px" background="red">
        <Flex align="baseline" mt={2}>
          <div className="App">
            <Heading className="App-header" style={myStyle} size='md'>
              Wasm Audio Tutorial
            </Heading>
            <AudioPlayer videoId={data.videoId} />
            <div className="App-content">
              <AudioRecorderControl />
            </div>
          </div>
        </Flex>
      </Box>
    </Center>
  )
}

export default KaraokePlayer;
