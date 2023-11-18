/**
 * Stock Card Component
 * Manages individual stock card rendering, updates, and interactions
 */

class StockCard {
    constructor(symbol, container, options = {}) {
        this.symbol = symbol.toUpperCase();
        this.container = container;
        this.options = {
            showChart: true,
            autoRefresh: true,
            refreshInterval: 30000, // 30 seconds
            enableAlerts: true,
            compact: false,
            ...options
        };
        
        this.data = null;
        this.previousData = null;
        this.element = null;
        this.chartInstance = null;
        this.refreshTimer = null;
        this.isLoading = false;
        this.hasError = false;
        
        this.init();
    }

    init() {
        this.createElement();
        this.bindEvents();
        this.loadData();
        
        if (this.options.autoRefresh) {
            this.startAutoRefresh();
        }
    }

    createElement() {
        this.element = document.createElement('div');
        this.element.className = `stock-card ${this.options.compact ? 'compact' : ''}`;
        this.element.setAttribute('data-symbol', this.symbol);
        
        this.element.innerHTML = this.getCardTemplate();
        this.container.appendChild(this.element);
    }

    getCardTemplate() {
        return `
            <div class="stock-card-header">
                <div class="stock-info">
                    <h3 class="stock-symbol">${this.symbol}</h3>
                    <span class="stock-name">Loading...</span>
                </div>
                <div class="stock-actions">
                    <button class="btn-refresh" title="Refresh">
                        <i class="icon-refresh"></i>
                    </button>
                    <button class="btn-alert" title="Set Alert">
                        <i class="icon-bell"></i>
                    </button>
                    <button class="btn-remove" title="Remove Card">
                        <i class="icon-close"></i>
                    </button>
                </div>
            </div>
            
            <div class="stock-card-body">
                <div class="loading-overlay">
                    <div class="loading-spinner"></div>
                    <span>Loading stock data...</span>
                </div>
                
                <div class="error-overlay" style="display: none;">
                    <div class="error-icon">⚠️</div>
                    <span class="error-message">Failed to load data</span>
                    <button class="btn-retry">Retry</button>
                </div>
                
                <div class="stock-content" style="display: none;">
                    <div class="price-section">
                        <div class="current-price">
                            <span class="price-value">$0.00</span>
                            <span class="price-change">
                                <span class="change-value">+$0.00</span>
                                <span class="change-percentage">(+0.00%)</span>
                            </span>
                        </div>
                        <div class="price-timestamp">
                            Last updated: <span class="timestamp">--</span>
                        </div>
                    </div>
                    
                    <div class="stock-details">
                        <div class="detail-row">
                            <span class="label">Open:</span>
                            <span class="value open-price">$0.00</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">High:</span>
                            <span class="value high-price">$0.00</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Low:</span>
                            <span class="value low-price">$0.00</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Volume:</span>
                            <span class="value volume">0</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">Market Cap:</span>
                            <span class="value market-cap">--</span>
                        </div>
                        <div class="detail-row">
                            <span class="label">P/E Ratio:</span>
                            <span class="value pe-ratio">--</span>
                        </div>
                    </div>
                    
                    <div class="chart-section" ${!this.options.showChart ? 'style="display: none;"' : ''}>
                        <div class="chart-controls">
                            <button class="chart-period active" data-period="1D">1D</button>
                            <button class="chart-period" data-period="5D">5D</button>
                            <button class="chart-period" data-period="1M">1M</button>
                            <button class="chart-period" data-period="3M">3M</button>
                            <button class="chart-period" data-period="1Y">1Y</button>
                        </div>
                        <div class="chart-container">
                            <canvas class="stock-chart"></canvas>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="stock-card-footer">
                <div class="card-status">
                    <span class="status-indicator"></span>
                    <span class="status-text">Ready</span>
                </div>
                <div class="last-update">
                    Updated: <span class="update-time">Never</span>
                </div>
            </div>
        `;
    }

