import Vue from 'vue';
import loadingVue from 'components/loading/loading.vue';

const LoadingConstructor = Vue.extend(loadingVue);

const Loading = (options = {}) => {
    let parent = document.body;
    let dv = document.createElement('div');
    dv.setAttribute('id', 'iframe-waiting');
    //  parent.appendChild(instance.$el); 会触发 类似F5刷新的效果，重新再加载一次，fuck
    parent.appendChild(dv);
    let instance = new LoadingConstructor(options).$mount('#iframe-waiting');

    instance.show = false;

    return instance;
};

export default {
    install(Vue, store) {
        Vue.prototype.$loading = Loading({
            beforeCreate() {
                this.$store = store;
            },
        });
    },
};
