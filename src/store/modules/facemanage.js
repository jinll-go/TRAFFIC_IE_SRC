const state = {
    activated: false,
};

const mutations = {
    ['facemanage/activated'](state, payload) {
        state.activated = payload;
    },
    ['facemanage/restore'](state) {
        state.activated = false;
    },
};

const getters = {
    facemanage_activated(state) {
        return state.activated;
    },
    facemanage() {
        return state;
    },
};

const actions = {
    facemanage_restore({ commit, state }) {
        commit('facemanage/restore');
    },
};

export default {
    state,
    getters,
    mutations,
    actions,
};
