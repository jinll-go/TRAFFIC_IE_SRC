//只支持hidden iframe 上传

var UPLOAD = function(store){
 var $el_form = null;
    var $el_iframe = null;
    var tid = null;
    var $store = store;
    var bind_success = false;

    function trans_state(iframe,info_cb,upload_complete){
    
            try{
                var doc = iframe.contentDocument || iframe.contentWindow.document;
                var responseText = JSON.parse(doc.body.textContent);
                    
            }catch(e){
                responseText = {
                    Result:-1,
                    ErrorString:'Upload response Invalid JSON String!'
                }
                //this.upload_text = this.$store.getters.current_language.i18n_upload_auth_params_invalid;
                info_cb($store.getters.current_language.i18n_upload_auth_params_invalid,-1);
            }
            msg(responseText)
            if (responseText.Result == 0) {//upload file to server ok!
                //this.upload_text = this.$store.getters.current_language.i18n_upload_auth_ok;
                info_cb($store.getters.current_language.i18n_upload_auth_ok);
                //获取进度
                if(upload_complete)upload_complete();
            
            }else{
                //this.upload_text = this.$store.getters.current_language.i18n_upload_auth_failed;
                info_cb($store.getters.current_language.i18n_upload_auth_failed,-2)
            }
            $store.commit('config/is_uploading_file',false);

    }



    return {
        bind_fileElement(form,action){
            bind_success = false;
            if(!form)return;
            $el_form = form;
            msg($el_form.children)
            var find_flg = false;
            for(var i = 0;i < form.children.length;++i){
                if(form.children[i].tagName.toUpperCase() == 'IFRAME')
                {
                    $el_iframe = form.children[i];
                    find_flg = true;
                    break;
                }
            }

            if (find_flg) {
                if(action){
                    $el_form.action = action;
                }
                bind_success = true;
            }else{
                msg('The form need a hidden iframe!');
            }

        },
        submit(info,progress)
        {
            if(!bind_success){
                msg('need success bind Element before submit!!');
                return;
            }
            $store.commit('config/is_uploading_file',true);
           
            $el_form.submit();
            
        
            $el_iframe.onload = function(){//ie9+ 
                trans_state($el_iframe,info,progress)
            }
        }
    }


};





export default{
    install(Vue,store){
       // Vue.prototype.$myName = "zhagngsan";
        
        Vue.$upload = UPLOAD(store);
        msg([111,Vue.$upload,Vue.prototype.$upload]);
    }
}