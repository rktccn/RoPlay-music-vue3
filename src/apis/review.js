import req from "../utils/http";
import Cookie from "js-cookie";

/**
 * 新版评论接口
 * 说明 : 调用此接口 , 传入资源类型和资源 id,以及排序方式,可获取对应资源的评论
 * - id : 资源 id, 如歌曲 id,mv id
 * - type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 * - pageNo:分页参数,第 N 页,默认为 1
 * - pageSize:分页参数,每页多少条数据,默认 20
 * - sortType: 排序方式, 1:按推荐排序, 2:按热度排序, 3:按时间排序
 * - cursor: 当sortType为 3 时且页数不是第一页时需传入,值为上一条数据的 time
 * @param {Object} params
 * @param {number} params.id
 * @param {number} params.type
 * @param {number} params.pageNo
 * @param {number} params.pageSize
 * @param {number} params.sortType
 * @param {number} params.cursor
 */
export function getComment(params) {
  return req({
    url: "/comment/new",
    method: "post",
    params: {
      ...params,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 楼层评论
 * 说明 : 调用此接口 , 传入资源 parentCommentId 和资源类型 type 和资源 id 参数, 可获得该资源的歌曲楼层评论
 * - parentCommentId: 楼层评论 id
 * - id : 资源 id
 * - type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 * - limit: 取出评论数量 , 默认为 20
 * - time: 分页参数,取上一页最后一项的 time 获取下一页数据
 * @param {Object} params
 * @param {number} params.parentCommentId
 * @param {number} params.id
 * @param {number} params.type
 * @param {number} params.limit
 * @param {number} params.time
 */
export function floorOfComment(params) {
  return req({
    url: "/comment/floor",
    method: "post",
    params: {
      ...params,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 热门评论
 * 说明 :  调用此接口 , 传入 type, 资源 id 可获得对应资源热门评论 ( 不需要登录 )
 * - id : 资源 id
 * - type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 * - limit: 取出评论数量 , 默认为 20
 * - offset: 偏移数量 , 用于分页 , 如 :( 评论页数 -1)*20, 其中 20 为 limit 的值
 * - before: 分页参数,取上一页最后一项的 time 获取下一页数据(获取超过 5000 条评论的时候需要用到)
 * @param {Object} params
 * @param {number} params.id
 * @param {number} params.type
 * @param {number} params.limit
 * @param {number} params.offset
 * @param {number} params.before
 */
export function commentOfDJ(params) {
  return req({
    url: "/comment/dj",
    method: "post",
    params: {
      ...params,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 给评论点赞
 * 说明 : 调用此接口 , 传入 type, 资源 id, 和评论 id cid 和 是否点赞参数 t 即可给对 应评论点赞 ( 需要登录 )
 * - id : 资源 id, 如歌曲 id,mv id
 * - cid : 评论 id
 * - t : 是否点赞 , 1 为点赞 ,0 为取消点赞
 * - type: 数字 , 资源类型 , 对应歌曲 , mv, 专辑 , 歌单 , 电台, 视频对应以下类型
 * @param {Object} params
 * @param {number} params.id
 * @param {number} params.cid
 * @param {number} params.t
 * @param {number} params.type
 */
export function likeComment(params) {
  return req({
    url: "/comment/like",
    method: "post",
    params: {
      ...params,
      cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 发送评论
 * 说明 : 调用此接口,可发送评论
 * - t:1 发送, 2 回复
 * - type: 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
 * - id:对应资源 id
 * - content :要发送的内容
 * - commentId :回复的评论 id (回复评论时必填)
 * @param {Object} params
 * @param {number} params.t
 * @param {number} params.type
 * @param {number} params.id
 * @param {String} params.content
 * @param {number} params.commentId
 */
export function writeComment(params) {
  return req({
    url: "/comment",
    method: "post",
    params: {
      ...params,
      cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 删除评论
 * 说明 : 调用此接口,可删除评论
 * - t:0 删除
 * - type: 0: 歌曲 1: mv 2: 歌单 3: 专辑 4: 电台 5: 视频 6: 动态
 * - id:对应资源 id
 * - content :内容 id,可通过 /comment/mv 等接口获取
 * - threadId:如给动态删除评论，则不需要传 id，需要传动态的 threadId
 * @param {Object} params
 * @param {number} params.t
 * @param {number} params.type
 * @param {number} params.id
 * @param {number} params.threadId
 * @param {number} params.content
 */
export function deleteComment(params) {
  return req({
    url: "/comment",
    method: "post",
    params: {
      ...params,
      cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 资源点赞( MV,电台,视频)
 * 说明 : 调用此接口,可删除评论
 * - type: 1: mv 4: 电台 5: 视频 6: 动态
 * - t: 操作,1 为点赞,其他为取消点赞
 * - id: 资源 id
 * @param {Object} params
 * @param {number} params.t
 * @param {number} params.type
 * @param {number} params.id
 */
export function likeResource(params) {
  return req({
    url: "/resource/like",
    method: "post",
    params: {
      ...params,
      cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
    },
  }).then((res) => {
    return res;
  });
}
