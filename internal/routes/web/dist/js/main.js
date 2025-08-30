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