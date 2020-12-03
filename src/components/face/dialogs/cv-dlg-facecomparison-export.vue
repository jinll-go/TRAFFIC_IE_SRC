<template>

        <div style="padding: 10px">
            <div class="tab-content" >
                    <div style="vertical-align: middle;text-align: center;border:1px solid gray;height:320px;">
                        <div class="w100" style="padding-top:60px;" v-show="plugin_type == 'ie'">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_ExportDir"></label>:&nbsp;</div>
                            <div class="fl" style="width:60%;text-align: left">
                                <input type="text" class="textc" v-model="export_dir" style="width: 140px;" readonly="readonly" />
                                <button @click="choose_dir" :class="button_style" style="width:100px;" v-tr="i18n_Browse"><!--浏览--></button>
                            </div>
                        </div>

                        <div class="w100" style="padding-top:20px;" v-show="plugin_type == 'ie'">
                            <div class="fl text_right" style="width:40%"><label v-tr="i18n_ExportFile"></label>:&nbsp;</div>
                            <div class="fl" style="width:60%;text-align: left">
                                <input type="text" style="width: 140px" v-model="export_file" class="w100 textc" />
                                <label>.xlsx</label>
                            </div>
                        </div>

                        <div class="w100 text_center" style="padding-top:20px;">
                            <button @click="start_export" :class="button_style" style="width:100px;" v-tr="i18n_Export"><!--导出--></button>
                        </div>
                        <div class="w100 pt10 text_center">
                            <label>{{ this.popup.ExportMsg }}</label>
                        </div>
                    </div>
                </div>



        </div>
</template>

<script>
import style from 'mixin/style';
export default {
	name: 'CVDialogFacecomparisonExport',
	mixins: [style],
	inject: ['popup'],
	data() {
		return {
			export_dir: '',
			export_file: '',
		};
	},
	methods: {
		hide() {
			if (this.popup.isExport) {
				if (confirm(this.lang['i18n_CancelExport'])) {
					this.popup.isExport = false;
					// this.$store.commit('face/isExport', false);
				} else {
					return;
				}
			}
			this.popup.visible = false;
		},
		choose_dir() {
			if (this.popup.isExport) return;
			this.export_dir = '';

			let plugin = this.$store.getters.config_plugin;

			if (plugin) {
				this.export_dir = plugin.OpenFileDialog({ OpenMode: 0 });
				msg('choose dir:' + this.export_dir);
			}
		},
		start_export() {
			if (this.plugin_type == 'ie') {
				if (this.export_dir.length == 0 || this.export_file.trim().length == 0) {
					this.$notify.error(this.lang['i18n_ExportError']);
					return;
				}
				this.popup.ExportPath = `${this.export_dir}\\${this.export_file}.xlsx`;
				// this.$store.commit('face/ExportPath', `${this.export_dir}\\${this.export_file}.xlsx`);
			} else {
				this.popup.ExportPath = `${this.lang.i18n_FaceComparison}_${new Date().format('yyyyMMdd_hhmmss')}.xlsx`;
				// this.$store.commit('face/ExportPath', `${this.lang.i18n_FaceComparison}_${new Date().format('yyyyMMdd_hhmmss')}.xlsx`);
			}
			this.popup.isExport = true;
			// this.$store.commit('face/isExport', true);
		},
	},
};
</script>
