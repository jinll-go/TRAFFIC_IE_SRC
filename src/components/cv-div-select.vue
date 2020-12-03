<template>
    <div class="fl" 
      v-show="show | true"
      :disabled="disabled"  
      @click="click_delegate($event)"
      >
      <div :class="$store.getters.is_honey?'honey_lang_select':'select2_bg'" >
        <img src="static/images/sel.png" alt="" class="select_img" v-if="this.$store.getters.is_honey"  @click.stop="show_lang">
        <div tabindex="1" name="label_text" :class="$store.getters.is_honey?'honey_lang_text':'sel2_text'" @blur="hide_options($event)">{{value}}</div>
      </div>
      <div  :class="$store.getters.is_honey?'honey_sel2_opti':'sel2_opti'" v-show="options_show" >
        <div 
          :class="[{'sel2_zy1':item.active,'sel2_zy2':!item.active}]"
          @mouseenter="toggle(item,0,index)"
          @mouseleave="toggle(item,1,index)"
          :val="item.val"
          v-for="(item,index) in options" >{{item.text}}</div>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'


export default {
  name:"CVDivSelect",
    props: {
      show: Boolean,
      disabled:Boolean,
      readonly: Boolean,
      options:Array
    },
    data () {//工厂函数
      return {
        value: '',
        options_show:false,
        opt_bgcolor:'honey_language_bg_opt_color'
      }
    },
    methods: {
      show_lang(){
        this.options_show = !this.options_show;      
      },
      click_delegate (evt) {
        //window.console.log(evt);
        var tag = $(evt.target).attr("name");
//       msg(tag);
        if(tag == 'label_text')
        {
          this.options_show = true;
        }else{
          if (evt.target.className.indexOf('sel2_zy') != -1) {
            this.value = evt.target.innerText;
            this.$emit("choose_language",$(evt.target).attr('val'));
          }
          this.options_show = false;
        }
      },
      hide_options(evt){
       // window.console.log(evt.target);
        setTimeout(()=>{//onblur 和onclick会冲突，延时解决
          this.$data.options_show = false;
          // this.$emit("language_option_changed",this.value);
        },250);
       
      },
      toggle(item,mode,idx){
       
        this.$nextTick(function () {

          this.options.forEach(function (item) {
            Vue.set(item,'active',false);//属性绑定用Vue.set
　　　　　});
          if (mode == 0) {
            Vue.set(item,'active',true);
          }
　　　　});
      }
    },
    watch:{
      options(newVal,oldVal){
          //msg(['-----------------',newVal,oldVal])
          let default_item = newVal.find((item)=>item.val == this.$store.state.Base.selected_language);
          if(default_item)this.$data.value = default_item.text;
      }
    }
  }
</script>


