//translate.js
Page({
  onReady:function(){
    var context = wx.createContext();

    context.rect(50,50,200,200)
    context.stroke()
    context.translate(50,50)
    context.rect(50,50,200,200)
    context.stroke();

    wx.drawCanvas({
      canvasId:1,
      actions:context.getActions()
    });
  }
})