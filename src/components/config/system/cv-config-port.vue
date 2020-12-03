<template>
    <div>
      <div class="main_con clearfix" style="margin-top:100px;">

        <div class="main_con_top"><div class="fl pl10 bold"><label v-tr="i18n_http_https"></label></div></div>

        <div class="main_con_mid">

        <!--<div class="w100 pt5">
            <div class="fl text_right" style="width:25%">&nbsp;<label v-tr="i18n_enablemulticast"></label></div>
            <div class="fl" style="width:75%">
              &nbsp;&nbsp;<input type="checkbox" v-model="d.Enable"/>
            </div>
          </div>

          <div class="w100 pt5">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_stream"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
              <select class="textc" style="width: 200px;" v-model="selBaudRate" :disabled="!d.Enable">
                <option v-for="(item,index) in BaudRate" v-tr="item[0]" :value="index" v-if="item[1]"></option>
              </select>
            </div>
          </div>-->
          <!--liuxin change  做端口配置，不提供使能配置-->
          <!--<div class="w100 pt5">
            <div class="fl td_bg" style="width:100%;" >&nbsp;&nbsp;<label v-tr="Http"></label>
            </div>
          </div>-->
          <!--liuxin change  做端口配置，不提供使能配置-->
          <!--liuxin change  做端口配置，不提供使能配置-->
          <!--<div class="w100 pt5">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_enableFtp"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
                  <input type='checkbox' class="textc"  v-model="d.EnableHttp"/> 
            </div>
          </div>-->
          <!--liuxin change  做端口配置，不提供使能配置-->
          <div class="w100 pt5">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_httpPort"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
              <input type='text' class='textc tip' data-title="i18n_port_error" style="width:220px;" v-model="d.HttpPortNo" v-validator:NOVOID:Number="[1,65535]"/>
           </div>
          </div>
          <div class="w100 pt5">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_httpsPort"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
              <input type='text' class='textc tip' data-title="i18n_port_error"  style="width:220px;" v-model="d.HttpsPort" v-validator:NOVOID:Number="[1,65535]"/>;
            </div>
          </div>
   <!--       <div class="w100 pt5">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_port"></label>:&nbsp;</div>
            <div class="fl" style="width:75%"><input type="text" v-model="param[1][selBaudRate]" :disabled="!d.Enable" class="textc" style="width:200px;" v-validator:NOVOID:Number="[0,65535]"/></div>
          </div>

          <div class="w100 pt5">
            <div class="fl text_right" style="width:25%"><label >TTL</label>:&nbsp;</div>
            <div class="fl" style="width:75%"><input  type="text" v-model="param[2][selBaudRate]" :disabled="!d.Enable" class="textc" style="width:200px;" v-validator:NOVOID:Number="[0,255]"/>&nbsp;<label>0-255</label>

            </div>
          </div>
    -->
    <!--<div v-show="ui_custom.https.visible">
          <div class="w100 pt5">
            <div class="fl td_bg" style="width:100%;" >&nbsp;&nbsp;<label v-tr="Https"></label>
            </div>
          </div>

          <div class="w100 pt5">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_enableFtp"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
                  <input type='checkbox' class="textc"  v-model="d.EnableHttps"/> 
            </div>
          </div>
          
          <div class="w100 pt5" v-show="ui_custom.forceHttps.visible && d.EnableHttps && d.EnableHttp">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_forceHttps"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
                  <input type='checkbox' class="textc"  v-model="d.RedirectHttpToHttps"/> 
            </div>
          </div>

          <div class="w100 pt5">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_port"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
              
                   <input type='text' class='textc tip' data-title="i18n_port_error"  style="width:200px;" :disabled="!d.EnableHttps"  v-model="d.HttpsPort" v-validator:NOVOID:Number="[1,65535]"/>
                      &nbsp;
            </div>
          </div>
