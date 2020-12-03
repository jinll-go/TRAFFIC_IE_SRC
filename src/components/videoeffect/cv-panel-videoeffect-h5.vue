<template>
    <div class="main_right_mid xx1" name="disSection" id="div_image">
        <div class="w100" id="divBri" v-for="(item, idx) of list">
            <div name="ptz" class="flx pt2" style="width:60px"><label v-tr="item.text"></label></div>
            <div class="fl">
                <a @click="minus(item, idx)">
                    <img :src="minus_url" name="Image7" width="26" height="27" border="0" id="Image7" :title="lang.i18n_minus" />
                </a>
            </div>

            <div class="r_2" id="Bri">
				<CVSlider :ref="item.name" :name="item.name" :min="1" :max="16" v-model="item.value" :step="1" :width="76"></CVSlider>
                <!-- <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 1 ? 'sk1' : 'sk2']" id="Bri1" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 2 ? 'sk1' : 'sk2']" id="Bri2" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 3 ? 'sk1' : 'sk2']" id="Bri3" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 4 ? 'sk1' : 'sk2']" id="Bri4" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 5 ? 'sk1' : 'sk2']" id="Bri5" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 6 ? 'sk1' : 'sk2']" id="Bri6" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 7 ? 'sk1' : 'sk2']" id="Bri7" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 8 ? 'sk1' : 'sk2']" id="Bri8" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 9 ? 'sk1' : 'sk2']" id="Bri9" style="cursor:hand;"></div>
                <div :class="[Math.floor((item.value * 10) / 10 + 0.5) >= 10 ? 'sk1' : 'sk2']" id="Bri9" style="cursor:hand;"></div> -->
            </div>

            <div class="fl">
                <a @click="plus(item, idx)">
                    <img :src="plus_url" name="Image8" width="26" height="27" border="0" id="Image8" :title="lang.i18n_plus" />
                </a>
            </div>
        </div>
        <!--
       <div class="w100" id="divCon">
            <div name="ptz" class="flx pl5 pt2"><label v-tr="i18n_contrast"></label></div>
            <div class="fl"><a href="#"   onfocus="this.blur()" ><img src="static/images/minusc.gif" name="Image9" width="26" height="27" border="0" id="Image9" title="减少"  /></a></div>
            <div class="r_2">
              <div class="sk2" id="Con1" style="cursor:hand;" ></div>
              <div class="sk2" id="Con2" style="cursor:hand;" ></div>
              <div class="sk2" id="Con3" style="cursor:hand;" ></div>
              <div class="sk2" id="Con4" style="cursor:hand;" ></div>
              <div class="sk2" id="Con5" style="cursor:hand;" ></div>
              <div class="sk2" id="Con6" style="cursor:hand;" ></div>
              <div class="sk2" id="Con7" style="cursor:hand;" ></div>
              <div class="sk2" id="Con8" style="cursor:hand;" ></div>
              <div class="sk2" id="Con9" style="cursor:hand;" ></div>
            </div>
            <div class="fl"><a href="#"   onfocus="this.blur()" ><img src="static/images/plus.gif" name="Image10" width="26" height="27" border="0" id="Image10" title="增加"  /></a></div>
          </div>
		  
		<div class="w100" id="divCon">
		  <div name="ptz" class="flx pl5 pt2"></div>
		  <div class="fl">
			<a href="#"   onfocus="this.blur()" ></a>
			</div>
      
	  </div>-->
        <div class="fr pr20">
            <a @click="restore_plugin_color">
                <img src="static/images/18.png" name="Image63" width="16" height="16" border="0" id="Image63" :title="lang.i18n_restore" />
            </a>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
	name: 'CVVideoEffect',
	data() {
		//console.log(['#######',d.brightness,Math.floor(d.brightness*10/16 + 0.5)]);
		return {
			minus_url: 'static/images/minus.png',
			plus_url: 'static/images/plus.png',
			d: {
				Brightness: 5,
				Contrast: 5,
				Saturation: 5,
				Hue: 5,
			},
		};
	},
	mounted() {
		this.$store
			.dispatch('request', {
				url: 'goform/frmVideoEffect',
				Type: 0,
				Data: {},
			})
			.then((r) => {
				if (r.Result == 0) {
					this.d = {
						Brightness: Math.round((r.Data.VideoEffect.Brightness * 10) / 255),
						Contrast: Math.round((r.Data.VideoEffect.Contrast * 10) / 255),
						Saturation: Math.round((r.Data.VideoEffect.Saturation * 10) / 255),
						Hue: Math.round((r.Data.VideoEffect.Hue * 10) / 255),
					};
				}
			});
	},
	computed: {
		...mapState({
			lang: (state) => state.base.langObj,
		}),

        list() {
            //  let d = this.$store.getters.plugin_color;

            // msg([d.brightness,d.contrast]);
            let ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            //  msg(ar.map(item=>Math.floor(item*0.625 + 0.5)))

			return [
				{
					text: 'i18n_brightness',
					value: this.d.Brightness,
					current_idx: ar.filter((item) => this.d.Brightness >= item).length - 1,
				},
				{
					text: 'i18n_contrast',
					value: this.d.Contrast,
					current_idx: ar.filter((item) => this.d.Contrast >= item).length - 1,
				},
				{
					text: 'i18n_saturation',
					value: this.d.Saturation,
					current_idx: ar.filter((item) => this.d.Saturation >= item).length - 1,
				},
				{
					text: 'i18n_hue',
					value: this.d.Hue,
					current_idx: ar.filter((item) => this.d.Hue >= item).length - 1,
				},
			];
		},
	},
	methods: {
		save() {
			let VideoEffect = {
				Brightness: Math.min(parseInt((this.d.Brightness * 255) / 10 + 0.5), 255),
				Contrast: Math.min(parseInt((this.d.Contrast * 255) / 10 + 0.5), 255),
				Saturation: Math.min(parseInt((this.d.Saturation * 255) / 10 + 0.5), 255),
				Hue: Math.min(parseInt((this.d.Hue * 255) / 10 + 0.5), 255),
			};
			this.$store.dispatch('request', {
				url: 'goform/frmVideoEffect',
				Type: 1,
				Data: { VideoEffect },
			});
		},
		minus(item, idx) {
			//let ar = [1,3,5,6,8,10,11,12,14,16];
			let ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			this.list[idx].current_idx -= 1;
			if (this.list[idx].current_idx < 0) {
				this.list[idx].current_idx = 0;
				return;
			}
			if (idx == 0) {
				this.d.Brightness = ar[item.current_idx];
			} else if (idx == 1) {
				this.d.Contrast = ar[item.current_idx];
			} else if (idx == 2) {
				this.d.Saturation = ar[item.current_idx];
			} else if (idx == 3) {
				this.d.Hue = ar[item.current_idx];
			}
			this.save();
		},
		plus(item, idx) {
			//let ar = [1,3,5,6,8,10,11,12,14,16];
			let ar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
			this.list[idx].current_idx += 1;
			if (this.list[idx].current_idx >= 10) {
				this.list[idx].current_idx = 10;
				return;
			}
			if (idx == 0) {
				this.d.Brightness = ar[item.current_idx];
			} else if (idx == 1) {
				this.d.Contrast = ar[item.current_idx];
			} else if (idx == 2) {
				this.d.Saturation = ar[item.current_idx];
			} else if (idx == 3) {
				this.d.Hue = ar[item.current_idx];
			}
			this.save();
		},
		restore_plugin_color() {
			//this.$store.dispatch('color_changed',{brightness: 8,contrast: 8});
			this.d = {
				Brightness: 5,
				Contrast: 5,
				Saturation: 5,
				Hue: 5,
			};
			this.save();
		},
	},
};
</script>
