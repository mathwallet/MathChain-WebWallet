import sha256 from "crypto-js/sha256";
import md5 from "md5";
import BigNumber from "bignumber.js";
const qs = require("qs");

export default {
  /**
   * cookie操作
   */
  setCookie(name, value, options) {
    options = options || {};
    if (value === null) {
      value = "";
      options.expires = -1;
    }
    var expires = "";
    if (
      options.expires &&
      (typeof options.expires == "number" || options.expires.toUTCString)
    ) {
      var date;
      if (typeof options.expires == "number") {
        date = new Date();
        date.setTime(date.getTime() + options.expires * 24 * 60 * 60 * 1000);
      } else {
        date = options.expires;
      }
      expires = "; expires=" + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? "; path=" + options.path : "";
    var domain = options.domain ? "; domain=" + options.domain : "";
    var s = [cookie, expires, path, domain, secure].join("");
    var secure = options.secure ? "; secure" : "";
    var c = [name, "=", encodeURIComponent(value)].join("");
    var cookie = [c, expires, path, domain, secure].join("");
    document.cookie = cookie;
  },
  getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie != "") {
      var cookies = document.cookie.split(";");
      for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) == name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  },
  formatEmail(email) {
    var reg = /^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test(email);
  },
  //axios Post 参数格式化
  qsStringify(param) {
    return qs.stringify(param);
  },
  // 数字千分位，保留n位小数格式化
  addCommas(num, point = 2) {
    return new BigNumber(num).toFormat(point, BigNumber.ROUND_FLOOR);
  },
  // 根据法币不同计算价格
  computePriceByCoin(num, tokenPrice, legalCoin) {
    return new BigNumber(num)
      .times(tokenPrice)
      .div(legalCoin.rmb)
      .toFormat(legalCoin.point - 0, BigNumber.ROUND_FLOOR);
  },
  // 根据精度不同获取数据
  fixedByDecimal(num, decimal, point = 4) {
    return new BigNumber(num)
      .div(Math.pow(10, decimal))
      .toFixed(point, BigNumber.ROUND_FLOOR);
  },
  // 根据精度不同计算数据 乘法
  timesByDecimal(num, decimal) {
    return new BigNumber(num).times(Math.pow(10, decimal)).toFixed(0);
  },
  // 获取加密code和time
  getCodeTime() {
    let key = "keycode";
    let timestamp = Date.parse(new Date()) / 1000;
    let code = md5(timestamp + sha256(key + timestamp) + timestamp);
    return "&code=" + code + "&time=" + timestamp;
  },
  // 过滤字符串中的空格
  trimString(str) {
    return str.replace(/\s*/g, "");
  },
};