</div>
          <div class="w100 pt5" v-show="ui_custom.certfile.visible">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_Certificate"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
              <form target="hidden_iframe1" id="crt"  method="post" :action="upload_url" enctype="multipart/form-data" >
                <input type="hidden" name="param" :value="hidden_json">
                <input type="file" name="selfile_crt" id="selfile_crt" style="width:200px;display: none" @change="getfile($event,'crt')"/>
                <div>
                  <input class="textc" style="width:200px;height:24px; padding-top:0px; padding-bottom:0px" type="text" disabled="disabled" v-model="file_name_crt"/>
                  <label class="btn1" style="display:inline-block; width:68px;height:24px; margin:0;" for="selfile_crt" v-tr="i18n_browse"></label>
                </div>
                <iframe  name="hidden_iframe1" style="display:none;visiblity:hidden;width:1px;height:1px;"></iframe>
              </form>
            </div>
          </div>

          <div class="w100 pt5" v-show="ui_custom.keyfile.visible">
            <div class="fl text_right" style="width:25%"><label v-tr="i18n_Privatekey"></label>:&nbsp;</div>
            <div class="fl" style="width:75%">
              <form target="hidden_iframe2" id="key"  method="post" :action="upload_url" enctype="multipart/form-data" >
                <input type="hidden" name="param" :value="hidden_json">
                <input type="file" name="selfile_key"  id="selfile_key"  style="width:200px;display: none" @change="getfile($event,'key')"/>
                <div>
                  <input class="textc" style="width:200px;height:24px; padding-top:0px; padding-bottom:0px" type="text" disabled="disabled" v-model="file_name_key"/>
                  <label class="btn1" style="display:inline-block; width:68px;height:24px; margin:0;" for="selfile_key" v-tr="i18n_browse"></label>
                </div>
                <iframe  name="hidden_iframe2" style="display:none;visiblity:hidden;width:1px;height:1px;"></iframe>
              </form>
            </div>
          </div>
          
           <div class="w100 pt10 text_center" style="position:relative" v-show="ui_custom.certfile.visible || ui_custom.keyfile.visible">
              
              <label style="color:red;font-size:14px;" v-tr="i18n_ssl_upload_warn"></label>

          </div> -->

          <div class="w100 pt10 text_center" style="position:relative">
            <button :class="button_style"  style="width:88px;" v-tr="i18n_save" @click="save"></button>

          </div>
        </div>
         
        <div class="main_con_bot"></div>
      </div>
    </div>
</template>

