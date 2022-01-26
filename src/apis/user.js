import req from "../utils/http";

/**
 * 获取用户详情
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户详情
 * - uid : 用户 id
 * @param {number} uid
 */
export function userDetail(uid) {
  return req
    .get("/user/detial", {
      params: {
        uid,
        timestamp: new Date().getTime(),
      },
      withCredentials,
    })
    .then((res) => res);
}

/**
 * 获取账号详情
 * 说明 : 登录后调用此接口 ,可获取用户账号信息
 */
export function userAccount() {
  return req
    .get("/user/account", {
      params: {
        timestamp: new Date().getTime(),
      },
    })
    .then((res) => res);
}

/**
 * 获取用户歌单
 * 说明 : 登录后调用此接口 , 传入用户 id, 可以获取用户歌单
 * - uid : 用户 id
 * - limit : 返回数量 , 默认为 30
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.uid
 * @param {number} params.limit
 * @param {number=} params.offset
 */
export function userPlaylist(params) {
  return req
    .get("/user/playlist", {
      params: {
        ...params,
      },
    })
    .then((res) => res);
}

/**
 * 喜欢音乐列表（需要登录）
 * 说明 : 调用此接口 , 传入用户 id, 可获取已喜欢音乐id列表(id数组)
 * - uid: 用户 id
 * @param {number} uid
 */
export function userLikedSongsIDs(uid) {
  return req
    .get("/likelist", {
      params: {
        uid,
        timestamp: new Date().getTime(),
      },
    })
    .then((res) => res);
}

/**
 * 每日签到
 * 说明 : 调用此接口可签到获取积分
 * -  type: 签到类型 , 默认 0, 其中 0 为安卓端签到 ,1 为 web/PC 签到
 * @param {number} type
 */
export function dailySignin(type = 0) {
  return req
    .get("/daily_signin", {
      params: {
        type,
        timestamp: new Date().getTime(),
      },
    })
    .then((res) => res);
}

/**
 * 获取收藏的专辑（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的专辑
 * - limit : 返回数量 , 默认为 25
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.limit
 * @param {number=} params.offset
 */
export function likedAlbums(params) {
  return req
    .get("/album/sublist", {
      params: {
        limit: params.limit,
        timestamp: new Date().getTime(),
      },
    })
    .then((res) => res);
}

/**
 * 获取收藏的歌手（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的歌手
 */
export function likedArtists(params) {
  return req
    .get("/artist/sublist", {
      params: {
        limit: params.limit,
        timestamp: new Date().getTime(),
      },
    })
    .then((res) => res);
}

/**
 * 获取收藏的MV（需要登录）
 * 说明 : 调用此接口可获取到用户收藏的MV
 */
export function likedMVs(params) {
  return req
    .get("/mv/sublist", {
      params: {
        limit: params.limit,
        timestamp: new Date().getTime(),
      },
    })
    .then((res) => res);
}

/**
 * 上传歌曲到云盘（需要登录）
 */
export function uploadSong(file) {
  let formData = new FormData();
  formData.append("songFile", file);

  return req({
    url: "/cloud",
    method: "post",
    params: {
      timestamp: new Date().getTime(),
    },
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((res) => res);
}

/**
 * 获取云盘歌曲（需要登录）
 * 说明 : 登录后调用此接口 , 可获取云盘数据 , 获取的数据没有对应 url, 需要再调用一 次 /song/url 获取 url
 * - limit : 返回数量 , 默认为 200
 * - offset : 偏移数量，用于分页 , 如 :( 页数 -1)*200, 其中 200 为 limit 的值 , 默认为 0
 * @param {Object} params
 * @param {number} params.limit
 * @param {number=} params.offset
 */
export function cloudDisk(params = {}) {
  params.timestamp = new Date().getTime();

  return req
    .get("/user/cloud", {
      params: {
        ...params,
      },
    })
    .then((res) => res);
}

/**
 * 获取云盘歌曲详情（需要登录）
 */
export function cloudDiskTrackDetail(id) {
  return req.get("/user/cloud/detial", {
    params: {
      timestamp: new Date().getTime(),
      id,
    },
  });
}

/**
 * 删除云盘歌曲（需要登录）
 * @param {Array} id
 */
export function cloudDiskTrackDelete(id) {
  return req
    .get("/user/cloud/del", {
      params: {
        timestamp: new Date().getTime(),
        id,
      },
    })
    .then((res) => res);
}
