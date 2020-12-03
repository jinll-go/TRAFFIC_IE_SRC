<!--
<template>
    <div :is="$store.getters.current_app_frame"></div>
</template>
-->
<script>
    import Vue from 'vue';
    //import CVLogin from "components/login/cv-login";
    //import CVLoginAI from "components/login/cv-login-AI";
    import CVIndex from 'components/cv-index';
    /*
    import CVConfigUserManage from 'components/config/usermanage/cv-config-usermanage';
    */
    import CVFrameConfig from 'components/config/cv-index-config';
    import CVConfigMsg from 'components/config/cv-config-msg';
    import _check_plugin from 'common/check_plugin_installed';
    export default {
        data() {
            return {
                name: '',
                renderTarget: null,
            };
        },

        mounted() {
            msg('App Mounted!');
            //this.name = 'CVLogin';
            //https://10.3.0.84:8080/public/remotepara.asp?s_username=admin&s_psw=MTIzNDU2&s_Language=1&s_browsertype=2
            //  this.GetFactoryInfo();

            //check remote autologin by url
            var result = {};
            var args = window.location.search;
            if (args && args.length > 0) {
                var pairs = args.slice(1).split('&');
                pairs.forEach((item) => {
                    let tmp = item.split('=');
                    if (tmp && tmp.length >= 2) {
                        result[tmp[0]] = tmp[1];
                    }
                });
            }

            //外网映射的端口
            if (result.rtspport || result.rtmpport) {
                let rempte_port = {
                    rtsp: parseInt(result.rtspport) || 0,
                    rtmp: parseInt(result.rtmpport) || 0,
                };
                this.$store.commit('login/remote_port_change', rempte_port);
            }

            if (result.s_username && result.s_psw != undefined) {
                switch (parseInt(result.s_Language)) {
                    case 0:
                        result.s_Language = 'en';
                        break;
                    case 1:
                        result.s_Language = 'zh';
                        break;
                    default:
                        result.s_Language = 'en';
                }
                if (result.s_psw.length % 4) {
                    let url = window.location.href;
                    let index = url.indexOf('s_psw=');
                    let psw_str = url.substr(index + 6);
                    let url_s = psw_str.indexOf('&');
                    result.s_psw = url_s > -1 ? psw_str.substring(0, url_s) : psw_str;
                }
                this.$store.dispatch('username_val_changed', result.s_username);
                this.$store.dispatch('password_val_changed', window.base64.decode(result.s_psw));
                this.$store.dispatch('choose_language', result.s_Language);
                msg('browsertype:' + result.s_browsertype);
                let isRemoteParaUseIEPlugin = parseInt(result.s_browsertype) == 1;
                let isRemoteParaUseH5 = parseInt(result.s_browsertype) == 3;
                this.$store.commit('plugin_type/val_changed', isRemoteParaUseIEPlugin ? 'ie' : isRemoteParaUseH5 ? 'h5' : 'flash');

                var that = this;
                    
                //login
                that.$store
                    .dispatch('login')
                    .then(({ login_status }) => {
                        // that.$store.commit("login/remote_params_store", r.Data);
                        if (login_status) {
                            //save login time
                            //that.$store.commit("login/timestamp", new Date().getTime());
                            //Vue.nextTick(() => {
                            that.$store.commit('config/activated', true);
                            that.$store.commit('config/value_changed', { vms_remote_autologin: true });
                            that.$store.commit('login/submit', result.tab_index == 'index' ? 1 : 3); //init config page
                            //   });
                        }
                    })
                    .catch((e) => {
                        alert(this.$store.getters.current_language['i18n_tips_login_failed']);
                    });
            } else {
                this.$store.commit('login/submit', 0);
                //this.$store.commit("app_frame/change", this.LoginComponent());
            }
        },

        methods: {
            GetFactoryInfo(obj) {
                if (obj) {
                    if (obj.OptionalDevChanStreams && obj.OptionalDevChanStreams.length > 1 && obj.IsOfFishEye && obj.IsOfFishEye == 'n') {
                        this.$store.commit('base/init_mode', 'multisensor');
                    } else if (obj.IsOfFishEye && obj.IsOfFishEye == 'y') {
                        this.$store.commit('base/init_mode', 'fisheye');
                    } else {
                        this.$store.commit('base/init_mode', 'normal');
                    }

                    if (obj.IsofDome == 'y') {
                        this.$UI['CVFramePreview'].ptz_extend.visible = true;
                        this.$UI['CVFramePreview'].cruise.visible = true;
                        this.$UI['CVFramePreview'].track.visible = true;
                    } else if (obj.IsofDome == 'y_ex') {
                        // this.$UI["CVFramePreview"].ptz_extend.visible = true;
                        this.$UI['CVFramePreview'].cruise.visible = true;
                        this.$UI['CVFramePreview'].track.visible = true;
                    } else {
                        this.$UI['CVFramePreview'].ptz_extend.visible = false;
                        this.$UI['CVFramePreview'].cruise.visible = false;
                        this.$UI['CVFramePreview'].track.visible = false;
                    }
                }
            },
            GetLocalSetting() {
                return this.$store
                    .dispatch('request', {
                        url: 'goform/frmLocalSettings',
                        Type: 0,
                        Data: {},
                    })
                    .then((r) => {
                        if (r && r.Result == 0) {
                            this.$store.commit('localsettings/data_change', r.Data);
                            this.$store.commit('login/password_tips', r.Data.PasswordTips);
                            this.$store.commit('login/enable_gb35114', r.Data.EnableGB35114);
                            msg(`frmLocalSettings load over!${r.Data.EnableGB35114}`);
                        }
                        return Promise.resolve();
                    });
            },
        },
        computed: {
            state() {
                return this.$store.getters.login_status;
            },
            LoginComponent() {
                let info = this.$store.getters;

                if (info.is_xiaoding) {
                    return () => import(/* webpackChunkName: "login" */ 'components/login/cv-login-xiaoding');
                } else if (info.is_sanbao) {
                    return () => import(/* webpackChunkName: "login" */ 'components/login/cv-login-sanbao');
                } else if (info.is_honeynew) {
                    return () => import(/* webpackChunkName: "login" */ 'components/login/cv-login-honeynew');
                } else {
                    return () => import(/* webpackChunkName: "login" */ 'components/login/cv-login');
                }
            },
        },
        watch: {
            state(newVal) {
                let c_name = '';
                switch (newVal) {
                    case -1:
                        c_name = 'CVConfigMsg';
                        this.renderTarget = CVConfigMsg;
                        break;
                    case 0:
                        c_name = 'CVLogin';
                        this.GetFactoryInfo();
                        this.renderTarget = this.LoginComponent;
                        break;
                    case 1:
                        c_name = 'CVIndex';
                        this.renderTarget = CVIndex;
                        break;
                        /*
                    case 2:
                        c_name = 'CVConfigUserManage';
                        this.renderTarget = CVConfigUserManage;
                        break;
                        */
                    case 3:
                        c_name = 'CVFrameConfig';
                        this.renderTarget = CVFrameConfig;
                        break;
                    default:
                        c_name = 'CVLogin';
                        this.renderTarget = CVLogin;
                }

                this.$store.commit('app_frame/change', c_name);
            },
        },
        components: {
            CVIndex,
            //CVConfigUserManage,
            CVFrameConfig,
            CVConfigMsg,
        },
        render(c) {
            return c(this.renderTarget);
        },
    };
</script>
