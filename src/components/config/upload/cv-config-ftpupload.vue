<template>

  <div class="main_con clearfix" :style="{'margin-top': '100px'}">

    <div class="main_con_top"><div class="fl pl10 bold"><label v-tr="i18n_ftp"></label></div></div>

    <div class="main_con_mid">

        <div class="w100 pt5">
				<div class="fl text_right" style="width:30%;">
					<label>FTP</label>:&nbsp;
				</div>
		        <div class="fl" style="width:70%">
		          <input type="checkbox" style="vertical-align:middle" v-model="d.Enable"/>&nbsp;
		          <span style="vertical-align:middle"><label v-tr="i18n_enableFtp"></label></span>&nbsp;&nbsp;
		          <input type="checkbox" style="vertical-align:middle" :disabled="!d.Enable"  v-model="d.FeatureImage"/>&nbsp;
		          <span style="vertical-align:middle"><label v-tr="i18n_ftpFeatureImg"></label></span>&nbsp;&nbsp;
              <input type="checkbox" style="vertical-align:middle" :disabled="!d.Enable"  v-model="d.FullViewImage"/>&nbsp;
		          <span style="vertical-align:middle"><label v-tr="i18n_ftpFullviewImg"></label></span>&nbsp;&nbsp;
		        </div>
		    </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_svrAddr"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc"  style="width:240px;" v-model="d.FTPServer"/>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_port"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc tip" data-title="i18n_port_error" style="width:240px;" v-model="d.FTPPort" v-validator:NOVOID:Number="[1,65535]"/>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_username"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc" style="width:240px;" v-model="d.UserName"/>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_password"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="password" class="textc" style="width:240px;" v-model="d.Password"/>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_svrPath"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc" style="width:240px;" v-model="d.Path"/>
        </div>
      </div>

      <div class="w100 pt10 text_center" style="position:relative">
        <button :class="button_style"  style="width:88px;" v-tr="i18n_save" @click="btnsave()"></button>
      </div>
    </div>
    <div class="main_con_bot"></div>

  </div>
</template>

<script>
import style from 'mixin/style'
    export default {
        name: 'CVConfigFTPUpload',
	mixins:[style],
        data(){
            return{
                d:{

                }
            }
        },
        mounted(){
           this.load_data();
        },
        methods:{
          load_data(){
             this.$store.dispatch("request",{url:"goform/frmNetFtpPara",Type:0,Data:{}}).then(_=>{
                if(_.Result == -655365){
                  this.$store.dispatch('config_no_right');
                }else if(_.Result == 0){
                    this.d = _.Data;
                  this.$notify.success(this.$store.getters.current_language["i18n_getok"]);
                }else {
                  this.$notify.error(this.$store.getters.current_language["i18n_getfailed"]);
                }
            });
          },  
            btnsave(){
              if(this.$el.innerHTML.indexOf("input_check_error")>0){
                this.$notify.error(this.$store.getters.current_language["i18n_checkinput"]);return;
              }

              this.d.FPort = parseInt(this.d.FPort,10);
                this.$store.dispatch("request",{url:"goform/frmNetFtpPara",Type:1,Data:this.d}).then(_=>{
                  if(_.Result == -655365){
                    this.$store.dispatch('config_no_right');
                  }else if(_.Result == 0){
                    this.$notify.success(this.$store.getters.current_language["i18n_saveok"]);
                  }else {
                    this.$notify.error(this.$store.getters.current_language["i18n_savefailed"]);
                  }
                });
            }
        }
    }
</script>
