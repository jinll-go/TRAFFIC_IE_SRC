import debounceFn from '../../node_modules/lodash/debounce.js';
import throttleFn from '../../node_modules/lodash/throttle.js';

var current_year = new Date().getFullYear();
var current_month = new Date().getMonth() + 1;
var current_day = new Date().getDate();

function isLeapYear(year) {
    return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
}
/**
 * 获取某一年份的某一月份的天数
 *
 * @param {Number} year
 * @param {Number} month
 */
function getMonthDays(year, month) {
    return [31, null, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month] || (isLeapYear(year) ? 29 : 28);
}

export { current_day, current_month, current_year, isLeapYear, getMonthDays };

export function LocalTimeToUTC(date) {
    var y = date.getUTCFullYear();
    var m = date.getUTCMonth();
    var d = date.getUTCDate();
    var h = date.getUTCHours();
    var M = date.getUTCMinutes();
    var s = date.getUTCSeconds();

    return Date.UTC(y, m, d, h, M, s) / 1000;
}

export function rangeArray(start, end) {
    return new Array(end - start + 1).fill(0).map((v, i) => i + start);
}

// JavaScript Document
//判断是否为空
//去除前后空格

String.prototype.Trim = function() {
    return this.replace(/(^\s*)|(\s*$)/g, '');
};
//String.prototype.len=function(){
//return this.replace(/[^\x00-\xff]/g,"**").length;
//} 这里的字符数是会自动区分中文字符的，一个中文字符会自动记为两个字符，
//因此，不需要象单行文本框一样，设置为总字符数的一半来控制。
/*
function checkNull(obj) {
  if (obj.value.Trim().length == 0) {
    return false;
  }
  return true;
}

function checkclick(frm,name){
  if($s(name).checked==false)
    $s(name).value=0;
  else
    $s(name).value=1;
}

function checkclick(frm,name){
  if($s(name).checked==false)
    $s(name).value=0;
  else
    $s(name).value=1;
}
*/
//check IP Address
export function checkIp(str) {
    if (CheckStr(str)) {
        return false;
    }

    var errStr = arguments[1] || '';
    //check type
    if (/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.test(str) == false) {
        //alert(errStr +' '+i18n_illegal);
        return false;
    }
    //check value
    if (RegExp.$1 < 0 || RegExp.$1 > 255 || RegExp.$2 < 0 || RegExp.$2 > 255 || RegExp.$3 < 0 || RegExp.$3 > 255 || RegExp.$4 < 0 || RegExp.$4 > 255) {
        //alert(errStr + ' '+i18n_illegal);
        return false;
    }
    //剔除   如     010.020.020.03   前面   的0
    var str = str.replace(/0(\d)/g, '$1');
    str = str.replace(/0(\d)/g, '$1');
    return true;
}

export function isPort(str) {
    if (CheckStr(str)) {
        return false;
    }
    var errStr = arguments[1] || '';
    var reg = /^[0-9]\d*$/;

    if (reg.test(str) && parseInt(str, 10) < 65536 && parseInt(str, 10) > 0) {
    } else {
        //alert(errStr + ' '+i18n_illegal);
        return false;
    }
    return true;
}
export function isPortV2(str) {
    if (CheckStr(str)) {
        return false;
    }
    var errStr = arguments[1] || '';
    var reg = /^[0-9]\d*$/;

    if (reg.test(str) && parseInt(str, 10) < 65536 && parseInt(str, 10) >= 1024) {
    } else {
        //alert(errStr + ' '+i18n_illegal);
        return false;
    }
    return true;
}

export function isTTL(str) {
    if (CheckStr(str)) {
        return false;
    }
    var errStr = arguments[1] || '';
    var reg = /^[0-9]\d*$/;

    if (reg.test(str) && parseInt(str, 10) < 256) {
    } else {
        //alert(errStr + ' '+i18n_illegal);
        return false;
    }
    return true;
}
//check digit
/*export function IsDigit(){
  if((event.keyCode != 46)&&(event.keyCode != 13)){
    if ((event.keyCode < 48) || (event.keyCode > 57)) {alert(enternumber)};
      return ((event.keyCode >= 48) && (event.keyCode <= 57));
  }else{
  return  (event.keyCode);
  }
}*/

