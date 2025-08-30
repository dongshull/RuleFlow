// 设置页面模块

window.SettingsPage = {
    init() {
        this.bindEvents();
        this.loadSettings();
    },

    bindEvents() {
        // 保存设置按钮
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.saveSettings();
        });

        // 主题选择器
        document.getElementById('theme-selector').addEventListener('change', (e) => {
            this.changeTheme(e.target.value);
        });
    },

    loadSettings() {
        // 加载保存的设置
        const savedTheme = Utils.getLocalStorage('theme', 'light');
        document.getElementById('theme-selector').value = savedTheme;
        
        // 应用主题
        this.changeTheme(savedTheme);
    },

    saveSettings() {
        try {
            const theme = document.getElementById('theme-selector').value;
            
            // 保存设置
            Utils.setLocalStorage('theme', theme);
            
            Utils.showMessage('设置保存成功', 'success');
        } catch (error) {
            console.error('保存设置失败:', error);
            Utils.showMessage(`保存设置失败: ${error.message}`, 'error');
        }
    },

    changeTheme(theme) {
        // 这里可以实现主题切换逻辑
        document.body.className = theme === 'dark' ? 'dark-theme' : '';
        Utils.setLocalStorage('theme', theme);
    }
};