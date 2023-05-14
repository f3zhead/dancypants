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
  const lyric = result.lrc.lyric
  return lyric
  // return Buffer.from(lyric, 'utf-8').toString();
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

function chooseSong(searchResults, metadata) {
  // forgive my sins
  const songDuration = metadata.duration;
  const songLengthDiffs = searchResults.map((element) => [Math.abs(songDuration - element.duration), element.id])
  console.log(songLengthDiffs)

  let smallestSongDiff = songLengthDiffs[0][0]
  let smallestSongDiffId = songLengthDiffs[0][1]
  for (const element of songLengthDiffs) {
    if (element[0] < smallestSongDiff) {
      smallestSongDiff = element[0]
      smallestSongDiffId = element[1]
    }
  }
  return getDownloadUrl(smallestSongDiffId)
}
// yay
export async function getLyrics(metadata) {
  const searchResults = await search(metadata)
  // const songChoiceUrl = chooseSong(searchResults, metadata)
  const songChoiceUrl = getDownloadUrl(searchResults[0].id)
  return download(songChoiceUrl)
}
