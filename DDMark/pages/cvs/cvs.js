var app = getApp();
Page({
  data: {
    width: "100px",
    height: "100px",
  },
  onReady: function () {
    var self = this;
    self.setData({
      width: app.w + "px",
      height: app.h + "px",
    });
    console.log(app.w);
    console.log(app.h);

    var context = wx.createContext();
    context.setStrokeStyle("#00ff00");
    context.setLineWidth(5);
    context.rect(0, 0, 200, 200);
    context.stroke();
    context.setStrokeStyle("#ff0000");
    context.setLineWidth(2);
    context.moveTo(160, 100);
    context.arc(100, 100, 60, 0, 2 * Math.PI, true);
    context.moveTo(140, 100);
    context.arc(100, 100, 40, 0, Math.PI, false);
    context.moveTo(85, 80);
    context.arc(80, 80, 5, 0, 2 * Math.PI, true);
    context.moveTo(125, 80);
    context.arc(120, 80, 5, 0, 2 * Math.PI, true);
    context.stroke();
    //context.drawImage(tempFilePath, 0, 0, 100, 100);
    // context.setFillStyle("#ff00ff")
    // context.rect(0, 0, 800, 800)
    // context.fill()
    wx.drawCanvas({
      canvasId: 'target',
      actions: context.getActions() // 获取绘图动作数组
    });

    wx.canvasToTempFilePath({
      canvasId: 'target',
      success: function (res) {
        wx.saveFile({
          tempFilePath: res.tempFilePath,
          success: function (res) {
            console.log('saved' + res.savedFilePath);
          },
          fail: function (e) {
            console.log(e.errMsg);
          }
        });
      },
      fail: function (e) {
        console.log(e.errMsg)
      },
      complete: function (e) {
        console.log(e.errMsg)
      },
    });
  }
})