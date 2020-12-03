import Vue from 'vue'; //此处import进来的模块(vue.runtime.js)有问题。导致$store属性注入失败

const state = {
    username: 'admin',
    password: '',
    auth: false,
    FactoryInfo: {},
    UserId: 0,
    rtmp_port: 0,
    rtsp_port: 0,
    serialno: '',
    ip: window.location.hostname,
    port: window.location.port,

    sensor_model: 0,
    login_timestamp: 0,
    ChanNum: 1,
    AlarmOutPortNum: 0,
    SessionId: 0,
    DefaultPwd: '888888',
    password_tips: 0,
    enable_gb35114: 0,
    //liuxin add IMS down config
    //enable_IMS_down:0,
    //liuxin add IMS down config
    timeOut: 900,
    showElectronicFence: false,
    hideModifyLoginCfg: false,
    remote_port: {
        rtsp: 0,
        rtmp: 0,
    },
    hashs:{
        'S-HASH': '',
        'C-HASH': '',
        'X-HASH': '',
    }
};

const mutations = {
    ['login/username_val_changed'](state, payload) {
        state.username = payload;
    },
    ['login/password_val_changed'](state, payload) {
        state.password = payload;
    },
    ['login/language_val_changed'](state, payload) {
        state.selected_language = payload;
    },
    ['login/submit'](state, payload) {
        state.auth = payload;
    },
    ['login/factory_info'](state, payload) {      
        state.FactoryInfo = payload;
        state.FactoryInfo.OptionalDevChanStreams = [[1]];   //先保证能正常运行
    },
    
    ['login/device_para'](state, payload) {
        state.device_para = payload;
    },
    ['login/remote_params_store'](state, payload) {
        if (payload.hasOwnProperty('RTMPPort') && state.remote_port.rtmp == 0) {
            state.rtmp_port = payload.RTMPPort;
        }
        if (payload.hasOwnProperty('RTSPPort') && state.remote_port.rtsp == 0) {
            state.rtsp_port = payload.RTSPPort;
        }
        if (payload.hasOwnProperty('SerialNumber')) state.serialno = payload.SerialNumber;
        if (payload.hasOwnProperty('UserId')) state.UserId = payload.UserId;
        if (payload.hasOwnProperty('ChanNum')) state.ChanNum = payload.ChanNum;
        if (payload.hasOwnProperty('AlarmOutPortNum')) state.AlarmOutPortNum = payload.AlarmOutPortNum;
        if (payload.hasOwnProperty('SessionId')) state.SessionId = payload.SessionId;
        if (payload.hasOwnProperty('DefaultPwd')) state.DefaultPwd = payload.DefaultPwd;
    },
    ['login/sensor_model'](state, payload) {
        state.sensor_model = payload;
    },
    ['login/timestamp'](state, payload) {
        state.login_timestamp = payload;
    },
    ['login/password_tips'](state, payload) {
        msg(['password_tips', payload]);
        state.password_tips = payload;
    },
    ['login/enable_gb35114'](state, payload) {
        state.enable_gb35114 = payload;
    },
    //liuxin add IMS down config
    /*['login/enable_IMS_down'](state, payload) {
        state.enable_IMS_down = payload;
    },*/
    //liuxin add IMS down config
    ['login/timeout_val_changed'](state, payload) {
        state.timeOut = payload;
    },
    ['login/show_electronic_fence'](state, payload) {
        state.showElectronicFence = payload;
    },
    ['login/hide_modify_login_cfg'](state, payload) {
        state.hideModifyLoginCfg = payload;
    },
    //外网映射端口
    ['login/remote_port_change'](state, payload) {
        if (payload.rtsp) {
            state.remote_port.rtsp = payload.rtsp;
            state.rtsp_port = payload.rtsp;
        }
        if (payload.rtmp) {
            state.remote_port.rtmp = payload.rtmp;
            state.rtmp_port = payload.rtmp;
        }
    },
};

const getters = {
    login_status(state) {
        return state.auth;
    },
    tokenA(state) {
        return state.username;
    },
    tokenB(state) {
        return state.password;
    },
    rtsp_port(state) {
        return state.rtsp_port;
    },
    rtmp_port(state) {
        return state.rtmp_port;
    },
    domain(state) {
        return window.location.host;
    },
    ip(state) {
        return state.ip;
    },
    factory_info(state) {
        return state.FactoryInfo;
    },
    sensor_model(state) {
        return state.sensor_model;
    },
    ChanNum(state) {
        return state.ChanNum;
    },
    AlarmOutPortNum(state) {
        return state.AlarmOutPortNum;
    },
    SessionId(state) {
        return state.SessionId;
    },
    DefaultPwd(state) {
        return state.DefaultPwd;
    },
    PasswordTips(state) {
        return state.password_tips;
    },
    Enable_GB35114(state) {
        return state.enable_gb35114;
    },
    //liuxin add IMS down config
    /*Enable_IMS_down(state) {
        return state.enable_IMS_down;
    },*/
    //liuxin add IMS down config
    timeOut(state) {
        return state.timeOut;
    },
    showElectronicFence(state) {
        return state.showElectronicFence;
    },
    hideModifyLoginCfg(state) {
        return state.hideModifyLoginCfg;
    },
    hashs(state) {
        return state.hashs;
    },
    device_para(state) {
        return state.device_para;
    }
};

