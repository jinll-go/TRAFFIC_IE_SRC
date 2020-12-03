<template>
	<div class="main_con clearfix" style="margin-top:100px;">
		<div class="main_con_top">
	    	<div class="fl pl10 bold"><label v-tr="i18n_http_push"><!-- http推送 --></label></div>
		</div>
		<div class="main_con_mid">
			<div class="w100 pt5">
				<div class="fl text_right" style="width:35%">
				<label>HTTP:&nbsp;</label>&nbsp;
				</div>
				<div class="fl" style="width:65%">
		          <input type="checkbox" style="vertical-align:middle" v-model="d.Enable"/>&nbsp;
		          <span style="vertical-align:middle"><label v-tr="i18n_enableHttp"></label></span>&nbsp;&nbsp;
		          <input type="checkbox" style="vertical-align:middle" :disabled="!d.Enable"  v-model="d.CaptureEnable"/>&nbsp;
		          <span style="vertical-align:middle"><label v-tr="i18n_httpCaptureImg"></label></span>&nbsp;&nbsp;
            	  <input type="checkbox" style="vertical-align:middle" :disabled="!d.Enable"  v-model="d.CompareEnable"/>&nbsp;
		          <span style="vertical-align:middle"><label v-tr="i18n_httpCompareImg"></label></span>&nbsp;&nbsp;
				  <input type="checkbox" style="vertical-align:middle" :disabled="!d.Enable"  v-model="d.UploadOffline"/>&nbsp;
		          <span style="vertical-align:middle"><label v-tr="i18n_httpUploadOffline"></label></span>&nbsp;&nbsp;
		        </div>
		 </div>	 

			<div class="w100 pt5">
				<div class="fl text_right" style="width:35%;">
					<label v-tr="i18n_svrAddr"><!-- 服务器地址 --></label>:&nbsp;
				</div>
				<div class="fl" style="width:45%">
					<input type="text" class="textc" style="width:202px;" v-model="d.HTTPServer" :disabled="!d.Enable" >
				</div>
				<div class="fr" style="width:15%;">
					<button :class="button_style"  style="width:45px;" v-tr="i18n_test" @click="test()" :disabled="!d.Enable"></button>
				</div>
			</div>

			<!-- 服务器端口 -->
			<!-- <div class="w100 pt5">
				<div class="fl text_right" style="width:35%;">
					<label v-tr="i18n_ServerPort"></label>:&nbsp;
				</div>
				<div class="fl" style="width:45%">
					<input type="text" class="textc" style="width:202px;" v-model="d.ServerPort" :disabled="!d.Enable" v-validator:NOVOID:Number="[0,65535]">
				</div>
			</div> -->

			<div class="w100 pt5">
				<div class="fl text_right" style="width:35%;">
					<label v-tr="i18n_HeartBeatInterval"><!-- 心跳间隔 --></label>:&nbsp;
				</div>
				<div class="fl" style="width:45%">
                    <input type="text" class="textc" style="width:202px;" v-model="d.HeartBeatInterval" :disabled="!d.Enable"  v-validator:NOVOID:Number="[1,3600]">
				</div>
			</div>

			<div class="w100 pt5">
				<div class="fl text_right" style="width:35%;">
					<label v-tr="i18n_username"><!-- 用户名 --></label>:&nbsp;
				</div>
				<div class="fl" style="width:45%">
					<input type="text" class="textc" style="width:202px;" v-model="d.UserName" :disabled="!d.Enable">
				</div>
			</div>
			<div class="w100 pt5">
				<div class="fl text_right" style="width:35%;">
					<label v-tr="i18n_password"><!-- 密码 --></label>:&nbsp;
				</div>
				<div class="fl" style="width:45%">
					<input type="password" class="textc" style="width:202px;" v-model="d.Password" :disabled="!d.Enable" >
				</div>
			</div>
			<div class="w100 pt5">
				<div class="fl text_right" style="width:35%;">
					<label v-tr="i18n_authMethods"></label>:&nbsp;
				</div>
				<div class="fl" style="width:45%">
					<select class="textc" style="width: 200px;" v-model="d.AuthType" :disabled="!d.Enable">
						<option :value="0" v-tr="i18n_noAuth"></option>
						<option :value="1">http-base64</option>
						<option :value="2">http-digest</option>
					</select>
				</div>
			</div>

			<div class="w100 pt10 text_center" style="position:relative" >
            	<button :class="button_style"  style="width:88px;" v-tr="i18n_save" @click="save()"></button>
          </div>
		</div>
		<div class="main_con_bot"></div>
	</div>
</template>


<script>
import Vue from 'vue';
import style from 'mixin/style';
import { debounce } from 'common/util';

	export default {
		name:'CVConfigHTTPUpload',
		mixins:[style],
		data(){
			return{
				d:{
					Enable:0,
					HTTPServer: '',
					HeartBeatInterval:0,
					CaptureEnable: 0,
					CompareEnable: 0,
					UploadOffline: 0,
					UserName: 'admin',
					Password: '',
					AuthType: 0,
			},
		};
		},
		created(){
		this.save = debounce(this.btnsave, 1000);
		},
		mounted(){
		this.$store.dispatch('request', { url: 'goform/frmNetHttpPara', Type: 0, Data: {} }).then((_) => {
				if(_.Result == -655365){
					this.$store.dispatch('config_no_right');
				}else if(_.Result == 0){
					this.d = _.Data;
				this.$notify.success(this.$store.getters.current_language['i18n_getok']);
				}else{
				this.$notify.error(this.$store.getters.current_language['i18n_getfailed']);
				}
			});
		},
		methods:{
			test(){
			this.$store
				.dispatch('request', {
					url: 'goform/frmNetHttpPara',
					Type:3,
					Data: { HTTPServer: this.d.HttpServer },
				})
				.then((r) => {
					if(r.Result == 0){
						this.$notify.success(this.$store.getters.current_language['i18_httpTips_succ']);
					}else{
						this.$notify.error(this.$store.getters.current_language['i18_httpTips_fail']);
					}
				});
			},
			btnsave(){
			if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
				this.$notify.error(this.$store.getters.current_language['i18n_checkinput']);
				return;
	            }
	        
				this.d.HeartBeatInterval = parseInt(this.d.HeartBeatInterval);
	

			this.$store
				.dispatch('request', {
					url: 'goform/frmNetHttpPara',
					Type:1,
					Data: this.d,
				})
				.then((_) => {
					if(_.Result == 0){
						this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
					} else if(_.Result == -655365) {
						this.$store.dispatch('config_no_right');
					} else {
						this.$notify.error(this.$store.getters.current_language['i18n_savefailed']);
					}
				});
		},
	},
};
</script>
