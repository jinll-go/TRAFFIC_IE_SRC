<template>
 <div class="main_mid_2">
      <div class="main_con clearfix" style="margin-top: 100px">
  	  <!--标题-->
      <div class="main_con_top"><div class="fl pl10 bold">&nbsp;<label v-tr="i18n_videodownload"><!--录像下载--></label></div></div>
	   <!--内容-->
	   <div class="main_con_mid">
	     <!--
	   <div class="w100 pt5"  >
		  <div class="fl text_right" style="width:20%"><label>&nbsp;</label>:&nbsp;</div>
		  	<div class="fl" style="width:75%">
				<div id="cpy"></div> 
				 <span id="lab_all" style="display:none;"><input type="checkbox" id="cb_all" name="cb1" value="1"  onclick="CheckAllSwitch(this);"  /><label></label></span>

 		  	</div>
		  </div> -->
	  
 	    <div class="w100 pt5">
		  <div class="fl text_right" style="width:20%"><label v-tr="i18n_beginTime"><!--开始时间--></label>:&nbsp;</div>
		  	<div class="fl">
				<select name="start_y"  id="start_y" class="textc"  style="width:65px;" v-model="selected_start_y" :disabled="status == 'start'">
					<option v-for="opt of start_y" :value="opt">{{opt+lang.i18n_suffix_year}}</option>
				</select>

				<select name="start_m"  id="start_m" class="textc"   style="width:45px;" @change="month_change(0)" v-model="selected_start_m" :disabled="status == 'start'">
					<option v-for="opt of start_m"  :value="opt">{{opt+lang.i18n_suffix_month}}</option>
				</select>
	 			
	 			<select name="start_d"  id="start_d" class="textc"  style="width:45px;" v-model="selected_start_d" :disabled="status == 'start'">
	 				<option v-for="opt of start_d"  :value="opt">{{opt+lang.i18n_suffix_day}}</option>
	 			</select>
	   		  	
	   		  	<select name="start_hou" id="start_hou"  class="textc"  style="width:45px;" v-model="selected_start_hour" :disabled="status == 'start'">
	   		  		<option v-for="opt of start_hour"  :value="opt">{{opt+lang.i18n_suffix_hour}}</option>
	   		  	</select>
	 			
	 			<select name="start_min" id="start_min"  class="textc"  style="width:50px;" v-model="selected_start_min" :disabled="status == 'start'">
	 				<option v-for="opt of start_min"  :value="opt">{{opt+lang.i18n_suffix_min}}</option>
	 			</select>
	 			
	 			<select name="start_sec"  id="start_sec" class="textc"  style="width:45px;" v-model="selected_start_sec" :disabled="status == 'start'">
	 				<option v-for="opt of start_sec"  :value="opt">{{opt+lang.i18n_suffix_second}}</option>
	 			</select>
		  	</div>
	     </div>
		 
		  <div class="w100 pt5">
		  <div class="fl text_right" style="width:20%" ><label v-tr="i18n_endTime"><!--结束时间--></label>:&nbsp;</div>
		  	<div class="fl" >
				<select name="end_y"  id="end_y" class="textc"   style="width:65px;" v-model="selected_end_y" :disabled="status == 'start'">
					<option v-for="opt of end_y"  :value="opt">{{opt + lang.i18n_suffix_year}}</option>
				</select>

				<select name="end_m"  id="end_m" class="textc"   style="width:45px;" @change="month_change(1)" v-model="selected_end_m" :disabled="status == 'start'">
					<option v-for="opt of end_m"  :value="opt">{{opt + lang.i18n_suffix_month}}</option>
				</select>
	 			
	 			<select name="end_d"  id="end_d" class="textc"  style="width:45px;" v-model="selected_end_d" :disabled="status == 'start'">
	 				<option v-for="opt of end_d"  :value="opt">{{opt + lang.i18n_suffix_day}}</option>
	 			</select>
	   		  	
	   		  	<select name="end_hou" id="end_hou"  class="textc"  style="width:45px;" v-model="selected_end_hour" :disabled="status == 'start'">
	   		  		<option v-for="opt of end_hour"  :value="opt">{{opt + lang.i18n_suffix_hour}}</option>
	   		  	</select>
	 			
	 			<select name="end_min" id="end_min"  class="textc"  style="width:50px;" v-model="selected_end_min" :disabled="status == 'start'">
	 				<option v-for="opt of end_min"  :value="opt">{{opt + lang.i18n_suffix_min}}</option>
	 			</select>
	 			
	 			<select name="end_sec"  id="end_sec" class="textc"   style="width:45px;" v-model="selected_end_sec" :disabled="status == 'start'">
	 				<option v-for="opt of end_sec"  :value="opt">{{opt + lang.i18n_suffix_second}}</option>
	 			</select>
 		  	</div>
	     </div>
		 
		 <div class="w100 pt5">
		  <div class="fl text_right" style="width:20%">
		    <label v-tr="i18n_backupToPath"><!--备份到--></label>:&nbsp;</div>
		  	<div class="fl" style="width:75%">
		  		<span class="fl" style="width:75%">
		  	  		<input name="txtpath"   id="txtpath" type="text" style="width:305px;background-color:#adadad" size="60" maxlength="20"  readonly="true" :value="$store.getters.localsettings.BackupPath"/>
	  	   		</span>
	  	   	</div>
	     </div>
 		 
		<div class="w100 pt5">
		  	<div class="fl text_right" style="width:20%"><label v-tr="i18n_fileFormat"><!--文件格式--></label>:&nbsp;</div>
		  	<div class="fl" style="width:75%">
				<!--
				<input type="radio" id="rd1"  name="b"   style="display:none"/><label  style="display:none">H264</label>
				<input type="radio" id="rd2"  name="b"   style="display:none" /><label style="display:none">I8</label>
				-->
				<input type="radio" id="rd3"  name="b"  checked="checked" />&nbsp;<label>AVI</label>
			</div>
	    </div>
		 
		<!--
		<div class="w100 pt5"  style="display:none;">
		  <div class="fl text_right" style="width:20%"><label><!--文件大小</label>:&nbsp;</div>
		  	<div class="fl" style="width:75%">&nbsp;
 			 <label id="lblsize">0</label>
			</div>
	    </div>
	    -->
		 
		 
		 <!--
		 <div class="w100 pt5"  >
		  <div class="fl text_right" style="width:20%"><label><!--正在备份通道--</label>:&nbsp;</div>
		  	<div class="fl" style="width:75%">&nbsp;
 			 <label id="lb_notice">0</label>
			</div>
	     </div>
	     -->
		 
		 
		 
		<div class="w100 pt5"  >
		  	<div class="fl text_right" style="width:20%"><label v-tr="i18n_progress"><!--进度--></label>:&nbsp;</div>
		  	<div class="fl" style="width:75%">&nbsp;
			  <label class="percent" >{{$store.getters.download_progress + '%'}}</label>
       	 	</div>
      	</div>
		 
	    <div class="w100 pt10 text_center">
			<button  class="btn1"   style="width:65px;" @click="start" v-tr="i18n_start" :disabled="status == 'start'"></button>
			<button  class="btn1"   style="width:65px;" @click="stop" v-tr="i18n_stop" :disabled="status == 'stop'"></button>
			<!--<button  class="btn1"   style="width:65px;" @click="exit" v-tr="i18n_return"></button>-->
	    </div>
    </div>
	  
	  <!--底部-->
      <div class="main_con_bot"></div>
     </div>
     </div>
