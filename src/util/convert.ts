
// function formatTime(seconds: number) {
//   const h = Math.floor(seconds / 3600)
//   const m = Math.floor((seconds % 3600) / 60)
//   const s = seconds % 60
//   return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
//     .filter(a => a)
//     .join(':')
// }

var helper = {
  toMilliseconds: function(s) {
    var match = /^\s*(\d+):(\d{1,2})([.,](\d{1,3}))?\s*$/.exec(s);
    var mm = parseInt(match[1]);
    var ss = parseInt(match[2]);
    var ff = match[4] ? parseInt(match[4]) : 0;
    var ms = mm * 60 * 1000 + ss * 1000 + ff * 10;
    return ms;
  },
  toTimeString: function(ms) {
    var mm = Math.floor(ms / 1000 / 60);
    var ss = Math.floor(ms / 1000 % 60);
    var ff = Math.floor(ms % 1000);
    var time = (mm < 10 ? "0" : "") + mm + ":" + (ss < 10 ? "0" : "") + ss + "." + (ff < 100 ? "0" : "") + (ff < 10 ? "0" : Math.floor(ff / 10));
    return time + "0";
  }
};

/******************************************************************************************
 * Parses captions in LRC format: https://en.wikipedia.org/wiki/LRC_%28file_format%29
 ******************************************************************************************/
function parse(content, options) {
  var prev = null;
  var captions = [];
  var eol = options.eol || "\r\n";
  var parts = content.split(/\r?\n/);
  for (var i = 0; i < parts.length; i++) {
    if (!parts[i] || parts[i].trim().length == 0) {
      continue;
    }

    //LRC content
    var regex = /^\[(\d{1,2}:\d{1,2}([.,]\d{1,3})?)\](.*)(\r?\n)*$/ugi;
    var match = regex.exec(parts[i]);
    if (match) {
      var caption = {};
      caption.type = "caption";
      caption.start = helper.toMilliseconds(match[1]);
      caption.end = caption.start + 2000;
      caption.duration = caption.end - caption.start;
      caption.content = match[3];
      caption.text = caption.content;
      captions.push(caption);

      //Update previous
      if (prev) {
        prev.end = caption.start;
        prev.duration = prev.end - prev.start;
      }
      prev = caption;
      continue;
    }

    //LRC meta
    var meta = /^\[([\w\d]+):([^\]]*)\](\r?\n)*$/gi.exec(parts[i]);
    if (meta) {
      var caption = {};
      caption.type = "meta";
      caption.tag = meta[1];
      if (meta[2]) {
        caption.data = meta[2];
      }
      captions.push(caption);
      continue;
    }

    if (options.verbose) {
      console.log("WARN: Unknown part", parts[i]);
    }
  }
  return captions;
};

function build(captions, options) {
  var eol = options.eol || "\r\n";
  var content = "WEBVTT" + eol + eol;
  for (var i = 0; i < captions.length; i++) {
    var caption = captions[i];
    if (caption.type == "meta") {
      if (caption.name == "WEBVTT") continue;
      content += caption.name + eol;
      content += caption.data ? caption.data + eol : "";
      content += eol;
      continue;
    }

    if (typeof caption.type === "undefined" || caption.type == "caption") {
      // content += (i + 1).toString() + eol;
      content += helper.toTimeString(caption.start) + " --> " + helper.toTimeString(caption.end) + eol;
      console.log(caption.text)
      content += caption.text + eol;
      content += eol;
      continue;
    }

    if (options.verbose) {
      console.log("SKIP:", caption);
    }
  }

  return content;
};

// i will implement a real parser in elm later trust
export function lrcToVtt(lrcSubtitle: string, fileLength: number) {
  console.log(lrcSubtitle)
  const parsedSubtitle = parse(lrcSubtitle, { format: 'lrc' })
  console.log(parsedSubtitle)
  const moo = build(parsedSubtitle, { format: "vtt" })
  console.log(moo)
  return moo
  // const splittedSubtitles: Array<string> = lrcSubtitle.split('\n')
  // splittedSubtitles.push(`[${formatTime(fileLength)}] `)
  // let result: Array<string> = ["WEBVTT\n"]
  // for (let i = 0; i < splittedSubtitles.length - 1; i++) {
  //   let line = splittedSubtitles[i]
  //   let nextLine = splittedSubtitles[i + 1]
  //   const timestamp = line.slice(1, 10)
  //   const lyric = line.slice(11)
  //   const nextTimestamp = nextLine.slice(1, 10)
  //   result.push(`${timestamp} --> ${nextTimestamp}`)
  //   result.push(lyric + '\n')
  // }
  // return result.join('\n')
}