const actions = {
    choose_language({ commit, state }, val) {
        commit('login/language_val_changed', val);
    },
    login({ commit, getters, state, dispatch }, val) {
        //do submit. if success,commit it
        return new Promise(async (resolve, reject) => {
            if (getters.tokenA.trim().length === 0) {
                alert(getters.current_language.i18n_warn_login_0);
                resolve({ login_status: false });
                return;
            }
            let result = await dispatch('request', {
                url: 'goform/frmUserLogin',
                Ch: 1,
                //Type: 0,

                Data: {},
            });
            
            if (result.Result == 0) {
                commit('login/remote_params_store', result.Data);

                //save login time
                commit('login/timestamp', new Date().getTime());
                //记录最后一次成功登陆的用户名
                $.cookie('last_login_username', state.username, {
                    expires: 7,
                });

                //if (getters.is_yuncong) {
                window.EncInfoToken = window.base64.encode([state.ip, state.rtsp_port, state.username, state.password].join('|'));
                // }
            } else if (result.Result == -655378) {
                alert(getters.current_language['i18n_LoginMaxUserTips']);
            } else {
                if (result.ErrorString.indexOf('Username or password is illegal') > -1) {
                    alert(getters.current_language['i18n_login_illegal']);
                }
                if (result.ErrorString.indexOf('Account is locked') > -1) {
                    let num = result.ErrorString.substr(result.ErrorString.lastIndexOf(' '));
                    alert(getters.current_language['i18n_login_locked'] + num + ' ' + getters.current_language['i18n_sec']);
                }
                if (result.ErrorString.indexOf('has Logined') > -1) {
                    let ip = result.ErrorString.substr(0, result.ErrorString.indexOf(' '));
                    alert(getters.current_language['i18n_has_logined_error'] + ip);
                }
                resolve({ login_status: false, result });
            }

            resolve({ login_status: result.Result == 0, result });
        });
    },
    cleanup({ commit, state, getters }, val) {
        //deactivated active frames
        commit(getters.current_frame.slice('CVFrame'.length).toLowerCase() + '/activated', false);

        commit('plugin_type/val_changed', 'ie');

        commit('login/username_val_changed', '');
        commit('login/password_val_changed', '');
        commit('login/remote_params_store', {
            RTMPPort: 0,
            RTSPPort: 0,
            SerialNumber: '',
            SessionId: 0,
        });
        commit('config/main_frame', '');
        if (val == -1) {
            commit('errorCode/change', 1);
        }

        window.location.reload(true);
    },
    logout({ commit, state, getters, dispatch }, val) {
        msg('logout action fired!');
        return new Promise(async (resolve, reject) => {
            try {
                let result = await dispatch('request', {
                    url: 'goform/frmUserLogout',
                    Type: 0,
                    async: false,
                    Timeout: 1000,
                    Data: {
                        UserId: state.UserId,
                    },
                });

                if (result.Result == 0) {
                    //commit("login/submit",false);
                    resolve(true);
                } else {
                    resolve(false);
                }

                if (val.reason == 'beforeunloadHandler fire') {
                } else {
                    dispatch('cleanup', 0);
                }
            } catch (e) {
                reject(false);
                //deactivated active frames
                if (val.reason == 'beforeunloadHandler fire') {
                } else {
                    dispatch('cleanup', -1);
                }
            }
        });
    },
    username_val_changed({ commit, state }, val) {
        commit('login/username_val_changed', val);
    },
    password_val_changed({ commit, state }, val) {
        commit('login/password_val_changed', val);
    },

    userclick_timeout({ dispatch, getters, commit, state }, click_timestamp) {
        //用户登录成功后30min内未操作界面（未有鼠标点击）,将此用户登出
        
        if (getters.login_status != 1) return;
        let idle_secs = parseInt($.cookie('idletimeout'), 10) || 15;
        msg([idle_secs, 'seconds']);
        if ((click_timestamp - state.login_timestamp) / 1000 >= idle_secs * 60) {
            //点击超时 15min
            if (!state.SessionId) {
                dispatch('logout', {}).then(() => {});
            }
        } else {
            //refresh
            commit('login/timestamp', click_timestamp);
        }
    },
    KeepSessionAlive({ commit, state, dispatch }) {
        return new Promise(async (resolve, reject) => {
            try {
                let result = await dispatch('request', {
                    url: 'goform/frmKeepSessionAlive',
                    Ch: 1,
                    Type: 0,
                    Data: {},
                });
                resolve(result);
            } catch (e) {
                reject();
            }
        });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
