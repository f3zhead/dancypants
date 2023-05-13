import { useEffect, useRef, useState } from 'react';
import { getLyrics } from '../util/download/netease'
import useEventListener from '../hooks/useEventListener'

function AudioPlayer({ videoData }) {
  const videoId = videoData.videoId.slice(9, 20)
  const [lyrics, setLyrics] = useState('');
  useEffect(() => {
    getLyrics({ title: videoData.title, metadata: videoData.uploaderName }).then((result) => (setLyrics(result)))
  },
    [])


  const canvasRef = useRef(null)
  const trackRef = useRef(null)

  useEventListener(trackRef, "cuechange", (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let cues = event.target.track.activeCues[0].text;
    context.font = "40px sans serif"
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillText(cues, canvas.width / 2, canvas.height / 2)
  })

  let blob = new Blob([lyrics], { type: "text/vtt" })

  let trackPlayer =
    <track default
      ref={trackRef} kind="captions"
      src={URL.createObjectURL(blob)} />
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
