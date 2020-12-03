
<template>
<div class="w100"  @keyup.enter="btn_login">
    <div class="login_sanbao_bg">
      <div class="login_sanbao_main">
          <div class="login_sanbao_main_left">
            <table class="login_sanbao_table">
              <tr>
                  <td style="text-align: center">
                      <label style="font-family: Roboto;font-size: 32px;color: #1598E7">SIGN IN</label>
                  </td>
              </tr>
              <!--<tr>-->
              <!--<td>-->
              <!---->
              <!--</td>-->
              <!--</tr>-->
              <tr>
                  <td>
                      <div class="login_sanbao_div_input">
                          <div>
                              <label style="font-size: 14px;color: #999999">USER ID</label>
                          </div>
                          <div style="width: 40px;height: 40px;float: left">
                                        <img src="/static/images/signin_User.png" style="margin: 7px 10px" />
                          </div>
                                    <input
                                        type="text"
                                        class="login_sanbao_input"
                                        v-model="username"
                                        :placeholder="$store.getters.current_language.i18n_login_username_tip"
                                    />
                      </div>
                  </td>
              </tr>
              <tr>
                  <td>
                      <div class="login_sanbao_div_input">
                          <div>
                              <label style="font-size: 14px;color: #999999">PASSWORD</label>
                          </div>
                          <div style="width: 40px;height: 40px;float: left">
                                        <img src="/static/images/losed-Lock.png" style="margin: 7px 10px" />
                          </div>
                                    <input
                                        type="password"
                                        class="login_sanbao_input"
                                        v-model="password"
                                        :placeholder="$store.getters.current_language.i18n_login_password_tip"
                                    />
                      </div>
                  </td>
              </tr>
              <tr>
                  <td>
                      <div class="login_sanbao_div_input_langsel">
                          <div>
                              <label style="font-size: 14px;color: #999999">LANGUAGE</label>
                          </div>
                          <select  v-model="select_language">
                              <option  :value="item.val"  v-for="item of div_select_language" v-tr="item.text"></option>
                          </select>
                      </div>

                  </td>
              </tr>
              <tr v-if="false">
                  <td>
                      <div class="login_sanbao_div_input">
                          <select class="login_sanbao_input_s" @change="item_choose_change($event)" >
                              <option v-for="(item,index) in browser_type.options" :value="index" v-tr="item"></option>
                          </select>
                      </div>

                  </td>
              </tr>



              <tr v-if="false">
                  <td class="text_center">
                      <button class="login_sanbao_btn" style="color: #ffffff" v-tr="i18n_login" @click="Login"></button>
                  </td>
              </tr>

              <tr>
                  <td>
                      <div style="height: 30px;width: 323px;margin: 50px auto 0 auto;color: #999">
                                    <div class="login_sanbao_input_s text_right" @click="forget_pwd" v-if="ui_custom.forgot_pwd.visible">
                                        <a><label style="cursor: pointer" v-tr="i18n_forgetPwd"></label></a>
                                    </div>
                      </div>
                  </td>
              </tr>
          </table>
          </div>
          <div class="login_sanbao_main_right">
              <div style="margin-top: 80px;margin-left: 60px">
                  <div>
                      <div style="color: #00c9ff;height: 32px">NETWORK CAMERA</div>
                      <div>Real-Time Monitoring System</div>
                  </div>
                  <div style="margin-top: 67px">
                            <input type="button" value="LOGIN" class="login_sanbao_btn" @click="btn_login" />
                  </div>
                  <div style="margin-top: 67px">
                            <input type="button" value="CANCEL" class="login_sanbao_btn" />
                  </div>
              </div>

          </div>
  </div>

  </div>
 <div class="loading" v-show="download_info_show">
   <label id="labwt">&nbsp;</label>
   <img id="imgwt" src="/static/images/loading.gif" width="206" height="8" />
            <a :href="download_exe_name" style="color:white">{{ this.$store.getters.current_language.i18n_plugin_download }}</a
            ><!--rtspvideoplugin.exe-->
 </div>
 </div>
</template>

<script>
import Vue from 'vue';


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
			download_exe_name: 'rtspvideoplugin.exe',
			download_info_show: false,
		};
		return _d;
	},
	methods: {
		item_choose_change(evt) {
			if (evt.target.value == 0) {
				this.download_info_show = !_check_plugin.isPluginInstalled();
				this.$store.commit('plugin_type/val_changed', 'ie');
			} else {
				this.download_info_show = false;
				this.$store.commit('plugin_type/val_changed', 'flash');
			}
		},
		Login() {
			//非ie浏览器不检查插件是否注册
                if (this.download_info_show) {
				alert(this.$store.getters.current_language['i18n_warn_login_1']);
				return;
			}

			this.$store
				.dispatch('login')
				.then(({ login_status }) => {
					if (login_status) {
						if (this.$store.getters.SessionId) {
							this.CheckSessionTimeOut();
						}
						//               if(this.$store.getters.DefaultPwd && this.ui_custom.modify_pwd.visible){
						//                 if(confirm(this.$store.getters.current_language["i18n_tips_login_first"])){
						//                   this.$store.commit("login/submit",2);
						//                 }
						//               }
						msg(['login', this.$store.getters.PasswordTips]);
						let status = 1;
						if (this.$store.getters.PasswordTips && this.ui_custom.modify_pwd.visible) {
							if (confirm(this.$store.getters.current_language['i18n_tips_login_first'])) {
								status = 2;
							} else {
								this.$store.dispatch('request', { url: 'goform/frmLocalSettings', Type: 1, Data: { PasswordTips: 0 } });
							}
						}
						this.$store.commit('login/submit', status);
						//   $.cookie("last_choosed_lang",this.select_language);
					}
					// msg([login_status , this.$store.getters.tokenA == 'admin'])
					/* if (login_status && this.$store.getters.tokenA == 'admin') {
            //定制生效
            //this.$UI["CVConfigMenu"].CVConfigDeveloper.visible = true;
          }else{
          //  this.$UI["CVConfigMenu"].CVConfigDeveloper.visible = false;
          }
          */
				})
				.catch(() => {
					alert(this.$store.getters.current_language['i18n_tips_login_failed']);
				});
		},
		forget_pwd() {
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
            this.btn_login = debounce(this.Login, 1000);
            if (window.plugin_download_addr) {
			this.download_exe_name = window.plugin_download_addr;
		}
	},
	mounted() {
		//msg("#download component mounted!");

		this.download_info_show = !_check_plugin.isPluginInstalled();

		//添加用户自定义的语言文件
		this.div_select_language = [];
		let lang = this.$store.getters.base.lang;
		Object.keys(lang).forEach((item, idx) => {
			this.div_select_language.push({
				text: lang[item][1],
				val: item,
			});
		});
	},
	watch: {
		username(val) {
			this.$store.dispatch('username_val_changed', val);
		},
		password(val) {
			this.$store.dispatch('password_val_changed', val);
		},
	},
	computed: {
		select_language: {
			get: function() {
				msg('get ' + this.$store.getters.base.selected_language);
				return this.$store.getters.base.selected_language;
			},
			set: function(newVal) {
				msg('set ' + newVal);
				this.$store.dispatch('choose_language', newVal);
			},
		},
	},
};
</script>
