<template>
    <div>
      <div class="main_con clearfix" style="margin-top:150px;">
        <div class="main_con_top">
          <div class="fl pl10 bold">
            <label>{{title_text}}<!--温馨提示--></label>
          </div>
        </div>
        <div class="main_con_mid msg_bkcolor">
          <div v-if="isForget">
            <div>
              <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_username"></label>:&nbsp;</div>
                <div class="fl" style="width:70%"><input type="text" v-model="User_Name" class="textc" style="width:200px;" :readonly="!show_user"/></div>
              </div>
            </div>
            <div v-if="!show_user&!is_TrafficIPC">
              <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_serialNumber"></label>:&nbsp;</div>
                <div class="fl" style="width:70%"><input type="text" v-model="Serial_Number" readonly="readonly" class="textc" style="width:200px;"/></div>
              </div>
              <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_Unique_identifier"></label>:&nbsp;</div>
                <div class="fl" style="width:70%"><input type="text" v-model="Unique_ID" readonly="readonly" class="textc" style="width:200px;"/></div>
              </div>
              <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_RestoreInfo"></label>:&nbsp;</div>
                <div class="fl" style="width:70%"><input type="text" v-model="Restore_Info" class="textc" style="width:200px;"/></div>
              </div>
              <div class="w100 pt5" style="color: red;">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_warn"></label>:&nbsp;</div>
                <div class="fl" style="width:70%"><label v-tr="i18n_restorePwd_tip"></label></div>
              </div>
            </div>
            <!--liuxin add  双目的忘记密码功能-->
            <div v-if="is_TrafficIPC">
              <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="super_pwd_txt"></label>:&nbsp;</div>
                <div class="fl" style="width:70%"><input type="text" v-model="super_pwd" class="textc" style="width:200px;"/></div>
              </div>
              <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_new_pwd"></label>:&nbsp;</div>
                <div class="fl" style="width:70%"><input type="password" v-model="new_pwd" class="textc" style="width:200px;"/></div>
              </div>
              <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_confirmPwd"></label>:&nbsp;</div>
                <div class="fl" style="width:70%"><input type="password" v-model="confirm_pwd" class="textc" style="width:200px;"/></div>
              </div>
              <div class="w100 pt5" style="color: red;">
                <div v-if="!is_modify_DefaultPwd">
                  <div class="fl text_right" style="width:30%"><label v-tr="i18n_warn"></label>:&nbsp;</div>
                  <div class="fl" style="width:70%"><label v-tr="i18n_restorePwd_tip_traffic"></label></div>
                </div>
              </div>
            </div>
            <!--liuxin add  双目的忘记密码功能-->
            <div class="w100 pt10 text_center" >
              <button :class="button_style"  style="width:60px;" @click="SubmitInfo">{{save_text}}</button>
              <button :class="button_style"  style="width:60px;" @click="ReturnLogin" v-tr="i18n_return"></button>
            </div>
          </div>
          <div v-else class="w100 pt1 text_center" style="padding-top:30px; padding-bottom:30px;">{{show_msg}}
        </div>
        </div>
        <div class="main_con_bot"></div>
      </div>
    </div>
</template>

