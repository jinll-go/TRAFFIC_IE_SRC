import Vue from 'vue'; //此处import进来的模块(vue.runtime.js)有问题。导致$store属性注入失败

//import zh from 'language/zh_cn.js'
// import en from 'language/en_gb.js';
import default_lang from 'common/check-browser-language';
import Calendar from 'common/calendar';
import { is_null_or_undefined } from 'common/util';

function support_ax_or_npapi_plugins() {
    let ie = !!window.ActiveXObject || 'ActiveXObject' in window;
    let npapi = navigator.plugins && navigator.plugins.length > 5;
    return ie || npapi;
}

const state = {
    client_type:'default', //default tyco
    lang: {
        //zh:[zh,'简体中文'],
        // en: [en, 'English'],
    },
    selected_language: default_lang,

    current_frame: '',
    app_frame: '',
    //liuxin add 用来记录登录使用的用户名，重置密码界面直接用这个
    tokenA:'',
    //liuxin add 用来记录登录使用的用户名，重置密码界面直接用这个
    canuse_axplugins: support_ax_or_npapi_plugins(), //能否使用activex或者npapi插件
    is_IE: !!window.ActiveXObject || 'ActiveXObject' in window, //是否是IE内核的浏览器
    window_rect: {
        width: $(window).width(),
        height: $(window).height(),
    },
    plugin_type: '', //ie flash h5
    plugin_installed: 2, //显示插件还是插件提示
    calendar: null,
    errorCode: 0,
    //liuxin add 修改默认密码
    is_DefaultPwd:false,
    //liuxin add 修改默认密码
    //liuxin add 用来记录登录使用的用户名，重置密码界面直接用这个
    tokenA:'',
    //liuxin add 用来记录登录使用的用户名，重置密码界面直接用这个
    date_format: 'yyyy-MM-dd',
    calendar_theme: 'default',
    //智能能力集
    data_change: [
        {
            CounterWire: 0,
        },
        {
            DetectWire: 0,
        },
        {
            ElectronicFence: 0,
        },
        {
            Retrograde: 0,
        },
        {
            HighDensity: 1,
        },
        {
            DetectPerson: 1,
        },
        {
            DetectAbsent: 1,
        },
    ],
    fc_cap_change:{
        SupportHealthCode:1,
        SupportHelmet:1,
        SupportEmask:1,
        SupportCarouselPic:1,  //是否支持轮播图片
        SupportAutop2p:1,       //是否支持p2p
        SupportPasswdOpen:1,       //密码开门
        SupportSwitchOpen:1,    //开关开门
    },
    rtspplugin_params: {
        EnableRule: 1, //显示智能规则
        EnableResult: 1, //显示智能结果
        Smart_results_sync_with_video: 1, //开启智能和视频同步
        Max_delay_smartnum: 30, //同步开启后 智能和视频时间戳 最多相差 多少个3600
        pipeSnapFaceMsgToJs: 0, //回调人脸抓拍
        pipeFaceCompareMsgToJs: 0, //回调人脸比对
        enableOnlyFaceResult: 0, //人脸识别模式,只显示人脸结果
        Capture_face_pics_save: 0, //保存抓拍,比对 图片到PC本地
        Capture_face_fullpic_save: 0, //保存全景图到PC本地
        Face_draw_id_score: 0, //绘制人脸额外的信息(id dcore name等)
    },
    init_mode: 'normal', //"fisheye" "multisensor"
};

