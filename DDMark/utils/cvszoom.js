function extend(target, options) {
        var src,copy;
        for (name in options) {
            src = target[name];
            copy = options[name];
            // Prevent never-ending loop
            if (target === copy) {
                continue;
            }
            if (copy instanceof Array) {
                if(src instanceof Array)
                    target[name] = arguments.callee(src, copy);
                else
                    target[name] = arguments.callee([], copy);
            } else if (Object.prototype.toString.call(copy)=="[object Object]") {
                if(Object.prototype.toString.call(src)=="[object Object]")
                    target[name] = arguments.callee(src, copy);
                else
                    target[name] = arguments.callee({}, copy);
            } else {
                target[name] = copy;
            }
        }
        return target;
    }
module.exports = function (cvs, imgPath, options) {
        var w = cvs.width;//canvas的宽
        var h = cvs.height;//canvas的高
        var id = cvs.canvasId;
        var wh = w / h;
        var fullWidth, fullHeight, fwh;//图片原始尺寸
        var width=200, height=200, top=0, left=0;//图片的box
        var defaults = {
            'initSize': 0.95, //初始显示时相对容器的比例
            'overScaleTimes': 2, //放大到全分辨率后，可以继续放大的倍数
        };
        extend(defaults, options);
        wx.getImageInfo({
            src: imgPath,
            success: function (res) {
                fullWidth = res.width;
                fullHeight = res.height;
                fwh = fullWidth / fullHeight;
                console.log('fullwidth:'+fullWidth+";fullHeight:"+fullHeight);
            }
        });
        var initdraw = function () {
            if (wh > fwh) {
                height = defaults.initSize * h;
                width = fwh * height;
            } else {
                width = defaults.initSize * w;
                height = width / fwh;
            }
            //居中放置
            left = (w - width) / 2;
            top = (h - height) / 2;
            var context = wx.createContext();
            context.clearRect(0,0,w,h);
            context.drawImage(imgPath, left, top, width, height);
            var draw=context.getActions();
            console.log(JSON.stringify(draw));
            wx.drawCanvas({
                canvasId: id,
                actions: draw
            });
        };
        initdraw();
        return {
            initdraw:initdraw,
            // scale: scale,
            // move: move
        }
    }
