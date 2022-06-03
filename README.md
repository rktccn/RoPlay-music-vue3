<h1 align="center" style="font-weight:600;">RoPlay</h1>

vue3 + vite + Pinia

## DEMO

[link](https://ro-play-vue3-69xxynv91-wskkku.vercel.app/#/)

<!-- ## 更新日志 -->

<!-- [更新日志](./docs/changLog.md) -->

## 使用方法

### 部署到自己的服务器

- 克隆本仓库
- 替换`/.env`文件中 `VITE_BASE_URL` 的值为你的网易云 API 地址
- 运行`yarn install`安装依赖
- 运行`yarn run build`打包

### 部署至 Vercel

- fork 并部署 [网易云音乐 api](https://github.com/Binaryify/NeteaseCloudMusicApi) 至 Vercel
- 点击 Environment Variables，填写 Name 为 `VITE_BASE_URL`，Value 为 你的网易云 API 地址.

## 介绍

### 特色

- 使用 vue3 + vite + Pinia 开发
- 响应式布局
- 无社交功能

### 截图

![首页](./images/explore.png)
![歌曲列表](./images/songlist.png)
![歌词](./images/lyric.png)

## 灵感来源

- [YesPlayMusic](https://github.com/qier222/YesPlayMusic)
- AppleMusic
- YoutubeMusic
- 网易云音乐

## 项目结构

```
├── .env
├── .env.local
├── .env.production
├── index.html
├── LICENSE
├── package-lock.json
├── package.json
├── /public/
│  └── favicon.ico
├── /src/
│  ├── /apis/ (api文件夹)
│  ├── App.vue
│  ├── /assets/ (图片文件夹)
│  │  └── logo.png
│  ├── /components/ (组件文件夹)
│  │  ├── artistFormat.vue      歌手格式组件
│  │  ├── audioControl.vue      音频控制
│  │  ├── carouselList.vue      轮播图组件
│  │  ├── contextInfo.vue       歌单/专辑/个人介绍
│  │  ├── contextMenu.ts        右键菜单
│  │  ├── contextMenu.vue       右键菜单
│  │  ├── coverRow.vue          封面列表
│  │  ├── pipLyric.vue          桌面歌词
│  │  ├── playListCard.vue      歌单/歌手/专辑卡片
│  │  ├── /scrollTab/           滚动组件
│  │  │  ├── scrollTab.vue      滚动组件
│  │  │  └── scrollTabCol.vue   滚动组件
│  │  ├── seeMore.vue           查看更多
│  │  ├── sideNav.vue           左侧导航
│  │  ├── textModal.ts          文本模态框
│  │  ├── textModal.vue         文本模态框
│  │  ├── trackList.vue         歌曲列表
│  │  └── trackListItem.vue     歌曲列表项
│  ├── /images/ (图片文件夹)
│  │  └── netease_music_icon.png
│  ├── main.js
│  ├── /route/  (路由文件夹)
│  │  └── index.js
│  ├── /store/  (存储文件夹)
│  │  ├── index.js  主要存储数据
│  │  └── player.js 存储播放器数据
│  ├── /styles/ (样式文件夹)
│  │  ├── animation.scss    动画样式
│  │  ├── color.scss        颜色样式
│  │  ├── fontStyle.scss    字体样式
│  │  ├── normalize.scss    标准样式
│  │  └── _variable.scss    变量样式
│  ├── /utils/  (工具文件夹)
│  │  ├── auth.js       权限控制
│  │  ├── common.js     公共方法
│  │  ├── http.js       axios请求
│  │  ├── lyric.js      歌词解析
│  ├── /views/
│  │  ├── album.vue         专辑详情
│  │  ├── artist.vue        歌手详情
│  │  ├── artistType.vue    歌手类型
│  │  ├── currentList.vue   当前播放列表
│  │  ├── /explore/     (探索页)
│  │  │  ├── /components/   (组件文件夹)
│  │  │  │  ├── banner.vue              轮播图
│  │  │  │  ├── latestAlbum.vue         最新专辑
│  │  │  │  ├── playListTrack.vue       歌单歌曲
│  │  │  │  ├── recomendFM.vue          推荐FM
│  │  │  │  ├── recomendOther.vue       推荐其他
│  │  │  │  └── recomendPlaylist.vue    推荐歌单
│  │  │  └── explore.vue                探索页
│  │  ├── /feed/    (动态页)
│  │  │  ├── /components/   (组件文件夹)
│  │  │  │  ├── favouriteAndRecord.vue  收藏和记录
│  │  │  │  ├── follow.vue              关注
│  │  │  │  ├── forYou.vue              为你推荐
│  │  │  │  ├── myPlaylist.vue          我的歌单
│  │  │  │  └── playlist.vue            歌单
│  │  │  └── feed.vue   动态页
│  │  ├── header.vue    头部
│  │  ├── /login/   (登录页)
│  │  │  ├── login.vue  登录页
│  │  │  └── reg.vue    注册页
│  │  ├── lyricPage.vue   歌词页
│  │  ├── /personalPage/    (个人页)
│  │  │  ├── /components/   (组件文件夹)
│  │  │  └── personalPage.vue   个人页
│  │  ├── playlist.vue  歌单详情
│  │  ├── /room/    (分类页)
│  │  │  ├── artist.vue     歌手分类
│  │  │  ├── playlist.vue   歌单分类
│  │  │  └── topList.vue    排行榜分类
│  │  ├── /search/  (搜索页)
│  │  │  ├── /components/   (组件文件夹)
│  │  │  │  ├── artistAndAlbum.vue  歌手和专辑
│  │  │  │  ├── fmResult.vue        FM搜索结果
│  │  │  │  ├── playListResult.vue  歌单搜索结果
│  │  │  │  ├── songResult.vue      歌曲搜索结果
│  │  │  │  └── videoResult.vue     视频搜索结果
│  │  │  ├── search.vue     搜索页
│  │  │  └── searchType.vue 搜索类型
│  │  ├── setting.vue   设置页
│  │  ├── songList.vue  歌曲列表页(云盘/日推/听歌排行/收藏)
│  │  └── video.vue     视频页
├── vite.config.js
├── yarn-error.log
└── yarn.lock

```