</template>
<script>
import Vue from 'vue'
import {rangeArray,current_year,current_month,current_day,getMonthDays} from 'common/util'


var DOWNLOAD_CONTEXT = {
	chooseChkVec:[],
	filetype:"avi",
	streamtype:1
};

//不足n位自动补零
function pad(num) {  
		return (num < 10?("0" + num):num);  
} 
/*************************************************
Function:		DownloadFun
Description:	Download video by time
Input:			 
Output:			
return:			组装好的对象数组				
*************************************************/
function mDownloadFun(cb)
{
	Vue.$auth_http({
		type: "POST",
		url:  addstr+ "/goform/frmFlashVideoQuery",
		data: JSON.stringify({
			Type: 0,
			Ch:0,
			Data:{ 
				Content:DOWNLOAD_CONTEXT.chooseChkVec,
		 		Date:date,
			}
		}),
		dataType: "json",
		error:function(XMLHttpRequest, textStatus, errorThrown){
			//console.log(["error",textStatus].join(" "));
			cb([]);
		},
		success: function(result){
			if(result.Result == 0){
				var data_vec = [];
				var start_vec_nopad = [start_hou,start_min,start_sec];
				var stop_vec_nopad = [end_hou,end_min,end_sec];
				$.each(result.Data.SearchResults,function(idx,el){

					//el = {ch:0,data:[]}
					var obj = Get_ch_videoLength_byTime(el.ChannelNo,[pad(start_y),pad(start_m),pad(start_d)].join(""),start_vec_nopad.slice(0),stop_vec_nopad.slice(0),el.Records,0);
					if(obj.time_length > 0)data_vec.push(obj);

				});
				//操作完成
				cb(data_vec);
			}
		}	
	});	
}

