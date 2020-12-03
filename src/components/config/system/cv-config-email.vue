<template>
  <div class="main_con clearfix" style="margin-top:100px;">
    <!--标题-->
    <div class="main_con_top"><div class="fl pl10 bold"><label v-tr="i18n_email"></label></div></div>
    <!--内容-->
    <div class="main_con_mid">
      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_emailAddr"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc tip" data-title="i18n_email_error" style="width:220px;" v-model="d.SenderAddress" v-validator:Email/>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_password"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="password" class="textc"  style="width:220px;" v-model="d.Password"/>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_confirmPwd"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="password" class="textc" style="width:220px;" v-model="ConfirmPwd" />
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_smtpSvr"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc" style="width:220px;" v-model="d.SmtpServer"/>
        </div>
      </div>


      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_smtpPort"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc tip" data-title="i18n_port_error"  style="width:220px;" v-model="d.SmtpPort" v-validator:NOVOID:Number="[0,65535]"/>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%">&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="checkbox" style="vertical-align:middle"  v-model="d.EnableSSL"/>
          <span style="vertical-align:middle">SSL</span>&nbsp;&nbsp;
          <input type="checkbox" style="vertical-align:middle" v-model="d.EnableVerify"/>
          <span style="vertical-align:middle"><label v-tr="i18n_serverVerify"><!--发送服务器要求身份验证--></label></span>
        </div>
      </div>

      <div class="w100 pt5" v-if="false">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_sendInterval"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc" style="width:220px" v-model="d.MailInterval" v-validator:NOVOID:Number="[25,250]">
          <span style="vertical-align:middle"><label>(25~250S)</label></span>
        </div>
      </div>

<div v-for="item in d.RecvArray">
      <div class="w100 pt5" style="display: none;">
        <div class="fl text_right" style="width:30%"><label  v-tr="i18n_recvName"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input type="text" class="textc" style="width:220px;" v-model="item.RecvName"/>
        </div>
      </div>
      <div class="w100 pt5">
        <div class="fl text_right" style="width:30%"><label v-tr="i18n_recvEmailAddr"></label>:&nbsp;</div>
        <div class="fl" style="width:70%">
          <input  type="text" class="textc tip" data-title="i18n_email_error" style="width:220px;" v-model="item.RecvAddress"  v-validator:Email/>
          <button :class="button_style"  value="" style="width:50px;" v-tr="i18n_emailtest_single" @click="btntest_single(item)"></button>
        </div>
      </div>
</div>
      <div class="w100 pt10 text_center" style="position:relative">
        <button :class="button_style"  value="" style="width:100px;" v-tr="i18n_save" @click="btnsave()"></button>
        <button :class="button_style"  value="" style="width:100px;display: none" v-tr="i18n_emailtest" @click="btntest()"></button>
      </div>
    </div>
    <!--底部-->
    <div class="main_con_bot"></div>
  </div>
</template>

<script>
import style from 'mixin/style'
    export default {
        name: 'CVConfigEmail',
	mixins:[style],
        data(){
            return{
                d:{
                  RecvArray:[{
                  }]
                },
                ConfirmPwd:''
            }
        },

        mounted(){
            this.$store.dispatch("request",{
              url:"goform/frmEmailSetting",
              Type:0,
              Data:{}}).then(_=>{
                if(_.Result == -655365){
                  this.$store.dispatch('config_no_right');
                }else if(_.Result == 0){
                    this.d = _.Data;
                    this.ConfirmPwd = _.Data.Password;
                    this.$notify.success(this.$store.getters.current_language["i18n_getok"]);
                }else {
                    this.$notify.error(this.$store.getters.current_language["i18n_getfailed"]);
                }
            });
        },
        methods:{
            btnsave(){
              this.d.test = 0;
              this.postData();
            },
            //邮件配置测试
            btntest(){
              this.d.test = 1;
              this.postData();
            },
            //每一个接收邮箱对应的测试
            btntest_single(item){
              this.d.test = 2;
              this.postData(item.RecvAddress);
            },
            postData(Addr){
              if(this.$el.innerHTML.indexOf("input_check_error")>0){
                this.$notify.error(this.$store.getters.current_language["i18n_checkinput"]);return;
              }
              if(this.d.Password != this.ConfirmPwd){
                this.$notify.error(this.$store.getters.current_language["i18n_Pwd_NotSame"]);
                return;
              }
              this.d.SmtpServer = this.d.SmtpServer;
              this.d.EnableSSL = this.d.EnableSSL?1:0;
              this.d.EnableVerify = this.d.EnableVerify?1:0;
              this.d.SmtpPort = parseInt(this.d.SmtpPort,10);
              this.d.MailInterval = parseInt(this.d.MailInterval,10);
              console.log(this.d.SmtpPort);
              this.$store.dispatch("request",{
                url:"goform/frmEmailSetting",
                Type:1,
                Data:this.d
              }).then(_=>{
                if(_.Result == -655365){
                  this.$store.dispatch('config_no_right');
                }else if(this.d.test==0){
                  if(_.Result == 0){
                    this.$notify.success(this.$store.getters.current_language["i18n_saveok"]);
                  }else {
                    this.$notify.error(this.$store.getters.current_language["i18n_savefailed"]);
                  }
                }else if(this.d.test == 1){
                  if(_.Result == 0){
                     this.$notify.success(this.$store.getters.current_language["i18n_emailtesting"],'', {timeOut: 10000});
                     setTimeout(()=>{this.$store.dispatch("request",{
                       url:"goform/frmEmailSetting",
                       Type:2,
                       Data:{}
                     }).then(_=>{
                       if(_.Result == 0){
                         this.$notify.success(_.Data.TestResult,'', {timeOut: 5000});
                       }else {
                         this.$notify.error(this.$store.getters.current_language["i18n_test_getfailed"]);
                       }
                     })},10000);
                  }else {
                    this.$notify.error(this.$store.getters.current_language["i18n_testfailed"]);
                  }

                }else if(this.d.test == 2){
                  let Json_data = JSON.parse(JSON.stringify(this.d));
                  if(_.Result == 0){
                    let self = 
                    {
                      RecvAddress: Addr
                    }
                    Json_data.RecvArray = [];
                    Json_data.RecvArray.push(self);
                    this.$notify.success(this.$store.getters.current_language["i18n_sending"],'', {timeOut: 1000});
                    setTimeout(()=>{this.$store.dispatch("request",{
                      url:"goform/frmEmailSetting",
                      Type:2,
                      Data:Json_data
                    }).then(_=>{
                      if(_.Result == 0){
                        this.$store.dispatch("request",{
                          url:"goform/frmEmailSetting",
                          Type:3,
                          Data:{}}).then(_=>{
                          if(_.Result == 0){
                              this.$notify.success(this.$store.getters.current_language["i18n_send_success"]);
                          }else {
                              this.$notify.error(this.$store.getters.current_language["i18n_send_failed"]);
                          }
                      }); 
                      }else {
                        this.$notify.error(this.$store.getters.current_language["i18n_send_failed"]);
                      }
                    })},1000);
                  }else {
                    this.$notify.error(this.$store.getters.current_language["i18n_testfailed"]);
                  }
                }
              });
            }
        }
    }
</script>
