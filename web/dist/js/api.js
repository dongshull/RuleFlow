// API接口模块

class ApiClient {
    constructor() {
        this.baseUrl = '/api';
        this.defaultHeaders = {
            'Content-Type': 'application/json'
        };
    }

    // 获取API基础URL
    getBaseURL() {
        return this.baseUrl;
    }

    // 设置API基础URL
    setBaseURL(url) {
        this.baseUrl = url;
    }

    // 构建完整URL
    buildUrl(endpoint) {
        return `${this.baseUrl}${endpoint}`;
    }

    // 发送GET请求
    async get(endpoint, params = {}) {
        try {
            const url = new URL(this.buildUrl(endpoint), window.location.origin);
            
            // 添加查询参数
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: this.defaultHeaders
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(`GET请求失败: ${error.message}`);
        }
    }

    // 发送POST请求
    async post(endpoint, data = {}, params = {}) {
        try {
            const url = new URL(this.buildUrl(endpoint), window.location.origin);
            
            // 添加查询参数
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(url.toString(), {
                method: 'POST',
                headers: this.defaultHeaders,
                body: JSON.stringify(data)
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(`POST请求失败: ${error.message}`);
        }
    }

    // 发送DELETE请求
    async delete(endpoint, params = {}) {
        try {
            const url = new URL(this.buildUrl(endpoint), window.location.origin);
            
            // 添加查询参数
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined && params[key] !== null) {
                    url.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(url.toString(), {
                method: 'DELETE',
                headers: this.defaultHeaders
            });

            return await this.handleResponse(response);
        } catch (error) {
            throw new Error(`DELETE请求失败: ${error.message}`);
        }
    }

    // 处理响应
    async handleResponse(response) {
        const contentType = response.headers.get('content-type');
        
        if (contentType && contentType.includes('application/json')) {
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return data;
        } else {
            const text = await response.text();
            
            if (!response.ok) {
                throw new Error(text || `HTTP ${response.status}: ${response.statusText}`);
            }
            
            return text;
        }
    }

    // 获取API密钥列表
    async getApiKeys(adminKey) {
        if (!adminKey) {
            throw new Error('管理员API密钥不能为空');
        }
        
        return await this.get('/keys', { api: adminKey });
    }

    // 创建API密钥
    async createApiKey(adminKey, note, token = null) {
        if (!adminKey) {
            throw new Error('管理员API密钥不能为空');
        }
        
        if (!note) {
            throw new Error('备注信息不能为空');
        }
        
        const data = { note };
        if (token) {
            data.token = token;
        }
        
        return await this.post('/keys', data, { api: adminKey });
    }

    // 删除API密钥
    async deleteApiKey(adminKey, id) {
        if (!adminKey) {
            throw new Error('管理员API密钥不能为空');
        }
        
        if (!id) {
            throw new Error('API密钥ID不能为空');
        }
        
        return await this.delete(`/keys/${id}`, { api: adminKey });
    }

    // 获取文件内容
    async getFile(path, apiKey = null) {
        if (!path) {
            throw new Error('文件路径不能为空');
        }
        
        const params = { path };
        if (apiKey) {
            params.api = apiKey;
        }
        
        return await this.get('/files', params);
    }
}

// 创建API客户端实例
const apiClient = new ApiClient();

// 导出API客户端
window.ApiClient = ApiClient;
window.api = apiClient;