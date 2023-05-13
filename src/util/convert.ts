function formatTime(seconds: number) {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
    .filter(a => a)
    .join(':')
}


// i will implement a real parser in elm later trust
export function lrcToVtt(lrcSubtitle: string, fileLength: number) {
  const splittedSubtitles: Array<string> = lrcSubtitle.split('\n')
  splittedSubtitles.push(`[${formatTime(fileLength)}] `)
  let result: Array<string> = ["WEBVTT\n"]
  for (let i = 0; i < splittedSubtitles.length - 1; i++) {
    let line = splittedSubtitles[i]
    let nextLine = splittedSubtitles[i + 1]
    const timestamp = line.slice(1, 10)
    const lyric = line.slice(13)
    const nextTimestamp = nextLine.slice(1, 10)
    result.push(`${timestamp} --> ${nextTimestamp}`)
    result.push(lyric + '\n')
  }
  return result.join('\n')
}
