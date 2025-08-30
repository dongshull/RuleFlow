// 访问统计页面模块

window.StatisticsPage = {
    init() {
        this.bindEvents();
        this.loadStats();
    },

    bindEvents() {
        // 筛选按钮事件
        document.getElementById('filter-stats-btn').addEventListener('click', () => {
            this.loadStats();
        });
    },

    async loadStats() {
        try {
            // 获取筛选条件
            const filePath = document.getElementById('stats-file-path').value;
            const dateRange = document.getElementById('stats-date-range').value;

            // 模拟统计数据
            const stats = {
                totalRequests: 1247,
                uniqueIPs: 23,
                uniqueFiles: 8,
                uniquePaths: 15
            };

            // 更新统计数字
            document.getElementById('total-requests').textContent = stats.totalRequests;
            document.getElementById('unique-ips').textContent = stats.uniqueIPs;
            document.getElementById('unique-files').textContent = stats.uniqueFiles;
            document.getElementById('unique-paths').textContent = stats.uniquePaths;

            // 模拟访问记录数据
            const accessLogs = [
                {
                    time: '2025-08-30 14:30:22',
                    ip: '192.168.1.100',
                    path: '/public/public.conf',
                    method: 'GET',
                    status: 200,
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                },
                {
                    time: '2025-08-30 14:28:15',
                    ip: '192.168.1.101',
                    path: '/private.rules',
                    method: 'GET',
                    status: 200,
                    userAgent: 'Quantumult X/1.0'
                },
                {
                    time: '2025-08-30 14:25:44',
                    ip: '192.168.1.102',
                    path: '/public/assets/logo.png',
                    method: 'GET',
                    status: 200,
                    userAgent: 'Surge iOS/4.5'
                },
                {
                    time: '2025-08-30 14:22:33',
                    ip: '192.168.1.100',
                    path: '/public/public.conf',
                    method: 'GET',
                    status: 200,
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
                },
                {
                    time: '2025-08-30 14:20:11',
                    ip: '192.168.1.103',
                    path: '/conf/app.conf',
                    method: 'GET',
                    status: 200,
                    userAgent: 'ClashX/1.2.3'
                }
            ];

            this.renderAccessLogs(accessLogs);
        } catch (error) {
            console.error('加载统计数据失败:', error);
            Utils.showMessage(`加载统计数据失败: ${error.message}`, 'error');
        }
    },

    renderAccessLogs(logs) {
        const tableBody = document.querySelector('#access-logs-table tbody');
        const noLogsMessage = document.getElementById('no-access-logs-message');

        // 清空现有数据
        tableBody.innerHTML = '';

        if (!logs || logs.length === 0) {
            noLogsMessage.style.display = 'block';
            return;
        }

        noLogsMessage.style.display = 'none';

        // 渲染每条访问记录
        logs.forEach(log => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${log.time}</td>
                <td>${log.ip}</td>
                <td>${log.path}</td>
                <td>${log.method}</td>
                <td><span class="status-${log.status}">${log.status}</span></td>
                <td>${log.userAgent}</td>
            `;
            tableBody.appendChild(row);
        });
    }
};