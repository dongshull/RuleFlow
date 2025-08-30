// 文件管理页面模块

window.FilesPage = {
    init() {
        this.bindEvents();
        this.loadSavedFileApiKey();
    },

    bindEvents() {
        // 文件API密钥可见性切换
        document.getElementById('toggle-file-key-visibility').addEventListener('click', () => {
            Utils.togglePasswordVisibility('file-api-key', 'toggle-file-key-visibility');
        });

        // 浏览文件按钮
        document.getElementById('browse-file-btn').addEventListener('click', () => {
            this.browseFile();
        });

        // 获取文件按钮
        document.getElementById('get-file-btn').addEventListener('click', () => {
            this.getFile();
        });

        // 文件API密钥输入变化时保存到localStorage
        document.getElementById('file-api-key').addEventListener('input', (e) => {
            Utils.setLocalStorage('fileApiKey', e.target.value);
        });
    },

    loadSavedFileApiKey() {
        const savedFileKey = Utils.getLocalStorage('fileApiKey');
        if (savedFileKey) {
            document.getElementById('file-api-key').value = savedFileKey;
        }
    },

    browseFile() {
        const path = document.getElementById('file-path').value;
        if (!path) {
            Utils.showMessage('请输入文件路径', 'warning');
            return;
        }

        // 这里可以实现文件浏览器功能
        Utils.showMessage(`浏览路径: ${path}`, 'info');
    },

    async getFile() {
        try {
            const path = document.getElementById('file-path').value;
            const apiKey = document.getElementById('file-api-key').value;

            if (!path) {
                Utils.showMessage('请输入文件路径', 'warning');
                return;
            }

            const fileContent = await api.getFile(path, apiKey);

            // 显示文件内容
            document.getElementById('file-content-text').textContent = fileContent;
            document.getElementById('file-content').classList.remove('hidden');
            document.getElementById('no-file-content').style.display = 'none';
            
            Utils.showMessage('文件获取成功', 'success');
        } catch (error) {
            console.error('获取文件失败:', error);
            Utils.showMessage(`获取文件失败: ${error.message}`, 'error');
            
            // 隐藏文件内容区域
            document.getElementById('file-content').classList.add('hidden');
            document.getElementById('no-file-content').style.display = 'block';
        }
    }
};