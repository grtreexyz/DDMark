//setfillstyle.js
Page({
  onReady:function(e){
    var context = wx.createContext();

    context.setFillStyle("#ff00ff");
    context.setStrokeStyle("#00ffff");
    
    context.rect(50,50,100,100)
    context.fill()
    context.stroke()
    wx.drawCanvas({
      canvasId:1,
      actions:context.getActions()
    });
  }
})