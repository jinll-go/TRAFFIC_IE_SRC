// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import 'babel-polyfill';
import Vue from 'vue';

import App from './App';

import store from 'store';

import tr from 'plugins/translate';
import va from 'plugins/validator';
import notify from 'plugins/notify';
import loading from 'components/loading';
import auth_http from 'plugins/auth_request';
import upload from 'plugins/upload';
import default_uiconfig from 'common/default-uiconfig';
import default_lang from 'common/check-browser-language';
import { wsse_allstring } from 'common/wsse';
import VueResource from 'vue-resource';

import Tabs from 'components/tabs';
//将CVPlugin在全局注册
import CVPlugin from 'components/activex/activex-wrapper.js';
import formui from 'form-ui';
//IE9 打补丁
if (!window.location.origin) {
    window.location.origin = window.location.protocol + '//' + window.location.host;
}
//Promise.finally patch
/**
 * @this {Promise}
 */
function finallyConstructor(callback) {
    var constructor = this.constructor;
    return this.then(
        function(value) {
            // @ts-ignore
            return constructor.resolve(callback()).then(function() {
                return value;
            });
        },
        function(reason) {
            // @ts-ignore
            return constructor.resolve(callback()).then(function() {
                // @ts-ignore
                return constructor.reject(reason);
            });
        }
    );
}
if (!Promise.prototype.finally) {
    Promise.prototype.finally = finallyConstructor;
}
function console_wrapper(token) {
    //fuck IE9.嗅探console.log.apply
    return function() {
        if (window.console) {
            if (window.console[token].apply) {
                window.console[token].apply(window.console, arguments);
            } else {
                window.console[token](Array.prototype.slice.apply(arguments));
            }
        }
    };
}

window.msg = console_wrapper('log');
window.warn = console_wrapper('warn');
window.error = console_wrapper('error');
Vue.config.silent = false;

//未定义时使用console.error错误信息
Vue.config.errorHandler = function(err, vm, info) {
    // handle error
    // `info` 是 Vue 特定的错误信息，比如错误所在的生命周期钩子
    // 只在 2.2.0+ 可用
    if (window.console) {
        window.console.error(err, vm, info);
    }
};
//捕获调试模式下的warning，firefox下warn打印太多
Vue.config.warnHandler = function(msg, vm, trace) {
    // `trace` 是组件的继承关系追踪
};

Vue.use(tr);
Vue.use(va);
Vue.use(notify);
Vue.use(loading);
Vue.use(auth_http, store);
Vue.use(upload, store);
Vue.use(Tabs);
Vue.use(VueResource);
Date.prototype.format = function(fmt) {
    // 返回处理后的值

    var o = {
        'M+': this.getMonth() + 1, //月份
        'd+': this.getDate(), //日
        'h+': this.getHours(), //小时
        'm+': this.getMinutes(), //分
        's+': this.getSeconds(), //秒
        'q+': Math.floor((this.getMonth() + 3) / 3), //季度
        S: this.getMilliseconds(), //毫秒
    };
    if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp('(' + k + ')').test(fmt)) fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
    return fmt;
};

//监听全局的窗口改变事件
$(window).resize(function(e) {
    store.dispatch('window_resize', {});
});

$(document.body).mousedown(function(evt) {
    store.dispatch('userclick_timeout', new Date().getTime());
});

toastr.options = {
    closeButton: false,
    debug: false,
    progressBar: false,
    //positionClass: 'toast-bottom-center',
    positionClass: ' toast-top-center',
    onclick: null,
    showDuration: '300',
    hideDuration: '10000',
    timeOut: '2000',
    extendedTimeOut: '1000',
    showEasing: 'swing',
    hideEasing: 'linear',
    showMethod: 'fadeIn',
    hideMethod: 'fadeOut',
};

/*if (store.getters.is_tyconew) {
    document.title = ' Illustra Standard IP camera';
} else {*/
document.title = 'HD-Network Real-time Monitoring System';
//}

$(document).keydown(function(e) {
    let doPrevent;
    if (e.keyCode == 8) {
        let d = e.srcElement || e.target;
        if (d.tagName.toUpperCase() == 'INPUT' || d.tagName.toUpperCase() == 'TEXTAREA') {
            doPrevent = d.readOnly || d.disabled;
        } else doPrevent = true;
    } else doPrevent = false;

    if (doPrevent) e.preventDefault();
});

const version = Number(Vue.version.split('.')[0]);

