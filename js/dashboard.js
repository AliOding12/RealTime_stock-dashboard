/**
 * Stock Dashboard Main Controller
 * Manages the overall dashboard functionality, layout, and coordination between components
 */

class StockDashboard {
    constructor(options = {}) {
        this.options = {
            container: '#dashboard-container',
            maxCards: 20,
            defaultSymbols: ['AAPL', 'GOOGL', 'MSFT', 'TSLA', 'AMZN'],
            autoSave: true,
            theme: 'dark',
            layout: 'grid', // 'grid', 'list', 'masonry'
            refreshInterval: 30000,
            enableNotifications: true,
            enableSounds: true,
            compactMode: false,
            ...options
        };

        this.stockCards = new Map();
        this.watchlist = new Set();
        this.isInitialized = false;
        this.updateInterval = null;
        this.marketStatus = null;
        this.searchTimeout = null;

        this.init();
    }

    async init() {
        try {
            // Initialize DOM 
            this.initializeDOM();
            
            // Load configuration and preferences
            await this.loadUserPreferences();
            
            // Set up event listeners
            this.bindEvents();
            
            // Request notification permissions
            await this.requestNotificationPermission();
            
            // Load saved watchlist or default symbols
            await this.loadWatchlist();
            
            // Initialize market status monitoring
            this.initializeMarketStatus();
            
            // Start global updates
            this.startGlobalUpdates();
            
            // Mark as initialized
            this.isInitialized = true;
            
            this.showStatus('Dashboard initialized successfully', 'success');
            
        } catch (error) {
            console.error('Dashboard initialization failed:', error);
            this.showStatus('Failed to initialize dashboard', 'error');
        }
    }

