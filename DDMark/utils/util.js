function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

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
module.exports = {
  formatTime: formatTime,
  extend:extend
}