<script>
  import Vue from 'vue';
  import {wsseHeader,wsse_allstring} from 'common/wsse';
  import style from 'mixin/style';
  import {isMulticastArr,getFileName,debounce} from "common/util";

    export default {
        name: 'CVConfigPort',
	      mixins:[style],
        data(){
            return{
              d:{},
              /*liuxin change 改成端口配置界面，无用参数全部屏蔽
              backup:{},
              file_name_crt:'',
              file_name_key:''*/
            }
        },
      //liuxin change 改成端口配置界面，无用参数全部屏蔽
      created(){
        this.save = debounce(this.btnsave,1000);
      },
      mounted(){

          this.$store.dispatch("request",{url:"digest/frmNetSetting_multi",
              Ch : 0,
              Type : 2,
              Data : {}}).then(_=>{
            if(_.Result == -655365){
              this.$store.dispatch('config_no_right');
            }else if(_.Result == 0){
                  this.d = _.Data;
                  //this.backup = $.extend(true,{},this.d);
                  this.$notify.success(this.$store.getters.current_language["i18n_getok"]);
              }else {
                this.$notify.error(this.$store.getters.current_language["i18n_getfailed"]);
            }
          })
      },
      methods:{
        /*liuxin change 改成端口配置界面，无用参数全部屏蔽
        getfile(e,type) {
          if(type == "key"){
            this.file_name_key = getFileName(e.target.value);
          }else if(type == "crt"){
            this.file_name_crt = getFileName(e.target.value);
          }
          msg(["e.target",this.file_name]);
        },*/
        jump(){
              if (confirm(this.$store.getters.current_language["i18n_newurl2"]))
              {
                // let flg = (window.location.href.indexOf('https') === 0);
                /*liuxin change 改成端口配置界面，无用参数全部屏蔽
                if(this.d.EnableHttps){

                    window.location.href  =  "https://" + window.location.hostname +':'+ this.d.HttpsPort;
                }else if(this.d.EnableHttp){
                    window.location.href  =  "http://" + window.location.hostname +':'+ this.d.HttpPortNo;
                }*/ 
                // liuxin add  默认登录链接是用 http 这里只保留 http          
                window.location.href  =  "http://" + window.location.hostname +':'+ this.d.HttpPortNo;
              }
          
        },
        btnsave(){
            if(this.$el.innerHTML.indexOf("input_check_error")>0){
                this.$notify.error(this.$store.getters.current_language["i18n_checkinput"]);return;
             }
            //this.d.EnableHttp = this.d.EnableHttp ? 1:0;
            //this.d.EnableHttps = this.d.EnableHttps ? 1:0;
            this.d.HttpPortNo = parseInt(this.d.HttpPortNo,10);
            this.d.HttpsPort = parseInt(this.d.HttpsPort,10);
            msg("----liuxin debug  HttpPortNo "+this.d.HttpPortNo+" HttpsPort "+this.d.HttpsPort);
            //this.d.RedirectHttpToHttps = this.d.RedirectHttpToHttps?1:0;

            /*if( !this.d.EnableHttp &&  !this.d.EnableHttps){
              this.$notify.error(this.$store.getters.current_language["i18n_http_https_both_disabled"]);return;
            }*/
            if(this.d.HttpPortNo == this.d.HttpsPort){
             this.$notify.error(this.$store.getters.current_language["i18n_sameport"]);return;
            }
            //changed then fire save
            /*let b1 = (this.d.EnableHttp != this.backup.EnableHttp);
            let b2 = (this.d.EnableHttps != this.backup.EnableHttps);
            let b3 = (this.d.HttpPortNo != this.backup.HttpPortNo);
            let b4 = (this.d.HttpsPort != this.backup.HttpsPort);
            let b5 = (this.d.RedirectHttpToHttps != this.backup.RedirectHttpToHttps);*/
            //if(b1 || b2 || b3 || b4 || b5){

            this.$store.dispatch("request",{url:"digest/frmNetSetting_multi",
                  Ch : 0,
                  Type : 3,
                  Data:this.d,
                  TimeOut:3000}).then(_=>{
                if(_.Result == 0){
                  this.$notify.success(this.$store.getters.current_language["i18n_saveok"]);
                  this.jump();
                }else  {
                    if(_.Result == -655377){
                      this.$notify.error(this.$store.getters.current_language["i18n_sameport"]);
                    }else{
                      this.$notify.error(this.$store.getters.current_language["i18n_savefailed"]);
                    }
                }
              }).catch(()=> {
                setTimeout((function(){
                    this.jump();
                }).bind(this),2000);
              });
        },
      },
    }
            //}
            /*liuxin change 改成端口配置界面，无用参数全部屏蔽
            if($('#crt')[0].selfile_crt.value.length > 0){
                Vue.$upload.bind_fileElement($('#crt')[0]);
                Vue.$upload.submit(function(msg,code){
                  if(code && code < 0){
                    this.$notify.error(this.$store.getters.current_language["i18n_Certificate_upload_failed"]);
                  }
                }.bind(this),function(){
                  //msg("crt upload ok!");
                  this.$notify.success(this.$store.getters.current_language["i18n_Certificate_upload_success"]);
                }.bind(this))
            }

             if($('#key')[0].selfile_key.value.length > 0){


              Vue.$upload.bind_fileElement($('#key')[0])
              Vue.$upload.submit(function(msg,code){
                 if(code && code < 0){
                  this.$notify.error(this.$store.getters.current_language["i18n_Privatekey_upload_failed"]);
                }
                }.bind(this),function(){
                //msg("key upload ok!");
                this.$notify.success(this.$store.getters.current_language["i18n_Privatekey_upload_success"]);
                if(confirm(this.$store.getters.current_language['i18n_confirm_remote_reboot'])){
                  this.$store.dispatch('request',{url:"goform/frmDeviceReboot",Type:1,Data:{}});
                }

              }.bind(this))

             }
          }*/
      //},
      /*liuxin change 改成端口配置界面，无用参数全部屏蔽
      computed:{
        hidden_json(){
          return JSON.stringify($.extend(true,wsseHeader(this.$store.getters.tokenA,this.$store.getters.tokenB),{uploadType:"Tls"}));
        },
        upload_url(){
          return this.$store.getters.is_dongshun?"/t8s/upload":"/digest/upload";
        }
      }*/
    //}
</script>