    initializeDOM() {
        // Create main dashboard structure if it doesn't exist
        const container = document.querySelector(this.options.container);
        if (!container) {
            throw new Error(`Container ${this.options.container} not found`);
        }

        container.innerHTML = `
            <div class="dashboard-header">
                <div class="dashboard-title">
                    <h1>Stock Dashboard</h1>
                    <div class="market-status">
                        <span class="status-indicator"></span>
                        <span class="status-text">Checking market status...</span>
                    </div>
                </div>
                
                <div class="dashboard-controls">
                    <div class="search-container">
                        <input type="text" id="stock-search" placeholder="Search stocks (e.g., AAPL, Apple)" />
                        <button id="add-stock-btn" title="Add Stock">
                            <i class="icon-plus"></i>
                        </button>
                        <div class="search-suggestions" style="display: none;"></div>
                    </div>
                    
                    <div class="view-controls">
                        <button class="view-btn active" data-view="grid" title="Grid View">
                            <i class="icon-grid"></i>
                        </button>
                        <button class="view-btn" data-view="list" title="List View">
                            <i class="icon-list"></i>
                        </button>
                        <button class="view-btn" data-view="masonry" title="Masonry View">
                            <i class="icon-masonry"></i>
                        </button>
                    </div>
                    
                    <div class="dashboard-actions">
                        <button id="refresh-all-btn" title="Refresh All">
                            <i class="icon-refresh"></i>
                        </button>
                        <button id="export-btn" title="Export Data">
                            <i class="icon-download"></i>
                        </button>
                        <button id="settings-btn" title="Settings">
                            <i class="icon-settings"></i>
                        </button>
                        <button id="fullscreen-btn" title="Toggle Fullscreen">
                            <i class="icon-fullscreen"></i>
                        </button>
                    </div>
                </div>
            </div>

            <div class="dashboard-body">
                <div class="dashboard-sidebar">
                    <div class="watchlist-section">
                        <h3>Watchlist</h3>
                        <div class="watchlist-items"></div>
                        <button class="btn-clear-watchlist">Clear All</button>
                    </div>
                    
                    <div class="market-overview">
                        <h3>Market Overview</h3>
                        <div class="market-indices">
                            <div class="index-item" data-symbol="^GSPC">
                                <span class="index-name">S&P 500</span>
                                <span class="index-value">Loading...</span>
                            </div>
                            <div class="index-item" data-symbol="^DJI">
                                <span class="index-name">Dow Jones</span>
                                <span class="index-value">Loading...</span>
                            </div>
                            <div class="index-item" data-symbol="^IXIC">
                                <span class="index-name">NASDAQ</span>
                                <span class="index-value">Loading...</span>
                            </div>
                        </div>
                    </div>
                    
                    <div class="alerts-section">
                        <h3>Active Alerts</h3>
                        <div class="alerts-list"></div>
                    </div>
                </div>

                <div class="dashboard-main">
                    <div class="dashboard-toolbar">
                        <div class="stats-summary">
                            <div class="stat-item">
                                <span class="stat-label">Total Stocks:</span>
                                <span class="stat-value" id="total-stocks">0</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Portfolio Change:</span>
                                <span class="stat-value" id="portfolio-change">$0.00 (0.00%)</span>
                            </div>
                            <div class="stat-item">
                                <span class="stat-label">Last Update:</span>
                                <span class="stat-value" id="last-update">Never</span>
                            </div>
                        </div>
                        
                        <div class="filter-controls">
                            <select id="sort-select">
                                <option value="symbol">Sort by Symbol</option>
                                <option value="price">Sort by Price</option>
                                <option value="change">Sort by Change</option>
                                <option value="volume">Sort by Volume</option>
                            </select>
                            <button id="sort-direction" class="asc" title="Sort Direction">
                                <i class="icon-sort-asc"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="cards-container grid-layout" id="cards-container">
                        <div class="empty-state" style="display: none;">
                            <div class="empty-icon">📈</div>
                            <h3>No stocks added yet</h3>
                            <p>Search and add stocks to get started</p>
                            <button class="btn-add-default">Add Default Stocks</button>
                        </div>
                    </div>
                </div>
            </div>

            <div class="dashboard-footer">
                <div class="footer-info">
                    <span class="connection-status">
                        <span class="status-dot"></span>
                        <span class="status-text">Connected</span>
                    </span>
                    <span class="data-source">Data provided by Alpha Vantage API</span>
                </div>
                <div class="footer-actions">
                    <button id="toggle-theme">
                        <i class="icon-theme"></i>
                        <span>Dark Mode</span>
                    </button>
                </div>
            </div>

            <!-- Status Toast -->
            <div class="status-toast" id="status-toast"></div>

            <!-- Settings Modal -->
            <div class="modal-overlay" id="settings-modal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Dashboard Settings</h3>
                        <button class="modal-close">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="settings-section">
                            <h4>Display</h4>
                            <label>
                                <input type="checkbox" id="compact-mode"> Compact Mode
                            </label>
                            <label>
                                <input type="checkbox" id="show-charts"> Show Charts
                            </label>
                            <label>
                                Theme:
                                <select id="theme-select">
                                    <option value="dark">Dark</option>
                                    <option value="light">Light</option>
                                    <option value="auto">Auto</option>
                                </select>
                            </label>
                        </div>
                        
                        <div class="settings-section">
                            <h4>Updates</h4>
                            <label>
                                Refresh Interval:
                                <select id="refresh-interval">
                                    <option value="10000">10 seconds</option>
                                    <option value="30000">30 seconds</option>
                                    <option value="60000">1 minute</option>
                                    <option value="300000">5 minutes</option>
                                </select>
                            </label>
                            <label>
                                <input type="checkbox" id="auto-refresh"> Auto Refresh
                            </label>
                        </div>
                        
                        <div class="settings-section">
                            <h4>Notifications</h4>
                            <label>
                                <input type="checkbox" id="enable-notifications"> Browser Notifications
                            </label>
                            <label>
                                <input type="checkbox" id="enable-sounds"> Sound Alerts
                            </label>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-secondary" id="cancel-settings">Cancel</button>
                        <button class="btn-primary" id="save-settings">Save Settings</button>
                    </div>
                </div>
            </div>
        `;

        this.container = container;
        this.cardsContainer = container.querySelector('#cards-container');
    }

