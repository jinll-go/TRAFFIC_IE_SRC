<template>
    <div class="w100 pt2" id="divPtztrack">
        <div name="ptz" class="flc"><label v-tr="i18n_track"></label></div>
        <div class="fl">
            <select name="Ptztrack" id="Ptztrack" class="textc" style="width:50px;" v-model="track_id">
                <option v-for="opt in options" :value="opt">{{ opt }}</option>
            </select>
        </div>
        <div class="fl pl5">
            <a onfocus="this.blur()">
                <img src="static/images/35.png" name="Image59" width="20" height="20" border="0" id="Image59" :title="lang.i18n_set" @click="set" />
            </a>
        </div>
        <!--  <div class="fl pl5"  style="display:none">
		  	<a   onfocus="this.blur()">
		  	<img src="static/images/36.gif" name="Image62" width="20" height="20" border="0" id="Image62" title="删除" />
		  	</a></div> -->
        <div class="fl pl5">
            <a onfocus="this.blur()">
                <img src="static/images/15.png" name="Image58" width="20" height="20" border="0" id="Image58" :title="lang.i18n_call" @click="call" />
            </a>
        </div>
    </div>
</template>

<script>
import Vue from 'vue';
import { rangeArray } from 'common/util';

/*
 ["PTZ/Track"]({ dispatch, commit, state, getters }, { TrackIndex, Type, Run }) {
        // {"Type":1,"Ch":1,"Data":{"Cmd":39,"Index":4}}

        return new Promise((resolve, reject) => {
            Vue.$auth_request({
                method: "POST",
                url: "goform/frmPTZTrack",
                data: JSON.stringify({
                    Dev: getters.preview.dev,
                    Ch: getters.preview.ch,
                    Type,
                    Data: {
                        TrackIndex,
                        Run,
                    },
                }),
                async: true,
                auth_type: "digest",
                successCb(result) {
                    resolve(result);
                },
                errorCb(err) {
                    reject(false);
                },
            });
        });
    },
*/
export default {
	name: 'CVPanelTrack',
	data() {
		return {
			options: rangeArray(1, 4),
			track_id: this.$store.getters.preview.track_id,
			is_NetHIK: this.$store.getters.factory_info.IsofDome == 'y_ex', //网络球机
		};
	},
	mounted() {
		this.head_dialog = null;
	},
	computed: {
		lang() {
			return this.$store.getters.current_language;
		},
		track_num() {
			return this.$store.getters.preview_ptz_ability.MaxPatternNum;
		},
	},
	methods: {
		async set() {
			this.$store.commit('preview/dialog_changed', 'TRACK');
			this.$store.commit('preview/track_id_change', this.track_id);

			if (this.is_NetHIK) {
				await this.$store.dispatch('request', {
					url: 'goform/frmPTZDomePatternControl',
					Type: 1,
					Data: {
						Cmd: 0,
						Idx: this.track_id,
					},
				});
			} else {
				//背景iframe弹出层 iframe全屏会遮挡住 视频区域 firefox下无此问题
				// this.$store.commit("preview/dialog_changed", "TRACK");
				/*if(this.head_dialog){
     				this.head_dialog.$destroy();
     				this.head_dialog = null;
     			}
     			this.head_dialog = new Vue({el:".mask",store:this.$store,render:h=>h(CVModalDialogHead)});
     			this.head_dialog.opened = true;*/

				// 开始记录轨迹
				await this.$store.dispatch('request', {
					url: 'goform/frmPTZTrack',
					Type: 0,
					Data: {
						TrackIndex: this.track_id,
						Run: 1,
					},
				});
			}
		},
		async call() {
			try {
				if (this.is_NetHIK) {
					//网络球机
					let ret = await this.$store.dispatch('request', {
						url: 'goform/frmPTZDomePatternControl',
						Type: 1,
						Data: {
							Cmd: 2,
							Idx: this.track_id,
						},
					});
				} else {
					let ret = await this.$store.dispatch('request', {
						url: 'goform/frmPTZTrack',
						Type: 1,
						Data: {
							TrackIndex: this.track_id,
						},
					});
				}
			} catch (e) {}
		},
	},
	watch: {
		track_num(n, o) {
			this.options = rangeArray(1, n);
		},
	},
};
</script>