//check Num
export function isNum(num, arrStr) {
    let reNum = /^[+-]?[0-9]\d*$/;
    if (!reNum.test(num)) {
        return false;
    }
    // msg("isNum:"+arrStr);

    if (arrStr) {
        let arr = [0, 0];
        if (Array.isArray(arrStr)) {
            arr = arrStr;
        } else {
            try {
                arr = JSON.parse(arrStr);
            } catch (e) {
                return false;
            }
        }

        if (parseInt(num) < arr[0] || parseInt(num) > arr[1]) {
            return false;
        }
    }

    return true;
}
export function isFloat(num, arrStr) {
    let reNum = /^[+-]?\d+(\.\d+)?$/;
    if (!reNum.test(num)) {
        return false;
    }
    // msg("isNum:"+arrStr);

    if (arrStr) {
        let arr = [0.0, 0.0];
        if (Array.isArray(arrStr)) {
            arr = arrStr;
        } else {
            try {
                arr = JSON.parse(arrStr);
            } catch (e) {
                return false;
            }
        }

        if (parseFloat(num) < arr[0] || parseFloat(num) > arr[1]) {
            return false;
        }
    }

    return true;
}

export function isNumV2(num) {
    // msg("isNumV2:"+num);
    //   if (typeof (num) != "number") {
    //     if (!num.match("^(\\-|\\+?)\\d+$"))
    //       return false;
    //   }
    let reNum = /^-?[0-9]\d*$/;
    return reNum.test(num);
}
//得到当前日期
export function getCurentData() {
    var now = new Date();

    var year = now.getFullYear(); //年
    var month = now.getMonth() + 1; //月
    var day = now.getDate(); //日
    var clock = year + '-';

    if (month < 10) clock += '0';

    clock += month + '-';

    if (day < 10) clock += '0';

    clock += day + ' ';

    return clock;
}

//时间格式检测如hh:mm
export function CheckHHMMTime(str) {
    var pattern = str.match(/^(\d|([0-1]\d)|(2[0-3])):(\d|([0-5]\d))$/);
    if (pattern == null) {
        return false;
    }
    return true;
}

export function CheckDateTime(value) {
    var strDTCheck = value;
    var strDateString = value;
    var strDate;
    var strTime;
    var strSp = 0;

    if (strDateString.length == 0) {
        //注意
        return true;
    }

    //取得分隔符" " 的位置 日期部分和时间部分的分隔符
    for (var i = 0; i < strDateString.length; i++) {
        if (strDateString.substr(i, 1) == ' ') {
            strSp = i;
            break;
        }
    }
    //如果没有分隔符" "；日期时间格式错误
    if (strSp == 0) {
        //如果没有日期时间分隔符" ",
        if (strDTCheck.length <= 10) {
            //如果字符串长度小于等于10，说明输入的有可能只是日期部分,而没有时间部分
            strDate = strDTCheck;
            return CheckDate(strDate);
        }
        return false;
    }
    strDate = strDateString.substr(0, strSp); //取日期部分
    strTime = strDateString.substr(strSp + 1, strDateString.length - strSp + 1); //取时间部分

    var separator = ':'; //时间分隔符
    var arrayOfTimes = strTime.split(separator); // HH:mm:ss 两个分隔符
    if (arrayOfTimes.length == 2) {
        //如果没有秒钟，补上 使之成为 HH:mm:ss 格式
        strTime = strTime + ':00';
    }
    if (CheckDate(strDate) == true) {
        //调用子函数CheckDate
        //校验日期部分正确
        // if (CheckTime(strTime) == true)
        if (isTime(strTime) == true) {
            //调用子函数isTime
            return true;
        } else {
            return false;
        }
    } else {
        //校验日期部分不正确 ，返回false
        return false;
    }
}

