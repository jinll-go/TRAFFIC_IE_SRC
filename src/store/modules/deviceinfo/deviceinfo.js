import Vue from 'vue'//此处import进来的模块(vue.runtime.js)有问题。导致$store属性注入失败

const state = {
  DeviceName:'',
  video_format:-1,
  image_mode:-1
}

const mutations = {
  ['deviceinfo/property_changed'](state,payload){
    $.extend(true,state,payload);
  }
}

const getters = {
  DeviceInfo(state){
    return state;
  }
}

const actions = {

}

export default {
  state,
  getters,
  mutations,
  actions
}