<template>
  <!-- Logo Banner -->
    <div class="clearfix">
      <div class="fl"><img v-if="!$Param.wm376" src="static/images/logo.png" /></div>
      <div class="login1" style="padding-left:4px;" >
        <label v-show="ui_custom.serno.visible">{{serno}}</label>
      </div>

      <div class="login2" >
          <label v-show="ui_custom.model.visible">{{model}}</label>
          <label v-show="ui_custom.version.visible">{{version}}</label>
      </div>
    </div>
</template>

<script>
export default {
  name: 'CVLoginBanner',
    data: function () {//工厂函数
      return {

    }
  },
  computed:{
    serno(){
      return this.$store.getters.factory_info.Brand;
    },
    model(){
      return this.$store.getters.factory_info.DeviceModel;
    },
    version(){
      return this.$store.getters.factory_info.HwVersion;
      }
    }
  }
</script>
