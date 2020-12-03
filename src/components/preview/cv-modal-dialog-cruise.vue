<template>
 <div class="mask" >
      <div class="main_con clearfix"  id="cruiseModalDiv" >
  			
			<div class="main_con_top" style="height:18px;">
				<div class="fl pl10 bold"><label id="cruise_set" v-tr="i18n_cruiseSet"><!--巡航设置--></label></div>
			</div>
			   <!--内容-->
				<div class="main_con_mid">
				<div id="cont">
					<table class="_table" cellpadding="0" cellspacing="0" width="100%" height="100%" border="0">
						<tr>
							<td class="_td text_center" v-tr="i18n_preset"></td>
						 	<td class="_td text_center" v-tr="i18n_cruiseTime"></td>
						 	<td class="_td text_center" v-tr="i18n_cruiseSpeed"></td>
						 	<td class="_td text_center" v-tr="i18n_operation" v-if="is_fishEye">操作</td>
						</tr>

						<tr v-for="(item,index) of list">
							<!-- <td class="_td text_center" align="center" width="115px"> {{is_fishEye?item.Point:item.PresetNo}} </td> -->
							<td class="_td text_center" align="center" width="115px"> {{GetNum(item)}} </td>
							<!-- <td class="_td text_center" width=155px> {{is_fishEye?item.Delay:item.Dwell }}</td> -->
							<td class="_td text_center" width=155px> {{GetTime(item)}}</td>
							<td class="_td text_center" width=150px> {{item.Speed }}</td>
							<td class="_td text_center" style="cursor:pointer" width=150px v-tr="i18n_del" @click="del(item,index)" v-if="is_fishEye"></td>
						</tr>
			
			</table>
				</div>
				<br />
				<table class="_table" cellpadding="0" cellspacing="0" width="100%" height="100%" border="0">
					<tr>
						<td class="_td text_center" width=115px>&nbsp;
							<label id="cruise_preset" v-tr="i18n_preset"><!--预置点--></label>:&nbsp;
							<select class="textc" id="sel_preset" v-model="cruise_presetno">
								<option :value="opt" v-for="opt in preset_ar">{{opt}}</option>
							</select>
						</td>
						<!-- 鱼眼巡航时间 1-120-->
						<td class="_td text_center" width=155px>&nbsp;
							<label id="cruise_time" v-tr="i18n_cruiseTime"><!--巡航时间--></label>:&nbsp;
							<select class="textc" id="sel_time" v-model="cruise_time">
								<option :value="opt" v-for="opt in is_fishEye?120:255">{{opt}}</option>

							</select>
						</td>
						<!-- 鱼眼巡航速度 1-10 -->
						<td class="_td text_center" width=150px>&nbsp;
							<label id="cruise_speed" v-tr="i18n_cruiseSpeed"><!--巡航速度--></label>:&nbsp;
							<select class="textc" id="sel_speed" v-model="cruise_speed">
								<option :value="opt" v-for="opt in is_fishEye?10:7">{{opt}}</option>
							</select>
						</td>
					</tr>
				</table>
				
				<div class="w100 pt10 text_center">
					<button  :class="button_style"   style="width:88px;" v-tr="i18n_add" @click="add"></button>
					<button  :class="button_style"   style="width:88px;" v-tr="i18n_del" @click="del" v-if="!is_fishEye"></button>
					<button  :class="button_style"   style="width:88px;" v-tr="i18n_exit" @click="exit"></button>
				</div>

			</div>
			<!--底部-->
			<div class="main_con_bot"></div>
	</div>
  </div>
		
</template>

