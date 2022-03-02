import req from "../utils/http";
import Cookie from "js-cookie";

/**
 * 获取 mv 数据
 * 说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 数据 , 数据包含 mv 名字 , 歌手 , 发布时间 , mv 视频地址等数据 ,
 * 其中 mv 视频 网易做了防盗链处理 , 可能不能直接播放 , 需要播放的话需要调用 ' mv 地址' 接口
 * - 调用例子 : /mv/detail?mvid=5436712
 * @param {number} mvid mv 的 id
 */
export function mvDetail(mvid) {
  return req
    .get("/mv/detail", {
      params: {
        mvid,
        timestamp: new Date().getTime(),
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * mv 地址
 * 说明 : 调用此接口 , 传入 mv id,可获取 mv 播放地址
 * - id: mv id
 * - r: 分辨率,默认1080,可从 /mv/detail 接口获取分辨率列表
 * - 调用例子 : /mv/url?id=5436712 /mv/url?id=10896407&r=1080
 * @param {Object} params
 * @param {number} params.id
 * @param {number=} params.r
 */
export function mvUrl(params) {
  return req
    .get("/mv/url", {
      params,
    })
    .then((res) => {
      return res;
    });
}

/**
 * 相似 mv
 * 说明 : 调用此接口 , 传入 mvid 可获取相似 mv
 * @param {number} mvid
 */
export function simiMv(mvid) {
  return req
    .get("/simi/mv", {
      params: {
        mvid,
      },
    })
    .then((res) => {
      return res;
    });
}

/**
 * 收藏/取消收藏 MV
 * 说明 : 调用此接口,可收藏/取消收藏 MV
 * - mvid: mv id
 * - t: 1 为收藏,其他为取消收藏
 * @param {Object} params
 * @param {number} params.mvid
 * @param {number=} params.t
 */

export function likeAMV(params) {
  return req({
    url: "mv/sub",
    method: "post",
    params: {
      ...params,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 全部 mv
 * 说明 : 调用此接口 , 可获取全部 mv
 * area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * type: 类型,可选值为全部,官方版,原生,现场版,网易出品,不填则为全部
 * order: 排序,可选值为上升最快,最热,最新,不填则为上升最快
 * limit: 取出数量 , 默认为 30
 * offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*50, 其中 50 为 limit 的值 , 默认 为 0
 * @param {Object} params
 * @param {String} params.area
 * @param {String} params.type
 * @param {String} params.order
 * @param {number} params.limit
 * @param {number} params.offset
 */

export function allMV(params) {
  return req({
    url: "/mv/all",
    method: "post",
    params: {
      ...params,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 最新 mv
 * 说明 : 调用此接口 , 可获取最新 mv
 * area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * limit: 取出数量 , 默认为 30
 * @param {Object} params
 * @param {String} params.area
 * @param {number} params.limit
 */

export function latestMV(params) {
  return req({
    url: "/mv/first",
    method: "post",
    params: {
      ...params,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    return res;
  });
}

/**
 * mv 排行
 * 说明 : 调用此接口 , 可获取 mv 排行
 * area: 地区,可选值为全部,内地,港台,欧美,日本,韩国,不填则为全部
 * offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认 为 0
 * limit: 取出数量 , 默认为 30
 * @param {Object} params
 * @param {String} params.area
 * @param {number} params.offset
 * @param {number} params.limit
 */

export function ToplistOfMV(params) {
  return req({
    url: "/top/mv",
    method: "post",
    params: {
      ...params,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 获取 mv 点赞转发评论数数据
 * 说明 : 调用此接口 , 传入 mvid ( 在搜索音乐的时候传 type=1004 获得 ) , 可获取对应 MV 点赞转发评论数数据
 * mvid: mv 的 id
 * @param {number} mvid
 */

export function mvReview(mvid) {
  return req({
    url: "/mv/detail/info",
    method: "post",
    params: {
      mvid,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    return res;
  });
}
