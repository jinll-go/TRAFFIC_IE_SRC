<template>
    <!--<div v-if="this.$store.getters.is_tyconew">
      <table style="width: 140px;margin-left: 20px">
        <tr>
          <td class="circle trans0" :title="lang.i18n_leftUp" @mousedown.prevent="ptz_control(25,0)" @mouseup="ptz_control(25,1)" @mouseover="mouse_over" @mouseout="mouse_out">
          </td>
          <td class="dect trans90" :title="lang.i18n_up"  @mousedown.prevent="ptz_control(21,0)" @mouseup="ptz_control(21,1)" @mouseover="mouse_over" @mouseout="mouse_out">
          </td>
          <td class="circle trans0" :title="lang.i18n_rightUp" @mousedown.prevent="ptz_control(26,0)" @mouseup="ptz_control(26,1)" @mouseover="mouse_over" @mouseout="mouse_out">
          </td>
        </tr>
        <tr>
          <td class="dect trans180" :title="lang.i18n_left" @mousedown.prevent="ptz_control(23,0)" @mouseup="ptz_control(23,1)" @mouseover="mouse_over" @mouseout="mouse_out">
          </td>
          <td>
          </td>
          <td class="dect trans0" :title="lang.i18n_right" @mousedown.prevent="ptz_control(24,0)" @mouseup="ptz_control(24,1)" @mouseover="mouse_over" @mouseout="mouse_out">
          </td>
        </tr>
        <tr>
          <td class="circle trans0" :title="lang.i18n_leftDown" @mousedown.prevent="ptz_control(27,0)" @mouseup="ptz_control(27,1)" @mouseover="mouse_over" @mouseout="mouse_out">
          </td>
          <td class="dect trans270" :title="lang.i18n_down" @mousedown.prevent="ptz_control(22,0)" @mouseup="ptz_control(22,1)" @mouseover="mouse_over" @mouseout="mouse_out">
          </td>
          <td class="circle trans0" :title="lang.i18n_rightDown" @mousedown.prevent="ptz_control(28,0)" @mouseup="ptz_control(28,1)" @mouseover="mouse_over" @mouseout="mouse_out">
          </td>
        </tr>
      </table>
    </div>-->
    <div :class="root_style">
        <div class="w100">
            <div class="kz_l_t">
                <img
                    src="static/images/k2.png"
                    name="Image39"
                    width="28"
                    height="28"
                    border="0"
                    id="Image39"
                    :title="lang.i18n_leftUp"
                    @mousedown.prevent="ptz_control(25, 0)"
                    @mouseup="ptz_control(25, 1)"
                    @mouseleave="ptz_control(25, 1, $event)"
                />
            </div>
            <div class="kz_t">
                <img
                    src="static/images/k1.png"
                    name="Image38"
                    :title="lang.i18n_up"
                    width="28"
                    height="28"
                    border="0"
                    id="Image38"
                    @mousedown.prevent="ptz_control(21, 0)"
                    @mouseup="ptz_control(21, 1)"
                    @mouseleave="ptz_control(21, 1, $event)"
                />
            </div>
            <div class="kz_r_t">
                <img
                    src="static/images/k3.png"
                    name="Image40"
                    width="28"
                    height="28"
                    border="0"
                    id="Image40"
                    :title="lang.i18n_rightUp"
                    @mousedown.prevent="ptz_control(26, 0)"
                    @mouseup="ptz_control(26, 1)"
                    @mouseleave="ptz_control(26, 1, $event)"
                />
            </div>
        </div>

        <div class="w100">
            <div class="kz_l">
                <img
                    src="static/images/k4.png"
                    name="Image41"
                    width="28"
                    height="28"
                    border="0"
                    id="Image41"
                    :title="lang.i18n_left"
                    @mousedown.prevent.prevent="ptz_control(23, 0)"
                    @mouseup="ptz_control(23, 1)"
                    @mouseleave="ptz_control(23, 1, $event)"
                />
            </div>
            <div class="kz_auto">
                <img :src="auto_img" name="Image42" width="42" height="42" border="0" id="Image42" @mousedown.prevent="ptz_control(29, 0)" />
            </div>
            <div class="kz_r">
                <img
                    src="static/images/k6.png"
                    name="Image43"
                    width="28"
                    height="28"
                    border="0"
                    id="Image43"
                    :title="lang.i18n_right"
                    @mousedown.prevent="ptz_control(24, 0)"
                    @mouseup="ptz_control(24, 1)"
                    @mouseleave="ptz_control(24, 1, $event)"
                />
            </div>
        </div>

        <div class="w100">
            <div class="kz_l_b">
                <img
                    src="static/images/k7.png"
                    name="Image44"
                    width="28"
                    height="28"
                    border="0"
                    id="Image44"
                    :title="lang.i18n_leftDown"
                    @mousedown.prevent="ptz_control(27, 0)"
                    @mouseup="ptz_control(27, 1)"
                    @mouseleave="ptz_control(27, 1, $event)"
                />
            </div>
            <div class="kz_b">
                <img
                    src="static/images/k9.png"
                    name="Image46"
                    width="28"
                    height="28"
                    border="0"
                    id="Image46"
                    :title="lang.i18n_down"
                    @mousedown.prevent="ptz_control(22, 0)"
                    @mouseup="ptz_control(22, 1)"
                    @mouseleave="ptz_control(22, 1, $event)"
                />
            </div>
            <div class="kz_r_b">
                <img
                    src="static/images/k8.png"
                    name="Image45"
                    width="28"
                    height="28"
                    border="0"
                    id="Image45"
                    :title="lang.i18n_rightDown"
                    @mousedown.prevent="ptz_control(28, 0)"
                    @mouseup="ptz_control(28, 1)"
                    @mouseleave="ptz_control(28, 1, $event)"
                />
            </div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'CVPanelPtz',
        data() {
            return {
                is_fish: this.$store.getters.factory_info.IsOfFishEye == 'y',
                is_NetHIK: this.$store.getters.factory_info.IsofDome == 'y_ex',
            };
        },
        methods: {
            ptz_control(Cmd, IsStop, e) {
                /**
                 * bugfix: 鼠标按下 不松开,移动到 按下目标 之外,目标绑定的mouseup不会触发,
                 * 会导致 停止命令 不发
                 * 使用 .prevent 清除掉 默认行为(img mousedown是图片拖动的逻辑).绑定mouseleave.再mouseleave触发时判断鼠标按钮状态,决定是否发送停止
                 */
                if (IsStop == 1) {
                    if (e && e.buttons == 0) {
                        return;
                    }
                }

                let Speed = this.$store.getters.preview.speed;
                let d = {};
                let speed = Speed / 10;

                if (this.is_fish) {
                    let d = {};
                    let speed = Speed / 10;
                    switch (Cmd) {
                        case 21: //��
                            d.TiltAngle = IsStop ? 0 : 1;
                            d.TiltSpeed = speed;
                            break;
                        case 22: //��
                            d.TiltAngle = IsStop ? 0 : -1;
                            d.TiltSpeed = speed;
                            break;
                        case 23: //��
                            d.PanAngle = IsStop ? 0 : -1;
                            d.PanSpeed = speed;
                            break;
                        case 24: //��
                            d.PanAngle = IsStop ? 0 : 1;
                            d.PanSpeed = speed;
                            break;
                        case 25: //����
                            d.TiltAngle = IsStop ? 0 : 1;
                            d.PanAngle = IsStop ? 0 : -1;
                            d.TiltSpeed = d.PanSpeed = speed;
                            break;
                        case 26: //����
                            d.TiltAngle = IsStop ? 0 : 1;
                            d.PanAngle = IsStop ? 0 : 1;
                            d.TiltSpeed = d.PanSpeed = speed;
                            break;
                        case 27: //����
                            d.TiltAngle = IsStop ? 0 : -1;
                            d.PanAngle = IsStop ? 0 : -1;
                            d.TiltSpeed = d.PanSpeed = speed;
                            break;
                        case 28: //����
                            d.TiltAngle = IsStop ? 0 : -1;
                            d.PanAngle = IsStop ? 0 : 1;
                            d.TiltSpeed = d.PanSpeed = speed;
                            break;
                        case 29: //�Զ�
                            d.Operation = 'Auto';
                            d.PanAngle = 1;
                            d.PanSpeed = speed;
                            break;
                    }
                    this.$store.dispatch('request', {
                        url: 'goform/frmFisheyeChanMove',
                        Type: 1,
                        Ch: 1,
                        Data: $.extend(
                            true,
                            {},
                            {
                                ChanNum: this.ptz_chan,
                                Operation: d.Operation ? d.Operation : 'ContinousMove',
                            },
                            d
                        ),
                    });
                } else if (this.is_NetHIK) {
                    switch (Cmd) {
                        case 21: //��
                            d.Type = 1;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                        case 22: //��
                            d.Type = 2;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                        case 23: //��
                            d.Type = 3;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                        case 24: //��
                            d.Type = 4;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                        case 25: //����
                            d.Type = 5;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                        case 26: //����
                            d.Type = 6;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                        case 27: //����
                            d.Type = 7;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                        case 28: //8
                            d.Type = 8;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                        case 29: //�Զ�
                            d.Type = 0;
                            d.Speed = IsStop ? 0 : Speed;
                            break;
                    }
                    this.$store.dispatch('request', {
                        url: 'goform/frmPTZDomePtzControl',
                        Type: 1,
                        Data: {
                            Cmd: d.Type,
                            Speed: d.Speed,
                        },
                    });
                } else {
                    this.$store.dispatch('request', {
                        url: 'goform/frmPTZControl',
                        Type: 1,
                        Ch: 1,
                        Data: {
                            Cmd,
                            IsStop,
                            Speed,
                        },
                    });
                }
            },
            mouse_over(e) {
                let classname = e.target.className;
                let arr = classname.split(' ');
                arr[0] += '_on';
                e.target.className = arr.join(' ');
            },
            mouse_out(e) {
                let classname = e.target.className;
                let arr = classname.split(' ');
                arr[0] = arr[0].substring(0, arr[0].length - 3);
                e.target.className = arr.join(' ');
            },
        },
        computed: {
            ptz_chan() {
                return this.$store.getters.ptz.cur_ch;
            },
            auto_img() {
                /* if (this.$store.getters.is_tyconew) {
                    return 'static/images/ptz_auto.png';
                } else {*/
			return 'static/images/k5.png';
			// }
		},
		root_style() {
			/*if (this.$store.getters.is_tyconew) {
                    return {
                        circle: true,
                    };
                } else {*/
                return {
                    main_right_mid_left: true,
                };
                //  }
            },
        },
    };
</script>
