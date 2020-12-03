<template>
	<div>
		<tabs :style="{ width: width, 'padding-top': '100px', 'padding-left': '100px' }" :tabs="subtabs"  @changed="tabChanged">
			<!-- tab :name="$store.getters.current_language.i18n_faceFailRecord">
				<CVConfigEigenvalue></CVConfigEigenvalue>
			</tab>
			<tab :name="$store.getters.current_language.i18n_faceBatch_modify">
				<CVConfigFaceBatchModify></CVConfigFaceBatchModify>
			</tab> -->
			<template v-slot:mainfrm="slotProps">
				<div :is='slotProps.activeTabHash'></div>
			</template>
		</tabs>
	</div>
</template>

<script>
import style from 'mixin/style';
import repos_plugin from 'mixin/repos_plugin';
import CVConfigEigenvalue from 'components/face/cv-config-Eigenvalue.vue';
import CVConfigFaceBatchModify from 'components/face/cv-config-face-batch-modify.vue';

	export default {
	name: 'CVConfigEigenvalueTab',
		mixins: [style, repos_plugin],
		data() {
			return {
			flag: false,
			subtabs: [
				{
					isActive: true,
					isDisabled: false,
					isVisible: true,
					hash: 'CVConfigEigenvalue',
					header: this.$store.getters.current_language.i18n_faceFailRecord,
				},
				{
					isActive: true,
					isDisabled: false,
					isVisible: true,
					hash: 'CVConfigFaceBatchModify',
					header: this.$store.getters.current_language.i18n_faceBatch_modify,
				},
			],
			};
		},
		mounted() {},
		methods: {
			tabChanged(info) {
			// msg(['tabChanged', info.tab.hash]);
			if (info.tab.hash == 'CVConfigEigenvalue') {
					this.flag = true;
				} else {
					this.flag = false;
				}
		},
		},
		computed: {
			width() {
			return this.flag ? '1300px' : '50%';
		},
		},
		components: {
			CVConfigEigenvalue,
		CVConfigFaceBatchModify,
	},
	};
</script>
