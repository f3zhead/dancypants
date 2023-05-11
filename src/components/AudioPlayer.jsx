
function AudioPlayer({videoId}) {
  let url = new URL('https://vid.puffyan.us/latest_version')
  url.searchParams.append('id', videoId)
  return (
    <audio controls src={url.toString()}></audio>
  )
}

export default AudioPlayer;