export function CheckDate(SparaDate) {
    //如果是正确的yyyyMMdd格式则校验通过,增加时间2005-06-23 added by linsj
    if (CheckyyyyMMdd(SparaDate) == true) {
        return true;
    }

    var strYMDSP = 0;
    var strYMD;

    //判断YYYYMMDD中的分隔符号 不是- 或/报错
    if (!(SparaDate.substr(4, 1) == '-')) {
        if (!(SparaDate.substr(4, 1) == '/')) {
            return false;
        }
    }

    var strYear = SparaDate.substr(0, 4);
    SparaDate = SparaDate.substr(5, SparaDate.length - 5);

    //去掉年后的字符串
    for (i = 0; i < SparaDate.length; i++) {
        if (SparaDate.substr(i, 1) == '-') {
            strYMDSP = i;
            break;
        }
        if (SparaDate.substr(i, 1) == '/') {
            strYMDSP = i;
            break;
        }
    }
    //剩下的字符串中没有-或/报错
    if (strYMDSP < 1) {
        return false;
    }

    var strMonth = SparaDate.substr(0, strYMDSP);
    var strDay = SparaDate.substr(strYMDSP + 1, SparaDate.length - strYMDSP + 1);
    //如果月和日是一位的话补0 ,使之成为yyyyMMdd格式
    if (strMonth.length == 1) {
        strMonth = '0' + strMonth;
    } //补0
    if (strDay.length == 1) {
        strDay = '0' + strDay;
    } //补0
    //调用CheckyyyyMMdd函数判断yyyyMMdd格式的日期
    if (CheckyyyyMMdd(strYear + strMonth + strDay) == true) {
        return true;
    } else {
        return false;
    }
} // end  export function

export function isTime(str) {
    var a = str.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/);
    if (a == null) {
        /*alert('输入的时间格式不正确');*/ return false;
    }
    if (a[1] > 24 || a[3] > 60 || a[4] > 60) {
        //alert("时间格式不对");
        return false;
    }
    return true;
}

