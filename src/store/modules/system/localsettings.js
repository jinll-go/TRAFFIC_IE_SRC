import Vue from 'vue'; //此处import进来的模块(vue.runtime.js)有问题。导致$store属性注入失败


const state = {
  PrevCapture:'',
  RecPath:'',
  PbCapture:'',
  BackupPath:'',
  FileCapture:'',
  PlatePics:'',
  FacePics:'',
  PicQuality:0,
  WndMode:0,
    RecFormat: 0,
};

const mutations = {
  ['localsettings/data_change'](state,payload){
        $.extend(true, state, payload);
    },
};

const getters = {
  localsettings(state){
    return state;
    },
};

const actions = {};



            
             
    



        

      
        
              
            


   
    





  


export default {
  state,
  getters,
  mutations,
    actions,
};
