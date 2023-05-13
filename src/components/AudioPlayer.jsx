import { useEffect, useRef } from 'react';
import useEventListener from '../hooks/useEventListener'

function AudioPlayer() {
  const canvasRef = useRef(null)
  const trackRef = useRef(null)
  useEventListener(trackRef, "cuechange", (event) => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    let cues = event.target.track.activeCues[0].text;
    console.log(cues)
    console.log("meow")
    context.font = "40px sans serif"
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.fillText(cues, canvas.width / 2, canvas.height / 2)
  })

  let trackPlayer =
    <track default
      ref={trackRef} kind="captions"
      srcLang="zh"
      src="/yijianmei.vtt" />
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
