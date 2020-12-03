<template>
    <div class="w100 " @keyup.enter="Login">
        <div class="login_bg login_bkg">
            <div class="login_1">
                <!-- Logo Banner -->
                <CVLoginBanner></CVLoginBanner>
                <div class="clearfix " style="padding-top:19px">
                    <!--Username-->
                    <div class="clearfix">
                        <div class="honey_login_text" style="width:35%">
                            <label v-tr="i18n_username"></label>
                            :&nbsp;
                        </div>
                        <div class="fl mt10" style="width:65%">
                            <!-- <CVInput ref="username" :value="last_login_username"></CVInput>-->
                            <input class="honey_login_input" type="text" name="username" v-model="username" />
                        </div>
                    </div>
                    <!-- password-->
                    <div class="clearfix">
                        <div class="honey_login_text" style="width:35%">
                            <label v-tr="i18n_password"></label>
                            :&nbsp;
                        </div>
                        <div class="fl mt10" style="width:65%">
                            <!--<CVInput ref="pwd" type="password" ></CVInput>-->
                            <input class="honey_login_input" type="password" name="pwd" v-model="password" />
                        </div>
                    </div>

                    <!--Browser Type -->
                    <div class="clearfix mt10" v-show="ui_custom.browser_type.visible" v-if="false">
                        <div class="honey_login_text" style="width:35%">
                            <label v-tr="i18n_browser_type"></label>
                            :&nbsp;
                        </div>
                        <div class="fl" style="width:65%">
                            <select class="honey_login_select" v-model="current_browser_type">
                                <option v-for="(item, index) in browser_type.options" :value="index" v-tr="item"></option>
                            </select>
                        </div>
                    </div>
                    <div class="clearfix">
                        <div class="honey_login_text" style="width:35%">
                            <label v-tr="i18n_choose_lang"></label>
                            :&nbsp;
                        </div>
                        <div class="fl mt10" style="width:180px;margin-left:-125px">
                            <CVDivSelect ref="language_select" :options="div_select_language"></CVDivSelect>
                        </div>
                    </div>
                    <!--
					<div class="clearfix honey_login_button_container">
						<div class="honey_login_button_div">
							<button class="log_btn" v-tr="i18n_login" @click="btn_login"></button>

							<div @click="forget_pwd" v-if="ui_custom.forgot_pwd.visible">
								<a class="fr"><label style="cursor: pointer" v-tr="i18n_forgetPwd"></label></a>
							</div>
						</div>
					</div>-->
                    <div class="clearfix">
                        <div class="honey_login_text" style="width:35%"></div>
                        <div class="fl mt10" style="width:65%">
                            <button class="honey_login_button" v-tr="i18n_login" @click="btn_login"></button>
                        </div>
                    </div>
                    <div class="clearfix">
                        <div class="fr">
                            <div @click="forget_pwd" v-if="ui_custom.forgot_pwd.visible">
                                <a class="fr"><label style="cursor: pointer" v-tr="i18n_forgetPwd"></label></a>
                            </div>
                        </div>
                    </div>
                </div>
                <!--<div class="div_opacity" style="top: 0;left: 0" v-show="enable_gb35114 && !usbdog_status">
					<div style="position: absolute;top: 30%;left: 45%;font-size: 22px" v-tr="usbdog_tip"></div>
				</div>-->
            </div>
            <!--
			<div style="position:relative;width:100%;" v-show="this.$store.getters.is_honey">
				<div class="login_2 f16" style="color:white;position:absolute;top:5px;;left:50%;margin-left:-400px;" v-tr="cpyright_info_text"></div>
				<div
					id="login_usage1"
					class="login_usage_1 f12"
					style="position:absolute;top:35px;;left:50%;margin-left:-400px;"
					v-show="tips_1_show"
					v-tr="i18n_tips1"
				></div>
				<div
					id="login_usage2"
					class="login_usage_1 f12"
					style="position:absolute;top:60px;;left:50%;margin-left:-400px;"
					v-show="tips_2_show"
					v-tr="i18n_tips2"
				></div>
			</div>-->
        </div>
        <!--Honey infos-->

        <!--dowload Link
        <div class="loading" v-show="false">
            <label id="labwt">&nbsp;</label>
            <img id="imgwt" src="static/images/loading.gif" width="206" height="8" />
            <a :href="download_exe_name" style="color:white">{{ this.lang.i18n_plugin_download }}</a
            >
        </div>rtspvideoplugin.exe-->
    </div>
