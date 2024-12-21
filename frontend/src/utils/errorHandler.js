// frontend/src/utils/errorHandler.js
export function handleApiError(error, fallbackMessage = '操作失敗', options = {}) {
    const { showDetailedError = false, customHandler = null } = options;

    console.error('API錯誤:', error);

    if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.message || error.message || fallbackMessage;

        console.log('完整錯誤資訊:', {
            status,
            data,
            message: errorMessage,
            stack: error.stack
        });
        // 執行自定義錯誤處理器
        if (typeof customHandler === 'function') {
            return customHandler(error);
        }

        if (showDetailedError && process.env.NODE_ENV === 'development') {
            alert(`HTTP ${status}：${errorMessage}`);
        }

        // 根據狀態碼分類處理
        switch (status) {
            case 401:
                alert('未授權：請重新登入');
                break;
            case 404:
                alert('資源未找到：' + errorMessage);
                break;
            case 500:
                alert('伺服器錯誤，請稍後再試');
                break;
            default:
                alert(errorMessage);
        }
    } else if (error.request) {
        console.error('未收到伺服器響應:', error.request);
        alert('無法連接到伺服器，請檢查網絡');
    } else {
        console.error('未知錯誤:', error.message);
        alert(fallbackMessage);
    }
}
