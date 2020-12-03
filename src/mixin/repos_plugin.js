/*
参数配置 显示plugin
人脸比对界面 配置显示 plugin
 */
import { throttle } from 'common/util';
/**
 * 判断当前dom元素是否显示有滚动条
 * @param {*} el
 * @param {*} direction
 * 判断不是很准
function hasScrolled(el, direction = 'vertical') {
    if (direction === 'vertical') {
        return el.scrollHeight > el.clientHeight;
    } else if (direction === 'horizontal') {
        return el.scrollWidth > el.clientWidth;
    }
}*/
export default {
    created() {
        //top memu transparent iframe to hide video plugin,when it is scrolled on top
        /*if (!(this.$store.getters.is_tyconew || this.$store.getters.is_dongshun)) {
			let top_ifrm_bkg = $('#topmenu_iframe_bkg');
			if (top_ifrm_bkg.length) {
			} else {
				$(document.body).append(
					'<iframe class="topmenu_iframe_bkg" id="topmenu_iframe_bkg" src="#"' + ' frameborder="0" scrolling="no" allowtransparency="true"></iframe>',
				);
			}
		}*/
    },
    mounted() {
        this.repos_plugin();
    },
    beforeDestroy() {
        this.hide_plugin();
    },
    methods: {
        hide_plugin() {
            let wrapper = $('#config_plugin_wrapper');

			if (wrapper.length) {
				let obj = {
					left: '0px',
					top: '0px',
					width: '1px',
					height: '1px',
				};
                if (this.is_ie) {
					obj.display = 'none';
				} else {
					obj.visibility = 'hidden';
				}
				wrapper.css(obj);
			}
            if (!this.load || !this.backup_plugindraw) {
                msg(this.$options.name, '组件需要实现load 和 backup_plugindraw 函数');
            } else {
                this.backup_plugindraw();
            }
            //清理监听,避免泄露
            if (this.scroll_el) {
                warn('!!!', 'remove scroll events listeners!');
                $(this.scroll_el).unbind('scroll');
                this.scroll_el = null;//清空,否则下一次不会进入监听绑定逻辑
            }
		},
		repos_plugin() {
            //检测是否需要监听scroll
            if (!this.scroll_el) {
                let el = this.$el.parentNode;
                let find = false;
                while (el.tagName !== 'BODY' && el.tagName !== 'HTML') {
                    let css_has_overflow = $(el).css('overflow-y') == 'scroll' || $(el).css('overflow') == 'scroll';
                    //let dom_has_scroll = hasScrolled(el, 'vertical');
                    let cls = $(el).attr('class');

                    let fixed_scroll_dom = /config_scollbar/.test(cls);
                    //找到main_mid_2 config_scollbar
                    if (css_has_overflow || fixed_scroll_dom) {
                        warn('scroll listen', el);
                        $(el).scroll(throttle(this.repos_plugin, 250, true));
                        find = true;
                        break;
                    }
                    el = el.parentNode;
                }
                this.scroll_el = find ? el : null;
            }
			let wrapper = $('#config_plugin_wrapper');
            let plugin = $(this.$el).find('#plugin');

            if (plugin.length == 0) return;

            let x = plugin.offset().left;
            let y = plugin.offset().top;
					if (x && y) {
						let obj = {
							left: x + 'px',
							top: y + 'px',
                    width: plugin.outerWidth() + 'px',
                    height: plugin.outerHeight() + 'px',
						};
                        if (this.is_ie) {
							obj.display = 'block';
						} else {
							obj.visibility = 'visible';
						}
						wrapper.css(obj);
					}
		},
	},
	watch: {
		rect(_r) {
            //浏览器窗口resize的时候检测 是否需要安装 scroll监听
            //eg:组初始化时 当前窗口大小, 没有滚动条,但是手动改变宽高后出现滚动条,
            //这种情形下需要手动监听scroll,否则小视频窗口也无法正确定位
            msg(this.$store.getters.config_activated, this.$store.getters.face_activated, this.$store.getters.temperature.activated);
            if (this.$store.getters.config_activated || this.$store.getters.face_activated || this.$store.getters.temperature.activated) {
				this.repos_plugin();
			} else {
				this.hide_plugin();
			}
		},
	},
	computed: {
        is_ie() {
            return this.$store.getters.is_IE;
        },
		rect() {
			return this.$store.getters.content_rect;
		},
	},
};
