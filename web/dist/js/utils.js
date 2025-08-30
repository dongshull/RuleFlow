// 工具函数模块

const Utils = {
    // 显示通知消息
    showMessage(message, type = 'info', duration = 3000) {
        // 创建通知元素
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        
        // 添加样式
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '15px 20px',
            borderRadius: '8px',
            color: 'white',
            fontWeight: '500',
            zIndex: '10000',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            transform: 'translateX(0)',
            transition: 'transform 0.3s ease'
        });
        
        // 设置不同类型的颜色
        switch (type) {
            case 'success':
                notification.style.background = 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
                break;
            case 'error':
                notification.style.background = 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
                break;
            case 'warning':
                notification.style.background = 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
                break;
            default:
                notification.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        }
        
        // 添加到页面
        document.body.appendChild(notification);
        
        // 自动移除
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    },

    // 切换密码可见性
    togglePasswordVisibility(inputId, buttonId) {
        const input = document.getElementById(inputId);
        const button = document.getElementById(buttonId);
        const icon = button.querySelector('i');
        
        if (input && button && icon) {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            
            if (type === 'password') {
                icon.className = 'fas fa-eye';
            } else {
                icon.className = 'fas fa-eye-slash';
            }
        }
    },

    // 格式化日期时间
    formatDateTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    },

    // 存储本地数据
    setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Failed to set localStorage:', e);
            return false;
        }
    },

    // 获取本地数据
    getLocalStorage(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Failed to get localStorage:', e);
            return defaultValue;
        }
    },

    // 检查API密钥是否有效
    isValidApiKey(apiKey) {
        return typeof apiKey === 'string' && apiKey.length > 0;
    }
};

// 导出工具函数
window.Utils = Utils;