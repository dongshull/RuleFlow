// 工具类
const Utils = {
    // 显示消息提示
    showMessage(message, type = 'info', duration = 3000) {
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = `alert alert-${type}`;
        messageElement.textContent = message;
        
        // 添加到页面
        document.body.appendChild(messageElement);
        
        // 设置自动消失
        setTimeout(() => {
            messageElement.classList.add('fade-out');
            setTimeout(() => {
                document.body.removeChild(messageElement);
            }, 500);
        }, duration);
    },
    
    // 格式化日期时间
    formatDateTime(date) {
        return new Date(date).toLocaleString('zh-CN');
    },
    
    // 获取当前用户信息
    getCurrentUser() {
        // 这里可以实现用户认证相关的逻辑
        return {
            id: 1,
            name: '管理员',
            role: 'admin'
        };
    }
};
// 模态框组件
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        if (!this.modal) {
            console.error(`模态框元素不存在: #${modalId}`);
            return;
        }
        
        // 初始化
        this.init();
    }
    
    init() {
        // 绑定关闭按钮事件
        const closeBtn = this.modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }
        
        // 点击外部关闭
        window.addEventListener('click', (event) => {
            if (event.target === this.modal) {
                this.hide();
            }
        });
    }
    
    // 显示模态框
    show() {
        if (this.modal) {
            this.modal.style.display = 'block';
        }
    }
    
    // 隐藏模态框
    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
        }
    }
}
// 页面切换器组件
class PageSwitcher {
    constructor() {
        this.currentPage = 'dashboard';
        this.pages = ['dashboard', 'api-keys', 'files', 'settings'];
        
        // 绑定导航事件
        this.initNavigation();
    }
    
    // 初始化导航
    initNavigation() {
        document.querySelectorAll('[data-nav]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-nav');
                this.showPage(page);
            });
        });
    }
    
    // 显示指定页面
    showPage(page) {
        if (!this.pages.includes(page)) {
            console.error(`页面不存在: ${page}`);
            return;
        }
        
        // 移除当前页面类
        document.body.classList.remove(`page-${this.currentPage}`);
        
        // 更新当前页面
        this.currentPage = page;
        
        // 添加新页面类
        document.body.classList.add(`page-${this.currentPage}`);
        
        // 触发页面显示事件
        this.onPageShow(page);
    }
    
    // 页面显示时的回调
    onPageShow(page) {
        // 可以在页面模块中重写此方法
        console.log(`页面显示: ${page}`);
    }
}
// API基础URL
const API_BASE_URL = '/api';

// DOM元素
const elements = {
    adminApiKey: document.getElementById('adminApiKey'),
    toggleAdminKeyVisibility: document.getElementById('toggleAdminKeyVisibility'),
    apiKeyTable: document.getElementById('apiKeyTable').querySelector('tbody'),
    noApiKeysMessage: document.getElementById('noApiKeysMessage'),
    addApiKeyBtn: document.getElementById('addApiKeyBtn'),
    addApiKeyModal: document.getElementById('addApiKeyModal'),
    closeModal: document.querySelector('.close'),
    cancelAddApiKey: document.getElementById('cancelAddApiKey'),
    confirmAddApiKey: document.getElementById('confirmAddApiKey'),
    newApiKeyNote: document.getElementById('newApiKeyNote'),
    newApiKeyToken: document.getElementById('newApiKeyToken'),
    filePath: document.getElementById('filePath'),
    fileApiKey: document.getElementById('fileApiKey'),
    toggleFileKeyVisibility: document.getElementById('toggleFileKeyVisibility'),
    getFileBtn: document.getElementById('getFileBtn'),
    fileContent: document.getElementById('fileContent'),
    fileContentText: document.getElementById('fileContentText')
};

// 页面模块对象
const PageModules = {
    // 仪表盘页面模块
    DashboardPage: {
        init: function() {
            // 仪表盘页面初始化代码
        }
    },
    
    // API密钥页面模块
    ApiKeysPage: {
        init: function() {
            bindEventListeners();
            
            // 尝试从localStorage获取管理员API密钥
            const savedAdminKey = localStorage.getItem('adminApiKey');
            if (savedAdminKey) {
                elements.adminApiKey.value = savedAdminKey;
                loadApiKeys(savedAdminKey);
            }
        }
    },
    
    // 文件页面模块
    FilesPage: {
        init: function() {
            // 文件页面初始化代码
            bindEventListenersForFiles();
        }
    },
    
    // 设置页面模块
    SettingsPage: {
        init: function() {
            // 设置页面初始化代码
        }
    }
};

