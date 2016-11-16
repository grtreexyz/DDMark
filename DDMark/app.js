//app.js
App({
  globalData: {
    userInfo: null
  },
  w: 0,
  h: 0,
  wh: 0,
  onLaunch: function () {
    var self = this;
    try {
      var res = wx.getSystemInfoSync()
      self.w = res.windowWidth;
      self.h = res.windowHeight;
      self.wh = res.windowWidth / res.windowHeight;
    } catch (e) {
      // Do something when catch error
      console.log(e.errMsg);
    }
  }
})