</template>

<script>
    import Vue from 'vue';

    import CVLoginBanner from 'components/login/cv-login-banner.vue';

    import CVDivSelect from 'components/cv-div-select';

    import default_lang from 'common/check-browser-language';

    import _check_plugin from 'common/check_plugin_installed';
    import { debounce } from 'common/util';

    import { mapState } from 'vuex';

    export default {
        name: 'CVLogin',
        data() {
            let show = true;
            let disabled = false;

            let _d = {
                username: this.$store.getters.tokenA,
                password: '',
                browser_type: {
                    //label
                    options: ['i18n_IE', 'i18n_Flash'],
                },
                div_select_language: [
                    //div-select
                    /* {text:"简体中文",val:"zh"},
                {text:"English",val:"en"}*/
                ],
                cpyright_info_text: `Copyright ${new Date().getFullYear()},Honeywell International Inc.and its licensors,all rights reserved.`,
                tips_1_show: true,
                tips_2_show: true,
                //download_exe_name: 'rtspvideoplugin.exe',
                //download_info_show: false,
                sessionlist_false: [],
                usbdog_status: 0,
                usbdog_tip: 'i18n_usbdog_none',
                enable_gb35114: true,
                current_browser_type: -1,
            };
            return _d;
        },
        methods: {
            Login() {
                this.need_usbdog = false; //for test
                if (this.enable_gb35114) {
                    if (this.usbdog_status) {
                        let cert = '';
                        if (this.plugin) {
                            cert = this.plugin.GetSTKCertFile();
                            msg(['cert', cert]);
                        }
                        if (cert.trim().length === 0) {
                            alert(this.lang['i18n_usbdog_get_failed']);
                            return;
                        }
                        this.$store
                            .dispatch('request', {
                                url: 'goform/frmGB35114CertValidate',
                                Type: 1,
                                Data: { CertFile: cert },
                            })
                            .then((r) => {
                                if (r.Result == 0) {
                                    this.$store
                                        .dispatch('request', {
                                            url: 'goform/frmGB35114CertValidate',
                                            Type: 0,
                                            Data: {},
                                        })
                                        .then((_) => {
                                            if (_.Result == 0) {
                                                if (this.plugin.AuthSTKCertFile(_.Data.CertFile)) {
                                                    this.start_login();
                                                    return;
                                                }
                                            }
                                            alert(this.lang['i18n_usbdog_auth_failed']);
                                        });
                                } else {
                                    alert(this.lang['i18n_usbdog_auth_failed']);
                                }
                            });
                    }
                } else {
                    this.start_login();
                }
            },
            start_login() {
                this.$store
                    .dispatch('login')
                    .then(({ login_status }) => {
                        if (login_status) {
                            _check_plugin.ClearPlugin();
                            if (this.$store.getters.SessionId) {
                                this.CheckSessionTimeOut();
                            }

                            let status = 1;
                            if (this.ui_custom.modify_pwd.visible) {
                                if (this.ui_custom.modify_pwd_mandatory.visible) {
                                    if (this.$store.getters.DefaultPwd) {
                                        alert(this.lang['i18n_tips_login_mandatory']);
                                        status = 2;
                                    }
                                } else {
                                    if (this.$store.getters.DefaultPwd) {
									//此处依赖，frmUserLogin这个API中返回的DefaultPwd值
                                        if (this.para_custom.force_firstlogin_modifypwd) {
                                            //fsan mstar 要求 默认密码直接跳修改

                                            status = 2;
                                        } else if (this.$store.getters.PasswordTips) {
										//此处需修改 /usr/etc/cfgfiles/Webserver.json中的PasswordTips值才生效
                                            if (confirm(this.lang['i18n_tips_login_first'])) {
                                                status = 2;
                                            } else {
                                                this.$store.dispatch('request', { url: 'goform/frmLocalSettings', Type: 1, Data: { PasswordTips: 0 } });
                                            }
                                        }
                                    }
                                }
                            }
                            this.$store.commit('login/submit', status);
                        }
                    })
                    .catch(() => {
                        alert(this.lang['i18n_tips_login_failed']);
                    });
            },
            forget_pwd() {
                _check_plugin.ClearPlugin();
                this.$store.commit('errorCode/change', -1);
                this.$store.commit('app_frame/change', 'CVConfigMsg');
                this.$store.commit('login/submit', -1);
            },
            CheckSessionTimeOut() {
                if (this.$store.getters.SessionId) {
                    setTimeout(() => {
                        this.$store.dispatch('KeepSessionAlive').then((_) => {
                            msg(['KeepSessionAlive', _]);
                            if (_.Result == 0) {
                                this.sessionlist_false = [];
                            }
                            if (!_) {
                                this.sessionlist_false.push(false);
                                if (this.sessionlist_false.length == 3) {
                                    this.$store.dispatch('cleanup', 0);
                                }
                            }
                        });
                        this.CheckSessionTimeOut();
                    }, 60000);
                }
            },
        },
        created() {
            //last login username
            let name = $.cookie('last_login_username') || '';
            this.username = name ? name : this.username;
            this.$store.dispatch('choose_language', this.$store.getters.base.selected_language);
            this.btn_login = debounce(this.Login, 500);
            //35114 只支持plugins
            msg(`Enable_GB35114 = ${this.$store.getters.Enable_GB35114}|${this.ui_custom.Enable_GB35114.visible}`);
            this.enable_gb35114 = this.ui_custom.Enable_GB35114.visible && this.$store.getters.Enable_GB35114;

            //检测是否支持wasm和MSE
            let h5Support = 'MediaSource' in window && 'WebAssembly' in window;
            msg('h5Support', h5Support);
            if (h5Support) {
                this.$store.commit('plugin_type/val_changed', 'h5');
                //隐藏插件选择select
                Vue.set(this.ui_custom.browser_type, 'visible', false);

                if (this.enable_gb35114) {
                    throw new Error('35114 can;t set in h5 mode!');
                }
            } else {
                //35114强制 ie
                if (this.enable_gb35114) {
                    Vue.set(this.ui_custom.browser_type, 'visible', false);
                    this.current_browser_type = 0;
                } else {
                    // 根据当前浏览器对plugins的支持度 设定默认插件类型
                    this.current_browser_type = this.$store.getters.base.canuse_axplugins ? 0 : 1;
                }
            }
        },
        mounted() {


            if (this.enable_gb35114) {
                msg('gb35114 enable');
                this.plugin = _check_plugin.GetPlugin();

                setTimeout(() => {
                    if (this.plugin) {
                        if (!this.plugin.STKContextInitOk) {
                            this.usbdog_tip = 'i18n_STKInitFailed';
                            return;
                        }

                        msg(this.plugin.CheckUsbDogStatus);
                        this.usbdog_status = this.plugin.CheckUsbDogStatus((status) => {
                            msg(['`````````````````CheckUsbDogStatus', status]);
                            this.usbdog_status = status;
                        });
                    }
                }, 250);
            }
            //添加用户自定义的语言文件
            this.div_select_language = [];
            let lang = this.$store.getters.base.lang;
            Object.keys(lang).forEach((item, idx) => {
                this.div_select_language.push({
                    text: lang[item][1],
                    val: item,
                });
            });

            this.$refs.language_select.$on('choose_language', (val) => {
                this.$store.dispatch('choose_language', val);

                //通知更新
                this.i18n_login = val;
                this.$set(this.browser_type.options, 0, 'i18n_IE');
            });


        },
        watch: {
            username(val) {
                this.$store.dispatch('username_val_changed', val);
            },
            password(val) {
                this.$store.dispatch('password_val_changed', val);
            },
            current_browser_type(n, o) {
                if (n) {
                    this.$store.commit('plugin_type/val_changed', 'flash');
                } else {
                    this.$store.commit('plugin_type/val_changed', 'ie');
                }
                //假设 都支持.登录界面我们不做实际的检测,组件CVPlugin初始化时再做
                this.$store.commit('base/plugin_installed', 2);
            },
        },
        components: {
            CVLoginBanner,
            CVDivSelect,
        },
    };
</script>
