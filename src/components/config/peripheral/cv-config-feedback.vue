 <template>
    <div class="main_con clearfix" style="margin-top:100px;">

    <div class="main_con_top"><div class="fl pl10 bold"><label v-tr="i18n_FeedBackConfig"></label></div></div>
    <div class="main_con_mid">

        <!-- 报警输入 -->
        <div class="w100 pt5">
            <div class="fl text_right" style="width:30%"><label v-tr="i18n_GateAlarmIn"></label>:&nbsp;</div>
            <div class="fl" style="width:70%">
                <select style="width:200px;" class="textc" id="selNI" v-model="IOIndex">
                    <option v-for="AlarmIn in PortNum.AlarmIn" :value="AlarmIn - 1">{{ 'in' + (AlarmIn) }}</option>
                </select>
            </div>
        </div>

        <!-- 生效类型 -->
        <div class="w100 pt5">
            <div class="fl text_right" style="width:30%"><label v-tr="i18n_VaildType"></label>:&nbsp;</div>
            <div class="fl" style="width:70%">
                <select type="text" class="textc" v-model="HighLevelValid" style="width:200px;">
                    <option :value="1" v-tr="i18n_HighPin"></option>
                    <option :value="0" v-tr="i18n_LowPin"></option>
                </select>
            </div>
        </div>

        <!-- 门磁超时时间 -->
        <div class="w100 pt5">
            <div class="fl text_right" style="width:30%"><label v-tr="i18n_OverTimeAlarmMs"></label>:&nbsp;</div>
            <div class="fl" style="width:70%">
                <input type="text" v-model="OverTimeAlarmMs" class="textc" style="width:150px;" v-validator:NameLength :disabled ="!OverTimeAlarmEnable" />
                <span class="fl" style="width:70%"> </span>
                <label v-tr="i18n_OverTimeAlarmMsEnable"></label>:&nbsp;
                <input type="checkbox" style="vertical-align:middle" :width="30" v-model="OverTimeAlarmEnable" />&nbsp;
            </div>
        </div>

        <!-- 未授权开门报警 -->
        <div class="w100 pt5">
            <div class="fl text_right" style="width:30%"><label v-tr="i18n_UnauthOpenWarning"></label>:&nbsp;</div>
            <div class="fl" style="width:70%">
                <input type="checkbox" style="vertical-align:middle" :width="190" v-model="AccessUnauthAlarmEnable" />&nbsp;
            </div>
		</div>

        <!-- 保存 -->
        <div class="w100 pt10 text_center">
            <button :class="button_style" v-tr="i18n_save" @click="save"></button>
        </div>

    </div>

    <div class="main_con_bot"></div>
  </div>
</template>

<script>
    import Vue from 'vue';
    import style from 'mixin/style';
    export default {
		name: 'CVConfigFeedBack',
		mixins: [style],
		data() {
			return {
                PortNum:{
                    AlarmOut : 0,             
                    AlarmIn : 0,
                },
                IOIndex: 0,
                HighLevelValid: 0,
                OverTimeAlarmEnable: 0,
                OverTimeAlarmMs: 0,
                AccessUnauthAlarmEnable: 0,
            }
        },   
        mounted() { 
            Promise.all([
                    this.$store.dispatch('request', { url: 'goform/frmWiegand', ch: 1, Type: 6, Data: {} }),
                    this.$store.dispatch('request', { url: 'goform/frmDevicePara', ch: 1, Type: 0, Data: {} }),
                ]).then((r) => {
                    msg('r[0].Result = ', r[0].Result);
                    if(r[0].Result == 0)
                    {
                        msg('r[0].Result.Data.GateOpenType = ', r[0].Data.IOIndex);
                        msg('r[0].Result.Data.WiegandRangeStart = ', r[0].Data.HighLevelValid);
                        msg('r[0].Result.Data.WiegandRangeEnd = ', r[0].Data.OverTimeAlarmEnable);
                        msg('r[0].Result.Data.WiegandCommonID = ', r[0].Data.OverTimeAlarmMs);
                        msg('r[0].Result.Data.LinkIO = ', r[0].Data.AccessUnauthAlarmEnable);

                        this.IOIndex = r[0].Data.IOIndex;
                        this.HighLevelValid = r[0].Data.HighLevelValid;
                        this.OverTimeAlarmEnable = r[0].Data.OverTimeAlarmEnable;
                        this.OverTimeAlarmMs = r[0].Data.OverTimeAlarmMs;
                        this.AccessUnauthAlarmEnable = r[0].Data.AccessUnauthAlarmEnable;
                    }

                    if(r[1].Result == 0)
                    {
                        this.PortNum.AlarmIn = r[1].Data.AlarmInPortNum;
                        this.PortNum.AlarmOut = r[1].Data.AlarmOutPortNum;
                    }
            }).catch((error) => {
                    msg('Get version info failed!!');
            });
        },		
        computed: {
			
		},
		methods: {
			save() {
                msg('btnsave');
                msg('btnsave');
                msg('btnsave');
                msg('btnsave');
                msg('btnsave');
				if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
					this.$notify.error(this.$store.getters.current_language['i18n_checkinput']);
					return;
                }

                Promise.all([
                    this.$store.dispatch('request', { url: 'goform/frmWiegand', ch: 1, Type: 7, Data: {
                                                                                                        IOIndex: this.IOIndex,
                                                                                                        HighLevelValid: this.HighLevelValid,
                                                                                                        OverTimeAlarmEnable: this.OverTimeAlarmEnable,
                                                                                                        OverTimeAlarmMs: this.OverTimeAlarmMs,
                                                                                                        AccessUnauthAlarmEnable: this.AccessUnauthAlarmEnable} }),
				]).then((r) => {
					if (r[0].Result != 0 || r[1].Result != 0) {
						this.$store.dispatch('config_no_right');
					} 
			    });
            }
        }
    };
</script>