import Vue from 'vue'//此处import进来的模块(vue.runtime.js)有问题。导致$store属性注入失败

const state = {

}

const mutations = {

}

const getters = {

}

const actions = {
 /*
  ['frmUserOnline/Get']({commit,state},{}){
    return new Promise((resolve,reject)=>{
      //{method,url,data,async,auth_type,username,pwd,successCb,errorCb,timeout}
   
      Vue.$auth_request({
        method:"POST",
        url:"goform/frmUserOnline",
        data:JSON.stringify({
          Type:0,
          Ch:1,
          Data:{}
        }),
        async:true,
        auth_type:'digest',
        successCb(result){
  
          resolve(result);
        },
        errorCb(err){
          reject(false);
        }
      })
    });
  },
  ['frmUserOnline/Set']({commit,state},{data}){
    return new Promise((resolve,reject)=>{
      //{method,url,data,async,auth_type,username,pwd,successCb,errorCb,timeout}
      Vue.$auth_request({
        method:"POST",
        url:"goform/frmUserOnline",
        data:JSON.stringify({
          Type:1,
          Ch:1,
          Data:data
        }),
        async:true,
        auth_type:'digest',
        successCb(result){
          resolve(result);
        },
        errorCb(err){
          reject(false);
        }
      })
    });
  },*/
  ['frmPasswordLost/Get']({commit,state,dispatch},data){
    
      //{method,url,data,async,auth_type,username,pwd,successCb,errorCb,timeout}
    msg(['frmPasswordLost/Get',data])
    return dispatch("request",{
      url:"goform/frmPasswordLost",
      Type:0,
      Ch:1,
      Data:data
    })
      

  },
  ['frmPasswordLost/Set']({commit,state,dispatch},data){
    return dispatch("request",{
        url:"goform/frmPasswordLost",
          Type:1,
          Ch:1,
          Data:data
  });
  },
}

export default {
  state,
  getters,
  mutations,
  actions
}