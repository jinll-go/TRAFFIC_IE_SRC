
<template>
   
   	<div class="w100 pt2" name="disSection" id="dofIr">
        <div name="ptz" class="flc">
            <label v-tr="i18n_irLightCtrl"><!--红外补光--></label>
        </div>
        <div class="fl">
		  <select name="select3" id="irMode_sel" class="textc" style="width:40px;" v-model="ir_mode">
            <option :value="0" v-tr="i18n_auto"><!--自动--></option>
            <option :value="1" v-tr="i18n_mannual"><!--手动--></option>
          </select>
		</div>
        <div class="fl pl3">
		  <select name="select5" id="irLight_sel" class="textc" style="width:80px;" v-model="light_idx" :disabled="ir_mode == 0">
            <option :value="0" v-tr="i18n_irAllClosed" v-if="ui_custom.AllClosed.visible"><!--红外灯全关--></option>
            <option :value="1" v-tr="i18n_irNearOpen" v-if="ui_custom.NOpen.visible"><!--近灯开--></option>
            <option :value="2" v-tr="i18n_irMiddleOpen" v-if="ui_custom.MOpen.visible"><!--中灯开--></option>
            <option :value="3" v-tr="i18n_irNMOpen" v-if="ui_custom.NMOpen.visible"><!--近中灯开--></option>
            <option :value="4" v-tr="i18n_irFarOpen" v-if="ui_custom.FOpen.visible"><!--远灯开--></option>
            <option :value="5" v-tr="i18n_irFNOpen" v-if="ui_custom.FNOpen.visible"><!--近远灯开--></option>
            <option :value="6" v-tr="i18n_irMFOpen" v-if="ui_custom.MFOpen.visible"><!--中远灯开--></option>
            <option :value="7" v-tr="i18n_irAllOpen" v-if="ui_custom.AllOpen.visible"><!--红外灯全开--></option>
          </select>
		</div>
  		</div>
		  

</template>

<script>
export default {
	name: 'CVIRLightControl',
	data() {
		return {};
	},
	mounted() {
		// 		console.log("CVIRLightControl Mounted!");
		let that = this;
		(async function() {
			let ret = await that.$store.dispatch('PTZExtend/IrLightCtrl', { Type: 0 });
		})();
	},
	computed: {
		ir_mode: {
			get: function() {
				return this.$store.getters.ptzextend.IrLightCtrl.Mode;
			},
			set: function(v) {
				let that = this;
				(async function() {
					let ret = await that.$store.dispatch('PTZExtend/IrLightCtrl', { Type: 1, Mode: v, Lighting: that.light_idx });
					if (ret.Result == 0) {
						that.$store.commit('PTZExtend/irlightctrl_changed', { Mode: v });
					}
				})();
			},
		},

		light_idx: {
			get: function() {
				return this.$store.getters.ptzextend.IrLightCtrl.Lighting;
			},
			set: function(v) {
				let that = this;

				(async function() {
					let ret = await that.$store.dispatch('PTZExtend/IrLightCtrl', { Type: 1, Mode: that.ir_mode, Lighting: v });
					if (ret.Result == 0) {
						that.$store.commit('PTZExtend/irlightctrl_changed', { Lighting: v });
					}
				})();
			},
		},
	},
};
</script>

