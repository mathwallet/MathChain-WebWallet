import sha256 from 'crypto-js/sha256'
import md5 from 'md5'
import BigNumber from 'bignumber.js'
const qs = require( 'qs' );

export default {
  // 时间戳转换日期 （秒）
  timestampToDate( timestamp ) {
    var date = new Date( timestamp ); //时间戳为10位需*1000
    var Y = date.getFullYear() + '-';
    var M = ( date.getMonth() + 1 < 10 ? '0' + ( date.getMonth() + 1 ) : date.getMonth() + 1 ) + '-';
    var D = ( date.getDate() < 10 ? '0' + date.getDate() : date.getDate() ) + ' ';
    var h = ( date.getHours() < 10 ? '0' + date.getHours() : date.getHours() ) + ':';
    var m = ( date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes() ) + ':';
    var s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return Y + M + D + h + m + s;
  },

  /**
   * cookie操作
   */
  setCookie( name, value, options ) {
    options = options || {};
    if ( value === null ) {
      value = '';
      options.expires = -1;
    }
    var expires = '';
    if ( options.expires && ( typeof options.expires == 'number' || options.expires.toUTCString ) ) {
      var date;
      if ( typeof options.expires == 'number' ) {
        date = new Date();
        date.setTime( date.getTime() + ( options.expires * 24 * 60 * 60 * 1000 ) );
      } else {
        date = options.expires;
      }
      expires = '; expires=' + date.toUTCString(); // use expires attribute, max-age is not supported by IE
    }
    var path = options.path ? '; path=' + options.path : '';
    var domain = options.domain ? '; domain=' + options.domain : '';
    var s = [cookie, expires, path, domain, secure].join( '' );
    var secure = options.secure ? '; secure' : '';
    var c = [name, '=', encodeURIComponent( value )].join( '' );
    var cookie = [c, expires, path, domain, secure].join( '' )
    document.cookie = cookie;
  },

  getCookie( name ) {
    var cookieValue = null;
    if ( document.cookie && document.cookie != '' ) {
      var cookies = document.cookie.split( ';' );
      for ( var i = 0; i < cookies.length; i++ ) {
        var cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if ( cookie.substring( 0, name.length + 1 ) == ( name + '=' ) ) {
          cookieValue = decodeURIComponent( cookie.substring( name.length + 1 ) );
          break;
        }
      }
    }
    return cookieValue;
  },

  setSession( key, value ) {
    value = JSON.stringify( value );
    sessionStorage.setItem( key, value );
  },

  getSession( key ) {
    if ( key == "" ) return "";
    let value = sessionStorage.getItem( key );
    if ( value == "" ) {
      return "";
    }
    return value;
  },

  delSession( key ) {
    if ( key ) {
      sessionStorage.removeItem( key );
    }
  },

  sessionClear() {
    sessionStorage.clear();
  },

  formatEmail( email ) {
    var reg = /^\w+([+-.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    return reg.test( email );
  },

  //axios Post 参数格式化
  qsStringify( param ) {
    return qs.stringify( param )
  },

  // 数字千分位，保留n位小数格式化
  addCommas( num, point = 2 ) {
    return new BigNumber( num ).toFormat( point, 1 );
  },

  // 根据法币不同计算金额
  fixedByCoin( num, legalCoin ) {
    return new BigNumber( num ).div( legalCoin.rmb ).toFixed( legalCoin.point - 0, 1 );
  },

  // 根据法币不同计算价格
  computePriceByCoin( num, tokenPrice, legalCoin ) {
    return new BigNumber( num ).times( tokenPrice ).div( legalCoin.rmb ).toFormat( legalCoin.point - 0, 1 );
  },

  // 根据精度不同千分化数据
  formatByDecimal( num, decimal, point = 4 ) {
    return new BigNumber( num ).div( Math.pow( 10, decimal ) ).toFormat( point, 1 );
  },

  // 根据精度不同获取数据
  fixedByDecimal( num, decimal, point = 4 ) {
    return new BigNumber( num ).div( Math.pow( 10, decimal ) ).toFixed( point, 1 );
  },

  // 根据精度不同计算数据 乘法
  timesByDecimal( num, decimal ) {
    return new BigNumber( num ).times( Math.pow( 10, decimal ) ).toFixed( 0 );
  },

  BigNumber( num ) {
    return new BigNumber( num );
  },

  // 获取加密code和time
  getCodeTime() {
    let key = 'SQscorK9G1ZnlCPo';
    let timestamp = ( Date.parse( new Date() ) ) / 1000;
    let code = md5( timestamp + sha256( key + timestamp ) + timestamp );
    return '&code=' + code + '&time=' + timestamp;
  },

  //查找 token返回
  findToken( tokens, alias ) {
    let result = [];
    for ( let j = 0; j < alias.length; j++ ) {
      for ( let i = 0; i < tokens.length; i++ ) {
        let item = tokens[i];
        if ( item.alias == alias[j] ) {
          result[item.alias] = item.last2Rmb;
          break;
        }
      }
    }
    return result;
  },

  // 过滤字符串中的空格
  trimString( str ) {
    return str.replace( /\s*/g, '' );
  },

  // 判断终端
  browserVersions() {
    var u = navigator.userAgent.toLowerCase();
    return {
      android: u.indexOf( 'android' ) > -1 || u.indexOf( 'adr' ) > -1, //android终端
      iPhone: u.indexOf( 'iphone' ) > -1, //是否为iPhone或者QQHD浏览器
      Safari: !!u.match( /version\/([\d.]+).*safari/ ), //是否为Safari浏览器
      weixin: u.indexOf( 'micromessenger' ) > -1, //是否微信
      mdsApp: u.indexOf( 'mdsapp' ) > -1, //是否MdsApp
      mdsVer: u.indexOf( 'mdsapp' ) > -1 ? u.match( /mdsapp\/[^\s]+\s?/ )[0].trim().split( '/' )[1] : '0' //MdsApp版本
    };
  }
}
