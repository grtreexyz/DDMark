//scale.js
Page({
  onReady:function(e){
    var context = wx.createContext();
    context.rect(5,5,25,15)
    context.stroke();
    context.scale(2,2); //再放大2倍
    context.rect(5,5,25,15);
    context.stroke();
    context.scale(2,2); //再放大2倍
    context.rect(5,5,25,15)
    context.stroke();
    wx.drawCanvas({
      canvasId:1,
      actions:context.getActions()
    });
  }
})