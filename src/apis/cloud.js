import req from "../utils/http";

/**
 * 云盘
 * 说明 : 登录后调用此接口 , 可获取云盘数据 , 获取的数据没有对应 url, 需要再调用一 次 /song/url 获取 url
 * - limit : 返回数量 , 默认为 200
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*200, 其中 200 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.limit
 * @param {number} params.offset
 */
export function getCloud(params) {
  return req({
    url: "/user/cloud",
    method: "post",
    params: {
      ...params,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    console.log(res);
    return res;
  });
}

/**
 * 云盘数据详情
 * 说明 : 登录后调用此接口 , 传入云盘歌曲 id，可获取云盘数据详情
 * - id: 歌曲 id,可多个,用逗号隔开
 * @param {number} id
 */
export function getCloudDetail(id) {
  return req({
    url: "/user/cloud/detail",
    method: "post",
    params: {
      id,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 云盘歌曲删除
 * 说明 : 登录后调用此接口 , 可删除云盘歌曲
 * - id: 歌曲 id,可多个,用逗号隔开
 * @param {number} id
 */
export function deleteCloudMusic(id) {
  return req({
    url: "/user/cloud/del",
    method: "post",
    params: {
      id,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 云盘上传
 * 说明 : 登录后调用此接口,使用'Content-Type': 'multipart/form-data'上传 mp3 formData(name 为'songFile'),可上传歌曲到云盘
 *
 */
export function uploadCloudMusic(file) {
  return req({
    url: "/cloud",
    method: "post",
    params: {
      file,
      timestamp: new Date().getTime(),
    },
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 云盘歌曲信息匹配纠正
 * 说明 : 登录后调用此接口,可对云盘歌曲信息匹配纠正,如需取消匹配,asid 需要传 0
 * - uid: 用户 id
 * - sid: 云盘的歌曲 id
 * - asid: 要匹配的歌曲 id
 * @param {Object} params
 * @param {number} params.uid
 * @param {number} params.sid
 * @param {number} params.asid
 */
export function matchCloudMusic(params) {
  return req({
    url: "/cloud/match",
    method: "post",
    params: {
      ...params,
      timestamp: new Date().getTime(),
    },
  }).then((res) => {
    return res;
  });
}
