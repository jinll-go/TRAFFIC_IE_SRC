<template>
  <div class="main_con clearfix" style="margin-top:100px;">

    <div class="main_con_top"><div class="fl pl10 bold"><label v-tr="i18n_switchOpen"></label></div></div>

    <div class="main_con_mid">


      <div class="w100 pt5">
        <div class="fl text_right" style="width:25%"><label v-tr="i18n_enable">{{}}</label>:&nbsp;</div>
        <div class="fl" style="width:75%">
          <input type="checkbox" v-model="d.SwitchOpenEnable"/>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:25%"><label v-tr="i18n_aiValidType">{{}}</label>:&nbsp;</div>
        <div class="fl" style="width:75%">
          <select class="textc" style="width: 200px;" v-model="d.SwitchHighValid" :disabled="!d.SwitchOpenEnable">
						<option :value="0" v-tr="i18n_aiLowLevel"></option>
            <option :value="1" v-tr="i18n_aiHighLevel"></option>
          </select>
        </div>
      </div>

      <div class="w100 pt5">
        <div class="fl text_right" style="width:25%"><label v-tr="i18n_aiIndex">{{}}</label>:&nbsp;</div>
        <div class="fl" style="width:75%">
          <select class="textc" style="width: 200px;" v-model="d.SwitchOpenPin" :disabled="!d.SwitchOpenEnable">
            <option :value="count - 1" v-for="count in aiNum" >{{count}}</option> 

          </select>
        </div>
      </div>

      <div class="w100 pt10 text_center" style="position:relative">
        <button :class="button_style" v-tr="i18n_save" @click="save()">{{}}</button>
      </div>
    </div>

    <div class="main_con_bot"></div>
  </div>
</template>

<script>
  import style from "mixin/style"
  export default {
    name: 'CVConfigSwitchOpen',
    mixins:[style],
    data(){
      return{
        aiNum:2,
        d:{}
      }
    },
    mounted(){
      this.get_aiNum();
      this.$store.dispatch("request",{url:"goform/frmTrafficControl",Type:6,Data:{}}).then(r=>{
        if(r.Result == -655365){
          this.$store.dispatch('config_no_right');
        }else {
          if(r.Result == 0){
            this.d = r.Data;
            this.$notify.success(this.$store.getters.current_language["i18n_getok"]);
          }else {
            this.$notify.error(this.$store.getters.current_language["i18n_getfailed"]);
          }
        }
      });
    },
    methods:{
      get_aiNum(){
        this.$store.dispatch('request', {url:"goform/frmDevicePara",Type:0,Data:{}}).then(r=>{
          if(r.Result == 0){
            this.aiNum = r.Data.AlarmInPortNum;
          }else{
            this.aiNum = 0;
          }
        });
      },
      save(){
        if(this.$el.innerHTML.indexOf("input_check_error")>0){
          this.$notify.error(this.$store.getters.current_language["i18n_checkinput"]);return;
        }
        this.d.SwitchOpenEnable = this.d.SwitchOpenEnable?1:0;
        this.$store.dispatch('request',{url:"goform/frmTrafficControl",Type:7,Data:this.d}).then(_=>{
          if(_.Result == 0){
            this.$notify.success(this.$store.getters.current_language["i18n_saveok"]);
          }else if(_.Result == -655365){
            this.$store.dispatch('config_no_right');
          }else {
            this.$notify.error(this.$store.getters.current_language["i18n_savefailed"]);
          }
        });
      }
    }
  }
</script>
