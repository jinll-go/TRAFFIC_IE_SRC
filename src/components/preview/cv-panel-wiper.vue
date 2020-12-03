
<template>
   		<div class="w100 pt2" name="position3d" id="Wiper">
        <div name="ptz" class="flc "><label v-tr="i18n_wiper"></label></div>
        <div class="fl ">
				<button  id="btnWiperOpen" class="btn1"   style="width:60px;" v-tr="i18n_open" @click="enable(1)"></button>
			</div>
        <div class="fl ">
				<button  id="btnWiperClose" class="btn1"   style="width:60px;" v-tr="i18n_close" @click="enable(0)"></button>
			</div>
 		</div>

</template>

<script>




export default {
	name:'CVPanelWiper',
 	data(){
            return {};
 			
 	},
 	methods:{
 		enable(flg){
 			let that = this;
 			(async function(){
                    let ret = await that.$store.dispatch('PTZExtend/Wiper', { Enable: flg });
                })();
            },
        },

    };
    
</script>



