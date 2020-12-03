<template>
    <div class=" clearfix" style="width:1200px;padding-top: 95px; padding-left: 20px;margin:0 auto;">
        <div class="main_con_top_face">
            <div class="fl pl10 bold">
                <label v-tr="i18n_FaceComparison"><!-- 记录查询 --></label>
            </div>
        </div>

        <div class="main_con_mid_face">
            <div>
                <table style="width: 100%">
                    <tr>
                        <td><label v-tr="i18n_beginTime"></label>:</td>
                        <td>
                            <input class="textc" ref="start_time" name="starttime" :value="starttime" @click="show_calendar" readonly="readonly" />
                        </td>
                        <td><label v-tr="i18n_endTime"></label>:</td>
                        <td>
                            <input class="textc" ref="end_time" name="endtime" :value="endtime" @click="show_calendar" readonly="readonly" />
                        </td>

			<td>
				<label  v-tr="i18n_Auth"></label>
				<input type="checkbox" style="vertical-align:middle" :width="190" v-model="enable_auth" />&nbsp;
			</td>

			<td>
				<label  v-tr="i18n_NotAuth"></label>
				<input type="checkbox" style="vertical-align:middle" :width="190" v-model="enable_unauth" />&nbsp;
			</td>

                        <td><label v-tr="i18n_QueryCondition"></label>:</td>
                        <td>
                            <select type="text" class="textc" v-model="query_type">
                                <option :value="0" v-tr="i18n_UnconditionalQuery"></option>
                                <option :value="1" v-tr="i18n_FaceID"></option>
                                <option :value="2" v-tr="i18n_FaceSearchFace"></option>
                                <option :value="3" v-tr="i18n_GroupType"></option>
				<option :value="4" v-tr="i18n_PassType"></option>
				<option :value="7" v-tr="i18n_FaceName"></option>
                            </select>
                        </td>
                        <td style="width: 120px">
                            <button :class="button_style" style="width: 88px" @click="btn_query" :disabled="query_disabled" v-tr="i18n_query"></button>
                        </td>
                        <!-- <td style="width: 100px" v-show="ui_custom.face_export.visible"> -->
						<td style="width: 100px" v-show="true">
                            <button :class="button_style" style="width: 88px" @click="btn_export" v-show="list.length" v-tr="i18n_Export"></button>
                        </td>
                    </tr>
                    <tr v-if="query_type == 1">
                        <td><label v-tr="i18n_FaceID"></label>:</td>
                        <td><input type="text" class="textc" v-model="FaceID" /></td>

			<td><label  v-tr="i18n_FuzzyQuery"></label>:</td>
			<td><input type="checkbox" style="vertical-align:middle" :width="190" v-model="enable_fuzzy_query" /></td>

                        <!-- <td><label v-tr="i18n_SimilarityThreshold"></label>:</td>
                        <td><input type="text" class="textc" v-model="Similarity" v-validator:NOVOID:Number="[0, 100]" /></td> -->
                    </tr>
                    <tr v-if="query_type == 2">
                        <td><label v-tr="i18n_FaceSearchFace"></label>:</td>

                        <td v-if="plugin_type !='h5'">
                            <input type="text" class="textc" v-model="img_path" readonly="readonly" />
                            <button :class="button_style" v-tr="i18n_browse" @click="getImageData"></button>
                        </td>


						<td v-if="plugin_type=='h5'">
							<input type="text" class="textc" v-model="img_path" readonly="readonly"/>
							<input type="file" id="selfilecmp" style="display: none" @change="h5_getImageData" accept=".jpg, .jpeg">
                			<label :class="button_style" style="display:inline-block; width:88px;height:24px; margin:0;" for="selfilecmp" v-tr="i18n_browse"></label>
						</td>



                        <td><label v-tr="i18n_SimilarityThreshold"></label>:</td>
                        <td><input type="text" class="textc" v-model="Similarity" v-validator:NOVOID:Number="[0, 100]" /></td>


                    </tr>
                    <tr v-if="query_type == 3">
                        <td><label v-tr="i18n_GroupType"></label>:</td>
                        <td colspan="3">
                            <!--<input type="checkbox" id="other" name="listtype" :value="0" v-model="list_type_other"/>-->
                            <!--<label for="other" v-tr="i18n_ResOther"></label>&nbsp;&nbsp;-->
                            <input type="checkbox" id="whitelist" name="listtype" :value="1" v-model="list_type_whitelist" />
                            <label for="whitelist" v-tr="i18n_whitelist"></label>&nbsp;&nbsp;
                            <input type="checkbox" id="blacklist" name="listtype" :value="2" v-model="list_type_blacklist" />
                            <label for="blacklist" v-tr="i18n_blacklist"></label>
			    <input type="checkbox" id="visitlist" name="listtype" :value="2" v-model="list_type_visitlist" />
                            <label for="visitlist" v-tr="i18n_visitlist"></label>
                        </td>
                    </tr>
		   <tr v-if="query_type == 4">
			<td><label v-tr="i18n_PassType"></label>:</td>
			<td colspan="4">
                            <input type="checkbox" id="facePass" name="passtype" :value="0" v-model="pass_type_face" />
                            <label for="facePass" v-tr="i18n_facepass"></label>&nbsp;&nbsp;
                            <input type="checkbox" id="CardPass" name="passtype" :value="1" v-model="pass_type_card" />
                            <label for="CardPass" v-tr="i18n_PassCard"></label>&nbsp;&nbsp;
							<input type="checkbox" id="IDCard" name="passtype" :value="2" v-model="pass_type_ID_card" />
                            <label for="IDCard" v-tr="i18n_IDCard"></label>&nbsp;&nbsp;
							<input type="checkbox" id="AdminPass" name="passtype" :value="3" v-model="pass_type_admin" />
                            <label for="AdminPass" v-tr="i18n_AdminPass"></label>&nbsp;&nbsp;
							<input type="checkbox" id="Stranger" name="passtype" :value="4" v-model="pass_type_stranger" />
                            <label for="Stranger" v-tr="i18n_Stranger"></label>&nbsp;&nbsp;
                        </td>
					</tr>
                    <tr v-if="query_type == 7">
                        <td><label v-tr="i18n_FaceName"></label>:</td>
                        <td><input type="text" class="textc" v-model="FaceName" /></td>
                        <td><label  v-tr="i18n_FuzzyQuery"></label>:</td>
						<td><input type="checkbox" style="vertical-align:middle" :width="190" v-model="enable_fuzzy_query" /></td>
                    </tr>
                    <tr v-if="query_type == 0">
                        <!-- <td><label v-tr="i18n_ComparisonResult"></label>:</td>
                        <td colspan="3">
                            <input type="radio" id="ComparisonAll" name="querytype" :value="0" v-model="QueryMode" />
                            <label for="ComparisonAll" v-tr="i18n_all"></label>&nbsp;&nbsp;
                            <input type="radio" id="ComparisonSuccess" name="querytype" :value="1" v-model="QueryMode" />
                            <label for="ComparisonSuccess" v-tr="i18n_ComparisonSuccess"></label>&nbsp;&nbsp;
                            <input type="radio" id="ComparisonFailed" name="querytype" :value="2" v-model="QueryMode" />
                            <label for="ComparisonFailed" v-tr="i18n_ComparisonFailed"></label>
                        </td> -->
                    </tr>
                </table>
            </div>
            <div class="w100">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" class="_table">
                    <tr>
                        <!-- <th class="_th text_center" style="width: 5%"><label v-tr="i18n_NO"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_Time"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_FaceModel"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_GroupName"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_GroupType"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_Name"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_FaceID"></label></th>
                        <th class="_th text_center" style="width: 15%"><label v-tr="i18n_Pic"></label></th>
                        <th class="_th text_center" style="width: 10%"><label v-tr="i18n_operation"></label></th> -->

			<th class="_th text_center" style="width: 5%"><label v-tr="i18n_NO"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_Pic"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_Model"></label></th>
			<th class="_th text_center" style="width: 5%"><label v-tr="i18n_Similarity"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_Time"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_PassType"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_Auth"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_FaceID"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_Name"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_Description"></label></th>
			<th class="_th text_center" style="width: 10%"><label v-tr="i18n_GroupName"></label></th>
                    </tr>
                    <tr v-for="(item, idx) in list" :key="idx">
                        <td class="_td text_center">
                            <label>{{ Offset + (idx + 1) }}</label>
                        </td>
                        <td class="_td text_center">
                            <label><img style="height: 126px;width: auto;" :src="'data:image/jpeg;base64,' + item.FaceData"/></label>
                        </td>
						<td class="_td text_center">
                            <label><img style="height: 126px;width: auto;" :src="ShowTargetFace(item.TargetFaceData)"/></label>
							<!-- <label><img style="height: 126px;width: auto;" :src="'data:image/jpeg;base64,' + that.$store.getters.ip  + '//' + item.TargetFaceData"/></label> -->
                        </td>
						<td class="_td text_center">
                            <label>{{ item.SimilarityPicture }}</label>
                        </td>
						<td class="_td text_center">
                            <label>{{ item.Time }}</label>
                        </td>
						<td class="_td text_center">
                            <!-- <label>{{ item.TrafficType }}</label> -->
							<label>{{ transTrafficType(item.TrafficType) }}</label>
                        </td>
						<td class="_td text_center">
                            <label>{{ transAuthType(item.AuthTraffic) }}</label>
                        </td>
						<td class="_td text_center">
                            <label>{{ item.Id }}</label>
                        </td>
						<td class="_td text_center">
                            <label>{{ item.Name }}</label>
                        </td>
						<td class="_td text_center">
                            <label>{{ item.Describe }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ item.TargetName }}</label>
                        </td>
                        <!-- <td class="_td text_center">
                            <label>{{ Offset + (idx + 1) }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ item.Time }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ trans_Type(item.Target) }}</label>
                        </td>
                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{ item.TargetName }}</label>
                        </td>
                        <td class="_td text_center">
                            <label>{{ trans_Type(item.TargetType, 'TargetType') }}</label>
                        </td>
                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{ item.Name }}</label>
                        </td>
                        <td class="_td text_center" style="word-break: break-all">
                            <label>{{ item.Id }}</label>
                        </td>
                        <td class="_td text_center">
                            <label><img style="height: 126px;width: auto;" :src="'data:image/jpeg;base64,' + item.FaceData"/></label>
                        </td>
                        <td class="_td text_center">
                            <a @click="list_detail(item)" v-tr="i18n_Detail"></a>
                        </td> -->
                    </tr>
                    <tr v-if="list.length == 0">
                        <td class="_td text_center" width="100%" height="24" align="right" colspan="11">
                            <div style="width:60%;margin: 5px auto 5px auto;text-align:center;" v-tr="i18n_no_result"></div>
                        </td>
                    </tr>
                </table>

                <CVFootMenu ref="footmenu" :foot="foot"  @pagechanged="pagechanged"></CVFootMenu>
            </div>
            <div class="w100 pt10 text_center">
                <label style="color:red;" v-tr="i18n_faceComparisonNote"></label>
            </div>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import style from 'mixin/style';
