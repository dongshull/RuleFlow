// 组件模块

// 页面切换组件
class PageSwitcher {
    constructor() {
        this.currentPage = 'dashboard';
        this.init();
    }

    init() {
        // 使用事件委托绑定导航链接点击事件
        document.querySelector('.nav-menu').addEventListener('click', (e) => {
            const link = e.target.closest('.nav-link');
            if (link) {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.switchTo(page);
            }
        });
    }

    switchTo(pageName) {
        // 隐藏当前页面
        const currentPageElement = document.getElementById(`${this.currentPage}-page`);
        if (currentPageElement) {
            currentPageElement.classList.remove('active');
        }

        // 显示目标页面
        const targetPageElement = document.getElementById(`${pageName}-page`);
        if (targetPageElement) {
            targetPageElement.classList.add('active');
        }

        // 更新导航链接状态
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        const activeNavLink = document.getElementById(`nav-${pageName}`);
        if (activeNavLink) {
            activeNavLink.classList.add('active');
        }

        // 更新当前页面
        this.currentPage = pageName;

        // 触发页面显示事件
        this.onPageShow(pageName);
    }

    onPageShow(pageName) {
        // 根据页面名称触发相应的初始化函数
        switch (pageName) {
            case 'dashboard':
                if (typeof window.DashboardPage !== 'undefined') {
                    window.DashboardPage.init();
                }
                break;
            case 'apikeys':
                if (typeof window.ApiKeysPage !== 'undefined') {
                    window.ApiKeysPage.init();
                }
                break;
            case 'files':
                if (typeof window.FilesPage !== 'undefined') {
                    window.FilesPage.init();
                }
                break;
            case 'statistics':
                if (typeof window.StatisticsPage !== 'undefined') {
                    window.StatisticsPage.init();
                }
                break;
            case 'settings':
                if (typeof window.SettingsPage !== 'undefined') {
                    window.SettingsPage.init();
                }
                break;
        }
    }
}

// 模态框组件
class Modal {
    constructor(modalId) {
        this.modal = document.getElementById(modalId);
        this.init();
    }

    init() {
        if (!this.modal) return;

        // 绑定关闭按钮事件
        const closeBtn = this.modal.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.hide();
            });
        }

        // 点击模态框外部关闭
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.hide();
            }
        });
    }

    show() {
        if (this.modal) {
            this.modal.style.display = 'block';
            // 阻止背景滚动
            document.body.style.overflow = 'hidden';
        }
    }

    hide() {
        if (this.modal) {
            this.modal.style.display = 'none';
            // 恢复背景滚动
            document.body.style.overflow = '';
        }
    }
}

// 表格组件
class DataTable {
    constructor(tableId) {
        this.table = document.getElementById(tableId);
        this.tbody = this.table ? this.table.querySelector('tbody') : null;
    }

    clear() {
        if (this.tbody) {
            this.tbody.innerHTML = '';
        }
    }

    addRow(data) {
        if (!this.tbody) return;

        const row = document.createElement('tr');
        row.innerHTML = data;
        this.tbody.appendChild(row);
    }

    setData(data, columns) {
        this.clear();
        
        if (!data || data.length === 0) {
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="${columns.length}" class="empty-cell">暂无数据</td>`;
            this.tbody.appendChild(emptyRow);
            return;
        }

        data.forEach(item => {
            const row = document.createElement('tr');
            columns.forEach(column => {
                const cell = document.createElement('td');
                if (typeof column === 'function') {
                    cell.innerHTML = column(item);
                } else if (typeof column === 'string') {
                    cell.textContent = item[column];
                }
                row.appendChild(cell);
            });
            this.tbody.appendChild(row);
        });
    }
}

// 导出组件
window.PageSwitcher = PageSwitcher;
window.Modal = Modal;
window.DataTable = DataTable;