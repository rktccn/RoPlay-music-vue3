import req from "../utils/http";
import Cookie from "js-cookie";

/**
 * 获取歌单详情
 * 说明 : 歌单能看到歌单名字, 但看不到具体歌单内容 , 调用此接口 , 传入歌单 id, 可以获取对应歌单内的所有的音乐(未登录状态只能获取不完整的歌单,登录后是完整的)，
 * 但是返回的trackIds是完整的，tracks 则是不完整的，可拿全部 trackIds 请求一次 song/detail 接口
 * 获取所有歌曲的详情 (https://github.com/Binaryify/NeteaseCloudMusicApi/issues/452)
 * - id : 歌单 id
 * - s : 歌单最近的 s 个收藏者, 默认为8
 * @param {number} id
 */
export function getPlaylistDetail(id) {
  return req
    .get("/playlist/detail", {
      params: {
        id,
      },
    })
    .then((res) => {
      return res;
    });
}
/**
 * 获取精品歌单
 * 说明 : 调用此接口 , 可获取精品歌单
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部", 可从精品歌单标签列表接口获取(/playlist/highquality/tags)
 * - limit: 取出歌单数量 , 默认为 20
 * - before: 分页参数,取上一页最后一个歌单的 updateTime 获取下一页数据
 * @param {Object} params
 * @param {string} params.cat
 * @param {number=} params.limit
 * @param {number} params.before
 */
export function highQualityPlaylist(params) {
  return req
    .get("/top/playlist/highquality", {
      params,
    })
    .then((res) => {
      return res;
    });
}

/**
 * 歌单 ( 网友精选碟 )
 * 说明 : 调用此接口 , 可获取网友精选碟歌单
 * - order: 可选值为 'new' 和 'hot', 分别对应最新和最热 , 默认为 'hot'
 * - cat: tag, 比如 " 华语 "、" 古风 " 、" 欧美 "、" 流行 ", 默认为 "全部",可从歌单分类接口获取(/playlist/catlist)
 * - limit: 取出歌单数量 , 默认为 50
 * @param {Object} params
 * @param {string} params.order
 * @param {string} params.cat
 * @param {number=} params.limit
 */
export function topPlaylist(params) {
  return req
    .get("/top/playlist", {
      params,
    })
    .then((res) => {
      return res;
    });
}

/**
 * 歌单分类
 * 说明 : 调用此接口,可获取歌单分类,包含 category 信息
 */
export function getPlaylistCatlist() {
  return req.get("/playlist/catlist").then((res) => {
    return res;
  });
}

/**
 * 所有榜单
 * 说明 : 调用此接口,可获取所有榜单 接口地址 : /toplist
 */
export function topLists() {
  return req.get("/toplist").then((res) => {
    return res;
  });
}

/**
 * 收藏/取消收藏歌单
 * 说明 : 调用此接口, 传入类型和歌单 id 可收藏歌单或者取消收藏歌单
 * - t : 类型,1:收藏,2:取消收藏
 * - id : 歌单 id
 * @param {Object} params
 * @param {number} params.t
 * @param {number} params.id
 */
export function subscribePlaylist(params) {
  params.timestamp = new Date().getTime();
  return req
    .get("/playlist/subscribe", {
      params,
      cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
    })
    .then((res) => {
      return res;
    });
}

/**
 * 删除歌单
 * 说明 : 调用此接口 , 传入歌单id可删除歌单
 * - id : 歌单id,可多个,用逗号隔开
 *  * @param {number} id
 */
export function deletePlaylist(id) {
  return req({
    url: "/playlist/delete",
    method: "post",
    params: {
      id,
      cookie: `MUSIC_U=${Cookie.get("MUSIC_U")};`,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 新建歌单
 * 说明 : 调用此接口 , 传入歌单名字可新建歌单
 * - name : 歌单名
 * - privacy : 是否设置为隐私歌单，默认否，传'10'则设置成隐私歌单
 * - type : 歌单类型,默认'NORMAL',传 'VIDEO'则为视频歌单
 * @param {Object} params
 * @param {string} params.name
 * @param {number} params.privacy
 * @param {string} params.type
 */
export function createPlaylist(params) {
  return req({
    url: "/playlist/create",
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
 * 对歌单添加或删除歌曲
 * 说明 : 调用此接口 , 可以添加歌曲到歌单或者从歌单删除某首歌曲 ( 需要登录 )
 * - op: 从歌单增加单曲为 add, 删除为 del
 * - pid: 歌单 id tracks: 歌曲 id,可多个,用逗号隔开
 * @param {Object} params
 * @param {string} params.op
 * @param {string} params.pid
 */
export function addOrRemoveTrackFromPlaylist(params) {
  params.timestamp = new Date().getTime();

  return req({
    url: "/playlist/tracks",
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
 * 获取歌单所有歌曲
 * 说明 : 由于网易云接口限制，歌单详情只会提供 10 首歌，通过调用此接口，传入对应的歌单id，即可获得对应的所有歌曲
 * 必选参数 : id : 歌单 id
 * 可选参数 : limit : 限制获取歌曲的数量，默认值为当前歌单的歌曲数量
 * 可选参数 : offset : 默认值为0，用于歌曲的分页，计算方法为 limit * offset<= 你得到的歌曲 <= limit * offset + 1
 * @param {Object} params
 * @param {Number} params.id
 * @param {Number} params.limit
 * @param {Number} params.offset
 */
export function getPlaylistTracks(params) {
  params.limit ??= 20;
  return req({
    url: "/playlist/track/all",
    method: "post",
    params: {
      ...params,
    },
  }).then((res) => {
    return res;
  });
}

/**
 * 所有榜单内容摘要
 * 说明 : 调用此接口,可获取所有榜单内容摘要
 */
export function getTopList() {
  return req({
    url: "/toplist/detail",
    method: "get",
  }).then((res) => {
    return res;
  });
}