    bindEvents() {
        // Stock search and addition
        const searchInput = document.getElementById('stock-search');
        const addBtn = document.getElementById('add-stock-btn');
        
        searchInput.addEventListener('input', (e) => this.handleSearchInput(e));
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleAddStock();
        });
        addBtn.addEventListener('click', () => this.handleAddStock());

        // View controls
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.changeView(e.target.dataset.view));
        });

        // Dashboard actions
        document.getElementById('refresh-all-btn').addEventListener('click', () => this.refreshAll());
        document.getElementById('export-btn').addEventListener('click', () => this.exportData());
        document.getElementById('settings-btn').addEventListener('click', () => this.showSettings());
        document.getElementById('fullscreen-btn').addEventListener('click', () => this.toggleFullscreen());

        // Sort controls
        document.getElementById('sort-select').addEventListener('change', (e) => this.sortCards(e.target.value));
        document.getElementById('sort-direction').addEventListener('click', () => this.toggleSortDirection());

        // Watchlist controls
        document.querySelector('.btn-clear-watchlist').addEventListener('click', () => this.clearWatchlist());
        document.querySelector('.btn-add-default').addEventListener('click', () => this.addDefaultStocks());

        // Theme toggle
        document.getElementById('toggle-theme').addEventListener('click', () => this.toggleTheme());

        // Settings modal
        document.getElementById('cancel-settings').addEventListener('click', () => this.hideSettings());
        document.getElementById('save-settings').addEventListener('click', () => this.saveSettings());
        document.querySelector('.modal-close').addEventListener('click', () => this.hideSettings());

        // Global events
        window.addEventListener('stockCardRemoved', (e) => this.handleCardRemoved(e.detail.symbol));
        window.addEventListener('beforeunload', () => this.saveUserPreferences());
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    async handleSearchInput(e) {
        const query = e.target.value.trim();
        
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        
        if (query.length >= 1) {
            this.searchTimeout = setTimeout(() => {
                this.searchStocks(query);
            }, 300);
        } else {
            this.hideSuggestions();
        }
    }

    async searchStocks(query) {
        try {
            const response = await fetch(`php/search_stocks.php?q=${encodeURIComponent(query)}`);
            const results = await response.json();
            
            if (results.success && results.data.length > 0) {
                this.showSuggestions(results.data);
            } else {
                this.hideSuggestions();
            }
        } catch (error) {
            console.error('Stock search failed:', error);
            this.hideSuggestions();
        }
    }

    showSuggestions(suggestions) {
        const container = document.querySelector('.search-suggestions');
        
        container.innerHTML = suggestions.map(stock => `
            <div class="suggestion-item" data-symbol="${stock.symbol}">
                <div class="suggestion-symbol">${stock.symbol}</div>
                <div class="suggestion-name">${stock.name}</div>
            </div>
        `).join('');
        
        container.style.display = 'block';
        
        // Add click handlers
        container.querySelectorAll('.suggestion-item').forEach(item => {
            item.addEventListener('click', () => {
                document.getElementById('stock-search').value = item.dataset.symbol;
                this.hideSuggestions();
                this.handleAddStock();
            });
        });
    }

    hideSuggestions() {
        document.querySelector('.search-suggestions').style.display = 'none';
    }

    async handleAddStock() {
        const input = document.getElementById('stock-search');
        const symbol = input.value.trim().toUpperCase();
        
        if (!symbol) {
            this.showStatus('Please enter a stock symbol', 'warning');
            return;
        }
        
        if (this.stockCards.has(symbol)) {
            this.showStatus(`${symbol} is already added`, 'warning');
            input.value = '';
            return;
        }
        
        if (this.stockCards.size >= this.options.maxCards) {
            this.showStatus(`Maximum ${this.options.maxCards} stocks allowed`, 'warning');
            return;
        }
        
        try {
            await this.addStockCard(symbol);
            input.value = '';
            this.hideSuggestions();
            this.hideEmptyState();
        } catch (error) {
            this.showStatus(`Failed to add ${symbol}: ${error.message}`, 'error');
        }
    }

    async addStockCard(symbol) {
        const cardOptions = {
            showChart: !this.options.compactMode,
            autoRefresh: true,
            refreshInterval: this.options.refreshInterval,
            enableAlerts: this.options.enableNotifications,
            compact: this.options.compactMode
        };
        
        const stockCard = new StockCard(symbol, this.cardsContainer, cardOptions);
        this.stockCards.set(symbol, stockCard);
        this.watchlist.add(symbol);
        
        this.updateStats();
        this.updateWatchlistDisplay();
        
        if (this.options.autoSave) {
            this.saveUserPreferences();
        }
        
        this.showStatus(`Added ${symbol} to dashboard`, 'success');
    }

    handleCardRemoved(symbol) {
        this.stockCards.delete(symbol);
        this.watchlist.delete(symbol);
        
        this.updateStats();
        this.updateWatchlistDisplay();
        
        if (this.stockCards.size === 0) {
            this.showEmptyState();
        }
        
        if (this.options.autoSave) {
            this.saveUserPreferences();
        }
        
        this.showStatus(`Removed ${symbol} from dashboard`, 'info');
    }

    refreshAll() {
        if (this.stockCards.size === 0) {
            this.showStatus('No stocks to refresh', 'info');
            return;
        }
        
        let refreshCount = 0;
        const totalCards = this.stockCards.size;
        
        this.showStatus('Refreshing all stocks...', 'info');
        
        this.stockCards.forEach(card => {
            card.refresh();
            setTimeout(() => {
                refreshCount++;
                if (refreshCount === totalCards) {
                    this.showStatus('All stocks refreshed', 'success');
                    this.updateStats();
                }
            }, 100);
        });
    }

    changeView(viewType) {
        document.querySelectorAll('.view-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelector(`[data-view="${viewType}"]`).classList.add('active');
        
        this.cardsContainer.className = `cards-container ${viewType}-layout`;
        this.options.layout = viewType;
        
        if (this.options.autoSave) {
            this.saveUserPreferences();
        }
    }

    sortCards(sortBy) {
        const cards = Array.from(this.stockCards.values());
        const direction = document.getElementById('sort-direction').classList.contains('asc') ? 1 : -1;
        
        cards.sort((a, b) => {
            let valueA, valueB;
            
            switch (sortBy) {
                case 'symbol':
                    valueA = a.getSymbol();
                    valueB = b.getSymbol();
                    break;
                case 'price':
                    valueA = parseFloat(a.getData()?.regularMarketPrice || 0);
                    valueB = parseFloat(b.getData()?.regularMarketPrice || 0);
                    break;
                case 'change':
                    const dataA = a.getData();
                    const dataB = b.getData();
                    valueA = dataA ? (dataA.regularMarketPrice - dataA.regularMarketPreviousClose) : 0;
                    valueB = dataB ? (dataB.regularMarketPrice - dataB.regularMarketPreviousClose) : 0;
                    break;
                case 'volume':
                    valueA = parseInt(a.getData()?.regularMarketVolume || 0);
                    valueB = parseInt(b.getData()?.regularMarketVolume || 0);
                    break;
                default:
                    return 0;
            }
            
            if (typeof valueA === 'string') {
                return valueA.localeCompare(valueB) * direction;
            }
            return (valueA - valueB) * direction;
        });
        
        // Reorder DOM elements
        cards.forEach(card => {
            this.cardsContainer.appendChild(card.element);
        });
    }

    toggleSortDirection() {
        const btn = document.getElementById('sort-direction');
        const isAsc = btn.classList.contains('asc');
        
        btn.classList.toggle('asc', !isAsc);
        btn.classList.toggle('desc', isAsc);
        btn.querySelector('i').className = isAsc ? 'icon-sort-desc' : 'icon-sort-asc';
        
        // Re-sort with new direction
        const sortSelect = document.getElementById('sort-select');
        this.sortCards(sortSelect.value);
    }

    async addDefaultStocks() {
        for (const symbol of this.options.defaultSymbols) {
            if (!this.stockCards.has(symbol) && this.stockCards.size < this.options.maxCards) {
                try {
                    await this.addStockCard(symbol);
                    // Small delay between additions to avoid API rate limits
                    await new Promise(resolve => setTimeout(resolve, 200));
                } catch (error) {
                    console.error(`Failed to add default stock ${symbol}:`, error);
                }
            }
        }
    }

    clearWatchlist() {
        if (this.stockCards.size === 0) {
            this.showStatus('Watchlist is already empty', 'info');
            return;
        }
        
        if (confirm('Are you sure you want to remove all stocks from your watchlist?')) {
            this.stockCards.forEach(card => card.remove());
            this.stockCards.clear();
            this.watchlist.clear();
            
            this.showEmptyState();
            this.updateStats();
            this.updateWatchlistDisplay();
            
            if (this.options.autoSave) {
                this.saveUserPreferences();
            }
            
            this.showStatus('Watchlist cleared', 'info');
        }
    }

    updateStats() {
        document.getElementById('total-stocks').textContent = this.stockCards.size;
        
        // Calculate portfolio change
        let totalValue = 0;
        let totalChange = 0;
        let validCards = 0;
        
        this.stockCards.forEach(card => {
            const data = card.getData();
            if (data && data.regularMarketPrice && data.regularMarketPreviousClose) {
                const price = parseFloat(data.regularMarketPrice);
                const previousClose = parseFloat(data.regularMarketPreviousClose);
                totalValue += price;
                totalChange += (price - previousClose);
                validCards++;
            }
        });
        
        if (validCards > 0) {
            const changePercent = totalValue > 0 ? (totalChange / (totalValue - totalChange)) * 100 : 0;
            const changeElement = document.getElementById('portfolio-change');
            changeElement.textContent = `${formatCurrency(totalChange)} (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
            changeElement.className = `stat-value ${totalChange >= 0 ? 'positive' : 'negative'}`;
        }
        
        document.getElementById('last-update').textContent = formatTime(new Date());
    }

    updateWatchlistDisplay() {
        const container = document.querySelector('.watchlist-items');
        
        container.innerHTML = Array.from(this.watchlist).map(symbol => `
            <div class="watchlist-item" data-symbol="${symbol}">
                <span class="symbol">${symbol}</span>
                <button class="btn-remove-watchlist" data-symbol="${symbol}">×</button>
            </div>
        `).join('');
        
        // Add click handlers
        container.querySelectorAll('.btn-remove-watchlist').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const symbol = btn.dataset.symbol;
                const card = this.stockCards.get(symbol);
                if (card) {
                    card.remove();
                }
            });
        });
        
        container.querySelectorAll('.watchlist-item').forEach(item => {
            item.addEventListener('click', () => {
                const symbol = item.dataset.symbol;
                const card = this.stockCards.get(symbol);
                if (card) {
                    card.element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    card.element.classList.add('highlight');
                    setTimeout(() => {
                        card.element.classList.remove('highlight');
                    }, 2000);
                }
            });
        });
    }

    async initializeMarketStatus() {
        try {
            const response = await fetch('php/get_market_status.php');
            const result = await response.json();
            
            if (result.success) {
                this.updateMarketStatus(result.data);
            }
        } catch (error) {
            console.error('Failed to get market status:', error);
            this.updateMarketStatus({ status: 'unknown', message: 'Status unavailable' });
        }
    }

    updateMarketStatus(status) {
        this.marketStatus = status;
        const indicator = document.querySelector('.market-status .status-indicator');
        const text = document.querySelector('.market-status .status-text');
        
        indicator.className = `status-indicator ${status.status || 'unknown'}`;
        text.textContent = status.message || 'Market status unknown';
    }

    startGlobalUpdates() {
        this.stopGlobalUpdates();
        
        this.updateInterval = setInterval(() => {
            if (!document.hidden) {
                this.updateMarketIndices();
                this.updateStats();
                this.checkAlerts();
            }
        }, this.options.refreshInterval);
    }

    stopGlobalUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    async updateMarketIndices() {
        const indices = ['^GSPC', '^DJI', '^IXIC'];
        
        for (const symbol of indices) {
            try {
                const response = await fetch(`php/get_stock_data.php?symbol=${symbol}`);
                const result = await response.json();
                
                if (result.success) {
                    const element = document.querySelector(`[data-symbol="${symbol}"]`);
                    if (element) {
                        const price = result.data.regularMarketPrice;
                        const change = result.data.regularMarketPrice - result.data.regularMarketPreviousClose;
                        const changePercent = (change / result.data.regularMarketPreviousClose) * 100;
                        
                        element.querySelector('.index-value').innerHTML = `
                            ${formatCurrency(price)}
                            <span class="${change >= 0 ? 'positive' : 'negative'}">
                                ${change >= 0 ? '+' : ''}${formatCurrency(change)} (${changePercent.toFixed(2)}%)
                            </span>
                        `;
                    }
                }
            } catch (error) {
                console.error(`Failed to update index ${symbol}:`, error);
            }
        }
    }

    checkAlerts() {
        const alerts = JSON.parse(localStorage.getItem('stockAlerts') || '{}');
        const alertsList = document.querySelector('.alerts-list');
        
        const activeAlerts = Object.entries(alerts)
            .filter(([symbol, alert]) => !alert.triggered)
            .map(([symbol, alert]) => ({ symbol, ...alert }));
        
        alertsList.innerHTML = activeAlerts.length > 0 
            ? activeAlerts.map(alert => `
                <div class="alert-item">
                    <span class="alert-symbol">${alert.symbol}</span>
                    <span class="alert-price">${formatCurrency(alert.price)}</span>
                    <button class="btn-remove-alert" data-symbol="${alert.symbol}">×</button>
                </div>
            `).join('')
            : '<div class="no-alerts">No active alerts</div>';
        
        // Add remove handlers
        alertsList.querySelectorAll('.btn-remove-alert').forEach(btn => {
            btn.addEventListener('click', () => {
                const symbol = btn.dataset.symbol;
                delete alerts[symbol];
                localStorage.setItem('stockAlerts', JSON.stringify(alerts));
                this.checkAlerts(); // Refresh display
            });
        });
    }

    showEmptyState() {
        document.querySelector('.empty-state').style.display = 'flex';
    }

    hideEmptyState() {
        document.querySelector('.empty-state').style.display = 'none';
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.stopGlobalUpdates();
        } else {
            this.startGlobalUpdates();
        }
    }

    handleKeyboardShortcuts(e) {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'k': // Ctrl+K for search
                    e.preventDefault();
                    document.getElementById('stock-search').focus();
                    break;
                case 'r': // Ctrl+R for refresh all
                    e.preventDefault();
                    this.refreshAll();
                    break;
                case 'f': // Ctrl+F for fullscreen
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
            }
        }
        
        if (e.key === 'Escape') {
            this.hideSuggestions();
            this.hideSettings();
        }
    }

    async requestNotificationPermission() {
        if ('Notification' in window && Notification.permission === 'default') {
            try {
                const permission = await Notification.requestPermission();
                this.options.enableNotifications = permission === 'granted';
            } catch (error) {
                console.error('Failed to request notification permission:', error);
            }
        }
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        this.options.theme = newTheme;
        
        const themeBtn = document.getElementById('toggle-theme');
        themeBtn.querySelector('span').textContent = newTheme === 'dark' ? 'Light Mode' : 'Dark Mode';
        
        if (this.options.autoSave) {
            this.saveUserPreferences();
        }
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(console.error);
        } else {
            document.exitFullscreen().catch(console.error);
        }
    }

    showSettings() {
        const modal = document.getElementById('settings-modal');
        
        // Load current settings
        document.getElementById('compact-mode').checked = this.options.compactMode;
        document.getElementById('show-charts').checked = !this.options.compactMode;
        document.getElementById('theme-select').value = this.options.theme;
        document.getElementById('refresh-interval').value = this.options.refreshInterval;
        document.getElementById('auto-refresh').checked = this.updateInterval !== null;
        document.getElementById('enable-notifications').checked = this.options.enableNotifications;
        document.getElementById('enable-sounds').checked = this.options.enableSounds;
        
        modal.style.display = 'flex';
    }

    hideSettings() {
        document.getElementById('settings-modal').style.display = 'none';
    }

    saveSettings() {
        // Get
    }}// Add initial dashboard layout in dashboard.js
// Add stock data display to dashboard.js
// Add real-time updates to dashboard.js
// Add user preferences to dashboard.js
// Add chart toggle in dashboard.js
// Add export dashboard data feature
// Add responsive layout to dashboard.js
// Add dark mode toggle to dashboard.js
// Add stock search functionality
// Add data aggregation display
// Add stock trend analysis
// Add portfolio tracking feature
// Add portfolio summary display
// Add export dashboard feature
// Add CSV export for dashboard
// Add data filtering in dashboard.js
// Add animation to dashboard transitions
// Add streaming data display
// Add user authentication to dashboard.js
// Add user profile display
// Add offline dashboard support
// Add error logging for dashboard
