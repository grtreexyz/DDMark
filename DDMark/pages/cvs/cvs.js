var app = getApp();
var x00, x01, y00, y01, x10, x11, y10, y11;
var width, height;
var scale = 1,
    left = 0,
    top = 0;
var context = wx.createContext(); //展示
var contextArray = []; //展示
var context2 = wx.createContext(); //记录
var drawArrays = []; //所有画
var fullWidth, fullHeight;
var textArrays = [];//所有字
var texttemp = {
    size: 12,
    text: "",
    color: '#000000',
    index:0,
};
//画布重绘
function redraw() {
    context.scale(scale, scale);
    context.translate(left, top);
    var all = [];
    drawArrays.forEach(function (value) {
        all = all.concat(value);
    });
    textArrays.forEach(function (value) {
        all = all.concat(value);
    });
    wx.drawCanvas({
        canvasId: 'target',
        actions: context.getActions().concat(all),
        reserve: false
    });
}

Page({
    data: {
        operate: "moveandzoom",
        width: 100,
        height: 100,
        mzclass: 'active',
        msclass: '',
        mtclass: '',
        textColors: [
            { name: '#ff0000', value: '红色' },
            { name: '#000000', value: '黑色', checked: 'true' },
            { name: '#ffffff', value: '白色' },
            { name: '#00ff00', value: '绿色' },
            { name: '#0000ff', value: '蓝色' },
            { name: '#ff0000', value: '黄色' },
        ],
        mtbarVisble: false,
    },
    moveandzoom: function () {
        this.setData({
            operate: "moveandzoom",
            mzclass: 'active',
            msclass: '',
            mtclass: ''
        });
    },
    markStroke: function () {
        this.setData({
            operate: "markStroke",
            mzclass: '',
            msclass: 'active',
            mtclass: ''
        });
    },
    markText: function () {
        this.setData({
            operate: "markText",
            mzclass: '',
            msclass: '',
            mtclass: 'active',
            mtbarVisble: true,
        });
    },
    closetext: function () {
        this.setData({
            mtbarVisble: false,
        });
    },
    settext: function () {
        this.setData({
            mtbarVisble: false,
        });
        if(texttemp.text!=""){
            context.setFontSize(texttemp.size);
            context.setFillStyle(texttemp.color);
            context.fillText(texttemp.text, 50, 50);
            var temp = context.getActions();
            
            if(texttemp.index==0){
                textArrays.push(temp);
                texttemp.index=textArrays.length-1;
            }else{
                textArrays[texttemp.index]=temp;
            }
            redraw();
        }
    },
    //startstartstartstartstartstartstartstartstartstartstartstartstartstartstartstartstart
    cvsStart: function (e) {
        //console.log(e.currentTarget.id);
        var self = this;
        switch (self.data.operate) {
            case "moveandzoom":
                if (e.touches.length == 2) { //双指缩放的手势操作
                    var t = e.touches;
                    x00 = t[0].x;
                    y00 = t[0].y;
                    x01 = t[1].x;
                    y01 = t[1].y;
                }
                if (e.touches.length == 1) { //移动单指操作
                    var t = e.touches;
                    x00 = t[0].x;
                    y00 = t[0].y;
                }
                break;
            case "markText":
                if (e.touches.length == 1) { //移动单指操作
                    var t = e.touches;
                    x00 = t[0].x;
                    y00 = t[0].y;
                }
                break;
            case "markStroke":
                console.log("markStrokestart");
                if (e.touches.length == 1) { //移动单指操作
                    var t = e.touches;
                    x00 = t[0].x;
                    y00 = t[0].y;
                    contextArray = [];
                    //context展示
                    context.beginPath();
                    context.setLineWidth(10 * scale);
                    context.setLineCap("round");
                    context.setLineJoin("round");
                    context.setStrokeStyle("#000000");
                    contextArray = context.getActions();
                    //context2记录
                    context2.setLineWidth(10 * scale);
                    context2.setLineCap("round");
                    context2.setLineJoin("round");
                    context2.setStrokeStyle("#000000");
                    context2.beginPath();
                    context2.moveTo(x00 - left, y00 - top);
                }
                break;
        }
    },
    //movemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemovemove
    cvsMove: function (e) {
        var self = this;
        switch (self.data.operate) {
            case "moveandzoom":
                if (e.touches.length == 2) { //双指缩放的手势操作
                    var t = e.touches;
                    x10 = t[0].x;
                    x11 = t[1].x;
                    y10 = t[0].y;
                    y11 = t[1].y;
                    var newscale = Math.sqrt(((x11 - x10) * (x11 - x10) + (y11 - y10) * (y11 - y10)) / ((x01 - x00) * (x01 - x00) + (y01 - y00) * (y01 - y00)));
                    scale = scale * newscale;
                    redraw();
                }
                if (e.touches.length == 1) { //移动单指操作
                    var t = e.touches;
                    x10 = t[0].x;
                    y10 = t[0].y;
                    var x = x10 - x00;
                    var y = y10 - y00;
                    left = left + x;
                    top = top + y;
                    redraw();
                    x00 = x10;
                    y00 = y10;
                }
                break;
            case "markText":
                if (e.touches.length == 1) { //移动单指操作
                    var t = e.touches;
                    x10 = t[0].x;
                    y10 = t[0].y;
                    var x = x10 - x00;
                    var y = y10 - y00;
                    textArrays[texttemp.index][2].data[1]+=x;
                    textArrays[texttemp.index][2].data[2]+=y;
                    redraw();
                    x00 = x10;
                    y00 = y10;
                }
                break;
            case "markStroke":
                console.log("markStrokemove");
                if (e.touches.length == 1) { //移动单指操作
                    var t = e.touches;
                    if (x00 == t[0].x && y00 == t[0].y) return;
                    context.moveTo(x00 - left, y00 - top);
                    x00 = t[0].x;
                    y00 = t[0].y;
                    context.lineTo(x00 - left, y00 - top);
                    context2.lineTo(x00 - left, y00 - top);
                    context.stroke();
                    wx.drawCanvas({
                        canvasId: 'target',
                        actions: contextArray.concat(context.getActions()),
                        reserve: true
                    });
                }
                break;
        }
    },
    //endendendendendendendendendendendendendendendendendendendendendendendendendendendendendendendendendend
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
                if (e.touches.length == 0 && e.changedTouches.length == 1) {
                    var t = e.changedTouches;
                    if (x00 == t[0].x && y00 == t[0].y) {
                        context2.stroke();
                        drawArrays.push(context2.getActions());
                        return;
                    }
                    context.moveTo(x00 - left, y00 - top);
                    x00 = t[0].x;
                    y00 = t[0].y;
                    context.lineTo(x00 - left, y00 - top);
                    context.stroke();
                    wx.drawCanvas({
                        canvasId: 'target',
                        actions: contextArray.concat(context.getActions()),
                        reserve: true
                    });
                    context2.lineTo(x00 - left, y00 - top);
                    context2.stroke();
                    drawArrays.push(context2.getActions());
                }
                break;
        }
    },
    //texttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttexttext
    textColorChange: function (e) {
        texttemp.color = e.detail.value;
        console.log('radio发生change事件，携带value值为：', e.detail.value)
    },
    textinput: function (e) {
        texttemp.text = e.detail.value;
        console.log('input发生change事件，携带value值为：', e.detail.value)
    },
    textsizechange: function (e) {
        texttemp.size = e.detail.value;
        console.log('input发生change事件，携带value值为：', e.detail.value)
    },
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
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
    onLoad: function () {
        this.setData({
            width: app.w,
            height: app.h - 300
        });
    },
    onReady: function () {
        var self = this;
        console.log(app.w);
        console.log(app.h);
        var initSize = 0.95;
        if (app.imgObj.imgPath) {
            wx.getImageInfo({
                src: app.imgObj.imgPath,
                success: function (res) {
                    fullWidth = res.width;
                    fullHeight = res.height;
                    var fwh = fullWidth / fullHeight;
                    console.log('fullwidth:' + fullWidth + ";fullHeight:" + fullHeight);
                    var w = self.data.width;
                    var h = self.data.height;
                    var wh = w / h;
                    if (wh > fwh) {
                        scale = initSize * h / fullHeight;
                    } else {
                        scale = initSize * w / fullWidth;
                    }
                    var context = wx.createContext();

                    var context = wx.createContext();
                    context.drawImage(app.imgObj.imgPath, fullWidth * (1 - initSize) / 2, fullHeight * (1 - initSize) / 2, initSize * fullWidth, initSize * fullHeight);
                    contextArray = context.getActions();
                    drawArrays.push(contextArray);
                    redraw();
                }
            });
        }


        // context.beginPath();
        // context.setLineWidth(10);
        // context.setLineCap("round");
        // context.setLineJoin("round");
        // context.setStrokeStyle("#000000")
        // context.moveTo(100, 100);
        // context.lineTo(200, 200);
        // context.stroke();
        // contextArray = context.getActions();
        // wx.drawCanvas({
        //     canvasId: 'target',
        //     actions: contextArray,
        //     reserve: true
        // });
        // drawArrays.push(contextArray);
        // context.moveTo(200, 200);
        // context.lineTo(100, 200);
        // context.stroke();
        // contextArray = context.getActions();
        // wx.drawCanvas({
        //     canvasId: 'target',
        //     actions: contextArray,
        //     reserve: true
        // });
        // drawArrays.push(contextArray);
    }
})
