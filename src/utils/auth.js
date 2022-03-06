import jsCookie from "js-cookie";

export function isLoggedIn() {
  return jsCookie.get("MUSIC_U") !== undefined;
}
export function isAccountLoggedIn() {
  return jsCookie.get("MUSIC_U") !== undefined;
}
