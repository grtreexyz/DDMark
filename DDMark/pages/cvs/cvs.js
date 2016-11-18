var app = getApp();
var x00, x01, y00, y01, x10, x11, y10, y11;
var scale = 1, left = 0, top = 0;
Page({
  data: {
    width: "200px",
    height: "200px",
    operate: "moveandzoom",
    cvsTransform: "matrix(1,0,0,1,0,0)",
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
    var self = this;
    switch (self.data.operate) {
      case "moveandzoom":
        if (e.touches.length == 2) {//双指缩放的手势操作
          var t = e.touches;
          x00 = t[0].pageX;
          x01 = t[1].pageX;
          y00 = t[0].pageY;
          y01 = t[1].pageY;
        }
        if (e.touches.length == 1) {//移动单指操作
          var t = e.touches;
          x00 = t[0].pageX;
          y00 = t[0].pageY;
        }
        break;
      case "markText":
        console.log("markText");
        break;
      case "markStroke":
        console.log("markStroke");
        break;
    }
  },
  cvsMove: function (e) {
    var self = this;
    switch (self.data.operate) {
      case "moveandzoom":
        if (e.touches.length == 2) {//双指缩放的手势操作
          var t = e.touches;
          x10 = t[0].pageX;
          x11 = t[1].pageX;
          y10 = t[0].pageY;
          y11 = t[1].pageY;
          scale = Math.sqrt(((x11 - x10) * (x11 - x10) + (y11 - y10) * (y11 - y10)) / ((x01 - x00) * (x01 - x00) + (y01 - y00) * (y01 - y00)));
          console.log('matrix(' + scale + ',0,0,' + scale + ',' + left + ',' + top + ')');
          self.setData({
            // width: 200*scale + 'px',
            // height: 200*scale + 'px',
            cvsTransform: 'scale('+scale+')'
          });
        }
        if (e.touches.length == 1) {//移动单指操作
          var t = e.touches;
          x10 = t[0].pageX;
          y10 = t[0].pageY;
          left += x10 - x00;
          top += y10 - y00;
          self.setData({
            //cvsTransform: 'matrix(' + scale + ',0,0,' + scale + ',' + left + ',' + top + ')'
          });
          x00=x10;
          y00=y10;
        }
        break;
      case "markText":
        console.log("markText");
        break;
      case "markStroke":
        console.log("markStroke");
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
        console.log("markStroke");
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
  onReady: function () {
    var self = this;
    console.log(app.w);
    console.log(app.h);

    var context = wx.createContext();
    // context.setStrokeStyle("#00ff00");
    // context.setLineWidth(5);
    // context.rect(0, 0, 200, 200);
    // context.stroke();
    // context.setStrokeStyle("#ff0000");
    // context.setLineWidth(2);
    // context.moveTo(160, 100);
    // context.arc(100, 100, 60, 0, 2 * Math.PI, true);
    // context.moveTo(140, 100);
    // context.arc(100, 100, 40, 0, Math.PI, false);
    // context.moveTo(85, 80);
    // context.arc(80, 80, 5, 0, 2 * Math.PI, true);
    // context.moveTo(125, 80);
    // context.arc(120, 80, 5, 0, 2 * Math.PI, true);
    // context.stroke();
    app.imgObj.imgPath&&context.drawImage(app.imgObj.imgPath, 0, 0,200,200);
    // context.setFillStyle("#ff00ff")
    // context.rect(0, 0, 800, 800)
    // context.fill()
    wx.drawCanvas({
      canvasId: 'target',
      actions: context.getActions() // 获取绘图动作数组
    });
  },
  containmove:function(){
    console.log("containmove");
  },
  onPullDownRefresh: function() {
    // Do something when pull down.
    console.log('onPullDownRefresh');
  },
  // onReachBottom: function() {
  //   // Do something when page reach bottom.
  //   console.log('onReachBottom');
  // },
})