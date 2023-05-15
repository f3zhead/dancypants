import { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { getLyrics } from '../util/download/lyrics'
import { lrcToVtt } from '../util/convert'
import useEventListener from '../hooks/useEventListener'

function AudioPlayer({ videoData }) {

  const canvasRef = useRef(null)
  const trackRef = useRef(null)
  const videoId = videoData.url.slice(9, 20)
  const [lyrics, setLyrics] = useState('');
  const [audioUrl, setAudioUrl] = useState('');


  useEffect(() => {
    getLyrics(videoData).then((result) => {
      const lyrics = lrcToVtt(result);
      setLyrics(lrcToVtt(result))
      const blob = new Blob([lyrics], { type: "text/vtt" })
      trackRef.current.src = URL.createObjectURL(blob)
    })
  },
    [])
  useEffect(() => {
    axios.get(`https://pipedapi.kavin.rocks/streams/${videoId}`).then((response) => {
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

  let trackPlayer =
    <track default
      ref={trackRef} kind="captions"
      src={"/yijianmei.vtt"} />
  let lyricDisplay = <canvas ref={canvasRef} width={window.innerWidth - 150} height={window.innerHeight - 183}></canvas >
  return (
    <div>
      {lyricDisplay}
      <audio controls src={audioUrl} crossOrigin="anonymous" >
        {trackPlayer}
      </audio>
    </div>
  )
}

export default AudioPlayer;
