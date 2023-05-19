import axios from "axios";


// function filterSong(song) {
//   const downloadSongUrl = getDownloadUrl(song.id)

//   return {
//     "title": song.name,
//     "artists": song.artists,
//     "album": song.album.name,
//     "duration": song.duration,
//     "source": "NetEase",
//     "downloadUrl": downloadSongUrl
//   }
// }

async function search(metadata) {
  const neteaseBaseUrl = 'https://music.163.com'
  const neteaseSearchUrl = new URL("/api/search/get", neteaseBaseUrl)
  neteaseSearchUrl.searchParams.append("s", (metadata.title || '') + (metadata.artist || ''))
  neteaseSearchUrl.searchParams.append("type", 1)

  const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(neteaseSearchUrl.toString())}`


  const result = await axios.get(corsProxyUrl)
  return result.data.result.songs
}

async function download(link) {
  const result = (await axios.get(link)).data
  if ('nolyric' in result || 'uncollected' in result) {
    throw new Error("This item has no lyrics")
  }
  return result
  // return Buffer.from(lyric, 'utf-8').toString();
}

function getLyric(lyricData) {
  return lyricData.lrc.lyric
}

function getDownloadUrl(neteaseSongId) {
  const neteaseBaseUrl = 'https://music.163.com'
  const downloadUrl = new URL("/api/song/lyric", neteaseBaseUrl)
  // this is specific to netease
  downloadUrl.searchParams.append("id", neteaseSongId)
  downloadUrl.searchParams.append("lv", -1)
  downloadUrl.searchParams.append("kv", -1)
  downloadUrl.searchParams.append("tv", -1)

  const corsProxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(downloadUrl.toString())}`
  return corsProxyUrl;
}

async function chooseSong(searchResults, metadata) {
  let lyric;
  // forgive my sins
  const songDuration = metadata.duration;

  function getSongDiff(songLength) {
    return Math.abs(songLength - songDuration)
  }
  searchResults.sort((a, b) => getSongDiff(a.duration / 1000) - getSongDiff(b.duration / 1000))
  console.log('search result', searchResults)
  for (const element of searchResults) {
    lyric = getLyric(await download(getDownloadUrl(element.id)))
    if (!lyric) {
      continue
    } else {
      return lyric;
    }
  }
  return "o dear"
}
// yay
export async function getLyrics(metadata) {
  const searchResults = await search(metadata)
  // const songChoiceUrl = chooseSong(searchResults, metadata)
  return await chooseSong(searchResults, metadata)
}