// 绑定通用事件监听器
function bindEventListeners() {
    // 管理员API密钥可见性切换
    elements.toggleAdminKeyVisibility.addEventListener('click', function() {
        togglePasswordVisibility(elements.adminApiKey, elements.toggleAdminKeyVisibility);
    });
    
    // 添加API密钥按钮
    elements.addApiKeyBtn.addEventListener('click', function() {
        if (!elements.adminApiKey.value) {
            alert('请先输入管理员API密钥');
            return;
        }
        elements.addApiKeyModal.style.display = 'block';
    });
    
    // 关闭模态框
    elements.closeModal.addEventListener('click', function() {
        elements.addApiKeyModal.style.display = 'none';
    });
    
    // 取消添加API密钥
    elements.cancelAddApiKey.addEventListener('click', function() {
        elements.addApiKeyModal.style.display = 'none';
    });
    
    // 确认添加API密钥
    elements.confirmAddApiKey.addEventListener('click', function() {
        addApiKey();
    });
    
    // 管理员API密钥输入变化时保存到localStorage
    elements.adminApiKey.addEventListener('input', function() {
        localStorage.setItem('adminApiKey', elements.adminApiKey.value);
    });
}

// 绑定文件相关的事件监听器
function bindEventListenersForFiles() {
    // 文件API密钥可见性切换
    elements.toggleFileKeyVisibility.addEventListener('click', function() {
        togglePasswordVisibility(elements.fileApiKey, elements.toggleFileKeyVisibility);
    });
    
    // 获取文件按钮
    elements.getFileBtn.addEventListener('click', function() {
        getFile();
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === elements.addApiKeyModal) {
            elements.addApiKeyModal.style.display = 'none';
        }
    });
}

// 切换密码可见性
function togglePasswordVisibility(input, button) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const icon = button.querySelector('i');
    if (type === 'password') {
        icon.className = 'fas fa-eye';
    } else {
        icon.className = 'fas fa-eye-slash';
    }
}

// 加载API密钥列表
function loadApiKeys(adminKey) {
    fetch(`${API_BASE_URL}/keys?api=${encodeURIComponent(adminKey)}`)
        .then(response => response.json())
        .then(data => {
            renderApiKeys(data);
        })
        .catch(error => {
            console.error('加载API密钥失败:', error);
            alert('加载API密钥失败，请检查管理员API密钥是否正确');
        });
}

// 渲染API密钥列表
function renderApiKeys(apiKeys) {
    // 清空现有数据
    elements.apiKeyTable.innerHTML = '';
    
    if (apiKeys.length === 0) {
        elements.noApiKeysMessage.style.display = 'block';
        return;
    }
    
    elements.noApiKeysMessage.style.display = 'none';
    
    // 渲染每个API密钥
    apiKeys.forEach(key => {
        const row = document.createElement('tr');
        
        // 格式化创建时间
        const createdAt = new Date(key.created_at).toLocaleString('zh-CN');
        
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
        
        elements.apiKeyTable.appendChild(row);
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteApiKey(id);
        });
    });
}

// 添加API密钥
function addApiKey() {
    const adminKey = elements.adminApiKey.value;
    const note = elements.newApiKeyNote.value;
    const token = elements.newApiKeyToken.value;
    
    if (!adminKey) {
        alert('请先输入管理员API密钥');
        return;
    }
    
    if (!note) {
        alert('请输入备注信息');
        return;
    }
    
    const requestData = {
        note: note
    };
    
    if (token) {
        requestData.token = token;
    }
    
    fetch(`${API_BASE_URL}/keys?api=${encodeURIComponent(adminKey)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('添加API密钥失败');
        }
    })
    .then(data => {
        // 关闭模态框并清空表单
        elements.addApiKeyModal.style.display = 'none';
        elements.newApiKeyNote.value = '';
        elements.newApiKeyToken.value = '';
        
        // 重新加载API密钥列表
        loadApiKeys(adminKey);
        
        alert('API密钥添加成功');
    })
    .catch(error => {
        console.error('添加API密钥失败:', error);
        alert('添加API密钥失败: ' + error.message);
    });
}

// 删除API密钥
function deleteApiKey(id) {
    const adminKey = elements.adminApiKey.value;
    
    if (!adminKey) {
        alert('请先输入管理员API密钥');
        return;
    }
    
    if (!confirm('确定要删除这个API密钥吗？此操作不可恢复。')) {
        return;
    }
    
    fetch(`${API_BASE_URL}/keys/${id}?api=${encodeURIComponent(adminKey)}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // 重新加载API密钥列表
            loadApiKeys(adminKey);
            alert('API密钥删除成功');
        } else {
            throw new Error('删除API密钥失败');
        }
    })
    .catch(error => {
        console.error('删除API密钥失败:', error);
        alert('删除API密钥失败: ' + error.message);
    });
}

