/*
不同风格组件的共有的样式
 */


export default {

	computed:{
		button_style(){
			let obj = null;
			if(this.$store.getters.is_tyconew || this.$store.getters.is_dongshun){
				obj = {
					'ui-button':true,
					'ui-widget':true,
					'ui-state-default':true,
					'ui-corner-all':true,
					'ui-button-text-only':true,
				}
			}else{
				obj = {
					'btn1':true,
					'btn2':false
				}
			}
			return obj;
		},

	}

}