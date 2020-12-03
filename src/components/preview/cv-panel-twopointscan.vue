
<template>
   
    	<div class="w100 pt2" id="divScan">
		<div name="ptz" class="flc"><label v-tr="i18n_twoPointScan">两点扫描</label></div>
        <div class="fl ">
		  <select name="Scan" id="ScanSelect" class="textc" style="width:40px;" v-model="SetScanIndex">
		  	<option v-for="opt in 8" :value="opt" >{{opt}}</option>
		  </select>
		  </div>
        <div class="fl pl5">
            <a onfocus="this.blur()">
                <img src="static/images/35.png" name="Image591" width="20" height="20" border="0" id="Image591" :title="lang.i18n_set" @click="set"
            /></a>
			</div>
        <!--<div class="fl " style="display:none"><a   onfocus="this.blur()">
				<img src="static/images/36.png" name="Image622" width="20" height="20" border="0" id="Image622" title="停止编辑" /></a>
			</div>-->
        <div class="fl pl5">
            <a onfocus="this.blur()">
                <img src="static/images/15.png" name="Image581" width="20" height="20" border="0" id="Image581" :title="lang.i18n_call" @click="call"
            /></a>
			</div>
		  </div>	  

</template>

<script>
import Vue from 'vue';

export default {
	name: 'CVTwoPointScan',
	data() {
		return {};
	},

	methods: {
		set() {
			//背景iframe弹出层 iframe全屏会遮挡住 视频区域 firefox下无此问题
			this.$store.commit('preview/dialog_changed', 'SETSCAN');
			/*if(this.head_dialog){
 				this.head_dialog.$destroy();
 				this.head_dialog = null;
 			}
 			this.head_dialog = new Vue({el:".mask",store:this.$store,render:h=>h(CVModalDialogHead)});
 			this.head_dialog.opened = true;*/

			let that = this;
			(async function() {
				let ret = await that.$store.dispatch('PTZExtend/SetScan', { Index: that.SetScanIndex, Type: 0 });
			})();
		},
		call() {
			let that = this;
			(async function() {
				let ret = await that.$store.dispatch('PTZExtend/SetScan', { Index: that.SetScanIndex, Type: 2 });
			})();
		},
	},
	computed: {
		lang() {
			return this.$store.getters.current_language;
		},
		SetScanIndex: {
			get: function() {
				return this.$store.getters.ptzextend.SetScanIndex;
			},
			set: function(v) {
				this.$store.commit('PTZExtend/setscan_index_changed', v);
			},
		},
	},
};
</script>