<script>
	import Modal from 'mixin/modal'
	import style from 'mixin/style'
	export default {
		name:'CVModalDialogCruise',
		mixins:[Modal,style],
		data(){
			return {
				list:[],
				cruise_presetno:0, //预置点
				cruise_time:1,  //巡航时间
				cruise_speed:5,  //巡航速度
				is_fishEye:this.$store.getters.factory_info.IsOfFishEye == 'y',
				is_NetHIK:this.$store.getters.factory_info.IsofDome == 'y_ex',//网络球机
			}
		},
		mounted(){
			this.GetInfo();
			if(Array.isArray(this.preset_ar) && this.preset_ar.length > 0){
				this.cruise_presetno = this.preset_ar[0];
			}
			
		},
		methods:{
			GetInfo(){
				var that = this;
				(async function(){
					if(that.$store.getters.factory_info.IsOfFishEye == 'y'){
						let ret = await that.$store.dispatch('request',{
	            		url:"goform/frmFisheyeChanCruise",
	            		Type:0,
	            		Data:{
		            		Route:that.$store.getters.ptz.cruise_path-1,
		            		ChanNum:that.$store.getters.ptz.cur_ch,
	            		}
	            	});
						// msg(["fisheye ret",ret])
	            			if(ret.Result == 0){
	            				that.list = ret.Data.RouteList;
	            			}

						// msg("这是dialog页的FGetInfo");

					}else if(that.is_NetHIK){
						let ret = await that.$store.dispatch("request", {
		                    url: "goform/frmPTZDomePatrolPath",
		                    Type: 0,
		                    Data: {
		                    	PatrolPathIdx:that.$store.getters.ptz.cruise_path,
		                    },
		                });
						if(ret.Result == 0){
							let Result_PatrolPath = ret.Data["PatrolPath"+ that.$store.getters.ptz.cruise_path]
							that.list = [];
							if(Result_PatrolPath.Presets){
								for( var i=0; i <Result_PatrolPath.Presets.length; i++){

									that.list.push({
										PresetIdx:Result_PatrolPath.Presets[i].PresetIdx,
										Delay:Result_PatrolPath.Presets[i].Delay,
										Speed:Result_PatrolPath.Presets[i].Speed
									})
								}
							}
						}
					}else{
						let ret = await that.$store.dispatch('request',{
							url:"goform/frmPTZCruise",
		            		Type:0,
							Data:{
								CruisePath:that.$store.getters.ptz.cruise_path,
							}
						})
						if(ret.Result == 0){
			            	that.$store.commit('PTZ/cruise_list_changed',ret.Data.Cruise);
			            	// msg([ret.Data.Cruise,"ret.Data.Cruise??????????"])
							that.list = ret.Data.Cruise;

			            }
					}

		    	}());
			},
			add(item,index){
				var that = this;
				(async function(){
					if(that.$store.getters.factory_info.IsOfFishEye == 'y'){
						let ret = await that.$store.dispatch('request',{
							url:"goform/frmFisheyeChanCruise",
							Type:1,
			            	Data:{
			            		ChanNum:that.$store.getters.ptz.cur_ch,
			            		OperationType:0,
			            		Route:that.$store.getters.ptz.cruise_path-1, //巡航路径
			            		Point:that.cruise_presetno, //预置点
			            		Delay:that.cruise_time, //巡航时间
			            		Speed:that.cruise_speed , //巡航速度
			            	}
						})
					//	that.list.push({Point:that.cruise_presetno, Delay:that.cruise_time, Speed:that.cruise_speed});

						// msg("这是dialog页的add");
						 if (ret.Result == 0) {

			            	that.GetInfo();
			            }

					}else if(that.is_NetHIK){

						let tmpObj = that.$store.getters.preview_ptz_ability
			            if(tmpObj.MaxPersetNumPrePatrolPath){
			                // msg(["Get_PersetNum",tmpObj.MaxPersetNumPrePatrolPath,that.list.length])

			                if((that.list.length+1) > tmpObj.MaxPersetNumPrePatrolPath){
			                	alert(that.$store.getters.current_language.i18n_cruiseMaxPresetTips1 + `${tmpObj.MaxPersetNumPrePatrolPath}`+ that.$store.getters.current_language.i18n_cruiseMaxPresetTips2)
			                	return;
			                }
			            }

			            that.list.push({
							PresetIdx: that.cruise_presetno,
							Delay: that.cruise_time,
							Speed: that.cruise_speed
						})

						let tmp = {}
						tmp["PatrolPath" + that.$store.getters.ptz.cruise_path]  = {
							Name:"",
							Presets:that.list
						}
						 let ret = await that.$store.dispatch("request", {
		                    url: "goform/frmPTZDomePatrolPath",
		                    Type: 1,
		                    Data: tmp
		                });
					}else{
						 let ret = await that.$store.dispatch('request',{
						 	url:"goform/frmPTZCruise",
		            		Type:1,
		            		Data:{
		            			CruisePath:that.$store.getters.ptz.cruise_path,
		            			PresetNo:that.cruise_presetno,
				            	Dwell:that.cruise_time,
				            	Speed:that.cruise_speed
		            		},

						 })
						 //that.list.push({PresetNo:that.cruise_presetno, Delay:that.cruise_time, Speed:that.cruise_speed});
						  if (ret.Result == 0) {
			            	that.GetInfo();
			            }
					}

		            // 	"PTZ/Cruise",{CruisePath:that.$store.getters.ptz.cruise_path,
		            // 	Type:1,
		            // 	PresetNo:that.cruise_presetno,
		            // 	Dwell:that.cruise_time,
		            // 	Speed:that.cruise_speed
		            // }
		            //

		    	}());
			},
			del(item,index){
				var that = this;
				(async function(){
					if(that.$store.getters.factory_info.IsOfFishEye == 'y'){
						let ret = await that.$store.dispatch('request',{
			            	url:"goform/frmFisheyeChanCruise",
			            	Type:3,
			            	Data:{
			            		ChanNum:that.$store.getters.ptz.cur_ch,
			            		OperationType:1,
			            		Route:that.$store.getters.ptz.cruise_path-1,
			            		Index:index,
			            	
			            	}
		        		});

		        		// msg("这是dialog页的Del");
		        		if (ret.Result == 0) {
			            	that.GetInfo();
			            }
					}else if(that.is_NetHIK){
						let tmp = {}
						let newItem = that.list.slice(0,that.list.length-1);
						tmp["PatrolPath" + that.$store.getters.ptz.cruise_path]  = {
							Name:"",
							Presets:newItem
						}
						let ret = await that.$store.dispatch('request',{
			            	url:"goform/frmPTZDomePatrolPath",
			            	Type:1,
			            	Data:tmp
		        		});
		        		if (ret.Result == 0) {
			            	that.GetInfo();
			            }

					}else{
						let ret = await that.$store.dispatch('request',{
							url:"goform/frmPTZCruise",
							Type:2,
							Data:{
								// point:that.cruise_presetno,
				            	// ChanNum:that.$store.getters.ptz.cur_ch,
				            	// DeleteType:1,
				            	CruisePath:that.$store.getters.ptz.cruise_path,
				            	CruiseItemNo:that.list.length
							}
						})
						if (ret.Result == 0) {
			            	that.GetInfo();
			            }
					}

		            	// "PTZ/Cruise",{
		            	// point:this.cruise_presetno,
		            	// ChanNum:1,
		            	// DeleteType:1,
		            	// Route:that.$store.getters.ptz.cruise_path,
		            	// Type:2,
		            	// CruiseItemNo:that.list.length

		    	}());
			},

			GetNum(item){
				if(this.is_NetHIK){
					return item.PresetIdx
				}else if(this.is_fishEye){
					return item.Point;
				}else{
					return item.PresetNo;
				}
			},

			GetTime(item){

				if(this.is_NetHIK){
					return item.Delay;
				}else if(this.is_fishEye){
					return item.Delay;
				}else{
					return item.Dwell;
				}
			}
		},
		computed:{
			list(){
				return this.$store.getters.ptz.cruise_list;
			},
			preset_ar(){
				let ar = [];
	            if (this.$Param["CVPanelPreset"]) {
	                ar = this.$Param["CVPanelPreset"].filterPresetArray || [];
	            }


	            // msg(ar);
	            let vec = [];
	            for (var i = 0; i <= 255; i++) {
	                if (!ar.includes(i)) {
	                     vec.push(i);
	                }
	            }
	           return vec;
			}
		}

	}

</script>
