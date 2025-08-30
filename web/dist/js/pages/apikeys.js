// API密钥管理页面模块

window.ApiKeysPage = {
    init() {
        this.bindEvents();
        this.loadSavedAdminKey();
    },

    bindEvents() {
        // 管理员API密钥可见性切换
        document.getElementById('toggle-admin-key-visibility').addEventListener('click', () => {
            Utils.togglePasswordVisibility('admin-api-key', 'toggle-admin-key-visibility');
        });

        // 添加API密钥按钮
        document.getElementById('add-api-key-btn').addEventListener('click', () => {
            const addApiKeyModal = new Modal('add-api-key-modal');
            addApiKeyModal.show();
        });

        // 添加API密钥模态框事件
        document.getElementById('cancel-add-api-key').addEventListener('click', () => {
            const addApiKeyModal = new Modal('add-api-key-modal');
            addApiKeyModal.hide();
        });

        document.getElementById('confirm-add-api-key').addEventListener('click', () => {
            this.addApiKey();
        });

        // 管理员API密钥输入变化时保存到localStorage
        document.getElementById('admin-api-key').addEventListener('input', (e) => {
            Utils.setLocalStorage('adminApiKey', e.target.value);
        });
    },

    loadSavedAdminKey() {
        const savedAdminKey = Utils.getLocalStorage('adminApiKey');
        if (savedAdminKey) {
            document.getElementById('admin-api-key').value = savedAdminKey;
            this.loadApiKeys(savedAdminKey);
        }
    },

    async loadApiKeys(adminKey) {
        try {
            if (!Utils.isValidApiKey(adminKey)) {
                Utils.showMessage('请输入有效的管理员API密钥', 'warning');
                return;
            }

            const apiKeys = await api.getApiKeys(adminKey);
            this.renderApiKeys(apiKeys);
        } catch (error) {
            console.error('加载API密钥失败:', error);
            Utils.showMessage(`加载API密钥失败: ${error.message}`, 'error');
            this.renderApiKeys([]); // 清空表格
        }
    },

    renderApiKeys(apiKeys) {
        const tableBody = document.querySelector('#api-keys-table tbody');
        const noApiKeysMessage = document.getElementById('no-api-keys-message');

        // 清空现有数据
        tableBody.innerHTML = '';

        if (!apiKeys || apiKeys.length === 0) {
            noApiKeysMessage.style.display = 'block';
            return;
        }

        noApiKeysMessage.style.display = 'none';

        // 渲染每个API密钥
        apiKeys.forEach(key => {
            const row = document.createElement('tr');
            
            // 格式化创建时间
            const createdAt = Utils.formatDateTime(key.created_at);
            
            row.innerHTML = `
                <td>${key.id}</td>
                <td class="token-cell">${key.token}</td>
                <td>${key.note || '-'}</td>
                <td>${createdAt}</td>
                <td>
                    <button class="delete-btn" data-id="${key.id}">
                        <i class="fas fa-trash"></i> 删除
                    </button>
                </td>
            `;
            
            tableBody.appendChild(row);
        });

        // 绑定删除按钮事件
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const id = button.getAttribute('data-id');
                this.deleteApiKey(id);
            });
        });
    },

    async addApiKey() {
        try {
            const adminKey = document.getElementById('admin-api-key').value;
            const note = document.getElementById('new-api-key-note').value;
            const token = document.getElementById('new-api-key-token').value;

            if (!Utils.isValidApiKey(adminKey)) {
                Utils.showMessage('请先输入管理员API密钥', 'warning');
                return;
            }

            if (!note) {
                Utils.showMessage('请输入备注信息', 'warning');
                return;
            }

            const newKey = await api.createApiKey(adminKey, note, token);

            // 关闭模态框并清空表单
            const addApiKeyModal = new Modal('add-api-key-modal');
            addApiKeyModal.hide();
            
            document.getElementById('new-api-key-note').value = '';
            document.getElementById('new-api-key-token').value = '';

            // 重新加载API密钥列表
            this.loadApiKeys(adminKey);
            
            Utils.showMessage('API密钥添加成功', 'success');
        } catch (error) {
            console.error('添加API密钥失败:', error);
            Utils.showMessage(`添加API密钥失败: ${error.message}`, 'error');
        }
    },

    async deleteApiKey(id) {
        try {
            const adminKey = document.getElementById('admin-api-key').value;

            if (!Utils.isValidApiKey(adminKey)) {
                Utils.showMessage('请先输入管理员API密钥', 'warning');
                return;
            }

            if (!confirm('确定要删除这个API密钥吗？此操作不可恢复。')) {
                return;
            }

            await api.deleteApiKey(adminKey, id);

            // 重新加载API密钥列表
            this.loadApiKeys(adminKey);
            
            Utils.showMessage('API密钥删除成功', 'success');
        } catch (error) {
            console.error('删除API密钥失败:', error);
            Utils.showMessage(`删除API密钥失败: ${error.message}`, 'error');
        }
    }
};