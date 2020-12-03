
<template>
   
 		<div class="w100 pt2" name="position3d" id="SprayMode">
		<div name="ptz" class="flc"><label v-tr="i18n_sprayMode"><!--喷淋模式:--></label></div>
		<div class="fl" >
		<button  id="btnSprayModeAuto" class="btn1"    style="width:60px;" v-tr="i18n_auto" @click="auto"></button>
		</div>
		<div class="fl pl5" >
		<button  id="btnSprayModeManual" class="btn1"    style="width:60px;" v-tr="i18n_mannual" @click="mannual"></button>
		</div>
 		</div>
</template>

<script>
export default {
	name: 'CVSprayMode',
	data() {
		return {};
	},
	methods: {
		auto() {
			let that = this;
			(async function() {
				let ret = await that.$store.dispatch('PTZExtend/SprayMode', { Code: 0 });
			})();
		},
		mannual() {
			let that = this;
			(async function() {
				let ret = await that.$store.dispatch('PTZExtend/SprayMode', { Code: 1 });
			})();
		},
	},
};
</script>
