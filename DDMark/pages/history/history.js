// pages/history/history.js
var util = require('../../utils/util.js')
var app = getApp();
Page({
  data: {
    files: {}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var self = this;
    wx.getSavedFileList({
      success: function (res) {
        console.log(res);
        var temp=res.fileList;
        temp=temp.map(function(data){
          data.createTime=util.formatTime(new Date(data.createTime*1000));
          data.size=(data.size/1000).toFixed(1)+"KB";
          return data;
        });
        self.setData({
          files: temp,
        });
      }
    });

  },
  openimage:function(event){
    console.log(event);
    app.imgObj.imgPath = event.currentTarget.dataset.src;
    wx.redirectTo({
          url: '../cvs/cvs'
    })
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})