const mutations = {
    ['SmartAbility/data_change'](state, payload) {
        state.data_change = payload;
    },
    
    ['Ability/fc_cap_change'](state, payload) {
        state.fc_cap_change = payload;
    },
    ['base/user_language_add'](state, payload) {
        state.lang = $.extend(true, {}, state.lang, payload);
    },
    ['login/language_val_changed'](state, payload) {
        if (!Object.keys(state.lang).includes(payload)) {
            msg(`language:${payload} is not support yet! you need change lang_map.json and add lang file!fallback to default:en`);
            state.selected_language = 'en';
        } else {
            state.selected_language = payload;
        }
        let cur_lang = state.lang[state.selected_language][0];
        state.calendar = new Calendar(1970, 2042, cur_lang, state.calendar_theme, '', state.date_format);
    },

    ['frame/change'](state, payload) {
        state.current_frame = payload;
    },
    ['date_format/change'](state, payload) {
        state.date_format = payload;
    },
    ['calendar_theme/change'](state, payload) {
        state.calendar_theme = payload;
    },
    ['app_frame/change'](state, payload) {
        state.app_frame = payload;
    },
    ['errorCode/change'](state, payload) {
        state.errorCode = payload;
    },
    //liuxin add 修改默认密码
    ['is_DefaultPwd/change'](state, payload) {
        state.is_DefaultPwd = payload;
    },
    //liuxin add 修改默认密码
    //liuxin add 用来记录登录使用的用户名，重置密码界面直接用这个
    ['tokenA/change'](state, payload) {
        state.tokenA = payload;
    },
    //liuxin add 用来记录登录使用的用户名，重置密码界面直接用这个
    ['plugin_type/val_changed'](state, payload) {
        state.plugin_type = payload;
    },
    ['window_resize/rect_changed'](state, payload) {
        //always trigger when window resize
        state.window_rect = $.extend(true, {}, payload);
    },
    ['base/plugin_installed'](state, payload) {
        msg(['base/plugin_installed', payload]);
        state.plugin_installed = payload;
    },
    ['base/rtspplugin_params'](state, payload) {
        $.extend(true, state.rtspplugin_params, payload);
    },
    ['base/init_mode'](state, payload) {
        state.init_mode = payload;
    },
};

const getters = {
    SmartAbility(state) {
        return state.data_change;
    },
    device_fc_Ability(state) {
        return state.fc_cap_change;
    },
    is_honey(state) {
        return state.client_type.startsWith('Honey');
    },
    is_tyco(state) {
        return state.client_type == 'Tyco';
    },
    is_tyconew(state) {
        return state.client_type == 'Tyconew';
    },
    is_default(state) {
        return state.client_type == 'Default';
    },
    is_dongshun(state) {
        return state.client_type.startsWith('Dongshun') || state.client_type.startsWith('Anxunmei');
    },
    is_yuncong(state) {
        return state.client_type == 'Yuncong';
    },
    is_xiaoding(state) {
        return state.client_type.startsWith('Xiaoding');
    },
    is_sanbao(state) {
        return state.client_type == 'Default_sanbao';
    },
    is_honeynew(state) {
        return state.client_type == 'Honeynew';
    },
    current_language(state) {
        //选择的语言不存在，默认英文
        msg('current_language:' + state.selected_language);
        if (!(state.lang[state.selected_language] && state.lang[state.selected_language][0])) {
            state.selected_language = 'en';
            return state.lang['en'][0];
        }
        return state.lang[state.selected_language][0];
    },
    current_frame(state) {
        let frame_name = '';
        switch (state.current_frame) {
            case 'preview':
                frame_name = 'CVFramePreview';
                break;
            case 'pbslider':
                frame_name = 'CVFramePBSlider';
                break;
            case 'playback':
                frame_name = 'CVFramePlayback';
                break;
            case 'file':
                frame_name = 'CVFrameFile';
                break;
            case 'config':
                frame_name = 'CVFrameConfig';
                break;
            case 'log':
                frame_name = 'CVFrameLog';
                break;
            case 'alarm':
                frame_name = 'CVFrameAlarm';
                break;
            case 'facedb':
                frame_name = 'CVFrameFace';
                break;
            /**********liuxin change top 调整**************/
            case 'face_manage':
                frame_name = 'CVFrameFaceManage';
                break;
            /**********liuxin change top 调整**************/
            case 'persondb':
                frame_name = 'CVFramePerson';
                break;
            case 'custom':
                frame_name = 'CVFrameCustom';
                break;
            case 'temperature':
                frame_name = 'CVFrameTemperature';
                break;
        }
        return frame_name;
    },
    current_app_frame(state) {
        return state.app_frame;
    },

    hash(state) {
        return state.hash;
    },
    is_IE(state) {
        return state.is_IE;
    },
    content_rect(state) {
        return state.window_rect;
    },
    plugin_type(state) {
        return state.plugin_type;
    },
    calendar(state) {
        if (!state.calendar) {
            state.calendar = new Calendar(1970, 2042, state.lang['en'][0], state.calendar_theme, '', state.date_format);
        }
        return state.calendar;
    },
    base(state) {
        return state;
    },
    is_temperature(state) {
        return state.init_mode == 'multisensor' && window.app.$UI.CVTopMenu.tab_temperature.visible;
    },
    is_normal(state) {
        return state.init_mode == 'normal';
    },
    is_fisheye(state) {
        return state.init_mode == 'fisheye';
    },
    is_multisensor(state) {
        return state.init_mode == 'multisensor';
    },
};

