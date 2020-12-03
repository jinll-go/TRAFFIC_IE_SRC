/**
 * Created by Administrator on 2017/3/20.
 */

const state = {
    activated: false,
    StartTime: '',
    EndTime: '',
    MajorType: 0,
    PageNum: 20,
    CurrentPage: 1,
    Step: 0,
};

const mutations = {
    ['log/activated'](state, payload) {
        state.activated = payload;
    },
    ['log/starttime_val_changed'](state, payload) {
        //  msg(['starttime',new Date(payload*1000).format("yyyy-MM-dd hh:mm:ss")])
        state.StartTime = payload;
    },
    ['log/endtime_val_changed'](state, payload) {
        //  msg(['stoptime',new Date(payload*1000).format("yyyy-MM-dd hh:mm:ss")])
        state.EndTime = payload;
    },
    ['log/logMaintype_val_changed'](state, payload) {
        state.MajorType = payload;
    },
    ['log/logSubtype_val_changed'](state, payload) {
        state.SubType = payload;
    },
    ['log/pagenum_val_changed'](state, payload) {
        state.PageNum = payload;
    },
    ['log/page_turning'](state, payload) {
        state.CurrentPage = payload;
    },
    ['log/restore'](state) {
        state.activated = false;
        state.MajorType = 0;
        state.SubType = 0;
        state.PageNum = 30;
        state.CurrentPage = 1;
        state.Step = 0;
    },
};

const getters = {
    log_activated(state) {
        return state.activated;
    },
    current_page() {
        return state.CurrentPage;
    },
    log() {
        return state;
    },
};

const actions = {
    log_val_restore({ commit, state }) {
        commit('log/restore');
    },
    starttime_val_changed({ commit, state }, val) {
        commit('log/starttime_val_changed', val);
    },
    endtime_val_changed({ commit, state }, val) {
        commit('log/endtime_val_changed', val);
    },
    logMaintype_val_changed({ commit, state }, val) {
        commit('log/logMaintype_val_changed', val);
    },
    logSubtype_val_changed({ commit, state }, val) {
        commit('log/logSubtype_val_changed', val);
    },
    pagenum_val_changed({ commit, state }, val) {
        commit('log/pagenum_val_changed', val);
    },
    page_turning({ commit, state }, val) {
        commit('log/page_turning', val);
    },
    frmLogCtrl({ commit, state, dispatch }, {}) {
        //获取设备参数
        msg('state.StartTime = ', state.StartTime);
        msg('state.EndTime = ', state.EndTime);
        return dispatch('request', {
            url: 'goform/frmLogCtrl',
            Ch: 1,
            Type: 0,
            Data: $.extend({}, state, {
                /*StartTime: state.StartTime, EndTime: state.EndTime*/
                TimeType: 1,
                StartCharTime: state.StartTime,
                EndCharTime: state.EndTime,
                MajorType: state.MajorType,
                SubType:  state.SubType,
                CurrentPage : state.CurrentPage,
                PageNum : state.PageNum,
            }),
        });
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
