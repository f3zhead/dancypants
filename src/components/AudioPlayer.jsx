import { useEffect, useRef, useState } from 'react';
import { getLyrics } from '../util/download/netease'
import { lrcToVtt } from '../util/convert'
import useEventListener from '../hooks/useEventListener'

function AudioPlayer({ videoData }) {

  const canvasRef = useRef(null)
  const trackRef = useRef(null)
  const videoId = videoData.url.slice(9, 20)
  const [lyrics, setLyrics] = useState('');
  useEffect(() => {
    getLyrics({ title: videoData.title, metadata: videoData.uploaderName }).then((result) => {
      const lyrics = lrcToVtt(result);
      setLyrics(lrcToVtt(result))
      const blob = new Blob([lyrics], { type: "text/vtt" })
      console.log(blob)
      console.log('fuk')
      trackRef.current.src = URL.createObjectURL(blob)

    })
  },
    [])
  // useEffect(() => {
  //   const blob = new Blob([lyrics], { type: "text/vtt" })
  //   console.log(blob)
  //   trackRef.current.src = URL.createObjectURL(blob)
  // }, [lyrics])



  useEventListener(trackRef, "cuechange", (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let cues = event.target.track.activeCues[0].text;
    context.font = "40px sans serif"
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillText(cues, canvas.width / 2, canvas.height / 2)
  })

  let trackPlayer =
    <track default
      ref={trackRef} kind="captions"
      src={"/yijianmei.vtt"} />
  let lyricDisplay = <canvas ref={canvasRef} width={700} ></canvas >

  let url = new URL('https://vid.puffyan.us/latest_version')
  url.searchParams.append('id', videoId)
  return (
    <div>
      {lyricDisplay}
      <audio controls src={url.toString()}>
        {trackPlayer}
      </audio>
    </div>
  )
}

export default AudioPlayer;
