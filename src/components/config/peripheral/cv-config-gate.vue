<template>
    <div class="main_con clearfix" style="margin-top:100px;">

    <div class="main_con_top"><div class="fl pl10 bold"><label v-tr="i18n_GateConfig"></label></div></div>
    <div class="main_con_mid">
        <div class="w100 pt5">
            <div class="fl text_right" style="width:30%"><label v-tr="i18n_AuthMethod"></label>:&nbsp;</div>
            <div class="fl" style="width:70%">
                <!-- <input type="text" v-model="GateOpenType" class="textc" style="width:200px;" v-validator:NameLength />
                <span class="fl" style="width:70%"> </span> -->
                <select type="text" class="textc" v-model="AuthMode" style="width:200px;">
                    <option :value="0" v-tr="i18n_AuthMethodServer"></option>
                    <option :value="1" v-tr="i18n_AuthMethodLocal"></option>
                    <option :value="2" v-tr="i18n_AuthMethodAuto"></option>
                </select>
            </div>
		</div>
        <div class="w100 pt5" >
            <div class="fl text_right" style="width:30%"><label v-tr="i18n_ControlInterface"></label>:&nbsp;</div>
            <div class="fl" style="width:70%">
                <!-- <input type="text" v-model="ControlMode" class="textc" style="width:200px;" v-validator:NameLength />
                <span class="fl" style="width:70%"> </span> -->
                    <select type="text" class="textc" v-model="GateOpenType" style="width:200px;">
                    <option :value="0" v-tr="i18n_ControlIo"></option>
                    <option :value="1" v-tr="i18n_ControlWiegand"></option>
                </select>
            </div>
		</div>

        <div v-if="GateOpenType == 1">
            <div class="w100 pt5" >
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_PublicCardNum"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="PublicCardNum" class="textc" style="width:200px;" v-validator:NameLength />
                    <span class="fl" style="width:70%"> </span>
                </div>
            </div>
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_CardRange"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="CardRangeMin" class="textc" style="width:90px;" v-validator:NameLength />
                    &nbsp;<label>-</label>&nbsp;
                    <input type="text" v-model="CardRangeMax" class="textc" style="width:90px;" v-validator:NameLength />
                </div>
            </div>
        </div>


        <div v-if="GateOpenType == 0">
            <!-- 继电器编号 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_ControlIoNo"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                        <select style="width:200px;" class="textc" id="selNI" v-model="FeedBackInIndex"> <!--v-model="d_cap.current_index"-->
                        <option v-for="AlarmOut in PortNum.AlarmOut" :value="AlarmOut - 1">{{ 'out' + (AlarmOut) }}</option>
                    </select>
                </div>
            </div>
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_IODelayTimeMs"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="IODelayTimeMs" class="textc" style="width:200px;" v-validator:NameLength />
                    <span class="fl" style="width:70%"> </span>
                    <label>(500 - 60000ms)</label> 
                </div>
            </div>
        </div>


        <div class="w100 pt5">
            <div class="fl text_right" style="width:30%"><label v-tr="i18n_GateOpeningMode"></label>:&nbsp;</div>
            <div class="fl" style="width:70%">
                <!-- <input type="text" v-model="OpenMode" class="textc" style="width:200px;" v-validator:NameLength />
                <span class="fl" style="width:70%"> </span> -->

                <select type="text" class="textc" v-model="OpenMode" style="width:200px;">
                    <option :value="0" v-tr="i18n_OpenModeFace"></option>
                    <option :value="1" v-tr="i18n_OpenModeCard"></option>
                    <option :value="2" v-tr="i18n_OpenModeFaceAndCard"></option>
                    <option :value="3" v-tr="i18n_OpenModeFaceOrCard"></option>
                    <option :value="4" v-tr="i18n_OpenModeIdentity"></option>
                    <option :value="5" v-tr="i18n_OpenModeFaceAndIdentity"></option>
                    <option :value="6" v-tr="i18n_OpenModeFaceOrIdentity"></option>
                    <option :value="7" v-tr="i18n_OpenModeNothing"></option>
                    <option :value="8" v-tr="i18n_OpenModeHealthCode"></option>
                    <option :value="9" v-tr="i18n_OpenModeGrpCtl"></option>
                    <option :value="10" v-tr="i18n_OpenModeCardOrNothing"></option>
                </select>
            </div>
		</div>

        <div v-if="this.PortNum.AlarmIn > 0">
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_OpenFeedBack"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <div class="fl" style="width:70%">
                        <input type="checkbox" style="vertical-align:middle" :width="190" v-model="FeedBackEnable" />&nbsp;
                    </div>
                </div>
            </div>

            <!-- 报警输入 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_GateAlarmIn"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <select style="width:200px;" class="textc" id="selNI" v-model="FeedBackIOIndex" :disabled ="!FeedBackEnable">
                        <option v-for="AlarmIn in PortNum.AlarmIn" :value="AlarmIn - 1">{{ 'in' + (AlarmIn) }}</option>
                    </select>
                </div>
            </div>

            <!-- 生效类型 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_VaildType"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <select type="text" class="textc" v-model="FeedBackHighLevelValid" style="width:200px;" :disabled ='!FeedBackEnable'>
                        <option :value="1" v-tr="i18n_HighPin"></option>
                        <option :value="0" v-tr="i18n_LowPin"></option>
                    </select>
                </div>
            </div>

            <!-- 等待时间 -->
            <div class="w100 pt5">
                <div class="fl text_right" style="width:30%"><label v-tr="i18n_WaitTime"></label>:&nbsp;</div>
                <div class="fl" style="width:70%">
                    <input type="text" v-model="FeedBackIODelayTimeMs" class="textc" style="width:200px;" v-validator:NameLength  :disabled ='!FeedBackEnable' />
                    <span class="fl" style="width:70%"> </span>
                    <label>(ms)</label>
                </div>
            </div>
        </div>

        <div class="w100 pt5">
            <div class="fl text_right" style="width:30%"><label v-tr="i18n_AutoIdentity"></label>:&nbsp;</div>
            <div class="fl" style="width:70%">
                <input type="checkbox" style="vertical-align:middle" :width="190" v-model="enable_auth" />&nbsp;
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
		name: 'CVConfigGate',
		mixins: [style],
		data() {
			return {
                AuthMode: 0,
                GateOpenType: 0,
                PublicCardNum: 0,
                CardRangeMin: 0,
                CardRangeMax:999999,
                OpenMode: 0,
                RegisterIDCard: 0,
                LinkIO: {
                    num : 0,
                },
                IODelayTimeMs: 0,
                FeedBackInIndex: 0,
                AlarmInPortNum: 0,
                AlarmOutPortNum: 0,
                PortNum:{
                    AlarmIn: 0,
                    AlarmOut: 0,
                },

                FeedBackEnable: 0,
                FeedBackIOIndex: 0,

                FeedBackIODelayTimeMs: 0, //等待时间
                FeedBackHighLevelValid: 0,
            }
        },   
        mounted() { 
            Promise.all([
                    this.$store.dispatch('request', { url: 'goform/frmWiegand', ch: 1, Type: 2, Data: {} }),
                    this.$store.dispatch('request', { url: 'goform/frmTrafficControl', ch: 1, Type: 0, Data: {} }),
                    this.$store.dispatch('request', { url: 'goform/frmDevicePara', ch: 1, Type: 0, Data: {} }),
                    this.$store.dispatch('request', { url: 'goform/frmWiegand', ch: 1, Type: 4, Data: {} }),
                ]).then((r) => {
                    if(r[0].Result == 0)
                    {
                        this.GateOpenType = r[0].Data.GateOpenType;
                        this.CardRangeMin = r[0].Data.WiegandRangeStart;
                        this.CardRangeMax = r[0].Data.WiegandRangeEnd;
                        this.PublicCardNum = r[0].Data.WiegandCommonID;
                        this.LinkIO.num = r[0].Data.LinkIO;
                        this.FeedBackInIndex = r[0].Data.IOIndex;
                        this.IODelayTimeMs = r[0].Data.IODelayTimeMs;
                        this.AuthMode = r[0].Data.AuthMode;
                        this.RegisterIDCard = r[0].Data.RegisterIDCard;
                    }

                    if(r[1].Result == 0)
                    {
                        this.OpenMode = r[1].Data.TrafficCtlType;
                    }

                    if(r[2].Result == 0)
                    {
                        this.PortNum.AlarmIn = r[2].Data.AlarmInPortNum;
                        this.PortNum.AlarmOut = r[2].Data.AlarmOutPortNum;
                    }

                    if(r[3].Result == 0)
                    {
                        this.FeedBackEnable = r[3].Data.Enable;
                        this.IOIndex = r[3].Data.IOIndex;
                        this.FeedBackIODelayTimeMs = r[3].Data.IODelayTimeMs;
                        this.FeedBackHighLevelValid = r[3].Data.HighLevelValid;
                    }
            }).catch((error) => {
                    msg('Get version info failed!!');
            });
        },		
        computed: {
			
		},
		methods: {
			save() {
				if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
					this.$notify.error(this.$store.getters.current_language['i18n_checkinput']);
					return;
                }

                Promise.all([
					this.$store.dispatch('request', { url: 'goform/frmWiegand', ch: 1, Type: 3, Data: {
                                                                                                        GateOpenType: this.GateOpenType,
                                                                                                        WiegandRangeStart: this.CardRangeMin,
                                                                                                        WiegandRangeEnd: this.CardRangeMax,
                                                                                                        WiegandCommonID: this.PublicCardNum,
                                                                                                        LinkIO: this.LinkIO.num,
                                                                                                        IOIndex: this.IOIndex,
                                                                                                        IODelayTimeMs: this.IODelayTimeMs,
                                                                                                        RegisterIDCard: this.RegisterIDCard} }),

                    this.$store.dispatch('request', { url: 'goform/frmTrafficControl', ch: 1, Type: 1, Data: {TrafficCtlType: this.OpenMode} }),
                    
                    this.$store.dispatch('request', { url: 'goform/frmWiegand', ch: 1, Type: 5, Data: {Enable: this.FeedBackEnable,
                                                                                                       IOIndex: this.IOIndex,
                                                                                                       IODelayTimeMs: this.FeedBackIODelayTimeMs,
                                                                                                       HighLevelValid: this.FeedBackHighLevelValid
                                                                                                        } }),
				]).then((r) => {
					if (r[0].Result != 0 || r[1].Result != 0) {
						this.$store.dispatch('config_no_right');
					} else {
						if (r[0].Result == 0 && r[1].Result == 0) {
							this.$notify.success(this.$store.getters.current_language['i18n_saveok']);
						} else {
							this.$notify.error(this.$store.getters.current_language['i18n_savefailed']);
						}
                    }
			    });
            }
        }
    };
</script>