<template>
	<div class="main_con clearfix">
    <div class="main_con_top">
        <div class="fl pl10 bold">
            <label v-tr="i18n_linkType"></label>
        </div>
    </div>

    <div class="main_con_mid">
        <div class="w100 pt1">
            <table width="100%" border="0" cellpadding="2" cellspacing="1">
                <!--  -->
                <tr>
                    <td  valign="top">
                        <table width="100%" border="0" cellspacing="0" cellpadding="5">
                            <tr>
                                <td  align="left">
                                  <label v-tr="i18n_Weekday" ></label>&nbsp;:
                                        <select id="start_wd" class="textc" style="width: 100px;" v-model="weekdayidx">
                                    <option :value="0" v-tr="i18n_Monday"></option>
                                    <option :value="1" v-tr="i18n_Tusday"></option>
                                    <option :value="2" v-tr="i18n_Wenday"></option>
                                    <option :value="3" v-tr="i18n_Thusday"></option>
                                    <option :value="4" v-tr="i18n_Friday"></option>
                                    <option :value="5" v-tr="i18n_Satday"></option>
                                    <option :value="6" v-tr="i18n_Sunday"></option>
                                  </select>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>

                <!--  -->
                <tr>
                    <td valign="top" class="td_bg" >
                        &nbsp;&nbsp;<label v-tr="i18n_ArmSchedule"><!----></label>
                    </td>
                </tr>

                <!--  -->
                <tr>
                    <td>
                            <CVConfigSection type="SECTION_EIGHT" v-model="alarmtime" :weekday="weekdayidx" :disabled="false"></CVConfigSection>
                    </td>

                </tr>

                <tr v-show="ui_custom.linkAll.visible">
                        <td valign="top" class="td_bg">&nbsp;&nbsp;<label v-tr="i18n_linkType"></label></td>
                </tr>

                    <CVConfigPTZLinkType
                                     name="alarmin"
                        :disabled="false"
                                     v-show="ui_custom.linkAll.visible"
                                     :linktype_email="ui_custom.upload_email.visible"
                                     :linktype_snap="ui_custom.snap.visible"
                                     :linktype_record="ui_custom.link_record.visible"
                                     :linktype_alarmout="ui_custom.alarmout.visible"
                                     :linktype_ptz="ui_custom.ptz.visible"
                                     :linktype_ftp="ui_custom.ftp.visible"
                                     :linktype_http="ui_custom.http.visible"
                                     :linktype_audio="ui_custom.link_audio.visible"
                                     :linktype_wiegand="ui_custom.link_wiegand.visible"
                        v-model="linktype"
                ></CVConfigPTZLinkType>
            </table>
        </div>

        <div class="w100 pt10 text_center" style="position:relative">
            <button :class="button_style" style="width:88px;" v-tr="i18n_save" @click="save()"></button>
        </div>
    </div>

    <div class="main_con_bot"></div>
  </div>
</template>

<script>
    import sections from 'mixin/sections';
    import linktype from 'mixin/linktype';
    import style from 'mixin/style';

	export default{
        name: 'CVConfigLinkSet',
        mixins: [style, sections, linktype],
		data(){
            return {};

		},
    mounted(){
      this.load_data();
    },
		methods:{
      load_data(){
                this.$store
                    .dispatch('request', {
                        url: 'goform/frmDetectLinkPara',
        Type:0,
                        Data: { DetectLinkType: 10, AlarmTimeType: 1 },
                    })
                    .then((r) => {
        if(r.Result == -655365){
          this.$store.commit('errorCode/change',0);
                            this.$store.commit('face/FaceIndex', 'CVConfigMsg');
        }else{
          if (r.Result == 0){
         //  msg(["linkset",r.Data])
                                this.alarmtime = r.Data.AlarmTime;
                                // this.$store.commit('facedetect/areatype', 0);

            // this.$store.commit('linktype/data_change',r.Data);
                                this.linktype = r.Data;
                                window.toastr.success(this.lang['i18n_getok']);
          }else{
                                window.toastr.error(this.lang['i18n_getfailed']);
          }
        }
                    });
      },

      save(){
                if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                    this.$notify.error(this.lang['i18n_checkinput']);
                    return;
          }
                let time_sections = this.alarmtime;

                this.$store
                    .dispatch('request', {
                        url: 'goform/frmDetectLinkPara',
              Type:1,
                        Data: $.extend(true, { DetectLinkType: 10, AlarmTimeType: 1 }, this.linktype, { AlarmTime: time_sections }),
                    })
                    .then((r) => {
              if(r.Result == -655365){
                this.$store.commit('errorCode/change',0);
                            this.$store.commit('face/FaceIndex', 'CVConfigMsg');
              }else{
                if(r.Result == 0){
                                this.$notify.success(this.lang['i18n_saveok']);
                }else {
                                this.$notify.error(this.lang['i18n_savefailed']);
                }
              }
                    });
            },
        },
    };
</script>



