import axios from "axios";


function filterSong(song) {
  const neteaseBaseUrl = 'https://music.163.com'
  const downloadUrl = new URL("/api/song/lyric", neteaseBaseUrl)
  const searchParams = new URLSearchParams()
  // this is specific to netease
  searchParams.append("id", song.id)
  searchParams.append("lv", -1)
  searchParams.append("kv", -1)
  searchParams.append("tv", -1)
  downloadUrl.search = searchParams.toString()

  return {
    "title": song.name,
    "artists": song.artists,
    "album": song.album.name,
    "source": "NetEase",
    "downloadUrl": downloadUrl.toString()
  }
}

export async function search(metadata) {
  const neteaseBaseUrl = 'https://music.163.com'
  const neteaseSearchUrl = new URL("/api/search/get", neteaseBaseUrl)
  const result = await axios.get(neteaseSearchUrl.toString(),
    { params: { "s": (metadata.title || '') + (metadata.artist || ''), "type": 1 } })
  console.log(result.data.result.songs)
  return result.data.result.songs.map(filterSong)
}

export async function download(link) {
  const result = (await axios.get(link)).data
  if ('nolyric' in result || 'uncollected' in result) {
    throw new Error("This item has no lyrics")
  }

  const lyric = result.lrc.lyric
  return Buffer.from(lyric, 'utf-8').toString();
}
