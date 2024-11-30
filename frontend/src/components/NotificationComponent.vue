<!-- src/components/NotificationComponent.vue -->
<template>
    <div class="notifications-container">
        <TransitionGroup name="notification">
            <div
                v-for="notification in notifications"
                :key="notification.id"
                :class="['notification', `notification-${notification.type}`]"
                @click="closeNotification(notification.id)"
            >
                <span class="message">{{ notification.message }}</span>
                <button class="close-btn" @click.stop="closeNotification(notification.id)">&times;</button>
            </div>
        </TransitionGroup>
    </div>
</template>

<script>
import { computed } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'NotificationComponent',
    setup() {
        const store = useStore();
        const notifications = computed(() => store.state.notifications.notifications);
        const closeNotification = (id) =>{
            store.dispatch('notifications/removeNotification',id);
        };
        
        return {
            notifications,
            closeNotification,
        };
    }
};
</script>

<style scoped>
.notifications-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 1000;
}

.notification {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 15px 25px;
    margin-bottom: 10px;
    border-radius: 4px;
    color: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    min-width: 300px;
}
.close-btn{
    background: none;
    border: none;
    color: white;
    font-size: 20px;
    cursor:pointer;
    padding: 0 0 0 15px;
    opacity:0.7;
}
.close-btn:hover{
    opacity:1 ;
}
.message{
    flex-grow:1;
}
.notification-success {
    background-color: #4caf50;
}

.notification-warning {
    background-color: #ff9800;
}

.notification-error {
    background-color: #f44336;
}

.notification-enter-active,
.notification-leave-active {
    transition: all 0.3s ease;
}

.notification-enter-from,
.notification-leave-to {
    opacity: 0;
    transform: translateX(100%);
}

.notification-move {
    transition: transform 0.3s ease;
}
</style>