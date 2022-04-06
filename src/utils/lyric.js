export function initLyric(lyric) {
  let result = [];

  const lyrics = lyric.split("\n");
  const pattern = /\[\d*:\d*((\.|:)\d*)*\]/g;

  for (let i = 0; i < lyrics.length; i++) {
    const resultTime = lyrics[i].match(pattern);
    const content = lyrics[i].replace(pattern, "").trim();
    if (content === "") continue;
    if (resultTime) {
      const t = resultTime[0].substring(
        resultTime[0].indexOf("[") + 1,
        resultTime[0].indexOf("]")
      );

      let time = t.split(":")[0] * 60 + t.split(":")[1] * 1;
      time = parseFloat(time).toFixed(0) * 1000 - 500;
      result.push({
        time,
        content,
      });
    }
  }
  return result;
}
