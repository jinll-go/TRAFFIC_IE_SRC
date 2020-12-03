<template>
 <div class="mask" >
		<div class="main_con clearfix" >
		  <!--标题-->
		<div class="main_con_top"><div class="fl pl10 bold"><label v-tr="i18n_idleOperation"></label></div>
		</div>
		   <!--内容-->
			<div class="main_con_mid">
			<table cellpadding="0" cellspacing="0" width="100%" height="100%" border="0">
				<tr >
					<td>
						<label> {{name}} </label>
						<select id="sel" v-model="index" class="textc">
							<option v-for="opt in num" :value="opt">{{opt}}</option>
						</select>
					</td>
					<td>
						<label v-tr="i18n_idleTime">  </label>
						<select id="idleTime_sel" v-model="idle_time" class="textc">
							<option v-for="opt in 15" :value="opt*60">{{opt}}</option>
						</select>
						<label v-tr="i18n_minitue"></label>
					</td>
				</tr>
			</table>
			
			<div class="w100 pt10 text_center">
				<button  class="btn1"   style="width:88px;" v-tr="i18n_save" @click="save"></button>
				<button  class="btn1"   style="width:88px;" v-tr="i18n_exit" @click="exit"></button>
			</div>
	
			</div>
		<!--底部-->
		<div class="main_con_bot"></div>
		</div>
	</div>


		
</template>

<script>
import Vue from 'vue'
	import Modal from '../../mixin/modal'
	export default {
		name:'CVModalDialogIdle',
		mixins:[Modal],
		data(){
			return {
			
		
			}
		},
		methods:{
		
			save(){
				let type = this.$store.getters.ptzextend.guardpos.Type;
				let that = this;
	 			(async function(){
	 			
		            let ret = await that.$store.dispatch("PTZExtend/IdleOperation",{Type:1,Data:{Index:that.index,IdleTime:that.idle_time,Type:type}});
		            if (ret.Result == 0) {//成功了更新数据
		            	that.$store.commit("PTZExtend/guardpos_changed",{Index:that.index,IdleTime:that.idle_time,Type:type});
		            }
				}());
			}
		},
		computed:{
			num(){
				let val = 0;
				let type = this.$store.getters.ptzextend.guardpos.Type;
				msg(type);
				switch (type) {
					case 0://无动作
						
						break;
					case 1://预置点
                        val = [];
                        let ar = [];

                        if(this.$Param['CVPanelPreset'])
                        {
                            ar = this.$Param['CVPanelPreset'].filterPresetArray || [];
                        }

                        for (var i = 0; i <= 255; i++) {
                            if(!ar.includes(i)){
                                val.push(i);
                            }
                        }
						break;
					case 2://巡航
						val = 8;
						break;
					case 3://轨迹
						val = 4;
						break;
					case 4://两点扫描
						val = 8;
						break;
				}
		
				return val;
			},
			name(){
				
					let name = '';
					let langObj = this.$store.getters.current_language;
					let type = this.$store.getters.ptzextend.guardpos.Type;
					switch (type) {
						case 0://无动作
							name = langObj.i18n_preset;
							break;
						case 1://预置点
							name = langObj.i18n_preset;
							break;
						case 2://巡航
							name = langObj.i18n_cruise;
							break;
						case 3://轨迹
							name = langObj.i18n_track;
							break;
						case 4://两点扫描
							name = langObj.i18n_twoPointScan;
							break;
					}
					return name;
				
			},
      index: {
        get: function () {

          let type = this.$store.getters.ptzextend.guardpos.Type;
          let idx = this.$store.getters.ptzextend.guardpos.Index;
          switch (type) {
            case 0://无动作
              return 0;
              break;
            case 1://预置点
              if (idx >= this.num[0] && idx <= 255) {
                return idx;
              } else {
                return this.num[0];
              }

              break;
            case 2://巡航
              if (idx >= 1 && idx <= 8) {
                return idx;
              } else {
                return 1;
              }
              break;
            case 3://轨迹
              if (idx >= 1 && idx <= 4) {
                return idx;
              } else {
                return 1;
              }
              break;
            case 4://两点扫描
              if (idx >= 1 && idx <= 8) {
                return idx;
              } else {
                return 1;
              }
              break;
            default:
              return 1;
          }
        },
        set: function (v) {
          this.$store.commit("PTZExtend/guardpos_changed", {Index: v});
        }
      },
      idle_time: {
        get: function () {

          let type = this.$store.getters.ptzextend.guardpos.Type;

          let time = this.$store.getters.ptzextend.guardpos.IdleTime;
          msg("idle_time：" + time);
          if (time <= 900 && time >= 60) {
            return time;
          } else {
            return 60;
          }
        },
        set: function (v) {
          this.$store.commit("PTZExtend/guardpos_changed", {IdleTime: v});
        }
      }
    }
  }
</script>
<style scoped>     
    .mask {       
            position: absolute; 
            top: 0px;
          /*  filter: alpha(opacity=60);*/
            background-color: rgba(191,191,191,.7);     
            z-index: 1002;
            left: 0px;     
          /*  opacity:0.5;
            -moz-opacity:0.5;*/    
            width:100%;
            height:100%; 
        }   
table{
		border-bottom:1px solid #666;
		border-left:1px solid #666;
	}
	td{
		border-right:1px solid #666;
		border-top: 1px solid #666;
		text-align:center;
		height: 30px;
	}
</style>  