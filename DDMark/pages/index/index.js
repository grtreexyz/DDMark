//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    buttonstatus: 'block',
    canvastatus: "none",
    width: "200px",
    height: "200px",
  },
  //事件处理函数
  bindTap: function () {
    var self = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        app.imgObj.imgPath = res.tempFilePaths[0];
        wx.redirectTo({
          url: '../cvs/cvs'
        })
      }
    });
  },

});
