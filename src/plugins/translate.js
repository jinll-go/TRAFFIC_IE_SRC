function SetValues(el, binding, vnode, oldVnode) {
    if (!vnode.context.$store) return;
    let lang = vnode.context.$store.getters.current_language;
    let name = el.tagName.toUpperCase();
    let key = '';

    if (binding.expression.indexOf('$slots.default') != -1) {
        key = binding.value[0].text;
    } else if (binding.expression.indexOf('i18n_') != -1) {
        key = binding.expression;
    } else if (binding.value && binding.value.indexOf('i18n_') != -1) {
        key = binding.value;
    } else {
        key = binding.value || binding.expression;
    }

    el.innerHTML = lang[key] || key;
}

export default {
    install(Vue) {
        // Vue.prototype.$myName = "zhagngsan";
        /*Vue.prototype.checkUserName = (value) => {
            if(value == ""){
                return true; // 如果没有填写,默认为true
            }

            if(/\w{6,20}/.test(value)){
                return true;
            }else{
                return false;
            }
        }*/

        Vue.directive('tr', {
            bind: function() {
                //msg('bind')
            },
            inserted: function(el, binding, vnode, oldVnode) {
                //msg('inserted')
                SetValues(el, binding, vnode, oldVnode);
            },
            update: function(el, binding, vnode, oldVnode) {
                //msg('update')
                SetValues(el, binding, vnode, oldVnode);
            },
            componentUpdated: function(el, binding, vnode, oldVnode) {
                // msg('componentUpdated');
            },
            unbind: function() {
                //  msg('unbind');
            },
        });
    },
};
