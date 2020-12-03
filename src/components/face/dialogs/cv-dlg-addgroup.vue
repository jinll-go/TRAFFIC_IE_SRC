<template>
    <div style="padding: 10px">
        <table class="_table" cellpadding="0" cellspacing="0" style="width:100%">
			<!---
            <tr>
                <td class="_td text_center p5" style="width: 30%;">
                    <label v-tr="i18n_status"></label>
                </td>
                <td class="_td text_center p5" style="width: 70%">
                    <input type="checkbox" v-model="CommonDB.Enable" />
                    <label v-tr="i18n_enableFtp"></label>
                </td>
            </tr>
			--->
            <tr>
                <td class="_td text_center p5"><label v-tr="i18n_GroupName"></label></td>
                <td class="_td text_center p5">
                    <input type="text" class="textc" style="width: 140px" v-model="CommonDB.TargetName" v-validator:NOVOID:StrLength="[1, 32]" />
                </td>
            </tr>
            <tr>
                <td class="_td text_center p5"><label v-tr="i18n_GroupType"></label></td>
                <td class="_td text_center p5">
                    <select class="textc" v-model="CommonDB.TargetType" style="width: 140px">
                        <!--<option :value="0" v-tr="i18n_ResOther"></option>-->
                        <option :value="1" v-tr="i18n_whitelist"></option>
                        <option :value="2" v-tr="i18n_blacklist"></option>
						<option :value="4" v-tr="i18n_visitlist"></option>
                    </select>
                </td>
            </tr>
			<!---
            <tr>
                <td class="_td text_center p5"><label v-tr="i18n_SimilarityThreshold"></label></td>
                <td class="_td text_center p5">
                    <input class="textc" v-model="CommonDB.Similarity" style="width: 140px" v-validator:NOVOID:Number="[0, 100]" />
                </td>
            </tr>
			--->
            <tr>
                <td class="_td text_center p5" colspan="2">
                    <button :class="button_style" @click="save" v-tr="i18n_save" :disabled="save_disabled" style="width: 88px"></button>
                </td>
            </tr>
        </table>
    </div>
</template>

<script>
import style from 'mixin/style';

export default {
	name: 'CVDialogFaceAddGroup',
	mixins: [style],
	inject: ['popup'],
	data() {
		return {
			CommonDB: {},
			save_disabled: false,
			tempdata: {},
		};
	},
	mounted() {
		this.tempdata = this.popup.extradata.TargetName; //修改前的组名保存起来
		this.CommonDB = this.popup.extradata;
	},

	methods: {
		hide() {
			this.popup.visible = false;
		},
		save() {
			if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
				this.$notify.error(this.lang['i18n_checkinput']);
				return;
			}

			if (this.CommonDB.TargetName.trim().length == 0) {
				this.$notify.error(this.lang['i18n_targetName_error']);
				return;
			}
			if (this.CommonDB.TargetName.includes(' ')) {
				this.$notify.error(this.lang['i18n_faceGroupNamewarn']);
				return;
			}
			this.save_disabled = true;
			this.$loading.show = true;
			let data = {
				Type: this.CommonDB.submit_type,
				Ch: 1,
				Data: {
					Enable: this.CommonDB.Enable ? 1 : 0,
					TargetType: this.CommonDB.TargetType,
					Similarity: parseInt(this.CommonDB.Similarity),
				},
			};
			if (this.CommonDB.submit_type == 2) {
				//修改
				/* data.Data.TargetName = this.$store.getters.Face.DialogFaceDB.TargetName;
				data.Data.NewTargetName = this.CommonDB.TargetName; //修改后的组名 */

				data.Data.TargetName = this.tempdata;
				data.Data.NewTargetName = this.CommonDB.TargetName; //修改后的组名
			} else {
				data.Data.TargetName = this.CommonDB.TargetName;
			}
			this.$store.dispatch('request', $.extend(true, { url: 'goform/frmFaceDatabase' }, data)).then((_) => {
				this.save_disabled = false;
				this.$loading.show = false;
				if (_.Result == -655365) {
					this.$store.dispatch('config_no_right');
				} else {
					if (_.Result == 0) {
						// this.$store.commit('face/fresh_facedatalist', true); //刷新人脸数据库列表
						this.popup.refreshAddGroupList = true;
						// this.$store.commit('temp_face/refreshAddGroupList', true);
						this.popup.visible = false;
						this.$notify.success(this.lang['i18n_saveok']);
					} else if (_.Result == -17) {
						this.$notify.error(this.lang['i18n_FaceGroupExist']);
					} else {
						this.$notify.error(this.lang['i18n_savefailed']);
					}
				}
			});
		},
		/*   trans_Type(type, option) {
                let str = '';
                let lang = this.lang;
                if (option) {
                    switch (type) {
                        case 0:
                            str = lang.i18n_ResOther;
                            break;
                        case 1:
                            str = lang.i18n_whitelist;
                            break;
                        case 2:
                            str = lang.i18n_blacklist;
                            break;
                    }
                } else {
                    str = type ? lang.i18n_yes : lang.i18n_no;
                }
                return str;
            },*/
	},
};
</script>
