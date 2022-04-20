import req from "../utils/http";
import { useStore } from "../store/index";

//获取专辑内容
export function getAlbum(id) {
  return req
    .get("/album", {
      params: {
        id,
      },
    })
    .then((res) => {
      return res;
    });
}

// 专辑动态信息
// 说明 : 调用此接口 , 传入专辑 id, 可获得专辑动态信息,如是否收藏,收藏数,评论数,分享数
export function albumDynamicDetail(id) {
  return (req.get("/album/detail/dynamic"),
  {
    params: {
      id,
    },
  }).then((res) => {
    return res;
  });
}

// 获取已收藏专辑列表;
// 说明: 调用此接口, 可获得已收藏专辑列表;

// limit: 取出数量 , 默认为 25
// offset: 偏移数量 , 用于分页 , 如 :( 页数 -1)*25, 其中 25 为 limit 的值 , 默认 为 0
export function getLikeAlbum(params) {
  return req
    .get("/album/sublist", {
      params,
    })
    .then((res) => {
      return res;
    });
}

// 收藏/取消收藏专辑
// 说明 : 调用此接口,可收藏/取消收藏专辑
// - id - 返专辑 id
// - t - 1 为收藏,其他为取消收藏
export function likeAAlbum(params) {
  return req
    .post("/album/sub", {
      params: {
        ...params,
        cookie: useCookie,
      },
    })
    .then((res) => {
      return res;
    });
}

// 最新专辑
// 说明 : 调用此接口 ，获取云音乐首页新碟上架数据
// - id - 返专辑 id
// - t - 1 为收藏,其他为取消收藏
export function latestAlbum() {
  return req.post("/album/newest").then((res) => {
    return res;
  });
}
