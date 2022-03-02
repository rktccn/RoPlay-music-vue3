import req from "../utils/http";
import Cookie from "js-cookie";

// 说明 : 私人 FM( 需要登录 )
export function personalFM() {
  return req
    .get("/personal_fm", {
      params: {
        cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 每日推荐歌曲
 * 说明 : 调用此接口 , 可获得每日推荐歌曲 ( 需要登录 )
 * @param {Object} params
 * @param {string} params.op
 * @param {string} params.pid
 */
export function dailyRecommendTracks() {
  return req
    .get("/recommend/songs", {
      params: {
        cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 获取每日推荐歌单
 * 说明 : 调用此接口 , 可获得每日推荐歌单 ( 需要登录 )
 * @param {Object} params
 * @param {number=} params.limit
 */
export function dailyRecommendPlaylist(params) {
  return req
    .get("/recommend/resource", {
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
 * 推荐歌单
 * 说明 : 调用此接口 , 可获取推荐歌单
 * - limit: 取出数量 , 默认为 30 (不支持 offset)
 * - 调用例子 : /personalized?limit=1
 * @param {Object} params
 * @param {number=} params.limit
 */
export function recommendPlaylist(params) {
  return req
    .get("/personalized", {
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
 * 推荐新音乐
 * 说明 : 调用此接口 , 可获取推荐新音乐
 * - limit: 取出数量 , 默认为 10 (不支持 offset)
 * @param {number=} limit
 */
export function recommendNewSong(limit) {
  return req
    .get("/personalized/newsong", {
      params: {
        limit,
        cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 推荐电台
 * 说明 : 调用此接口 , 可获取推荐电台
 * - limit: 取出数量 , 默认为 10 (不支持 offset)
 * @param {number=} limit
 */
export function recommendFM(limit) {
  return req
    .get("/personalized/djprogram", {
      params: {
        limit,
        cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
      },
    })
    .then((res) => {
      return res;
    });
}