<script>
  import style from 'mixin/style'
    export default {
      name:'CVConfigMsg',
      mixins:[style],
      data(){
        return{
          lang:this.$store.getters.current_language,
          isForget:false,
          show_user:true,
          //liuxin add  双目的忘记密码功能
          //liuxin add  双目的修改默认密码功能
          is_modify_DefaultPwd:false,
          //liuxin add  双目的修改默认密码功能
          is_TrafficIPC: true,
          super_pwd:'',
          new_pwd:'',
          confirm_pwd:'',
          //liuxin add  双目的忘记密码功能
          Serial_Number:'026a01235f1cfa622975',
          Unique_ID:'',
          Restore_Info:'',
          show_msg:"",
          User_Name:''
        }
      },
      mounted(){
          switch(this.$store.getters.base.errorCode){
            case -1:this.isForget = true;break;
            case 0:this.show_msg = this.lang["i18n_no_rights"];break;
            case 1:this.show_msg = this.lang["i18n_webserver_error"];break;
            case 2:this.show_msg = this.lang["i18n_uiconfig_error"];break;
          };
          this.is_modify_DefaultPwd=this.$store.getters.base.is_DefaultPwd;
          msg("---liuxin debug is_modify_DefaultPwd: "+this.is_modify_DefaultPwd);
      },
      created() {
            //last login username
            //let name = $.cookie('last_login_username') || '';
            this.User_Name = this.$store.getters.base.tokenA;
      },
      methods:{
        ReturnLogin(){
          this.$store.commit('errorCode/change',0);
          // this.$store.commit('app_frame/change','CVLogin');
          window.location.href = window.location.href;
          //window.location.reload();
          //let val='';
          //this.$store.dispatch('password_val_changed',val);
        },
        SubmitInfo(){
          msg("modify")
          if(!this.show_user){
            this.$store.dispatch("frmPasswordLost/Get",{UserName:this.User_Name}).then(r=>{
              if(r.Result == 0){
                this.Serial_Number = r.Data.SerialNumber;
                this.Unique_ID = r.Data.Token;
                this.show_user = false;
                //liuxin add  双目的忘记密码功能
                this.is_TrafficIPC = true,
                //liuxin add  双目的忘记密码功能
                this.$notify.success(this.lang["i18n_getok"]);
              }else {
                this.$notify.error(this.lang["i18n_warn_login_0"]);
              }
            })
          }else {
            if(this.new_pwd != this.confirm_pwd){
              msg("---liuxin debug 密码不一致");
              alert(this.lang['i18n_tips_login_mandatory']);
            }
            let data = {
              UserName:this.User_Name,
              //SerialNumber:this.Serial_Number,
              //RestoreInfo:this.Restore_Info,
              //liuxin add  双目的忘记密码功能
              super_pwd:this.super_pwd,
              new_pwd:this.new_pwd,
              confirm_pwd:this.confirm_pwd
              //liuxin add  双目的忘记密码功能
            };
            this.$store.dispatch('login').then(({ login_status }) => {
              if (login_status) {
                msg("---liuxin debug login ok");
                this.$store.dispatch('request',{
                  url:"digest/frmUserManage",
                  Type:4,
                  Ch:0,
                  Data:{
                    OriginalUserName:this.User_Name,
                    OriginalPassword:"",
                    UseSupperPassword:this.is_modify_DefaultPwd?0:1,
                    UserName:this.User_Name,
                    Password:this.confirm_pwd,
                    ModifyPassword:1,
                    AuthLevel:0,
                    Priority:0
                }}).then(r=>{
                  if (r.Result == -655365) {
                    this.$store.dispatch('config_no_right');
                  }else{
                    if (r.Result == 0) {
                      msg('---liuxin debug modify pwd ok!');
                      if(!this.is_modify_DefaultPwd){
                        this.$notify.success(this.$store.getters.current_language["i18n_reset_pwd_ok"]);
                      }else{
                        this.$notify.success(this.$store.getters.current_language["i18n_modify_pwd_ok"]);
                      }
                    }else{
                      msg('---liuxin debug modify pwd err!');
                      if(!this.is_modify_DefaultPwd){
                        this.$notify.success(this.$store.getters.current_language["i18n_reset_pwd_err"]);
                      }else{
                        this.$notify.success(this.$store.getters.current_language["i18n_modify_pwd_err"]);
                      }
                    }
                    this.$store.dispatch('request', {
                      url: 'digest/frmUserLogout',
                      Type: 0,
                      async: false,
                      Timeout: 1000,
                      Data: {},
                      }).then((login_status) => {

                      })
                      .catch(() => {
                            //alert(this.$store.getters.current_language["i18n_tips_logout_failed"]);
                      });
                  }
                })
              }
            })
            .catch(() => {
              alert(this.lang['i18n_tips_login_failed']);
            });
            /*this.$store.dispatch("frmPasswordLost/Set",data).then(r=>{
              switch(r.Result){
                case 0:this.$notify.success(this.lang["i18n_operation_true"]);break;
                case -1005:this.$notify.error(this.lang["i18n_RestoreInfo_error"]);break;
                case -1006:this.$notify.error(this.lang["i18n_RestoreInfo_Expired"]);break;
                case -1007:this.$notify.error(this.lang["i18n_RestoreInfo_TryMax"]);break;
                default:this.$notify.error(this.lang["i18n_Restore_failed"]);break;
              }
            });*/
          }
        }
      },
      watch: {
        User_Name(val) {
          this.$store.dispatch('username_val_changed', val);
        },
        super_pwd(val) {
          msg("---liuxin debug password_val_changed :"+val);
          this.$store.dispatch('password_val_changed', val);
        },
        confirm_pwd(val){
          //this.$store.dispatch('password_val_changed', val);
        },
      },
      computed:{
        title_text(){
          if(this.is_modify_DefaultPwd){
            return this.lang["i18n_modify_pwd"];
          }
          return this.isForget?this.lang["i18n_PwdRestore"]:this.lang["i18n_warn"];
        },
        save_text(){
          return (this.show_user&&(!this.is_TrafficIPC))?this.lang["i18n_nextStep"]:this.lang["i18n_save"];
        },
        super_pwd_txt(){
          return this.is_modify_DefaultPwd?this.lang["i18n_password"]:this.lang["i18n_super_pwd"];
        }
      }
    }
</script>