    bindEvents() {
        // Refresh buttons are to be here
        this.element.querySelector('.btn-refresh').addEventListener('click', () => {
            this.refresh();
        });

        // Remove button
        this.element.querySelector('.btn-remove').addEventListener('click', () => {
            this.remove();
        });

        // Alert button
        this.element.querySelector('.btn-alert').addEventListener('click', () => {
            this.showAlertDialog();
        });

        // Retry button
        this.element.querySelector('.btn-retry').addEventListener('click', () => {
            this.retry();
        });

        // Chart period buttons
        this.element.querySelectorAll('.chart-period').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.changeChartPeriod(e.target.dataset.period);
            });
        });

        // Card click for details
        this.element.addEventListener('click', (e) => {
            if (!e.target.closest('.stock-actions') && !e.target.closest('.chart-controls')) {
                this.toggleDetails();
            }
        });
    }

    async loadData() {
        if (this.isLoading) return;
        
        this.setLoading(true);
        this.setError(false);
        
        try {
            const response = await fetch(`php/get_stock_data.php?symbol=${this.symbol}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const result = await response.json();
            
            if (result.success) {
                this.previousData = this.data;
                this.data = result.data;
                this.updateDisplay();
                this.setStatus('success', 'Data loaded');
            } else {
                throw new Error(result.error || 'Failed to fetch stock data');
            }
            
        } catch (error) {
            console.error(`Error loading data for ${this.symbol}:`, error);
            this.setError(true, error.message);
            this.setStatus('error', 'Failed to load');
        } finally {
            this.setLoading(false);
        }
    }

    updateDisplay() {
        if (!this.data) return;

        const content = this.element.querySelector('.stock-content');
        
        // Update stock name
        this.element.querySelector('.stock-name').textContent = 
            this.data.name || this.data.longName || this.symbol;

        // Update price information
        this.updatePriceDisplay();
        
        // Update stock details
        this.updateDetailsDisplay();
        
        // Update timestamp
        this.updateTimestamp();
        
        // Show content
        content.style.display = 'block';
        
        // Update chart if enabled
        if (this.options.showChart) {
            this.updateChart();
        }
        
        // Animate price changes
        this.animatePriceChange();
    }

    updatePriceDisplay() {
        const price = parseFloat(this.data.regularMarketPrice || this.data.price || 0);
        const previousClose = parseFloat(this.data.regularMarketPreviousClose || this.data.previousClose || price);
        const change = price - previousClose;
        const changePercent = previousClose !== 0 ? (change / previousClose) * 100 : 0;

        // Update price
        this.element.querySelector('.price-value').textContent = formatCurrency(price);
        
        // Update change values
        const changeValueEl = this.element.querySelector('.change-value');
        const changePercentEl = this.element.querySelector('.change-percentage');
        
        changeValueEl.textContent = `${change >= 0 ? '+' : ''}${formatCurrency(change)}`;
        changePercentEl.textContent = `(${change >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)`;
        
        // Update change styling
        const priceChangeEl = this.element.querySelector('.price-change');
        priceChangeEl.className = `price-change ${change >= 0 ? 'positive' : 'negative'}`;
        
        // Update card styling based on change
        this.element.className = this.element.className.replace(/\b(positive|negative)\b/g, '');
        this.element.classList.add(change >= 0 ? 'positive' : 'negative');
    }

    updateDetailsDisplay() {
        const details = {
            'open-price': this.data.regularMarketOpen || this.data.open,
            'high-price': this.data.regularMarketDayHigh || this.data.dayHigh,
            'low-price': this.data.regularMarketDayLow || this.data.dayLow,
            'volume': this.data.regularMarketVolume || this.data.volume,
            'market-cap': this.data.marketCap,
            'pe-ratio': this.data.trailingPE || this.data.peRatio
        };

        Object.entries(details).forEach(([className, value]) => {
            const element = this.element.querySelector(`.${className}`);
            if (element && value !== undefined && value !== null) {
                if (className.includes('price')) {
                    element.textContent = formatCurrency(value);
                } else if (className === 'volume') {
                    element.textContent = formatNumber(value);
                } else if (className === 'market-cap') {
                    element.textContent = formatMarketCap(value);
                } else if (className === 'pe-ratio') {
                    element.textContent = parseFloat(value).toFixed(2);
                } else {
                    element.textContent = value.toString();
                }
            }
        });
    }

    updateTimestamp() {
        const timestamp = this.data.regularMarketTime || this.data.timestamp || Date.now();
        const date = new Date(timestamp * 1000); // Convert to milliseconds if needed
        
        this.element.querySelector('.timestamp').textContent = formatTime(date);
        this.element.querySelector('.update-time').textContent = formatTime(new Date());
    }

    updateChart() {
        // This would integrate with chart-manager.js or a charting library
        const chartContainer = this.element.querySelector('.chart-container');
        const canvas = this.element.querySelector('.stock-chart');
        
        if (window.ChartManager) {
            if (this.chartInstance) {
                this.chartInstance.destroy();
            }
            
            this.chartInstance = new window.ChartManager(canvas, {
                symbol: this.symbol,
                data: this.data.chartData,
                type: 'line',
                period: this.getCurrentChartPeriod()
            });
        }
    }

    animatePriceChange() {
        if (!this.previousData) return;
        
        const currentPrice = parseFloat(this.data.regularMarketPrice || this.data.price || 0);
        const previousPrice = parseFloat(this.previousData.regularMarketPrice || this.previousData.price || 0);
        
        if (currentPrice !== previousPrice) {
            const priceElement = this.element.querySelector('.price-value');
            const changeClass = currentPrice > previousPrice ? 'price-flash-up' : 'price-flash-down';
            
            priceElement.classList.add(changeClass);
            setTimeout(() => {
                priceElement.classList.remove(changeClass);
            }, 1000);
        }
    }

    changeChartPeriod(period) {
        // Update active button
        this.element.querySelectorAll('.chart-period').forEach(btn => {
            btn.classList.remove('active');
        });
        this.element.querySelector(`[data-period="${period}"]`).classList.add('active');
        
        // Update chart
        this.updateChart();
    }

    getCurrentChartPeriod() {
        const activeBtn = this.element.querySelector('.chart-period.active');
        return activeBtn ? activeBtn.dataset.period : '1D';
    }

    toggleDetails() {
        this.element.classList.toggle('expanded');
    }

    showAlertDialog() {
        // This would show a modal or popup for setting price alerts
        const currentPrice = parseFloat(this.data.regularMarketPrice || this.data.price || 0);
        const alertPrice = prompt(`Set price alert for ${this.symbol}\nCurrent price: ${formatCurrency(currentPrice)}\n\nAlert when price reaches:`);
        
        if (alertPrice && !isNaN(parseFloat(alertPrice))) {
            this.setAlert(parseFloat(alertPrice));
        }
    }

    setAlert(price) {
        // Store alert in local storage or send to server
        const alerts = JSON.parse(localStorage.getItem('stockAlerts') || '{}');
        alerts[this.symbol] = {
            price: price,
            created: Date.now(),
            triggered: false
        };
        localStorage.setItem('stockAlerts', JSON.stringify(alerts));
        
        this.setStatus('info', `Alert set for ${formatCurrency(price)}`);
        
        // Update alert button appearance
        this.element.querySelector('.btn-alert').classList.add('active');
    }

    checkAlerts() {
        const alerts = JSON.parse(localStorage.getItem('stockAlerts') || '{}');
        const alert = alerts[this.symbol];
        
        if (alert && !alert.triggered && this.data) {
            const currentPrice = parseFloat(this.data.regularMarketPrice || this.data.price || 0);
            
            if ((alert.price >= alert.created && currentPrice >= alert.price) ||
                (alert.price < alert.created && currentPrice <= alert.price)) {
                
                this.triggerAlert(alert.price, currentPrice);
                alert.triggered = true;
                localStorage.setItem('stockAlerts', JSON.stringify(alerts));
            }
        }
    }

    triggerAlert(alertPrice, currentPrice) {
        // Visual notification
        this.element.classList.add('alert-triggered');
        setTimeout(() => {
            this.element.classList.remove('alert-triggered');
        }, 3000);
        
        // Audio notification (if enabled)
        if (this.options.enableAlerts && window.Audio) {
            try {
                const audio = new Audio('assets/sounds/notification.mp3');
                audio.play().catch(() => {}); // Ignore errors
            } catch (e) {}
        }
        
        // Browser notification
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(`${this.symbol} Price Alert`, {
                body: `Price reached ${formatCurrency(alertPrice)} (Current: ${formatCurrency(currentPrice)})`,
                icon: 'assets/images/stock-icons/default.png'
            });
        }
        
        this.setStatus('alert', 'Price alert triggered!');
    }

    setLoading(loading) {
        this.isLoading = loading;
        const overlay = this.element.querySelector('.loading-overlay');
        overlay.style.display = loading ? 'flex' : 'none';
        
        if (loading) {
            this.setStatus('loading', 'Loading...');
        }
    }

    setError(hasError, message = '') {
        this.hasError = hasError;
        const overlay = this.element.querySelector('.error-overlay');
        overlay.style.display = hasError ? 'flex' : 'none';
        
        if (hasError) {
            const errorMessage = this.element.querySelector('.error-message');
            errorMessage.textContent = message || 'Failed to load data';
            this.setStatus('error', message || 'Error');
        }
    }

    setStatus(type, message) {
        const indicator = this.element.querySelector('.status-indicator');
        const text = this.element.querySelector('.status-text');
        
        indicator.className = `status-indicator ${type}`;
        text.textContent = message;
    }

    refresh() {
        this.loadData();
    }

    retry() {
        this.setError(false);
        this.loadData();
    }

    startAutoRefresh() {
        this.stopAutoRefresh();
        this.refreshTimer = setInterval(() => {
            if (!document.hidden && !this.isLoading) {
                this.loadData();
            }
        }, this.options.refreshInterval);
    }

    stopAutoRefresh() {
        if (this.refreshTimer) {
            clearInterval(this.refreshTimer);
            this.refreshTimer = null;
        }
    }

    remove() {
        this.stopAutoRefresh();
        
        if (this.chartInstance && this.chartInstance.destroy) {
            this.chartInstance.destroy();
        }
        
        this.element.classList.add('removing');
        setTimeout(() => {
            this.element.remove();
            
            // Emit removal event
            window.dispatchEvent(new CustomEvent('stockCardRemoved', {
                detail: { symbol: this.symbol }
            }));
        }, 300);
    }

    destroy() {
        this.stopAutoRefresh();
        if (this.chartInstance && this.chartInstance.destroy) {
            this.chartInstance.destroy();
        }
        if (this.element && this.element.parentNode) {
            this.element.remove();
        }
    }

    // Public API methods
    getSymbol() {
        return this.symbol;
    }

    getData() {
        return this.data;
    }

    isExpanded() {
        return this.element.classList.contains('expanded');
    }

    expand() {
        this.element.classList.add('expanded');
    }

    collapse() {
        this.element.classList.remove('expanded');
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StockCard;
} else {
    window.StockCard = StockCard;
}// Add stock card component in stock-card.js
// Add stock price update logic to stock-card.js
// Add historical data display to stock-card.js
// Add stock comparison feature to stock-card.js
// Add stock alerts in stock-card.js
// Optimize stock card rendering
// Add stock metrics display
// Add theme support to stock-card.js
// Add stock watchlist feature
// Add stock performance metrics
// Add trend indicators to stock-card.js
// Add portfolio data to stock-card.js
// Add export stock data feature
// Add CSV export for stock data
// Add filtering to stock-card.js
// Add animation to stock card updates
// Add streaming data to stock-card.js
// Add auth-based stock data access
// Add user-specific stock preferences
// Add offline stock data display
// Add error logging for stock cards
// Add unit tests for stock-card.js
// Optimize stock card performance
// Add accessibility to stock-card.js
// Add multilingual support to stock-card.js
// Add annotation support to stock-card.js
// Add performance monitoring
// Add compressed data to stock cards
// Add PDF export for stock data
// Add import support for stock data
// Add final optimizations to stock-card.js
// Add stock card component in stock-card.js
// Add stock price update logic to stock-card.js
// Add historical data display to stock-card.js
// Add stock comparison feature to stock-card.js
// Optimize stock card rendering
// Add stock metrics display to stock-card.js
// Add stock alerts in stock-card.js