//ch 从0开始
function Get_ch_videoLength_byTime(ch,date,startVec,stopVec,el,streamType){
	var stat = 0;
	var videoLength = 0;
	var hasCheckBothInOne = false;
	var startSecs = startVec[0]*3600 + startVec[1]*60 + startVec[2];
	var stopSecs = stopVec[0]*3600 + stopVec[1]*60 + stopVec[2];
	//判断是否播放线跳入空白
	for (var i = 0,len = el.length;i < len;++i){
				
			var seg0 = el[i];
			if (stat == 0){//find real start
				if ( startSecs <= seg0[1])
				{
					startSecs = Math.max(seg0[1],startSecs);
					stat = 1;
				}else if(startSecs <= seg0[2]){
					startSecs =  Math.min(seg0[2],startSecs);
					stat = 1;
				}else{
					continue;
				}
				
			}
			if(stat == 1){//find stop

				//check stop 是不是不start在同一块
				if (!hasCheckBothInOne)
				{	
					if (stopSecs <= seg0[2])
					{
						videoLength = stopSecs - startSecs;
						stat = 2;
						break;
					}else{
						videoLength = seg0[2] - startSecs;
						hasCheckBothInOne = true;
						continue;
					}
				}

				if (stopSecs < seg0[1])
				{
					//以搜索完毕
					stat = 2;
					break;
				}else if(stopSecs <= seg0[2]){
						videoLength = videoLength + stopSecs - seg0[1];
						stat = 2;
						break;
				}else{
					videoLength = videoLength + seg0[2] - seg0[1];
				}
			}
			
		}

		var h = Math.floor(startSecs/3600);
		var m = Math.floor((startSecs - h*3600)/60);
		var s = startSecs - h*3600 - m*60;

		startVec[0] = pad(h);
		startVec[1] = pad(m);
		startVec[2] = pad(s);

		h = Math.floor(stopSecs/3600);
		m = Math.floor((stopSecs - h*3600)/60);
		s = stopSecs - h*3600 - m*60;
		stopVec[0] = pad(h);
		stopVec[1] = pad(m);
		stopVec[2] = pad(s);





		return {
			"date":date,
			"start":startVec.join(""),
			"stop":stopVec.join(""),
			"ch":ch,
			"filetype":DOWNLOAD_CONTEXT.filetype,
			"time_length":(videoLength<0?0:videoLength)
		};

}








