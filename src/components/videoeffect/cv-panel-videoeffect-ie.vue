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
                <!-- <div v-if="is_honey"> -->
                    <CVSlider :ref="item.name" :name="item.name" :min="1" :max="16" v-model="item.value" :step="1" :width="76"></CVSlider>
                <!-- </div> -->

                <!-- <div v-else>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 1 ? 'sk1' : 'sk2']" id="Bri1" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 2 ? 'sk1' : 'sk2']" id="Bri2" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 3 ? 'sk1' : 'sk2']" id="Bri3" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 4 ? 'sk1' : 'sk2']" id="Bri4" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 5 ? 'sk1' : 'sk2']" id="Bri5" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 6 ? 'sk1' : 'sk2']" id="Bri6" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 7 ? 'sk1' : 'sk2']" id="Bri7" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 8 ? 'sk1' : 'sk2']" id="Bri8" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 9 ? 'sk1' : 'sk2']" id="Bri9" style="cursor:hand;"></div>
                    <div :class="[Math.floor((item.value * 10) / 16 + 0.5) >= 10 ? 'sk1' : 'sk2']" id="Bri9" style="cursor:hand;"></div>
                </div> -->
            </div>

            <div class="fl" :style="{ 'padding-left': is_honey ? '8px' : '' }">
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
import CVSlider from 'components/slider/slider.vue';

export default {
	name: 'CVVideoEffect',
	data() {
		//console.log(['#######',d.brightness,Math.floor(d.brightness*10/16 + 0.5)]);
		return {
			minus_url: 'static/images/minus.png',
			plus_url: 'static/images/plus.png',
		};
	},
	mounted() {
            //处理input
			this.$refs.brightness_slider[0].$on('input', (val) => {
				msg('brightness', val);
				this.$store.dispatch('color_changed', { brightness: parseInt(val, 10) });
			});
			this.$refs.contrast_slider[0].$on('input', (val) => {
				msg('contrast', val);
				this.$store.dispatch('color_changed', { contrast: parseInt(val, 10) });
			});
        },
        beforeDestroy() {
            this.$refs.brightness_slider[0].$off('input');
            this.$refs.contrast_slider[0].$off('input');
	},
	computed: {
		is_honey() {
			return this.$store.getters.is_honey;
		},

            list() {
                let d = this.$store.getters.plugin_color;
                // msg([d.brightness,d.contrast]);
                let ar = [1, 3, 5, 6, 8, 10, 11, 12, 14, 16];
                //  msg(ar.map(item=>Math.floor(item*0.625 + 0.5)))

                return [
                    {
                        name: 'brightness_slider',
                        text: 'i18n_brightness',
                        value: d.brightness,
                        current_idx: ar.filter((item) => d.brightness >= item).length - 1,
                    },
                    {
                        name: 'contrast_slider',
                        text: 'i18n_contrast',
                        value: d.contrast,
                        current_idx: ar.filter((item) => d.contrast >= item).length - 1,
                    },
                ];
            },
        },

        methods: {
            minus(item, idx) {
                let v = 0;
                if (this.is_honey) {
                    v = parseInt(item.value, 10) - 1;
                    if (v <= 0) {
                        v = 1;
                    }
                } else {
                    let ar = [1, 3, 5, 6, 8, 10, 11, 12, 14, 16];
                    this.list[idx].current_idx -= 1;
                    if (this.list[idx].current_idx < 0) {
                        this.list[idx].current_idx = 0;
                        return;
                    }
                    v = ar[item.current_idx];
                }
                if (idx == 0) {
                    this.$store.dispatch('color_changed', { brightness: v });
                } else if (idx == 1) {
                    this.$store.dispatch('color_changed', { contrast: v });
                }
            },
            plus(item, idx) {
                let v = 0;
                if (this.is_honey) {
                    v = parseInt(item.value, 10) + 1;
                    if (v > 16) {
                        v = 16;
                    }
                } else {
                    let ar = [1, 3, 5, 6, 8, 10, 11, 12, 14, 16];
                    this.list[idx].current_idx += 1;
                    if (this.list[idx].current_idx >= 10) {
                        this.list[idx].current_idx = 10;
                        return;
                    }
                    v = ar[item.current_idx];
                }
                if (idx == 0) {
                    this.$store.dispatch('color_changed', { brightness: v });
                } else if (idx == 1) {
                    this.$store.dispatch('color_changed', { contrast: v });
                }
            },
            restore_plugin_color() {
                let default_val = { brightness: 8, contrast: 8 };
                if (this.is_honey) {
                    this.list.forEach((element) => {
                        element.value = 8;
                    });
                }
                this.$store.dispatch('color_changed', default_val);
            },
        },

        components: {
            CVSlider,
        },
    };
</script>
