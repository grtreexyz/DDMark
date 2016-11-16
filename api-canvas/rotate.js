//rotate.js
Page({
  onReady:function(e){
    var context = wx.createContext();
    context.rect(50,50,200,200)
    context.stroke();
    context.rotate(5*Math.PI/180)
    context.rect(50,50,200,200)
    context.stroke();
    context.rotate(5*Math.PI/180)
    context.rect(50,50,200,200)
    context.stroke()

    wx.drawCanvas({
      canvasId:1,
      actions:context.getActions()
    });
  }
})