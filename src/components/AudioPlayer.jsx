import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import PitchReadout from "./PitchReadout";
import { getLyrics } from '../util/download/lyrics'
import { lrcToVtt } from '../util/convert'
import useEventListener from '../hooks/useEventListener'
import { Center, Box } from '@chakra-ui/layout';
import { setupAudio } from '../setupAudio';

function AudioPlayer({ videoData }) {

  const canvasRef = useRef(null)
  const trackRef = useRef(null)
  const videoId = videoData.url.slice(9, 20)
  const [lyrics, setLyrics] = useState('');
  const [audioUrl, setAudioUrl] = useState('');

  const [audio, setAudio] = useState(undefined);
  const [running, setRunning] = useState(false);
  const [latestPitch, setLatestPitch] = useState(undefined);


  useEffect(() => {
    getLyrics(videoData).then((result) => {
      const lyrics = lrcToVtt(result);
      setLyrics(lrcToVtt(result))
      const blob = new Blob([lyrics], { type: "text/vtt;charset=UTF-8" })
      trackRef.current.src = URL.createObjectURL(blob)
    })
  },
    [])
  useEffect(() => {
    axios.get(`https://pipedapi.leptons.xyz/streams/${videoId}`).then((response) => {
      setAudioUrl(response.data.audioStreams[0].url)
    })
  }, []
  )
  // useEffect(() => {
  //   const blob = new Blob([lyrics], { type: "text/vtt" })
  //   console.log(blob)
  //   trackRef.current.src = URL.createObjectURL(blob)
  // }, [lyrics])



  useEventListener(trackRef, "cuechange", (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let cues = event.target.track.activeCues[0].text;
    context.font = canvas.width / cues.length + "px sans serif"
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillText(cues, 0, canvas.height / 1.5)
  })

  let trackPlayer = <track default ref={trackRef} kind="captions" src={"/yijianmei.vtt"} />
  let lyricDisplay = <canvas ref={canvasRef} width={window.innerWidth - 500} height={window.innerHeight - 300}></canvas >

  return (
    <Box>
      {lyricDisplay}
      <Center>
        <audio controls src={audioUrl} onPlay={async () => {
          setAudio(await setupAudio(setLatestPitch));
          setRunning(true);

        }} crossOrigin="anonymous" >
          {trackPlayer}
        </audio>
      </Center>
      <PitchReadout running={running} latestPitch={latestPitch} />
    </Box>
  )
}

export default AudioPlayer;