// 获取文件
function getFile() {
    const path = elements.filePath.value;
    const apiKey = elements.fileApiKey.value;
    
    if (!path) {
        alert('请输入文件路径');
        return;
    }
    
    let url = `${API_BASE_URL}/files?path=${encodeURIComponent(path)}`;
    
    if (apiKey) {
        url += `&api=${encodeURIComponent(apiKey)}`;
    }
    
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else if (response.status === 401) {
                throw new Error('API密钥无效或缺失');
            } else if (response.status === 404) {
                throw new Error('文件未找到');
            } else {
                throw new Error('获取文件失败');
            }
        })
        .then(data => {
            elements.fileContentText.textContent = data;
            elements.fileContent.classList.remove('hidden');
        })
        .catch(error => {
            console.error('获取文件失败:', error);
            alert('获取文件失败: ' + error.message);
            elements.fileContent.classList.add('hidden');
        });
}
// 前端主入口文件

document.addEventListener('DOMContentLoaded', function() {
    // 初始化页面切换器
    window.pageSwitcher = new PageSwitcher();
    
    // 初始化各个页面模块
    window.DashboardPage.init();
    window.ApiKeysPage.init();
    window.FilesPage.init();
    window.StatisticsPage.init();
    window.SettingsPage.init();
    
    // 初始化模态框
    window.addApiKeyModal = new Modal('add-api-key-modal');
    
    // 显示欢迎消息
    Utils.showMessage('欢迎使用USG-LEGO管理面板', 'success');
});

// 页面可见性变化时重新加载当前页面数据
document.addEventListener('visibilitychange', function() {
    if (!document.hidden && window.pageSwitcher) {
        window.pageSwitcher.onPageShow(window.pageSwitcher.currentPage);
    }
});
// API基础URL
const API_BASE_URL = '/api';

// DOM元素
const elements = {
    adminApiKey: document.getElementById('adminApiKey'),
    toggleAdminKeyVisibility: document.getElementById('toggleAdminKeyVisibility'),
    apiKeyTable: document.getElementById('apiKeyTable').querySelector('tbody'),
    noApiKeysMessage: document.getElementById('noApiKeysMessage'),
    addApiKeyBtn: document.getElementById('addApiKeyBtn'),
    addApiKeyModal: document.getElementById('addApiKeyModal'),
    closeModal: document.querySelector('.close'),
    cancelAddApiKey: document.getElementById('cancelAddApiKey'),
    confirmAddApiKey: document.getElementById('confirmAddApiKey'),
    newApiKeyNote: document.getElementById('newApiKeyNote'),
    newApiKeyToken: document.getElementById('newApiKeyToken'),
    filePath: document.getElementById('filePath'),
    fileApiKey: document.getElementById('fileApiKey'),
    toggleFileKeyVisibility: document.getElementById('toggleFileKeyVisibility'),
    getFileBtn: document.getElementById('getFileBtn'),
    fileContent: document.getElementById('fileContent'),
    fileContentText: document.getElementById('fileContentText')
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    // 绑定事件监听器
    bindEventListeners();
    
    // 尝试从localStorage获取管理员API密钥
    const savedAdminKey = localStorage.getItem('adminApiKey');
    if (savedAdminKey) {
        elements.adminApiKey.value = savedAdminKey;
        loadApiKeys(savedAdminKey);
    }
});

// 绑定事件监听器
function bindEventListeners() {
    // 管理员API密钥可见性切换
    elements.toggleAdminKeyVisibility.addEventListener('click', function() {
        togglePasswordVisibility(elements.adminApiKey, elements.toggleAdminKeyVisibility);
    });
    
    // 文件API密钥可见性切换
    elements.toggleFileKeyVisibility.addEventListener('click', function() {
        togglePasswordVisibility(elements.fileApiKey, elements.toggleFileKeyVisibility);
    });
    
    // 添加API密钥按钮
    elements.addApiKeyBtn.addEventListener('click', function() {
        if (!elements.adminApiKey.value) {
            alert('请先输入管理员API密钥');
            return;
        }
        elements.addApiKeyModal.style.display = 'block';
    });
    
    // 关闭模态框
    elements.closeModal.addEventListener('click', function() {
        elements.addApiKeyModal.style.display = 'none';
    });
    
    // 取消添加API密钥
    elements.cancelAddApiKey.addEventListener('click', function() {
        elements.addApiKeyModal.style.display = 'none';
    });
    
    // 确认添加API密钥
    elements.confirmAddApiKey.addEventListener('click', function() {
        addApiKey();
    });
    
    // 获取文件按钮
    elements.getFileBtn.addEventListener('click', function() {
        getFile();
    });
    
    // 点击模态框外部关闭
    window.addEventListener('click', function(event) {
        if (event.target === elements.addApiKeyModal) {
            elements.addApiKeyModal.style.display = 'none';
        }
    });
    
    // 管理员API密钥输入变化时保存到localStorage
    elements.adminApiKey.addEventListener('input', function() {
        localStorage.setItem('adminApiKey', elements.adminApiKey.value);
    });
}

