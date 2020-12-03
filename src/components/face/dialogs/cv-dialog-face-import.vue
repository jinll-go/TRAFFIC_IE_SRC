<template>
	<div style="padding: 10px">
		<CVConfigTabTemp></CVConfigTabTemp>
	</div>

</template>
<script>
import CVConfigTabTemp from 'components/face/cv-config-tab';
export default {
	name: 'CVDialogFaceImport',
	inject: ['popup'],
	data() {
		return {};
	},
	methods: {
		hide() {
			if (this.popup.isBatchImporting) {
				if (confirm(this.lang['i18n_CancelImport'])) {
					this.popup.isBatchImporting = false;
					// this.$store.commit('face/isBatchImporting', false);
					if (this.$store.getters.Face.isNeedEnableFace) {
						this.$store.dispatch('request', { url: 'goform/frmVideoFaceDetectV2', Type: 1, Data: { Enable: 1 } });
						this.$store.commit('face/isNeedEnableFace', false);
					}
				} else {
					return;
				}
			}
			this.popup.refreshQueryList = true;
			// this.popup.refreshQueryList = true
			// this.$store.commit('temp_face/fresh_QueryList', true);
			this.popup.visible = false;
		},
	},
	components: {
		CVConfigTabTemp,
	},
};
</script>