const actions = {
    choose_language({ commit, state }, val) {
        msg(val);
        commit('login/language_val_changed', val);
    },
    /* choose_calendar_language({commit,state},val){
//     msg(val);
    commit("login/calendar_language_changed",val);
  },*/
    frame_change({ commit, state }, val) {
        commit('frame/change', val);
    },
    date_format_change({ commit, state }, val) {
        commit('date_format/change', val);
    },
    hash_change({ commit, state }, val) {
        // msg(val);
        commit('session/hashchange', val);
    },
    plugin_loaded({ dispatch, commit, state, getters }, val) {
        let frm = getters.current_frame.substr(7).toLowerCase();
        msg('current frame:' + frm);
        switch (frm) {
            case 'preview':
                dispatch('preview_plugin_change', {
                    plugin: val,
                });
                break;
            case 'pbslider':
            case 'playback':
                dispatch('playback_plugin_change', {
                    plugin: val,
                });
                break;
            case 'file':
                dispatch('file_plugin_change', {
                    plugin: val,
                });
                break;
            case 'config':
                dispatch('config_plugin_change', {
                    plugin: val,
                });
                break;
            case 'log':
                break;
            case 'alarm':
                break;
            case 'facedb':
                break;
            /**********liuxin change top 调整**************/
            case 'face_manage':
                break;
            /**********liuxin change top 调整**************/
            case 'custom':
                break;
        }
    },
    window_resize({ dispatch, commit, state, getters }, {}) {
        commit('window_resize/rect_changed', {
            width: $(window).width(),
            height: $(window).height(),
        });
    },
    GetStaticFileByName({ dispatch, commit, state, getters }, { prefix, filename }) {
        let dataType = 'text';
        if (filename.endsWith('.json')) {
            dataType = 'json';
        }

        prefix = prefix || 'static/';

        return new Promise((resolve, reject) => {
            $.ajax({
                url: prefix + filename, // 跳转到 action
                type: 'get',
                cache: false,
                dataType,
                success: function(response, status) {
                    msg(status);
                    if (dataType == 'text' && filename.endsWith('.js')) {
                        try {
                            response = new Function(`return ${response}`)();
                        } catch (e) {
                            msg(`text file:${filename} content is invalid expression str!`);
                            response = null;
                        }
                    }
                    msg(response);
                    resolve(response);
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    msg("异常！");
                    msg([XMLHttpRequest, textStatus, errorThrown]);
                    resolve(null);
                },
            });
        });
    },
    request({ dispatch, commit, state, getters }, data) {
        return new Promise((resolve, reject) => {
            //{method,url,data,async,auth_type,username,pwd,successCb,errorCb,timeout}

            if (Object.prototype.toString.call(data.url) == '[object String]') {
                if (!data.url.startsWith('/')) {
                    data.url = `/${data.url}`;
                }
            }

            if (is_null_or_undefined(data.Dev)) data.Dev = 1;
            if (is_null_or_undefined(data.Ch)) data.Ch = 1;

            Vue.$auth_request({
                method: 'POST',
                url: data.url,
                data: JSON.stringify({
                    Type: data.Type,
                    Dev: data.Dev,
                    Ch: data.Ch,
                    Data: data.Data,
                }),
                async: data.async == 'undefined' ? true : data.async,
                timeout: data.TimeOut,
                auth_type: 'digest',
                successCb(result) {
                    resolve(result);
                },
                errorCb(err) {
                    reject(false);
                },
            });
        });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
