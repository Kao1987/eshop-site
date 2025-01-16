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
import { computed, onMounted  } from 'vue';
import { useStore } from 'vuex';

export default {
    name: 'NotificationComponent',
    setup() {
        const store = useStore();
        const notifications = computed(() => store.state.notifications.notifications);

        onMounted(() => {
            store.dispatch('notifications/showNotification',{
                type:'warning',
                message:
                `歡迎來到小高的網站！👋
                感謝您的蒞臨與支持 🙌

                提醒您：由於本網站採用免費版的雲端架構，部分圖片可能需要稍微多一點時間加載 
                (閒置一段時間後可能會需要先[喚醒]一下)⏳
                我們正在努力優化體驗，感謝您的耐心等候與理解！🙏
                希望您在這裡度過愉快的時光，祝您瀏覽愉快！😊`,
                timeout:0
            });

        });

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
    z-index: 9999;
    pointer-events: auto;
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