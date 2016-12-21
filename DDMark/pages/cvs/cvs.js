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
var bgArrays = [];
var fullWidth, fullHeight;
var textArrays = [];//所有字
var texttemp = {
    size: 12,
    text: "",
    color: '#000000',
    index: 0,
};
var stroketemp = {
    size: 10,
    color: '#000000',
    index: 0,
};
//画布重绘
function redraw() {
    context.translate(left, top);
    context.scale(scale, scale);
    var all = [];
    bgArrays.forEach(function (value) {
        all = all.concat(value);
    });
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
        top: 0,
        mzclass: 'active',
        msclass: '',
        mtclass: '',
        mhclass: '',
        textColors: [
            { name: '#ff0000', value: '红色' },
            { name: '#000000', value: '黑色', checked: 'true' },
            { name: '#ffffff', value: '白色' },
            { name: '#00ff00', value: '绿色' },
            { name: '#0000ff', value: '蓝色' },
            { name: '#ffff00', value: '黄色' },
        ],
        mtbarVisble: false,
        mhbarVisble: false,
        drawHistoryVisble: true,
    },
    moveandzoom: function () {
        this.setData({
            top: 0,
            operate: "moveandzoom",
            mzclass: 'active',
            msclass: '',
            mtclass: '',
            mhclass: '',
            mhbarVisble: false,
        });
    },
    markStroke: function () {
        this.setData({
            top: '-100%',
            operate: "markStroke",
            mzclass: '',
            msclass: 'active',
            mtclass: '',
            mhclass: '',
            msbarVisble: true,
            mhbarVisble: false,
        });
    },
    markText: function () {
        this.setData({
            top: '-100%',
            operate: "markText",
            mzclass: '',
            msclass: '',
            mtclass: 'active',
            mhclass: '',
            mtbarVisble: true,
            mhbarVisble: false,
        });
    },
    markHistory: function () {
        var drawsobj = [];
        var textsobj = [];
        drawArrays.forEach(function (value, index) {
            drawsobj.push({ "index": index });
        });
        textArrays.forEach(function (value, index) {
            textsobj.push({ "index": index });
        });
        this.setData({
            top: '-100%',
            mzclass: '',
            msclass: '',
            mtclass: '',
            mhclass: 'active',
            mhbarVisble: true,
            drawsobj: drawsobj,
            textsobj: textsobj,
        });

        drawArrays.forEach(function (value, index) {
            var maxX = -10000, minX = 10000, maxY = -10000, minY = 10000;
            value[4].data.forEach(function (value, index) {
                var d0 = value.data[0], d1 = value.data[1];
                d0 > maxX && (maxX = d0);
                d0 < minX && (minX = d0);
                d1 > maxY && (maxY = d1);
                d1 < minY && (minY = d1);
            });
            var s=80/Math.max(maxX-minX,maxY-minY);
            context.scale(s,s);
            context.translate(-minX+10, -minY+10);
            wx.drawCanvas({
                canvasId: 'draw' + index,
                actions: context.getActions().concat(value),
                reserve: false
            });
        });
        textArrays.forEach(function (value, index) {
            var data=value;
            data[0].data[0]=14;
            data[2].data[1]=3;
            data[2].data[2]=17;
            wx.drawCanvas({
                canvasId: 'text' + index,
                actions: data,
                reserve: false
            });
        });
    },
    closetext: function () {
        this.setData({
            top: 0,
            mtbarVisble: false,
        });
    },
    settext: function () {
        this.setData({
            top: 0,
            mtbarVisble: false,
        });
        if (texttemp.text != "") {
            context.setFontSize(texttemp.size / scale);
            context.setFillStyle(texttemp.color);
            context.fillText(texttemp.text, 50 / scale - left / scale, 50 / scale - top / scale);
            var temp = context.getActions();

            if (texttemp.index == 0) {
                textArrays.push(temp);
                texttemp.index = textArrays.length - 1;
            } else {
                textArrays[texttemp.index] = temp;
            }
            redraw();
        }
    },
    closeStroke: function () {
        this.setData({
            top: 0,
            msbarVisble: false,
        });
    },
    setStroke: function () {
        this.setData({
            top: 0,
            msbarVisble: false,
        });
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
                    context.setLineWidth(stroketemp.size / scale);
                    context.setLineCap("round");
                    context.setLineJoin("round");
                    context.setStrokeStyle(stroketemp.color);
                    contextArray = context.getActions();
                    //context2记录
                    context2.setLineWidth(stroketemp.size / scale);
                    context2.setLineCap("round");
                    context2.setLineJoin("round");
                    context2.setStrokeStyle(stroketemp.color);
                    context2.beginPath();
                    context2.moveTo(x00 / scale - left / scale, y00 / scale - top / scale);
                }
                break;
        }

        //console.log(scale,left,top,x00,y00);
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
                    scale = 1 * scale.toFixed(2);
                    redraw();
                    x00 = x10, x01 = x11, y00 = y10, y01 = y11;
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
                    textArrays[texttemp.index][2].data[1] += x / scale;
                    textArrays[texttemp.index][2].data[2] += y / scale;
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
                    context.moveTo(x00 / scale - left / scale, y00 / scale - top / scale);
                    x00 = t[0].x;
                    y00 = t[0].y;
                    context.lineTo(x00 / scale - left / scale, y00 / scale - top / scale);
                    context2.lineTo(x00 / scale - left / scale, y00 / scale - top / scale);
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
                    context.moveTo(x00 / scale - left / scale, y00 / scale - top / scale);
                    x00 = t[0].x;
                    y00 = t[0].y;
                    context.lineTo(x00 / scale - left / scale, y00 / scale - top / scale);
                    context.stroke();
                    wx.drawCanvas({
                        canvasId: 'target',
                        actions: contextArray.concat(context.getActions()),
                        reserve: true
                    });
                    context2.lineTo(x00 / scale - left / scale, y00 / scale - top / scale);
                    context2.stroke();
                    drawArrays.push(context2.getActions());
                }
                break;
        }
        console.log(drawArrays, textArrays);
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
    strokeColorChange: function (e) {
        stroketemp.color = e.detail.value;
        console.log('radio发生change事件，携带value值为：', e.detail.value)
    },
    strokeSizeChange: function (e) {
        stroketemp.size = e.detail.value;
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
                        wx.showModal({
                            title: '提示',
                            content: '保存成功！',
                            success: function (res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                }
                            }
                        })
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
    drawsHistory: function () {
        this.setData({
            drawHistoryVisble: true,
            textHistoryVisble: false,
        });
    },
    textsHistory: function () {
        this.setData({
            drawHistoryVisble: false,
            textHistoryVisble: true,
        });
    },
    delText: function (e) {
        textArrays.splice(e.detail.value,1);
        this.markHistory();
        redraw();
    },
    delDraw: function (e) {
        drawArrays.splice(e.detail.value,1);
        this.markHistory();
        redraw();
    },
    onLoad: function () {
        this.setData({
            width: app.w,
            height: app.h - 30
        });
    },
    onReady: function () {
        var self = this;
        console.log(app.w);
        console.log(app.h);
        wx.drawCanvas({
            canvasId: 'target',
            actions: [],
            reserve: false
        });
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
                    context.drawImage(app.imgObj.imgPath, fullWidth * (1 - initSize) / 2, fullHeight * (1 - initSize) / 2, initSize * fullWidth, initSize * fullHeight);
                    contextArray = context.getActions();
                    bgArrays.push(contextArray);
                    redraw();
                }
            });
        } else {
            this.setData({
                top: "-100%",
                operate: "markStroke",
                mzclass: '',
                msclass: 'active',
                mtclass: '',
                msbarVisble: true,
            });
        }
    }
})