import history_records from 'mixin/compare-records/comparison_records';
import export_excel from 'mixin/compare-records/export_excel';
import { basename } from 'common/util';
export default {
	name: 'CVIndexFaceComparison',
	mixins: [style, history_records, export_excel],
	inject: ['popup'],
	data() {
		return {
			Similarity: 0,
			FaceID: '',
			FaceName: '',
			query_type: 0,
			img_path: '',
			img_data: '',
			list_type: 0,
			pass_type: 0,
			auth_type: 3,
			fuzzy_query: 0,
			foot: {
				logitemcount: 0,
				totalpages: 1,
				current_page: 1,
				name: 'frmTrafficPeople',
			},

			QueryMode: 0,
		};
	},

	mounted() {
		// this.$store.commit('face/isExport', false);
		this.popup.isExport = false;

	},
	methods: {
		pagechanged(n){
this.Num = 10;
			this.Offset = (n - 1) * this.Num;
			this.foot.current_page = n;
			//  this.getData();
			this.getQueryResult(1);
		},
		btn_export() {
			this.popup.dialogmode = 'CVDialogFacecomparisonExport';
			// this.popup.extradata = item;
			this.popup.visible = true;
			this.popup.ExportMsg = '';

			/*  this.$store.commit('face/isShowDialog', true);
                this.$store.commit('face/DialogMode', 'facecomparison_export');
                this.$store.commit('face/ExportMsg', ''); */
		},
		start_export() {

			let autorun = async function() {
				let plugin = this.$store.getters.config_plugin;

				let header_types = [
					{
						name: this.lang.i18n_capture,
						type_id: 3,
					},
					{
						name: this.lang.i18n_FaceModelPic,
						type_id: 3,
					},
					{
						name: this.lang.i18n_Time,
						type_id: 2,
					},
					{
						name: this.lang.i18n_Face_Similary,
						type_id: 0,
					},
					{
						name: this.lang.i18n_Name,
						type_id: 2,
					},
					{
						name: this.lang.i18n_Describe,
						type_id: 2,
					},
					{
						name: this.lang.i18n_FaceID,
						type_id: 2,
					},
				];
				let filepath = this.popup.ExportPath;
				let plugin_handle = this.create_wb(plugin, filepath, header_types);
				if (plugin_handle <= 0) return;

				this.Offset = 0;
				this.Num = 10;
				while (1) {
					if (this.Offset >= this.foot.logitemcount) {
						msg('export ok!!');
						this.save_wb(plugin, filepath, plugin_handle);
						this.popup.isExport = false;
						// this.$store.commit('face/isExport', false);
						this.popup.ExportMsg = this.lang['i18n_AllIsDone'];
						// this.$store.commit('face/ExportMsg', this.lang['i18n_AllIsDone']);
						return;
					}
					if (!this.popup.isExport) {
						msg('export break!!');
						this.save_wb(plugin, filepath, plugin_handle);
						return;
					}
					msg(['offset', this.Offset]);
					this.popup.ExportMsg = `${this.Offset} / ${this.foot.logitemcount}`;
					// this.$store.commit('face/ExportMsg', `${this.Offset} / ${this.foot.logitemcount}`);

					let r;
					try {
						let data = { Type: 6, Ch: 1, Data: { ResultHandle: this.handle, Offset: this.Offset, Num: this.Num } };
						r = await this.$store.dispatch(
							'request',
							$.extend(
								true,
								{
									url: 'goform/frmTrafficPeople',
								},
								data,
							),
						);
					} catch (e) {
						await this.sleep(20000);
						continue;
					}

					if (r.Result == 0) {
						let data_list = [];
						r.Data.FaceResults.forEach((item) => {
							data_list.push([
								'data:image/jpeg;base64,' + item.FaceData,
								// src = "http://" +this.$store.getters.ip  + '/' + item.TargetFaceData,
								// 'data:image/jpeg;base64,' + this.getPicData2( this.ShowTargetFace(item.TargetFaceData)),
								this.ShowTargetFace(item.TargetFaceData),
								item.Time,
								item.TargetSimilarity,
								item.Name,
								item.Describe,
								item.FaceId,
							]);
						});
						//  msg(["data_list",data_list,data_list.length])
						this.addrows(plugin, { handle: plugin_handle, data: data_list });
					} else if (r.Result == -6) {
						try {
							let result_handle = await this.$store.dispatch(
								'request',
								$.extend(
									true,
									{
										url: 'goform/frmTrafficPeople',
									},
									this.query_data,
								),
							);

							if (result_handle.Result == 0) {
								this.handle = result_handle.Data.ResultHandle;
								while (1) {
									let result_progress = await this.$store.dispatch('request', {
										url: 'goform/frmTrafficPeople',
										Type: 4,
										Ch: 1,
										Data: { ResultHandle: this.handle },
									});
									if (result_progress.Result == 0) {
										if (result_progress.Data.TotalSearchNum > result_progress.Data.CurrentSearchNum) {
										} else {
											this.foot.logitemcount = result_progress.Data.MatchNum;
											break;
										}
									}
								}
								continue;
							}
						} catch (e) {
							await this.sleep(20000);
							continue;
						}
					}
					this.Offset += this.Num;
				}
			}.bind(this);
			autorun();
		},                    
		queryRecords() {
			/*    if (this.$el.innerHTML.indexOf('input_check_error') > 0) {
                        this.$notify.error(this.lang['i18n_checkinput']);
                    return;
                }
    */		
   			if (this.auth_type == 0){
				this.$notify.error(this.lang['i18n_AuthTypeFailed']);	
				return;   	
			}
			if (this.query_type == 1) {
				if (this.FaceID.trim().length == 0) {
					this.$notify.error(this.lang['i18n_FaceIdFailed']);
					return;
				}
			}
			if (this.query_type == 2) {
				if (this.img_path.trim().length == 0) {
					this.$notify.error(this.lang['i18n_faceImport_single_select_picture']);
					return;
				}
			}
			if (this.query_type == 3) {
				if (this.list_type == 0) {
					this.$notify.error(this.lang['i18n_chooseGroupType']);
					return;
				}
			}
			if (this.query_type == 4) {	
				if(this.pass_type == 0){
					this.$notify.error(this.lang['i18n_choosePassType']);
					return;
				}
			}
			let start_t = this.date_trans(this.starttime);
			let end_t = this.date_trans(this.endtime);

			this.query_data = { Type: this.query_type, Ch: 1, Data: {Channels: [1], BeginDateTime: start_t, EndDateTime: end_t, IsOpen: this.auth_type,  SreachNum: 1000, IsTimeIncrease:0} };
			switch (this.query_type) {
				case 0:
					this.query_data.Data.QueryMode = this.QueryMode;
					break;
				case 1:
					this.query_data.Data.Id = this.FaceID;
					// this.query_data.Data.Similarity = parseInt(this.Similarity);
					this.query_data.Data.FuzzySearch = this.fuzzy_query;
					break;
				case 2:
					this.query_data.Data.FaceData = this.img_data; //imgbase64
					this.query_data.Data.Similarity = parseInt(this.Similarity);
					break;
				case 3:
					this.query_data.Data.SearchType = this.list_type;
					break;
				case 4:
					this.query_data.Data.TrafficType = this.pass_type;
					break;
				case 7:
					this.query_data.Data.Name = this.FaceName;
					this.query_data.Data.FuzzySearch = this.fuzzy_query;
					break;
				default:
					break;
			}
			this.query();
		},

		list_detail(item) {
			this.popup.dialogmode = 'CVDialogFacecomparisonDetail';
			this.popup.extradata = item;
			this.popup.visible = true;
		},
		trans_Type(type, option) {
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
		},
		ShowTargetFace(facedata) {
				return "http://" +this.$store.getters.ip  + '/' + facedata;
		},
		transTrafficType(type){
			let str = '';
			let lang = this.lang;
			switch(type){
				case 0:
					str = lang.i18n_facepass;
				break;
				case 1:
					str = lang.i18n_PassCard;
				break;
				case 2:
					str = lang.i18n_IDCard;
				break;
				case 3:
					str = lang.i18n_AdminPass;
				break;
				case 6:
					str = lang.i18n_Stranger;
				break;
				default:
				break;
			}
			return str;
		},
		transAuthType (type){
			let str = '';
			let lang = this.lang;
			switch(type){
				case 0:
					str = lang.i18n_NotAuth;
				break;
				case 1:
					str = lang.i18n_Auth;
				break;
				default:
				break;
			}
			return str;
		}
	},
	computed: {
		isExport() {
			return this.popup.isExport;
		},
		height() {
			return this.$parent.height ? this.$parent.height : this.$store.getters.content_rect.height + 'px';
		},
		list_type_other: {
			get: function() {
				return this.list_type & 0x01 ? true : false;
			},
			set: function(v) {
				if (v) {
					this.list_type |= 0x01;
				} else {
					this.list_type &= ~0x01;
				}
			},
		},
		list_type_whitelist: {
			get: function() {
				return (this.list_type >> 1) & 0x01 ? true : false;
			},
			set: function(v) {
				if (v) {
					this.list_type |= 0x02;
				} else {
					this.list_type &= ~0x02;
				}
			},
		},
		list_type_blacklist: {
			get: function() {
				return (this.list_type >> 2) & 0x01 ? true : false;
			},
			set: function(v) {
				if (v) {
					this.list_type |= 0x04;
				} else {
					this.list_type &= ~0x04;
				}
			},
		},
		list_type_visitlist:{
			get: function() {
				return (this.list_type >> 4) & 0x01 ? true : false;
			},
			set: function(v) {
				if (v) {
					this.list_type |= 0x10;
				} else {
					this.list_type &= ~0x10;
				}
			},
		},
		pass_type_face:{
			get: function(){
				return (this.pass_type >> 0) & 0x01 ? true : false;
			},
			set: function(v){
				if (v) {
					this.pass_type |= 0x01;
				} else {
					this.pass_type &= ~0x01;
				}
			}
		},
		pass_type_card:{
			get: function(){
				return (this.pass_type >> 1) & 0x01 ? true : false;
			},
			set: function(v){
				if(v){
					this.pass_type |= 0x02;
				}else{
					this.pass_type &= ~0x02;
				}
			}
		},
		pass_type_ID_card:{
			get: function(){
				return (this.pass_type >> 2) & 0x01 ? true : false;
			},
			set: function(v){
				if(v){
					this.pass_type |= 0x04;
				}else{
					this.pass_type &= ~0x04;
				}
			}
		},
		pass_type_admin:{
			get: function(){
				return (this.pass_type >> 3) & 0x01 ? true : false;
			},
			set: function(v){
				if(v){
					this.pass_type |= 0x08;
				}else{
					this.pass_type &= ~0x08;
				}
			}
		},
		pass_type_stranger:{
			get: function(){
				return (this.pass_type >> 6) & 0x01 ? true : false;
			},
			set: function(v){
				if(v){
					this.pass_type |= 0x40;
				}else{
					this.pass_type &= ~0x40;
				}
			}
		},
		enable_auth:{
			get:function(){
				return (this.auth_type >> 0) & 0x01 ? true :false;
			},
			set:function(v){
				if(v){
					this.auth_type |= 0x01;
				}else{
					this.auth_type &= ~0x01;
				}
			}
		},
		enable_unauth:{
			get:function(){
				return (this.auth_type >> 1) & 0x01 ? true :false;
			},
			set:function(v){
				if(v){
					this.auth_type |= 0x02;
				}else{
					this.auth_type &= ~0x02;
				}
			}
		},
		enable_fuzzy_query:{
			get:function(){
				return (this.fuzzy_query == 1) ? true : false;
			},
			set:function(v){
				if(v){
					this.fuzzy_query = 1;
				}else{
					this.fuzzy_query = 0;
				}
			}
		},
	},

	watch: {
		isExport(n, o) {
			if (n) {
				this.start_export();
			}
		},
	},
};
</script>
