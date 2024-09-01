export default defineAppConfig({
  pages: [
    'pages/login/login',
    'pages/register/register',
    'pages/discover/discover',
    'pages/publish/publish',
    'pages/search/search',
    'pages/mine/mine',
    'pages/detail/detail',
    'pages/edit/edit',
    'pages/user/user',
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: "#333",
    selectedColor: "#A797F8",
    backgroundColor: "#fff",
    borderStyle: "white",
    list: [
      {
        pagePath: "pages/discover/discover",
        text: "发现",
        iconPath: "./assets/images/discover.png",
        selectedIconPath: "./assets/images/discover_selected.png"
      },
      {
        pagePath: "pages/publish/publish",
        text: "发布",
        iconPath: "./assets/images/publish.png",
        selectedIconPath: "./assets/images/publish_selected.png"
      },
      {
        pagePath: "pages/mine/mine",
        text: "我的",
        iconPath: "./assets/images/mine.png",
        selectedIconPath: "./assets/images/mine_selected.png"
      }
    ]
  },
  lazyCodeLoading: "requiredComponents",
})
