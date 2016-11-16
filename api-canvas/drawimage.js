//drawimage.js
Page({
  onReady:function(e){
    var context = wx.createContext();
    wx.chooseImage({
      success:function(res){
        context.drawImage(res.tempFilePaths[0],0,0)
        wx.drawCanvas({
          canvasId:1,
          actions:context.getActions()
        });
      }
    })
  }
})