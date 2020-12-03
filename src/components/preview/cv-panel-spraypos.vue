
<template>
   
    <div class="w100 pt2" name="position3d" id="SprayPos">
		<div name="ptz" class="flc"><label v-tr="i18n_sprayPos"><!--喷淋位置:--></label></div>
		<div class="fl pl5" >
			<button  id="btnSprayPosSet" class="btn1"   style="width:60px;" v-tr="i18n_set" @click="set"></button>
		</div>
		<div class="fl pl5" >
			<button  id="btnSprayPosDel" class="btn1"   style="width:60px;" v-tr="i18n_del" @click="del"></button>
		</div>
 	</div>

</template>

<script>
export default {
	name: 'CVSprayPos',
	data() {
		return {};
	},

	methods: {
		set() {
			let that = this;
			(async function() {
				let ret = await that.$store.dispatch('PTZExtend/SprayPos', { Code: 0 });
			})();
		},
		del() {
			let that = this;
			(async function() {
				let ret = await that.$store.dispatch('PTZExtend/SprayPos', { Code: 1 });
			})();
		},
	},
};
</script>