export function CheckyyyyMMdd(dayString) {
    //年月日检验函数
    var digit = '0123456789';
    datelist = new Array(31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
    if (dayString.length != 8) return false;
    for (i = 0; i < 8; i++) {
        if (digit.indexOf(dayString.charAt(i), 0) == -1) return false;
    }
    year = dayString.substr(0, 4); //截取年部分
    month = dayString.substr(4, 2); //截取月部分
    date = dayString.substr(6, 2); //截取日部分
    if (year > 2200 || year < 1900 || month > 12 || month < 1 || date > 31 || date < 1) return false;
    if (date > datelist[month - 1]) return false;

    yyyy = eval(year);
    if (month == '02') {
        if (yyyy % 400 == 0) {
            if (date > 29) return false;
        } else if (yyyy % 4 == 0 && yyyy % 100 != 0) {
            if (date > 29) return false;
        } else {
            if (date > 28) return false;
        }
    }
    return true;
}

export function isDateTimeString(str) {
    str = str.trim();
    if (str.length == 0) return false;

    var a = str.match(
        /^(?:(?!0000)[0-9]{4}-(?:(?:0[1-9]|1[0-2])-(?:0[1-9]|1[0-9]|2[0-8])|(?:0[13-9]|1[0-2])-(?:29|30)|(?:0[13578]|1[02])-31)|(?:[0-9]{2}(?:0[48]|[2468][048]|[13579][26])|(?:0[48]|[2468][048]|[13579][26])00)-02-29)\s+([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/
    );
    if (a == null) {
        return false;
    }
    if (a[1] > 24 || a[3] > 60 || a[4] > 60) {
        //alert("时间格式不对");
        return false;
    }
    return true;
}

export function CheckNull(str) {
    if (str.trim().length) {
        //alert(i18n_illegal);
        return true;
    }
    return false;
}

function utf8_bytes_num(str) {
    let totalLength = 0;
    let charCode;
    for (let i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength += 1;
        } else if (0x0080 <= charCode && charCode <= 0x07ff) {
            totalLength += 2;
        } else if (0x0800 <= charCode && charCode <= 0xffff) {
            totalLength += 3;
        }
    }
    return totalLength;
}

export function GetLength_UTF8(str) {
    return utf8_bytes_num(str) > 63 ? false : true;
}

export function GetLength_GB2312(str, n) {
    //msg("GetLength_GB2312");
    var reLen = 0;
    for (var i = 0; i < str.length; i++) {
        if (str.charCodeAt(i) < 27 || str.charCodeAt(i) > 126) {
            // 全角
            reLen += 2;
        } else {
            reLen++;
        }
    }
    if (n) return reLen;
    return reLen > 31 ? false : true;
}

/**
 * 检验 多行OSD的输入
 *
 * @export
 * @param {*} str
 * @param {number} [max_row_count=8] 最大输入行数
 * @param {number} [max_col_bytes_count=44] 单行 换算成utf8 bytes的最大长度
 * @returns
 */
export function GetMultiOSDLength(str, { max_row_count = 1, max_col_bytes_count = 44 }) {
    // msg('MULIT:',str);
    let mstr = str.replace(/\r\n/g, '\n');
    if (mstr.length != 0) {
        while (mstr.indexOf('\n') == 0) {
            mstr = mstr.substr(1);
        }
    }

    while (mstr.lastIndexOf('\n') == mstr.length - 1) {
        if (mstr.length == 0) {
            break;
        }
        mstr = mstr.substr(0, mstr.length - 1);
    }

    let strVec = mstr.split('\n');
    if (strVec.length > max_row_count) {
        return false;
    }
    for (let i = 0; i < strVec.length; ++i) {
        if (utf8_bytes_num(strVec[i]) > max_col_bytes_count) {
            return false;
        }
    }
    return true;
}

//检测输入非法字符
export function CheckStr(str) {
    //var myReg = /^[^@\/\'\\\"#$%&\^\*]+$/;
    var myReg = /[!#\$%\^&\()\{}\<>\"\'\*]+/g;

    if (myReg.test(str)) {
        //alert(i18n_illegal);
        return true;
    }
    return false;
}

export function CheckGeneralPwd(str) {
    var patrn = /^([a-zA-Z0-9]|[_]){0,15}$/;
    if (!patrn.test(str)) {
        return false;
    }
    return true;
}

export function CheckUserName(str) {
    /*
  字母开头，数字字母,最多31位
   */
    return /^[a-zA-Z][a-zA-Z0-9]*$/.test(str) && str.length <= 31;
}
export function CheckEmailAddress(str) {
    /*if (CheckStr(str)) {
    return false;
  }*/

    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
    if (str.length > 0 && !reg.test(str)) {
        return false;
    }
    return true;
}
export function CheckPwd(str, param) {
    var patrn = /^[a-zA-Z0-9]{8,15}$/;
    if (parseInt(param) === 1) {
        patrn = /^(?![0-9]+$)(?![~!@#$%^&*()_+{}|:<>?]+$)[0-9~!@#$%^&*()_+{}|:<>?]{8,15}$/;
    } else if (parseInt(param) === 2) {
        //YC 3559A
        patrn = /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{8,15}$/;
    }

    if (!patrn.test(str)) {
        return false;
    }
    return true;
}

export function ComparePwd(obj1, obj2) {
    if (CheckStr(obj1.value)) {
        obj1.focus();
        return false;
    }
    if (CheckStr(obj2.value)) {
        obj2.focus();
        return false;
    }

    if (obj1.value !== obj2.value) {
        return false;
    }
    return true;
}

export function CheckDomain(str) {
    return true;
    if (CheckStr(str)) {
        return false;
    }
    var errStr = arguments[1] || '';
    var reg = /^[\w-]+\.[a-zA-Z]+\.[a-zA-Z]+(?::\d{1,5}){0,1}$/;

    if (str.length > 0 && !reg.test(str)) {
        //alert(errStr +' '+ i18n_illegal);
        return false;
    }
    return true;
}
export function CheckPop3orSMTP(str) {
    if (CheckStr(str)) {
        return false;
    }
    var errStr = arguments[1] || '';
    var reg = /^(smtp|pop3)(.[a-zA-Z0-9]+)+\.(com|cn)$/;

    if (str.length > 0 && !reg.test(str)) {
        //alert(errStr + ' '+i18n_illegal);
        return false;
    }
    return true;
}

//得到字符串长度 中英文，一个汉字相当于2个字符
export function GetLength(str) {
    var realLength = 0,
        len = str.length,
        charCode = -1;
    for (var i = 0; i < len; i++) {
        charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += 2;
    }
    return realLength;
}

////获取字符串的长度 中英文，一个汉字相当于2个字符
export function get_length(s) {
    var char_length = 0;
    for (var i = 0; i < s.length; i++) {
        var son_char = s.charAt(i);
        encodeURI(son_char).length > 2 ? (char_length += 1) : (char_length += 0.5);
    }
    return char_length;
}

//截取字符串的长度 中英文，一个汉字相当于2个字符
export function cut_str(stbr, len) {
    var char_length = 0;
    for (var i = 0; i < str.length; i++) {
        var son_str = str.charAt(i);
        encodeURI(son_str).length > 2 ? (char_length += 1) : (char_length += 0.5);
        if (char_length >= len) {
            var sub_len = char_length == len ? i + 1 : i;
            return str.substr(0, sub_len);
            break;
        }
    }
}

export function _checkIput_fomartIP(ip) {
    return (ip + 256).toString(2).substring(1); //格式化输出(补零)
}

//验证子网掩码
export function validateMask(MaskStr) {
    var errStr = arguments[1] || '';
    var IPArray = MaskStr.split('.');
    var ip1 = parseInt(IPArray[0]);
    var ip2 = parseInt(IPArray[1]);
    var ip3 = parseInt(IPArray[2]);
    var ip4 = parseInt(IPArray[3]);

    if (ip1 < 0 || ip1 > 255 || ip2 < 0 || ip2 > 255 || ip3 < 0 || ip3 > 255 || ip4 < 0 || ip4 > 252) {
        //alert(errStr + ' '+i18n_illegal);
        return false;
    }

    var ip_binary = _checkIput_fomartIP(ip1) + _checkIput_fomartIP(ip2) + _checkIput_fomartIP(ip3) + _checkIput_fomartIP(ip4);

    if (-1 != ip_binary.indexOf('01')) {
        // alert(errStr + ' '+i18n_illegal);
        return false;
    }

    return true;
}

export function ipToInt(IP) {
    var REG = /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/;
    var xH = '',
        result = REG.exec(IP);
    if (!result) return -1;
    return ((parseInt(result[1]) << 24) | (parseInt(result[2]) << 16) | (parseInt(result[3]) << 8) | parseInt(result[4])) >>> 0;
}

//ip地址和子网掩码是否合法(前提是子网掩码是合法的)
export function validateSubMaskAndIp(submask, ip) {
    if (!validateMask(submask)) {
        return false;
    }
    var maskrev = ~ipToInt(submask);
    var value = maskrev & ipToInt(ip);
    if (value != 0 && value != maskrev) {
        return true;
    } else {
        return false;
    }
}

export function validateip_submask_gateway(ip, submask, gateway) {
    if (!validateSubMaskAndIp(submask, ip)) return false;
    let IntIP = ipToInt(ip);
    let IntMask = ipToInt(submask);
    let IntGateway = ipToInt(gateway);
    if (IntIP == IntMask || IntIP == IntGateway || IntMask == IntGateway) return false;
    let ip_submask = IntIP & IntMask;
    let gateway_submask = IntGateway & IntMask;
    return ip_submask == gateway_submask ? true : false;
}

export function check_times(arr) {
    if (arr[2] * 60 + arr[3] <= arr[0] * 60 + arr[1]) {
        return false;
    }
    return true;
}

export function GMT_Check(str) {
    let reg = /^[-+]?[01]?[0-9]:[0-5]?[0-9]$/;
    if (!reg.test(str)) {
        return false;
    }
    let arr = str.split(':');
    if (parseInt(arr[0], 10) < -12 || parseInt(arr[0], 10) > 13) {
        return false;
    }
    return true;
}
//liuxin add 时区微调用来过滤有效输入
export function UTC_Micro(str) {
    let reg = /^[0-5]?[0-9]$/; //正则表达是限定输入 0-59 分钟
    if (!reg.test(str)) {
        return false;
    }
    return true;
}
//liuxin add 时区微调用来过滤有效输入
export function arr_to_int(arr) {
    return arr.map(function(value) {
        if (Array.isArray(value)) {
            return arr_to_int(value);
        }
        return parseInt(value);
    });
}

export function isRepeat(arr) {
    let hash = {};

    for (let i in arr) {
        if (hash[arr[i]]) return true;

        hash[arr[i]] = true;
    }

    return false;
}

export function isMulticastArr(arr) {
    let minMul = ipToInt('224.0.0.1');
    let maxMul = ipToInt('239.255.255.255');
    if ($.isArray(arr)) {
        for (let i = 0; i < arr.length; i++) {
            let curMul = ipToInt(arr[i]);
            if (curMul >= minMul && curMul <= maxMul) {
                continue;
            } else {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}

export function checkMarkText(str) {
    let reg = /^[0-9A-Za-z]{1,16}$/;
    return reg.test(str);
}

export function checkUrl(str) {
    let reg = /[a-zA-z]+:\/\/[^\s]*/;
    return reg.test(str);
}
export function getFileName(path) {
    var pos1 = path.lastIndexOf('/');
    var pos2 = path.lastIndexOf('\\');
    var pos = Math.max(pos1, pos2);
    if (pos < 0) {
        return path;
    } else {
        return path.substring(pos + 1);
    }
}

/**
 * 防反跳。func函数在最后一次调用时刻的wait毫秒之后执行！
 * @param func 执行函数
 * @param wait 时间间隔
 * @param immediate 为true，debounce会在wait 时间间隔的开始调用这个函数
 * @returns {Function}
 *
export function debounce(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
        var last = new Date().getTime() - timestamp; // timestamp会实时更新

        if (last < wait && last >= 0) {
            timeout = setTimeout(later, wait - last);
        } else {
            timeout = null;
            if (!immediate) {
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
        }
    };

    return function() {
        context = this;
        args = arguments;
        timestamp = new Date().getTime();
        var callNow = immediate && !timeout;

        if (!timeout) {
            timeout = setTimeout(later, wait);
        }
        if (callNow) {
            result = func.apply(context, args);
            context = args = null;
        }
        return result;
    };
}

/**
 * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait毫秒调用一次该函数
 * @param func 执行函数
 * @param wait 时间间隔
 * @param options 如果你想禁用第一次首先执行的话，传递{leading: false}，
 *                如果你想禁用最后一次执行的话，传递{trailing: false}
 * @returns {Function}
 *
export function throttle(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
        previous = options.leading === false ? 0 : new Date().getTime();
        timeout = null;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
    };
    return function() {
        var now = new Date().getTime();
        if (!previous && options.leading === false) previous = now;
        var remaining = wait - (now - previous);
        context = this;
        args = arguments;
        if (remaining <= 0 || remaining > wait) {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
            previous = now;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        } else if (!timeout && options.trailing !== false) {
            timeout = setTimeout(later, remaining);
        }
        return result;
    };
}*/

export function checkMAC(str) {
    if (str.trim().length == 0) return true;
    let st = str.toLocaleUpperCase();
    let reg = /^[A-F0-9]{2}(:[A-F0-9]{2}){5}$/;
    return reg.test(st);
}

//校验NTP服务器地址
export function checkNTPAddr(str) {
    if (str.trim().length == 0) return true;
    let reg = /^[A-Za-z0-9_\-\.]+$/;
    return reg.test(str);
}

export function CheckStrLength(str, arrStr) {
    let len = str.length;

    if (arrStr) {
        let arr = [0, 0];
        if (Array.isArray(arrStr)) {
            arr = arrStr;
        } else {
            try {
                arr = JSON.parse(arrStr);
            } catch (e) {
                return false;
            }
        }

        if (len < arr[0] || len > arr[1]) {
            return false;
        }
    }

    return true;
}

export function CheckDTMFKey(str) {
    if (str.length == 0) return true;
    let reg = /^[0-9\*\#]{1}$/;
    return reg.test(str);
}

// 校验域名
export function CheckDomainName(str) {
    if (str.length == 0) return true;
    let reg = /^(?=^.{3,255}$)(http(s)?:\/\/)?(www\.)?[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(\.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+(:\d+)*(\/\w+\.\w+)*([\?&]\w+=\w*)*$/;
    return reg.test(str);
}

export function CheckNameSeparator(str) {
    if (str.length == 0) return true;
    let reg = /^[ `~!@#$%^&()_\-+={},.;'[\]·~！@#￥%……&（）——\-+={}《》？：“”【】、；‘’，。、]{1,3}$/;
    return reg.test(str);
}

export function CheckFaceId(str) {
    //非汉字
    let reg = /^[^\u4e00-\u9fa5]+$/;
    return reg.test(str);
}

export function CheckcallNumber(str) {
    //为数字，长度为0~30
    let reg = /^[0-9]{0,30}$/;
    return reg.test(str);
}
/*
export function CheckFileName(str){

    var pattern1=/^[a-zA-Z0-9\u4e00-\u9fa5]{0,42}$/;
    var pattern2 = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![\u4e00-\u9fa5]+$)(?![,，!！.。？?;； ]+$)[0-9a-zA-Z\u4e00-\u9fa5,，!！.。？?;；“”""'' ]{0,30}$/

    if(pattern1.test(str) || pattern2.test(str)){
      return true;
    }
    return false;
}*/

//最大支持128个字节，每个汉字占三个字节，每个字符字母占1个字节
export function CheckFileName(str) {
    //console.log(['声音报警',str, str.length]);
    var char_length = 0;
    for (var i = 0; i < str.length; i++) {
        var son_char = str.charAt(i);
        encodeURI(son_char).length > 2 ? (char_length += 3) : (char_length += 1);
    }
    //console.log(["合计",char_length]);
    if (char_length > 0 && char_length < 128) {
        var pattern1 = /^[a-zA-Z0-9\u4e00-\u9fa5]{0,127}$/;
        let pattern2 = /^(?![0-9]+$)(?![a-zA-Z]+$)(?![\u4e00-\u9fa5]+$)(?![,，!！.。？?;； ]+$)[0-9a-zA-Z\u4e00-\u9fa5,，!！.。？?;；“”""'' ]{0,127}$/;
        if (pattern1.test(str) || pattern2.test(str)) {
            return true;
        }
        return false;
    }
}
export function pad(num) {
    //小于10 就补0
    return num < 10 ? '0' + num : num;
}

export function addEvent(pluginObj, evtname, fn) {
    if (pluginObj.attachEvent) {
        //IE, 或者是判断浏览器内核
        pluginObj.attachEvent(`on${evtname}`, fn);
    } else {
        pluginObj.addEventListener(evtname, fn, false);
    }
}
export function removeEvent(pluginObj, evtname, fn) {
    if (pluginObj.detachEvent) {
        //IE, 或者是判断浏览器内核
        pluginObj.detachEvent(`on${evtname}`, fn);
    } else {
        pluginObj.removeEventListener(evtname, fn, false);
    }
}
/**
 * 指定dom下开始检测input_check_error错误提示
 *
 */
export function check_input_error(dom) {
    return dom ? dom.innerHTML.indexOf('input_check_error') > 0 : false;
}

export function checkFloat(n) {
    let filter = /^([1-9]\d*|0)(\.\d{1,2})?$/;
    return filter.test(n);
}
/*
Date 对象 转换成yyyyMMddhhmmss
*/
export function trans_datetime_to_string(seconds) {
    let time = new Date(seconds * 1000);
    let y = time.getFullYear();
    let m = time.getMonth() + 1;
    let d = time.getDate();
    let h = time.getHours();
    let min = time.getMinutes();
    let s = time.getSeconds();
    return [y, m, d, h, min, s].map((item) => pad(item)).join('');
}
/**
 * 生成 不重复的 组件 key
 */
export function generate_compkeys() {
    return `${new Date().getTime()}-${Math.random() * 1000}`;
}
/**
 * 生成默认 移动侦测 18*22
 */
export function generate_default_motionscope() {
    return [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ];
}
/**
 * 生成默认 7*8 alarmtime
 */
export function generate_default_alarmtime() {
    return [
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
        [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
        ],
    ];
}
/**
 * 显示设置 ie 计算 标题和多行osd text长度
 *
 * @export
 * @param {*} s
 * @returns
 */
export function mbStringLength(s) {
    var totalLength = 0;
    var i;
    var charCode;
    for (i = 0; i < s.length; i++) {
        charCode = s.charCodeAt(i);
        if (charCode < 0x007f) {
            totalLength = totalLength + 1;
        } else if (0x0080 <= charCode && charCode <= 0x07ff) {
            totalLength += 2;
        } else if (0x0800 <= charCode && charCode <= 0xffff) {
            totalLength += 3;
        }
    }
    return totalLength;
}
/**
 * 一位数 补齐0 达到2的宽度，常用 年月日 时分秒显示
 *
 * @export
 * @param {*} num
 * @returns
 */
export function padZero(num) {
    return num < 10 ? '0' + num : num;
}
export function is_string(s) {
    return Object.prototype.toString.call(s) == '[object String]';
}
export function is_number(s) {
    return Object.prototype.toString.call(s) == '[object Number]';
}
export function is_object(s) {
    return Object.prototype.toString.call(s) == '[object Object]';
}
export function is_Array(s) {
    return Object.prototype.toString.call(s) == '[object Array]';
}
export function is_function(s) {
    return Object.prototype.toString.call(s) == '[object Function]';
}
export function is_boolean(s) {
    return Object.prototype.toString.call(s) == '[object Boolean]';
}
export function is_null_or_undefined(s) {
    let t = Object.prototype.toString.call(s);
    return t == '[object Null]' || t == '[object Undefined]';
}
export function getfile_by_form(id, url, cb) {
    let token = `id-${new Date().getTime()}`;
    //获取进度的iframe
    let iframe = document.createElement('iframe');
    iframe.setAttribute('id', id);
    iframe.setAttribute('name', token);
    iframe.setAttribute('style', 'display:none;visiblity:hidden;width:1px;height:1px;');
    //下载请求发起者
    let form = document.createElement('form');
    form.setAttribute('style', 'display:none');
    form.setAttribute('target', token);
    form.setAttribute('method', 'get');
    form.setAttribute('action', url + '?' + new Date().getTime()); //下载文件的请求路径
    form.appendChild(iframe);
    document.body.appendChild(form);
    iframe.onload = function() {
        document.body.removeChild(form);
        warn('iframe onload fired');
        //ie9+
        cb();
    };
    form.submit();
}
/**
 * base64编码的图片转 Image
 * @param {base64 picture string} base64Str
 */
export function getImg(base64Str) {
    return new Promise((resolve, reject) => {
        let image = new Image();
        image.onload = function() {
            image.onload = null;
            resolve(image);
        };
        image.src = base64Str;
    });
}

/**
 * 图片url转成base64数据
 * @param {picture url} url
 */


export function get_data_base64_from_url(url) {
    return new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(url, { type: 'image/jpeg' });
        reader.onload = function () {
            resolve(reader.result);
        };
    });
}

/**
 * 传入路径 返回完整文件名
 * @param {String} str
 */
export function basename(str) {
    let idx = str.lastIndexOf('/');
    idx = idx > -1 ? idx : str.lastIndexOf('\\');
    if (idx < 0) {
        return str;
    }
    return str.substring(idx + 1);
}
/**
 * 事件监听使用匿名函数，方便removeEventListener的便利api
 * @param {*} scope
 * @param {*} type
 * @param {*} handler
 * @param {*} capture
 */
export function EventDisposer(scope, type, handler, capture = false) {
    const addfn = scope.addEventListener || scope.on;
    const delfn = scope.removeEventListener || scope.off;
    addfn.call(scope, type, handler, capture);
    return () => {
        delfn.call(scope, type, handler, capture);
    };
}

//检测是否为图片

export function ImgsAcceptedByImport(n) {
    let filter = /\.(jpg|jpeg|JPG|JPEG)$/;
    return filter.test(n);
}

export function debounce() {
    if (debounceFn.apply) {
        return debounceFn.apply(this, arguments);
    } else {
        return debounceFn(Array.prototype.slice.apply(arguments));
    }
}

export function throttle() {
    if (throttleFn.apply) {
        return throttleFn.apply(this, arguments);
    } else {
        return throttleFn(Array.prototype.slice.apply(arguments));
    }
}

export function uint8arrayToBase64(u8Arr) {
    let CHUNK_SIZE = 0x8000; //arbitrary number
    let index = 0;
    let length = u8Arr.length;
    let result = '';
    let slice;
    while (index < length) {
        slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
        result += String.fromCharCode.apply(null, slice);
        index += CHUNK_SIZE;
    }
    // web image base64图片格式: "data:image/png;base64," + b64encoded;
    // return  "data:image/png;base64," + btoa(result);
    return btoa(result);
}