export default {
	name:'CVModalDialogBackup',
	data(){
		let tmp = new Date();
		let _hour = tmp.getHours(); //获取系统时，
		let _min = tmp.getMinutes(); //分
		let _sec = tmp.getSeconds(); //
		return{
			start_y:[current_year],
			start_m:rangeArray(1,12),
			start_d:rangeArray(1,getMonthDays(current_year,current_month - 1)),
			start_hour:rangeArray(0,23),
			start_min:rangeArray(0,59),
			start_sec:rangeArray(0,59),

			end_y:[current_year],
			end_m:rangeArray(1,12),
			end_d:rangeArray(1,getMonthDays(current_year,current_month - 1)),
			end_hour:rangeArray(0,23),
			end_min:rangeArray(0,59),
			end_sec:rangeArray(0,59),


			selected_start_y:current_year,
			selected_start_m:current_month,
			selected_start_d:current_day,
			selected_start_hour:_hour,
			selected_start_min:_min,
			selected_start_sec:_sec,

			selected_end_y:current_year,
			selected_end_m:current_month,
			selected_end_d:current_day,
			selected_end_hour:_hour,
			selected_end_min:_min,
			selected_end_sec:_sec,

		
		
			status:'stop'
		}
	},
	mounted(){
		msg('backup mounted!');

	},
	watch:{
		selected_start_m(newVal){
			this.start_d = rangeArray(1,getMonthDays(this.selected_start_y,newVal - 1));
		},
		selected_end_m(newVal){
			this.end_d = rangeArray(1,getMonthDays(this.selected_end_y,newVal- 1));
		}
	},
	methods:{
		start(){
			let Activex = this.$store.getters.playback_plugin;
			if (Activex) {
				Activex.BackUpStop();


				//
				DOWNLOAD_CONTEXT.chooseChkVec = [1];


				var start_y = parseInt(this.selected_start_y,10);	
				var start_m = parseInt(this.selected_start_m,10);	
				var start_d = parseInt(this.selected_start_d,10);	
				var start_hou = parseInt(this.selected_start_hour,10);	
				var start_min = parseInt(this.selected_start_min,10);	
				var start_sec = parseInt(this.selected_start_sec,10);	
				
				var end_y = parseInt(this.selected_end_y,10);	
				var end_m = parseInt(this.selected_end_m,10);	
				var end_d = parseInt(this.selected_end_d,10);	
				var end_hou = parseInt(this.selected_end_hour,10);	
				var end_min = parseInt(this.selected_end_min,10);	
				var end_sec = parseInt(this.selected_end_sec,10);	


				var d1 = new Date();
				d1.setFullYear(start_y,start_m,start_d);
				d1.setHours(start_hou,start_min,start_sec);
				var d2 = new Date();
				d2.setFullYear(end_y,end_m,end_d);
				d2.setHours(end_hou,end_min,end_sec);
				
				//check date
				if (d1 >= d2) {	
					return; 
				}

				var start_vec = [pad(start_y),pad(start_m),pad(start_d),pad(start_hou),pad(start_min),pad(start_sec)].join("");
				var end_vec = [pad(end_y),pad(end_m),pad(end_d),pad(end_hou),pad(end_min),pad(end_sec)].join("");
				//查询日期 不支持跨天查询
				var date = [start_y,start_m,start_d];
				var startSecs = start_hou*3600 + start_min*60 + start_sec;
				var stopSecs = end_hou*3600 + end_min*60 + end_sec;
				//按照用户请求的start和stop。前端查询录像区间。调整start和stop,并算出这个区间段的真正录像时长



				DOWNLOAD_CONTEXT.filetype = "avi";
				var that = this;
				let callback = function(data_vec){
									
					for (var i = 0,len = data_vec.length; i < len; i++) {
						var obj = data_vec[i];

						if (obj.time_length > 0) {
							Activex.BackUpInit({
								"usrname":that.$store.getters.tokenA,
								"pwd":that.$store.getters.tokenB,
								"file_format":obj.filetype,
								"ip":that.$store.getters.ip,
								"port":that.$store.getters.rtsp_port,
								"ch":obj.ch - 1,
								"stream_type":DOWNLOAD_CONTEXT.streamtype,
								"date":obj.date,
								"start":obj.start,
								"stop":obj.stop,
								"time_length":obj.time_length
							});
						};
					
					}

					if(data_vec.length>0){
						Activex.BackUpStart();
						//IsEnablePage(true);
					}else{
						//alert("在查询区间中所有选择的通道均无录像!");
					}
				};

				this.$store.dispatch('do_history_records_search',{context:this.$store.getters,data:{
						Type: 0,
						Ch:0,
						Data:{ 
							Content:DOWNLOAD_CONTEXT.chooseChkVec,
					 		Date:date,
						}
					}}).then(result=>{


          				if(result.Result == 0){
							var data_vec = [];
							var start_vec_nopad = [start_hou,start_min,start_sec];
							var stop_vec_nopad = [end_hou,end_min,end_sec];
							result.Data.SearchResults.forEach(function(el,idx){

								//el = {ch:0,data:[]}
								var obj = Get_ch_videoLength_byTime(el.ChannelNo,[pad(start_y),pad(start_m),pad(start_d)].join(""),start_vec_nopad.slice(0),stop_vec_nopad.slice(0),el.Records,0);
							//	console.log(obj);
								if(obj.time_length > 0)data_vec.push(obj);

							});
							//操作完成
							callback(data_vec);
						}else{
							callback([]);
						}
				})

			
		
				this.status = 'start';

			}
		},
		stop(){
			let Activex = this.$store.getters.playback_plugin;
			if (Activex) {	Activex.BackUpStop();
				this.status = 'stop';
			}
		}
	},
	computed:{
		
		lang(){
			return this.$store.getters.current_language;
		},
	}

}
</script>
