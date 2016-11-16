//filltext.js
Page({
  onReady:function(){
    var context = wx.createContext();

    context.setFontSize(14)
    context.fillText("MINA",50,50)
    context.moveTo(0,50)
    context.lineTo(100,50)
    context.stroke();

    context.setFontSize(20)
    context.fillText("MINA",100,100)
    context.moveTo(0,100)
    context.lineTo(200,100)
    context.stroke();
    wx.drawCanvas({
      canvasId:1,
      actions:context.getActions()
    });
  }
})