//全局mixin
if (version >= 2) {
    Vue.mixin({
        beforeCreate: function() {
            const options = this.$options;

            if (options.UICustomization) {
                this.$UI = typeof options.UICustomization === 'function' ? options.UICustomization() : options.UICustomization;
            } else if (options.parent && options.parent.$UI) {
                this.$UI = options.parent.$UI;
            }

            if (options.ParamCustomization) {
                this.$Param = typeof options.ParamCustomization === 'function' ? options.ParamCustomization() : options.ParamCustomization;
            } else if (options.parent && options.parent.$Param) {
                this.$Param = options.parent.$Param;
            }
        },
        computed: {
            ui_custom() {
                return this.$UI[this.$options.name] || {};
            },
            para_custom() {
                return this.$Param[this.$options.name] || {};
            },
            lang() {
                return this.$store.getters.current_language;
            },
            plugin_type() {
                return this.$store.getters.plugin_type;
            },
        },
    });
} else {
    msg('Not support Vue 1.x,use Vue 2.x');
}

function CreateApp(uiconfig, paramconfig) {
    let app = new Vue({
        el: '#app',
        store,
        UICustomization: uiconfig,
        ParamCustomization: paramconfig,
        render: (h) => {
            return h(App, {});
        },
    });

    window.app = app;
    window.wsse_allstring = wsse_allstring;

    return app;
}

/**
 * 获取语言配置,并加载对应的语言
 */
function Step1() {
    return store.dispatch('GetStaticFileByName', { filename: 'lang_map.json' }).then((jn) => {
        let relations = [];
        if (jn == null) {
            msg("Can't load language map file!!Only built-in language(En) will be applyed!");
        } else {
            /*
          [
            {
              option_text:'русский'
              option_value:'ru',
              filename:'ru_ru'
            },
          ]
          */

            if (!Array.isArray(jn)) {
                msg('language map file format is a valid JSON!But it is not a Array Object!');
                relations = [];
            } else {
                relations = jn;

                let tmpObj = {
                    option_text: 'English',
                    option_value: 'en',
                    filename: 'en_gb.js',
                };
                //if (JSON.stringify(relations).indexOf(tmpObj) == -1) {
                // msg("没有英文,add")
                //	relations.push(tmpObj)
                //	}
                /*
                向前兼容. lang_map.json中没有配置英文的话,默认添加上去
                */
                let npos = relations.findIndex((item) => {
                    return item.option_text == tmpObj.option_text;
                });

                if (npos == -1) {
                    relations.push(tmpObj);
                }

                // msg(["language!!!", relations])
            }
        }
        if (relations.length == 0) {
            return new Promise((resolve, reject) => {
                resolve([]);
            });
        } else {
            let file_list = relations.map((item) => {
                return store.dispatch('GetStaticFileByName', { filename: 'lang/' + item.filename });
            });

            file_list.push(
                relations.map((item) => {
                    return {
                        value: item.option_value,
                        text: item.option_text,
                    };
                })
            );

            return Promise.all(file_list);
        }
    });
}

function Step2() {
    //动态获取 ui配置文件
    return store.dispatch('GetStaticFileByName', { filename: 'uiconfig.json' });
}

function Step3() {
    //动态获取 插件版本文件
    return store.dispatch('GetStaticFileByName', { filename: 'pluginconfig.json' });
}

function Step4() {
    //动态获取 参数配置文件
    return store.dispatch('GetStaticFileByName', { filename: 'paramconfig.json' });
}

