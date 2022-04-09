import req from "../utils/http";
import Cookie from "js-cookie";

/**
 * 获取音乐 url
 * 说明 : 使用歌单详情接口后 , 能得到的音乐的 id, 但不能得到的音乐 url, 调用此接口, 传入的音乐 id( 可多个 , 用逗号隔开 ), 可以获取对应的音乐的 url,
 * !!!未登录状态返回试听片段(返回字段包含被截取的正常歌曲的开始时间和结束时间)
 * @param {string} id - 音乐的 id，例如 id=405998841,33894312
 */
export function getMP3(id, br = 320000) {
  // let br =
  //   store.state.settings?.musicQuality !== undefined
  //     ? store.state.settings.musicQuality
  //     : 320000;
  return req
    .get("/song/url", {
      params: {
        id,
        br,
        cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 获取歌曲详情
 * 说明 : 调用此接口 , 传入音乐 id(支持多个 id, 用 , 隔开), 可获得歌曲详情(注意:歌曲封面现在需要通过专辑内容接口获取)
 * @param {string} ids - 音乐 id, 例如 ids=405998841,33894312
 */
export async function getTrackDetail(ids) {
  return req
    .get("/song/detail", {
      params: {
        ids,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 获取歌词
 * 说明 : 调用此接口 , 传入音乐 id 可获得对应音乐的歌词 ( 不需要登录 )
 * @param {number} id - 音乐 id
 */
export function getLyric(id) {
  return req
    .get("/lyric", {
      params: {
        id,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 新歌速递
 * 说明 : 调用此接口 , 可获取新歌速递
 * @param {number} type - 地区类型 id, 对应以下: 全部:0 华语:7 欧美:96 日本:8 韩国:16
 */
export function topSong(type) {
  return req
    .get("/top/song", {
      params: {
        type,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 喜欢音乐
 * 说明 : 调用此接口 , 传入音乐 id, 可喜欢该音乐
 * - id - 歌曲 id
 * - like - 默认为 true 即喜欢 , 若传 false, 则取消喜欢
 * @param {Object} params
 * @param {number} params.id
 * @param {boolean=} [params.like]
 */
export function likeATrack(params) {
  return req
    .get("/like", {
      params: {
        ...params,
        cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 听歌打卡
 * 说明 : 调用此接口 , 传入音乐 id, 来源 id，歌曲时间 time，更新听歌排行数据
 * - id - 歌曲 id
 * - sourceid - 歌单或专辑 id
 * - time - 歌曲播放时间,单位为秒
 * @param {Object} params
 * @param {number} params.id
 * @param {number} params.sourceid
 * @param {number=} params.time
 */
export function scrobble(params) {
  return req
    .get("/scrobble", {
      params: {
        ...params,
        cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 音乐是否可用
 * 说明: 调用此接口,传入歌曲 id, 可获取音乐是否可用,返回 { success: true, message: 'ok' } 或者 { success: false, message: '亲爱的,暂无版权' }
 * @param {Object} params
 * @param {number | string} params.id 歌曲id
 * @param {number=} params.br 码率,默认设置了 999000 即最大码率,如果要 320k 则可设置为 320000,其他类推
 * @return {Object} { success: true, message: 'ok' } 或者 { success: false, message: '亲爱的,暂无版权' }
 */
export function checkMusic(params) {
  console.log(params);
  return req
    .get("/check/music", {
      params: {
        ...params,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err.status);
      console.log(err);
    });
}
