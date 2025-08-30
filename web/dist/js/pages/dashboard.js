// 仪表板页面模块

window.DashboardPage = {
    init() {
        this.loadStats();
        this.loadActivity();
    },

    async loadStats() {
        try {
            // 模拟统计数据
            const stats = {
                apiKeys: 3,
                files: 12,
                publicFiles: 5,
                privateFiles: 7
            };

            // 更新统计数字
            document.getElementById('api-keys-count').textContent = stats.apiKeys;
            document.getElementById('files-count').textContent = stats.files;
            document.getElementById('public-files-count').textContent = stats.publicFiles;
            document.getElementById('private-files-count').textContent = stats.privateFiles;
        } catch (error) {
            console.error('加载统计数据失败:', error);
        }
    },

    async loadActivity() {
        try {
            const activityList = document.getElementById('activity-list');
            
            // 模拟活动数据
            const activities = [
                { time: '2025-08-30 14:30:22', content: '创建了新的API密钥' },
                { time: '2025-08-30 13:45:17', content: '访问了私有文件 /private.rules' },
                { time: '2025-08-30 12:15:44', content: '更新了公共文件 /public/public.conf' },
                { time: '2025-08-30 10:22:01', content: '删除了API密钥 ID: 2' }
            ];

            // 清空现有内容
            activityList.innerHTML = '';

            // 添加活动项
            activities.forEach(activity => {
                const activityItem = document.createElement('div');
                activityItem.className = 'activity-item';
                activityItem.innerHTML = `
                    <div class="activity-time">${activity.time}</div>
                    <div class="activity-content">${activity.content}</div>
                `;
                activityList.appendChild(activityItem);
            });
        } catch (error) {
            console.error('加载活动数据失败:', error);
        }
    }
};