Promise.all([Step1(), Step2(), Step3(), Step4()]).then((result_list) => {
    let lang_files = result_list[0];

    if (lang_files.length == 0) {
        msg('language map file parse result is []!Only built-in language(En) will be applyed!');
    } else {
        let extend_lang_obj = lang_files[lang_files.length - 1].map((item, idx) => {
            //	msg('see see', item.value, lang_files[idx], item.text)
            if (lang_files[idx] == null) {
                msg(`Some errors in ${item.text} language file,please check it!!!`);
            }
            return {
                [item.value]: [lang_files[idx], item.text],
            };
        });
        let lang_obj_tmp = [];
        lang_files.forEach((item, idx) => {
            if (idx < lang_files.length - 1 && item != null) {
                lang_obj_tmp.push(extend_lang_obj[idx]);
            }
        });

        lang_obj_tmp.forEach((item) => {
            store.commit('base/user_language_add', item);
        });
    }

    let UICustomization = result_list[1];
    let ui_msg = false;
    //因为引入了默认配置，我们需要将获取到的配置和初始配置简单合并（none deep clone）
    if (UICustomization == null) {
        msg('uiconfig.json format is invalid!Default uiconfig will be applyed!');
        UICustomization = {};
    } else {
        UICustomization = $.extend(true, {}, default_uiconfig, UICustomization);
    }
    if (result_list[2] && result_list[2].version) {
        msg('pluginconfig = ', result_list[2]);
        window.pluginVersion = result_list[2].version;
        window.plugin_download_addr = result_list[2].plugin_download_addr;
        store.commit('base/rtspplugin_params', result_list[2]);
        msg(['pluginVersion', window.pluginVersion, window.plugin_download_addr]);
    } else {
        ui_msg = true;
    }

    let ParamCustomization = result_list[3];
    if (ParamCustomization == null) {
        msg('paramconfig.json format is invalid!');
        ParamCustomization = {};
        ui_msg = true;
    }
    //应用网页的逻辑定制
    if (ParamCustomization) {
        if (ParamCustomization.CVIndex) {
            //日历年月日显示格式
            if (ParamCustomization.CVIndex.Date_Format) {
                store.commit('date_format/change', ParamCustomization.CVIndex.Date_Format);
            }
            //预览默认打开的码流
            if (ParamCustomization.CVIndex.Default_Stream) {
                store.commit('preview/default_stream_changed', ParamCustomization.CVIndex.Default_Stream);
            }
        }
        //日历控件的主题
        if (ParamCustomization.Calendar_theme) {
            store.commit('calendar_theme/change', ParamCustomization.Calendar_theme);
        }
        //登录语言栏的默认语言
        if (ParamCustomization.Default_language) {
            store.commit('login/language_val_changed', ParamCustomization.Default_language);
        } else {
            //应用自动检测的系统语言作为默认值
            store.commit('login/language_val_changed', default_lang);
        }

        //点击超时
        if (ParamCustomization.TimeOutLogout) {
            store.commit('login/timeout_val_changed', ParamCustomization.TimeOutLogout);
        }
        //电子围栏显示定制
        if (ParamCustomization.showElectronicFence) {
            store.commit('login/show_electronic_fence', ParamCustomization.showElectronicFence);
        }
        // 登录时修改密码页 隐藏地址和Ip配置项的定制
        if (ParamCustomization.hideModifyLoginCfg) {
            store.commit('login/hide_modify_login_cfg', ParamCustomization.hideModifyLoginCfg);
        }
    }

    //根据浏览器类型 ui定制 动态加载 额外依赖的js
    let extra_js = [];

    let h5Support = 'MediaSource' in window && 'WebAssembly' in window;
    if (h5Support) {
        //h5 全屏
        let get_h5_screenfull = new Promise((resolve, reject) => {
            $.getScript('static/screenfull.min.js', (resp, status) => {
                if (status == 'success') {
                    resolve(true);
                } else {
                    error('load static/screenfull.min.js failed');
                    resolve(false);
                }
            });
        });
        extra_js.push(get_h5_screenfull);

        //h5 canvas 绘制（回放检索条，智能规则结果 ， 参数配置 点线框）
        let get_canvasdraw = new Promise((resolve, reject) => {
            $.getScript('static/canvas_alpha.js', (resp, status) => {
                if (status == 'success') {
                    resolve(true);
                } else {
                    error('load static/canvas_alpha.js failed');
                    resolve(false);
                }
            });
        });
        extra_js.push(get_canvasdraw);
        //h5播放器
        let get_h5player = new Promise((resolve, reject) => {
            $.getScript('static/h5player.js', (resp, status) => {
                if (status == 'success') {
                    resolve(true);
                } else {
                    error('load static/h5player.js failed');
                    resolve(false);
                }
            });
        });
        extra_js.push(get_h5player);

        if (UICustomization.CVTopMenu.tab_face.visible || UICustomization.CVTopMenu.tab_temperature.visible || UICustomization.CVTopMenu.tab_person.visible) {
            //h5 导出excel
            let get_h5_excel = new Promise((resolve, reject) => {
                $.getScript('static/exceljs.bare.min.js', (resp, status) => {
                    if (status == 'success') {
                        resolve(true);
                    } else {
                        error('load static/exceljs.bare.min.js failed');
                        resolve(false);
                    }
                });
            });
            extra_js.push(get_h5_excel);
        }
    }

    msg('Get Cropper', UICustomization.CVTopMenu.tab_face.visible, UICustomization.CVTopMenu.tab_temperature.visible);
    if (UICustomization.CVTopMenu.tab_face.visible || UICustomization.CVTopMenu.tab_temperature.visible || UICustomization.CVTopMenu.tab_person.visible) {
        //人脸 图片裁剪
        let get_pic_cropper = new Promise((resolve, reject) => {
            $.getScript('static/cropper.js', (resp, status) => {
                if (status == 'success') {
                    resolve(true);
                } else {
                    error('load static/cropper.js failed');
                    resolve(false);
                }
            });
        });
        extra_js.push(get_pic_cropper);
    }

    Promise.all(extra_js)
        .then((r) => {
            msg(r);
            CreateApp(UICustomization, ParamCustomization);

            if (ui_msg) {
                store.commit('errorCode/change', 2);
                store.commit('app_frame/change', 'CVConfigMsg');
            }
        })
        .catch((e) => {
            error(e);
        });
});
