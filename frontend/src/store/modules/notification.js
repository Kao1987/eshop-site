// store/modules/notifications.js
const state = {
    notifications: [],
};
const MAX_NOTIFICATIONS = 3;
const DEFAULT_TIMEOUT = 2000;
const mutations = {
    ADD_NOTIFICATION(state, notification) {
        if(!notification.message || !notification.type){
            console.error('Invalid notification data');
            return;
        }
        if(state.notifications.length >= MAX_NOTIFICATIONS){
            state.notifications.shift();
        }
        const isDuplicate = state.notifications.some(
            n => n.message === notification.message && n.type === notification.type
        );
        if(!isDuplicate){
            if(state.notifications.length>= MAX_NOTIFICATIONS_LENGTH){
                state.notifications.shift();
            }
        state.notifications.push(notification);
        }
    },
    REMOVE_NOTIFICATION(state,id){
        const index = state.notifications.findIndex(n => n.id === id);
        if(index !== -1){
            state.notifications.splice(index,1);
        }
    }
};

const actions = {
    showNotification({ commit }, {message,type,timeout = DEFAULT_TIMEOUT}) {
        if(!message || !type){
            console.error('Missing required notification parameters');
            return;
        }
        const id = Date.now();
        const notification = {id, message,type};
        commit('ADD_NOTIFICATION', notification);

        if(timeout >0){
            setTimeout(()=>{
                commit('REMOVE_NOTIFICATION',id);
            },timeout);
        }
    },
    removeNotification({commit},id){
        commit('REMOVE_NOTIFICATION',id);
    }
};

export default {
namespaced: true, 
state,
mutations,
actions,
};