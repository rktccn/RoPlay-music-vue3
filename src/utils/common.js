/**
 * 日期格式化
 * @param Number time
 */
export function dateFormat(time, showMin = false) {
  const t = new Date(time);
  // 日期格式
  const format = showMin ? "Y-m-d h:i:s" : "Y-m-d";
  let year = t.getFullYear();
  // 由于 getMonth 返回值会比正常月份小 1
  let month = t.getMonth() + 1;
  let day = t.getDate();
  let hours = t.getHours();
  let minutes = t.getMinutes();
  let seconds = t.getSeconds();
  month = month > 9 ? month : `0${month}`;
  day = day > 9 ? day : `0${day}`;
  hours = hours > 9 ? hours : `0${hours}`;
  minutes = minutes > 9 ? minutes : `0${minutes}`;
  seconds = seconds > 9 ? seconds : `0${seconds}`;
  const hash = {
    Y: year,
    m: month,
    d: day,
    h: hours,
    i: minutes,
    s: seconds,
  };
  return format.replace(/\w/g, (o) => {
    return hash[o];
  });
}

export function timeFormat(value) {
  if (value == 0) return "00:00";
  if (!value) return "";
  value = value / 1000;
  let min = ~~((value / 60) % 60);
  if (min < 10) min = "0" + min;

  let sec = (~~(value % 60)).toString().padStart(2, "0");
  return `${min}:${sec}`;
}
