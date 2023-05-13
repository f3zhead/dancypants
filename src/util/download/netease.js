import axios from "axios";


function filterSong(song) {
  const neteaseBaseUrl = 'https://music.163.com'
  const downloadUrl = new URL("/api/song/lyric", neteaseBaseUrl)
  // this is specific to netease
  downloadUrl.searchParams.append("id", song.id)
  downloadUrl.searchParams.append("lv", -1)
  downloadUrl.searchParams.append("kv", -1)
  downloadUrl.searchParams.append("tv", -1)

  const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(downloadUrl.toString())}`

  return {
    "title": song.name,
    "artists": song.artists,
    "album": song.album.name,
    "source": "NetEase",
    "downloadUrl": corsProxyUrl
  }
}

async function search(metadata) {
  const neteaseBaseUrl = 'https://music.163.com'
  const neteaseSearchUrl = new URL("/api/search/get", neteaseBaseUrl)
  neteaseSearchUrl.searchParams.append("s", (metadata.title || '') + (metadata.artist || ''))
  neteaseSearchUrl.searchParams.append("type", 1)
  console.log(neteaseSearchUrl.toString())

  const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(neteaseSearchUrl.toString())}`


  const result = await axios.get(corsProxyUrl)
  console.log(result.data.result.songs)
  return result.data.result.songs.map(filterSong)
}

async function download(link) {
  const result = (await axios.get(link)).data
  if ('nolyric' in result || 'uncollected' in result) {
    throw new Error("This item has no lyrics")
  }
  const lyric = result.lrc.lyric
  return lyric
  // return Buffer.from(lyric, 'utf-8').toString();
}

// yay
export async function getLyrics(metadata) {
  const searchResults = await search(metadata)
  console.log(searchResults[0])
  return download(searchResults[0].downloadUrl)
}
