/**
 * 获取浏览器的语言
 * IE浏览器支持获取当前系统语言(navigator.systemLanguage)
 * 其他情况只能获取浏览器语言
 */

let language = null;

//detect language
if ((language = navigator.language)) {
} else if ((language = navigator.browserLanguage)) {
} else if ((language = navigator.userLanguage)) {
} else if ((language = navigator.systemLanguage)) {
} else {
    language = 'en-US';
}

let lang = 'en';
if (language.substr(0, 2) == 'zh') {
    lang = 'zh';
}

export default lang;
