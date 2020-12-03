const state = {
  AutoRebootMode: 0,
  EveryDayTime: 0,
  Week: [{
      Enable: 0,
      Time: 0
    },
    {
      Enable: 0,
      Time: 0
    },
    {
      Enable: 0,
      Time: 0
    },
    {
      Enable: 0,
      Time: 0
    },
    {
      Enable: 0,
      Time: 0
    },
    {
      Enable: 0,
      Time: 0
    },
    {
      Enable: 0,
      Time: 0
    },
  ],
  DateTime: [2017, 4, 6, 12, 0, 0],
  Month: {
    Days: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    Time: 0,
  },
  Enable: 0, //车牌检测的Enable

};

const mutations = {
  ['platedetect/enable_change'](state, payload) {
    state.Enable = payload;
  },
  ['autoreboot/data_change'](state, payload) {
    $.extend(true, state, payload);
  },
  ['autoreboot/week_data_change'](state,payload){
    state.Week[payload.idx].Enable = payload.Enable?1:0;
  },
  ['autoreboot/month_day_change'](state,payload){
        msg(['month.Days', payload]);
    if (payload instanceof Array) {
       state.Month.Days = payload;
    }else{
      state.Month.Days[payload.idx] = payload.Enable?1:0;
    }
    
  },
  ['autoreboot/month_time_change'](state,payload){
        msg(['month.Time', payload]);
    state.Month.Time = payload;
    },
};

const getters = {
  autoreboot(state){
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
