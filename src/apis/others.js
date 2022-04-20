import req from "../utils/http";
import { useStore } from "../store/index";

/**
 * 搜索
 * 说明 : 调用此接口 , 传入搜索关键词可以搜索该音乐 / 专辑 / 歌手 / 歌单 / 用户 , 关键词可以多个 , 以空格隔开 ,
 * 如 " 周杰伦 搁浅 "( 不需要登录 ), 搜索获取的 mp3url 不能直接用 , 可通过 /song/url 接口传入歌曲 id 获取具体的播放链接
 * - keywords : 关键词
 * - limit : 返回数量 , 默认为 30
 * - offset : 偏移数量，用于分页 , 如 : 如 :( 页数 -1)*30, 其中 30 为 limit 的值 , 默认为 0
 * - type: 搜索类型；默认为 1 即单曲 , 取值意义 : 1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单, 1002: 用户, 1004: MV, 1006: 歌词, 1009: 电台, 1014: 视频, 1018:综合
 * - 调用例子 : /search?keywords=海阔天空 /cloudsearch?keywords=海阔天空(更全)
 * @param {Object} params
 * @param {string} params.keywords
 * @param {number=} params.limit
 * @param {number=} params.offset
 * @param {number=} params.type
 */
export function search(params) {
  let typeList = {
    单曲: 1,
    专辑: 10,
    歌手: 100,
    歌单: 1000,
    用户: 1002,
    MV: 1004,
    歌词: 1006,
    电台: 1009,
    视频: 1014,
    综合: 1018,
  };

  if (params.type && typeof params.type !== "number") {
    params.type = typeList[params.type];
  }

  return req
    .get("/cloudsearch", {
      params,
    })
    .then((res) => {
      return res;
    });
}

// banner
// 说明 : 调用此接口 , 可获取 banner( 轮播图 ) 数据
export function getBanner() {
  return req({
    url: "/banner",
    method: "post",
  }).then((res) => {
    return res;
  });
}

// 垃圾桶
// 说明 : 调用此接口 , 传入音乐 id, 可把该音乐从私人 FM 中移除至垃圾桶
export function fmTrash(id) {
  return req({
    url: "/fm_trash",
    method: "post",
    params: {
      cookie: useStore().userCookie || "",
      id,
    },
  }).then((res) => {
    return res;
  });
}
