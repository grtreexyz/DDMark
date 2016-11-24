var app = getApp();
var x00, x01, y00, y01, x10, x11, y10, y11;
var scale = 1, left = 0, top = 0;
var cvszoom = require('../../utils/cvszoom.js');
var cvs;
var context = wx.createContext();
var context2 = wx.createContext();
var drawArray=[];
Page({
  data: {
    operate: "moveandzoom",
    width:100,
    height:100
  },
  moveandzoom: function () {
    this.data.operate = "moveandzoom";
  },
  markText: function () {
    this.data.operate = "markText";
  },
  markStroke: function () {
    this.data.operate = "markStroke";
  },
  cvsStart: function (e) {
    //console.log(e.currentTarget.id);
    var self = this;
    switch (self.data.operate) {
      case "moveandzoom":
        if (e.touches.length == 2) {//双指缩放的手势操作
          var t = e.touches;
          x00 = t[0].x;
          y00 = t[0].y;
          x01 = t[1].x;
          y01 = t[1].y;
        }
        if (e.touches.length == 1) {//移动单指操作
          var t = e.touches;
          x00 = t[0].x;
          y00 = t[0].y;
        }
        break;
      case "markText":
        console.log("markText");
        break;
      case "markStroke":
        console.log("markStrokestart");
        var t = e.touches;
        x00 = t[0].x;
        y00 = t[0].y;
        context.beginPath();
        context.setLineWidth(10);
        context.setLineCap("round");
        context.setLineJoin("round");
        context.setStrokeStyle("#000000")
        context.moveTo(x00, y00);
        
        context2.setLineWidth(10);
        context2.setLineCap("round");
        context2.setLineJoin("round");
        context2.setStrokeStyle("#000000");
        context2.beginPath();
        context2.moveTo(x00, y00);
        break;
    }
  },
  cvsMove: function (e) {
    var self = this;
    switch (self.data.operate) {
      case "moveandzoom":
        if (e.touches.length == 2) {//双指缩放的手势操作
          var t = e.touches;
          x10 = t[0].x;
          x11 = t[1].x;
          y10 = t[0].y;
          y11 = t[1].y;
          scale = Math.sqrt(((x11 - x10) * (x11 - x10) + (y11 - y10) * (y11 - y10)) / ((x01 - x00) * (x01 - x00) + (y01 - y00) * (y01 - y00)));
          cvs.scale(scale);
        }
        if (e.touches.length == 1) {//移动单指操作
          var t = e.touches;
          x10 = t[0].x;
          y10 = t[0].y;
          var x = x10 - x00;
          var y = y10 - y00;
          cvs.move(x, y);
          x00 = x10;
          y00 = y10;
        }
        break;
      case "markText":
        console.log("markText");
        break;
      case "markStroke":
        console.log("markStrokemove");
        var t = e.touches;
        if(x00 == t[0].x && y00 == t[0].y) return;
        x00 = t[0].x;
        y00 = t[0].y;      
        context.lineTo(x00,y00);
        context2.lineTo(x00,y00);
        context.stroke();
        wx.drawCanvas({
          canvasId: 'target',
          actions: context.getActions()
        });
        break;
    }
  },
  cvsEnd: function (e) {
    switch (this.data.operate) {
      case "moveandzoom":
        console.log('moveandzoom');
        break;
      case "markText":
        console.log("markText");
        break;
      case "markStroke":
        console.log("markStrokeend");
        context.
        break;
    }
  },
  saveimg: function () {
    wx.canvasToTempFilePath({
      canvasId: 'target',
      success: function (res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            console.log('saved::' + res.savedFilePath);
          },
          complete: function (e) {
            console.log(e.errMsg);
          }
        });
      },
      complete: function (e) {
        console.log(e.errMsg)
      },
    });
  },
  onLoad:function(){
    this.setData({
      width:app.w,
      height:app.h-200
    });
  },
  onReady: function () {
    var self = this;
    console.log(app.w);
    console.log(app.h);
    // cvs = cvszoom({
    //   canvasId: 'target',
    //   width: app.w,
    //   height: app.h - 40
    // }, app.imgObj.imgPath);


        context.beginPath();
        context.setLineWidth(10);
        context.setLineCap("round");
        context.setLineJoin("round");
        context.setStrokeStyle("#000000")
        context.moveTo(100, 100);
        context.lineTo(200,200);
        context.stroke();
        wx.drawCanvas({
          canvasId: 'target',
          actions: context.getActions(),
          reserve:true
        });  
        context.moveTo(200, 200);     
        context.lineTo(100,200);
        context.stroke();
        wx.drawCanvas({
          canvasId: 'target',
          actions: context.getActions(),
          reserve:true
        });
  }
})