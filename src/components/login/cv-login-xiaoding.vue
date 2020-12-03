<template>
    <!-- 小町 版本 登录 -->
    <div class="login" id="login" @keyup.enter="Login">
        <div class="loading" v-show="download_info_show">
            <label id="labwt">&nbsp;</label>
            <img id="imgwt" src="static/images/loading.gif" width="206" height="8" />
            <a :href="download_exe_name" style="color:white">{{ this.$store.getters.current_language.i18n_plugin_download }}</a
            ><!--rtspvideoplugin.exe-->
        </div>
        <div class="login_top">
            <div class="logo"></div>
            <div class="language"></div>
        </div>
        <table cellspacing="0" cellpadding="0" border="0" class="middle">
            <tbody>
                <tr>
                    <td class="login-l">&nbsp;</td>
                    <td class="login-m">
                        <div class="bgImg">
                            <div class="formMain">
                                <div style="margin:21px 0"><img src="static/images/logo.png"></div>
                                <form class="form-horizontal">
                                    <div class="form-group has-feedback">
                                        <div class="col-sm-12 username">
                                            <span class="glyphicon glyphicon-user form-control-feedback"> </span>
                                            <input type="text" class="form-control" v-model="username" placeholder="请输入账号" />
                                        </div>
                                    </div>
                                    <div class="form-group has-feedback">
                                        <div class="col-sm-12 password">
                                            <span class="glyphicon glyphicon-lock form-control-feedback"></span>
                                            <input type="password" class="form-control" v-model="password" placeholder="请输入密码" />
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <a href="javaScript:;" class="noPwd" @click="forget_pwd" v-if="ui_custom.forgot_pwd.visible">忘记密码</a>
                                    </div>
                                    <div class="form-group">
                                        <div class="col-sm-12">
                                            <input type="button" class="login-btn btn btn-primary" @click="Login" value="登录" />
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </td>
                    <td class="login-r">&nbsp;</td>
                </tr>
            </tbody>
        </table>
        <!--<div class="footer" id="footer">
            <a href="http://xiaoding110.com/" target="_blank">{{ cpyright_info_text }}</a>-->
        </div>
    </div>
</template>

<script>
import Vue from "vue";

import _check_plugin from "common/check_plugin_installed";
import { debounce } from "common/util";

import { mapState } from "vuex";

export default {
    name: "CVLogin",
    data() {
        let show = true;
        let disabled = false;

        let _d = {
            username: this.$store.getters.tokenA,
            password: "",
            browser_type: {
                //label
                options: ["i18n_IE", "i18n_Flash"],
            },
            div_select_language: [
                //div-select
                /* {text:"简体中文",val:"zh"},
            {text:"English",val:"en"}*/
            ],
            cpyright_info_text: "",
            tips_1_show: true,
            tips_2_show: true,
            download_exe_name: "rtspvideoplugin.exe",
            download_info_show: false,
            sessionlist_false: [],
        };
        return _d;
    },
    methods: {
        Login() {
            //非ie浏览器不检查插件是否注册
            if (this.download_info_show ) {
                alert(this.$store.getters.current_language["i18n_warn_login_1"]);
                return;
            }

            this.$store
                .dispatch("login")
                .then(({ login_status }) => {
                    if (login_status) {
                        if (this.$store.getters.SessionId) {
                            this.CheckSessionTimeOut();
                        }

                        let status = 1;
                        if (this.$store.getters.PasswordTips && this.ui_custom.modify_pwd.visible) {
                            if (confirm(this.$store.getters.current_language["i18n_tips_login_first"])) {
                                status = 2;
                            } else {
                                this.$store.dispatch("localsettings/Set", { PasswordTips: 0 });
                            }
                        }
                        this.$store.commit("login/submit", status);
                    }
                })
                .catch(() => {
                    alert(this.$store.getters.current_language["i18n_tips_login_failed"]);
                });
        },
        forget_pwd() {
            this.$store.commit("errorCode/change", -1);
            this.$store.commit("app_frame/change", "CVConfigMsg");
            this.$store.commit("login/submit", -1);
        },
        CheckSessionTimeOut() {
            if (this.$store.getters.SessionId) {
                setTimeout(() => {
                    this.$store.dispatch("KeepSessionAlive").then(_ => {
                        msg(["KeepSessionAlive", _]);
                        if (_.Result == 0) {
                            this.sessionlist_false = [];
                        }
                        if (!_) {
                            this.sessionlist_false.push(false);
                            if (this.sessionlist_false.length == 3) {
                                this.$store.dispatch("cleanup", 0);
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
        let name = $.cookie("last_login_username") || "";
        this.username = name ? name : this.username;
        this.$store.dispatch("choose_language", "zh");
        this.btn_login = debounce(this.Login, 1000);

        if (window.plugin_download_addr) {
            this.download_exe_name = window.plugin_download_addr;
        }

        if (this.para_custom.cpyright_info) {
            this.cpyright_info_text = this.para_custom.cpyright_info;
        }
    },
    mounted() {
        //msg("#download component mounted!");

        this.download_info_show = !_check_plugin.isPluginInstalled();
    },
    watch: {
        username(val) {
            this.$store.dispatch("username_val_changed", val);
        },
        password(val) {
            this.$store.dispatch("password_val_changed", val);
        },
    },
};
</script>
<style scoped>
* {
    box-sizing: border-box;
}
</style>