// 切换密码可见性
function togglePasswordVisibility(input, button) {
    const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
    input.setAttribute('type', type);
    
    const icon = button.querySelector('i');
    if (type === 'password') {
        icon.className = 'fas fa-eye';
    } else {
        icon.className = 'fas fa-eye-slash';
    }
}

// 加载API密钥列表
function loadApiKeys(adminKey) {
    fetch(`${API_BASE_URL}/keys?api=${encodeURIComponent(adminKey)}`)
        .then(response => response.json())
        .then(data => {
            renderApiKeys(data);
        })
        .catch(error => {
            console.error('加载API密钥失败:', error);
            alert('加载API密钥失败，请检查管理员API密钥是否正确');
        });
}

// 渲染API密钥列表
function renderApiKeys(apiKeys) {
    // 清空现有数据
    elements.apiKeyTable.innerHTML = '';
    
    if (apiKeys.length === 0) {
        elements.noApiKeysMessage.style.display = 'block';
        return;
    }
    
    elements.noApiKeysMessage.style.display = 'none';
    
    // 渲染每个API密钥
    apiKeys.forEach(key => {
        const row = document.createElement('tr');
        
        // 格式化创建时间
        const createdAt = new Date(key.created_at).toLocaleString('zh-CN');
        
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
        
        elements.apiKeyTable.appendChild(row);
    });
    
    // 绑定删除按钮事件
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            const id = this.getAttribute('data-id');
            deleteApiKey(id);
        });
    });
}

// 添加API密钥
function addApiKey() {
    const adminKey = elements.adminApiKey.value;
    const note = elements.newApiKeyNote.value;
    const token = elements.newApiKeyToken.value;
    
    if (!adminKey) {
        alert('请先输入管理员API密钥');
        return;
    }
    
    if (!note) {
        alert('请输入备注信息');
        return;
    }
    
    const requestData = {
        note: note
    };
    
    if (token) {
        requestData.token = token;
    }
    
    fetch(`${API_BASE_URL}/keys?api=${encodeURIComponent(adminKey)}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('添加API密钥失败');
        }
    })
    .then(data => {
        // 关闭模态框并清空表单
        elements.addApiKeyModal.style.display = 'none';
        elements.newApiKeyNote.value = '';
        elements.newApiKeyToken.value = '';
        
        // 重新加载API密钥列表
        loadApiKeys(adminKey);
        
        alert('API密钥添加成功');
    })
    .catch(error => {
        console.error('添加API密钥失败:', error);
        alert('添加API密钥失败: ' + error.message);
    });
}

// 删除API密钥
function deleteApiKey(id) {
    const adminKey = elements.adminApiKey.value;
    
    if (!adminKey) {
        alert('请先输入管理员API密钥');
        return;
    }
    
    if (!confirm('确定要删除这个API密钥吗？此操作不可恢复。')) {
        return;
    }
    
    fetch(`${API_BASE_URL}/keys/${id}?api=${encodeURIComponent(adminKey)}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            // 重新加载API密钥列表
            loadApiKeys(adminKey);
            alert('API密钥删除成功');
        } else {
            throw new Error('删除API密钥失败');
        }
    })
    .catch(error => {
        console.error('删除API密钥失败:', error);
        alert('删除API密钥失败: ' + error.message);
    });
}

// 获取文件
function getFile() {
    const path = elements.filePath.value;
    const apiKey = elements.fileApiKey.value;
    
    if (!path) {
        alert('请输入文件路径');
        return;
    }
    
    let url = `${API_BASE_URL}/files?path=${encodeURIComponent(path)}`;
    
    if (apiKey) {
        url += `&api=${encodeURIComponent(apiKey)}`;
    }
    
    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.text();
            } else if (response.status === 401) {
                throw new Error('API密钥无效或缺失');
            } else if (response.status === 404) {
                throw new Error('文件未找到');
            } else {
                throw new Error('获取文件失败');
            }
        })
        .then(data => {
            elements.fileContentText.textContent = data;
            elements.fileContent.classList.remove('hidden');
        })
        .catch(error => {
            console.error('获取文件失败:', error);
            alert('获取文件失败: ' + error.message);
            elements.fileContent.classList.add('hidden');
        });
}