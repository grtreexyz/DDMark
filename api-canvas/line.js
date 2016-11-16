//line.js
Page({
  onReady:function(e){
    var context = wx.createContext();

    context.setLineWidth(10);
    context.setLineCap("round")
    context.setLineJoin("miter");
    context.setMiterLimit(10);
    context.moveTo(20,20);
    context.lineTo(150,27);
    context.lineTo(20,54);
    context.stroke();

    context.beginPath();

    context.setMiterLimit(3);
    context.moveTo(20,70);
    context.lineTo(150,77);
    context.lineTo(20,104);
    context.stroke();

    wx.drawCanvas({
      canvasId:1,
      actions:context.getActions()
    });
  }
})
