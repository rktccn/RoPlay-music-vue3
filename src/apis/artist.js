import req from "../utils/http";
import { useStore } from "../store/index";

// 获取歌手热门单曲和信息
// 说明 : 调用此接口 , 传入歌手 id, 可获得歌手部分信息和热门歌曲
export function getArtist(id) {
  return req
    .get("/artists", {
      params: {
        id,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 歌手全部歌曲
 * 说明 : 调用此接口,可获取歌手全部歌曲
 * - id: 歌手 id
 * - order : hot ,time 按照热门或者时间排序
 * - limit: 取出数量 , 默认为 50
 * - offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.id
 * @param {number=} params.limit
 * @param {number=} params.order
 * @param {number=} params.offset
 */
export function getArtistSongs(params) {
  return req.get("/artist/songs", { params }).then((res) => {
    return res;
  });
}

/**
 * 获取歌手专辑
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手专辑内容
 * - id: 歌手 id
 * - limit: 取出数量 , 默认为 50
 * - offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.id
 * @param {number=} params.limit
 * @param {number=} params.offset
 */
export function getArtistAlbum(params) {
  return req.get("/artist/album", { params }).then((res) => {
    return res;
  });
}

/**
 * 歌手榜
 * 说明 : 调用此接口 , 可获取排行榜中的歌手榜
 * - type : 地区
 * 1: 华语
 * 2: 欧美
 * 3: 韩国
 * 4: 日本
 * @param {number=} type
 */
export function toplistOfArtists(type = null) {
  return req
    .get("/toplist/artist", {
      params: {
        type,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 获取歌手 mv
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手 mv 信息 , 具体 mv 播放地址可调 用/mv传入此接口获得的 mvid 来拿到 , 如 : /artist/mv?id=6452,/mv?mvid=5461064
 * @param {number} params.id 歌手 id, 可由搜索接口获得
 * @param {number} params.offset
 * @param {number} params.limit
 */
export function getArtistMv(params) {
  return req.get("artist/mv", { params }).then((res) => {
    return res;
  });
}

/**
 * 收藏歌手
 * 说明 : 调用此接口 , 传入歌手 id, 可收藏歌手
 * - id: 歌手 id
 * - t: 操作,1 为收藏,其他为取消收藏
 * @param {Object} params
 * @param {number} params.id
 * @param {number} params.t
 * @param {string} params.cookie
 */
export function followAArtist(params) {
  req({
    url: "/artist/sub",
    method: "post",
    params: {
      ...params,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 相似歌手
 * 说明 : 调用此接口 , 传入歌手 id, 可获得相似歌手
 * - id: 歌手 id
 * @param {number} id
 */
export function getSimilarArtists(id) {
  return req
    .get("/simi/artist", {
      params: {
        id,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 获取歌手详情
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手描述
 * - id: 歌手 id
 * @param {number} id
 */
export function getArtistDetail(id) {
  return req
    .get("/artist/detail", {
      params: {
        id,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 获取歌手描述
 * 说明 : 调用此接口 , 传入歌手 id, 可获得歌手描述
 * - id: 歌手 id
 * @param {number} id
 */
export function getArtistDesc(id) {
  return req
    .get("/artist/desc", {
      params: {
        id,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 歌手分类列表
 * 说明 : 调用此接口 , 可获取排行榜中的歌手榜
 * - type : -1:全部 1:男歌手 2:女歌手 3:乐队
 * - area : -1:全部 7华语 96欧美 8:日本 16韩国 0:其他
 * - limit : 返回数量 , 默认为 30
 * - offset : 偏移数量，用于分页
 * - initial: 按首字母索引查找参数, 热门传-1, 全部传0
 * @param {Object} params
 * @param {number} params.type
 * @param {number} params.area
 * @param {number} params.limit
 * @param {number} params.offset
 * @param {string} params.initial
 */
export function getArtistList(params) {
  return req
    .get("/artist/list", {
      params,
    })
    .then((res) => {
      return res;
    });
}

/**
 * 关注歌手新歌
 * 说明 : 登录后调用此接口可获取关注歌手新歌
 * - limit: 取出评论数量 , 默认为 20
 * - before: 上一页数据返回的 publishTime 的数据

 * @param {Object} params
 * @param {number=} params.limit
 * @param {number=} params.before
 */
export function getFollowedArtistNewMvs(params) {
  return req
    .get("/artist/new/mv", {
      params: {
        ...params,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 关注歌手新 MV
 * 说明 :登录后调用此接口可获取关注歌手新 MV
 * - limit: 取出评论数量 , 默认为 20
 * - before: 上一页数据返回的 publishTime 的数据

 * @param {Object} params
 * @param {number=} params.limit
 * @param {number=} params.before
 */
export function getFollowedArtistNewSongs(params) {
  return req
    .get("/artist/new/song", {
      params: {
        ...params,
      },
    })
    .then((res) => {
      return res;
    });
}
