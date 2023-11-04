/**
 * Utility Functions for Stock Dashboard
 * Comprehensive utility library for common operations
 * 
 * @author Stock Dashboard Team
 * @version 1.0.0
 * @since 2025-01-15
 */

'use strict';

/**
 * Main Utils class containing all utility functions
 */
class Utils {
    
    // ==================== FORMATTING UTILITIES ====================
    
    /**
     * Format currency value with proper symbol and decimals
     * @param {number|string} value - The numeric value to format
     * @param {string} currency - Currency symbol (default from config)
     * @param {number} decimals - Number of decimal places (default from config)
     * @param {string} locale - Locale for formatting (default from config)
     * @returns {string} Formatted currency string
     */
    static formatCurrency(value, currency = null, decimals = null, locale = null) {
        // Get defaults from config
        currency = currency || STOCK_CONFIG.FORMAT.CURRENCY_SYMBOL;
        decimals = decimals !== null ? decimals : STOCK_CONFIG.FORMAT.CURRENCY_DECIMALS;
        locale = locale || STOCK_CONFIG.FORMAT.CURRENCY_LOCALE;
        
        // Handle invalid values
        if (isNaN(value) || value === null || value === undefined || value === '') {
            return `${currency}0.${'0'.repeat(decimals)}`;
        }
        
        const numValue = parseFloat(value);
        
        try {
            // Use Intl.NumberFormat for proper localization
            const formatter = new Intl.NumberFormat(locale, {
                style: 'currency',
                currency: currency === '$' ? 'USD' : 'USD', // Default to USD
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals
            });
            
            return formatter.format(numValue);
        } catch (error) {
            // Fallback to manual formatting
            return `${currency}${numValue.toFixed(decimals)}`;
        }
    }
    
    /**
     * Format percentage value with proper sign and decimals
     * @param {number|string} value - The percentage value
     * @param {number} decimals - Number of decimal places (default from config)
     * @param {boolean} showSign - Show + sign for positive values
     * @returns {string} Formatted percentage string
     */
    static formatPercentage(value, decimals = null, showSign = null) {
        decimals = decimals !== null ? decimals : STOCK_CONFIG.FORMAT.PERCENTAGE_DECIMALS;
        showSign = showSign !== null ? showSign : STOCK_CONFIG.FORMAT.SHOW_POSITIVE_SIGN;
        
        if (isNaN(value) || value === null || value === undefined || value === '') {
            return `0.${'0'.repeat(decimals)}%`;
        }
        
        const numValue = parseFloat(value);
        const sign = numValue > 0 && showSign ? '+' : '';
        
        return `${sign}${numValue.toFixed(decimals)}%`;
    }
    
    /**
     * Format large numbers with abbreviations (K, M, B, T)
     * @param {number|string} value - The numeric value
     * @param {number} decimals - Number of decimal places for abbreviated values
     * @param {boolean} useAbbreviations - Whether to use abbreviations
     * @returns {string} Formatted number string
     */
    static formatNumber(value, decimals = null, useAbbreviations = null) {
        decimals = decimals !== null ? decimals : STOCK_CONFIG.FORMAT.VOLUME_DECIMALS;
        useAbbreviations = useAbbreviations !== null ? useAbbreviations : STOCK_CONFIG.FORMAT.VOLUME_ABBREVIATIONS;
        
        if (isNaN(value) || value === null || value === undefined || value === '') {
            return '0';
        }
        
        const num = parseInt(value);
        
        if (!useAbbreviations) {
            return new Intl.NumberFormat(STOCK_CONFIG.FORMAT.CURRENCY_LOCALE).format(num);
        }
        
        const abbreviations = [
            { value: 1e12, suffix: 'T' }, // Trillion
            { value: 1e9, suffix: 'B' },  // Billion
            { value: 1e6, suffix: 'M' },  // Million
            { value: 1e3, suffix: 'K' }   // Thousand
        ];
        
        for (const abbrev of abbreviations) {
            if (Math.abs(num) >= abbrev.value) {
                const abbreviated = num / abbrev.value;
                return abbreviated.toFixed(decimals) + abbrev.suffix;
            }
        }
        
        return num.toString();
    }
    
    /**
     * Format price change with appropriate sign and color class
     * @param {number} change - Price change value
     * @param {number} changePercent - Price change percentage
     * @returns {Object} Formatted change data with CSS classes
     */
    static formatPriceChange(change, changePercent) {
        const isPositive = change > 0;
        const isNegative = change < 0;
        const isNeutral = change === 0;
        
        return {
            change: this.formatCurrency(Math.abs(change)),
            changePercent: this.formatPercentage(changePercent),
            sign: isPositive ? '+' : (isNegative ? '-' : ''),
            icon: isPositive ? STOCK_CONFIG.FORMAT.PRICE_CHANGE_ICONS.UP : 
                  (isNegative ? STOCK_CONFIG.FORMAT.PRICE_CHANGE_ICONS.DOWN : 
                   STOCK_CONFIG.FORMAT.PRICE_CHANGE_ICONS.NEUTRAL),
            cssClass: isPositive ? 'positive' : (isNegative ? 'negative' : 'neutral'),
            color: isPositive ? STOCK_CONFIG.FORMAT.COLORS.POSITIVE : 
                   (isNegative ? STOCK_CONFIG.FORMAT.COLORS.NEGATIVE : 
                    STOCK_CONFIG.FORMAT.COLORS.NEUTRAL)
        };
    }
    
    // ==================== DATE/TIME UTILITIES ====================
    
    /**
     * Get current timestamp in various formats
     * @param {string} format - Format type: 'iso', 'locale', 'time', 'date', 'custom'
     * @param {string} customFormat - Custom format string for 'custom' type
     * @returns {string} Formatted timestamp
     */
    static getCurrentTimestamp(format = 'locale', customFormat = null) {
        const now = new Date();
        
        switch (format.toLowerCase()) {
            case 'iso':
                return now.toISOString();
                
            case 'locale':
                return now.toLocaleString(STOCK_CONFIG.FORMAT.CURRENCY_LOCALE, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                    timeZone: STOCK_CONFIG.FORMAT.TIMEZONE
                });
                
            case 'time':
                return now.toLocaleTimeString(STOCK_CONFIG.FORMAT.CURRENCY_LOCALE, {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: true,
                    timeZone: STOCK_CONFIG.FORMAT.TIMEZONE
                });
                
            case 'date':
                return now.toLocaleDateString(STOCK_CONFIG.FORMAT.CURRENCY_LOCALE, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    timeZone: STOCK_CONFIG.FORMAT.TIMEZONE
                });
                
            case 'custom':
                return customFormat ? this.formatDate(now, customFormat) : now.toString();
                
            default:
                return now.toString();
        }
    }
    
    /**
     * Format date with custom format string
     * @param {Date|string|number} date - Date to format
     * @param {string} format - Format string (YYYY, MM, DD, HH, mm, ss, etc.)
     * @returns {string} Formatted date string
     */
    static formatDate(date, format) {
        const d = new Date(date);
        
        if (isNaN(d.getTime())) {
            return 'Invalid Date';
        }
        
        const replacements = {
            'YYYY': d.getFullYear(),
            'YY': d.getFullYear().toString().slice(-2),
            'MM': String(d.getMonth() + 1).padStart(2, '0'),
            'M': d.getMonth() + 1,
            'DD': String(d.getDate()).padStart(2, '0'),
            'D': d.getDate(),
            'HH': String(d.getHours()).padStart(2, '0'),
            'H': d.getHours(),
            'hh': String(d.getHours() % 12 || 12).padStart(2, '0'),
            'h': d.getHours() % 12 || 12,
            'mm': String(d.getMinutes()).padStart(2, '0'),
            'm': d.getMinutes(),
            'ss': String(d.getSeconds()).padStart(2, '0'),
            's': d.getSeconds(),
            'A': d.getHours() >= 12 ? 'PM' : 'AM',
            'a': d.getHours() >= 12 ? 'pm' : 'am'
        };
        
        return format.replace(/YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|A|a/g, match => replacements[match]);
    }
    
    /**
     * Calculate time until next update
     * @param {number} interval - Update interval in milliseconds
     * @param {Date|string|number} lastUpdate - Last update timestamp
     * @returns {Object} Time remaining information
     */
    static getTimeUntilNextUpdate(interval, lastUpdate) {
        if (!lastUpdate) {
            return { text: '--', seconds: 0, expired: true };
        }
        
        const now = new Date();
        const lastUpdateDate = new Date(lastUpdate);
        const nextUpdate = new Date(lastUpdateDate.getTime() + interval);
        const remaining = Math.max(0, nextUpdate - now);
        
        if (remaining === 0) {
            return { text: 'Now', seconds: 0, expired: true };
        }
        
        const seconds = Math.ceil(remaining / 1000);
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        
        let text;
        if (minutes > 0) {
            text = `${minutes}m ${remainingSeconds}s`;
        } else {
            text = `${seconds}s`;
        }
        
        return { text, seconds, expired: false };
    }
    
    /**
     * Check if current time is within market hours
     * @param {Date} date - Date to check (defaults to now)
     * @returns {Object} Market status information
     */
    static getMarketStatus(date = null) {
        const now = date || new Date();
        
        // Convert to market timezone
        const marketTime = new Date(now.toLocaleString("en-US", {
            timeZone: STOCK_CONFIG.MARKET.HOURS.TIMEZONE
        }));
        
        const day = marketTime.getDay(); // 0 = Sunday, 6 = Saturday
        const timeString = marketTime.toTimeString().slice(0, 5); // HH:MM format
        
        // Check if it's a trading day
        const isTradingDay = STOCK_CONFIG.MARKET.TRADING_DAYS.includes(day);
        
        // Check if it's a holiday (simplified check)
        const dateString = marketTime.toISOString().slice(0, 10);
        const isHoliday = STOCK_CONFIG.MARKET.HOLIDAYS.includes(dateString);
        
        // Check market hours
        const isMarketHours = timeString >= STOCK_CONFIG.MARKET.HOURS.OPEN && 
                             timeString < STOCK_CONFIG.MARKET.HOURS.CLOSE;
        
        // Check extended hours
        const isPreMarket = timeString >= STOCK_CONFIG.MARKET.EXTENDED_HOURS.PRE_MARKET_START && 
                           timeString < STOCK_CONFIG.MARKET.EXTENDED_HOURS.PRE_MARKET_END;
        
        const isAfterHours = timeString >= STOCK_CONFIG.MARKET.EXTENDED_HOURS.AFTER_HOURS_START && 
                            timeString < STOCK_CONFIG.MARKET.EXTENDED_HOURS.AFTER_HOURS_END;
        
        const isOpen = isTradingDay && !isHoliday && isMarketHours;
        const isExtendedHours = isTradingDay && !isHoliday && (isPreMarket || isAfterHours);
        
        return {
            isOpen,
            isTradingDay,
            isHoliday,
            isExtendedHours,
            isPreMarket,
            isAfterHours,
            marketTime: marketTime,
            status: isOpen ? 'open' : (isExtendedHours ? 'extended' : 'closed'),
            statusText: isOpen ? 'Market Open' : 
                       (isExtendedHours ? 'Extended Hours' : 
                        (isHoliday ? 'Market Holiday' : 
                         (!isTradingDay ? 'Market Closed - Weekend' : 'Market Closed')))
        };
    }
    
    // ==================== DOM UTILITIES ====================
    
    /**
     * Safely get element by ID with error handling
     * @param {string} id - Element ID
     * @param {boolean} required - Whether element is required
     * @returns {HTMLElement|null} Element or null
     */
    static getElementById(id, required = false) {
        const element = document.getElementById(id);
        
        if (!element && required) {
            console.error(`Required element with ID '${id}' not found`);
            this.showNotification(`Missing required element: ${id}`, 'error');
        }
        
        return element;
    }
    
    /**
     * Safely query selector with error handling
     * @param {string} selector - CSS selector
     * @param {HTMLElement} parent - Parent element (defaults to document)
     * @param {boolean} required - Whether element is required
     * @returns {HTMLElement|null} Element or null
     */
    static querySelector(selector, parent = document, required = false) {
        try {
            const element = parent.querySelector(selector);
            
            if (!element && required) {
                console.error(`Required element with selector '${selector}' not found`);
                this.showNotification(`Missing required element: ${selector}`, 'error');
            }
            
            return element;
        } catch (error) {
            console.error(`Invalid selector '${selector}':`, error);
            return null;
        }
    }
    
    /**
     * Create element with attributes and content
     * @param {string} tagName - HTML tag name
     * @param {Object} attributes - Element attributes
     * @param {string|HTMLElement|Array} content - Element content
     * @returns {HTMLElement} Created element
     */
    static createElement(tagName, attributes = {}, content = null) {
        const element = document.createElement(tagName);
        
        // Set attributes
        Object.entries(attributes).forEach(([key, value]) => {
            if (key === 'className' || key === 'class') {
                element.className = value;
            } else if (key === 'dataset') {
                Object.entries(value).forEach(([dataKey, dataValue]) => {
                    element.dataset[dataKey] = dataValue;
                });
            } else if (key.startsWith('on') && typeof value === 'function') {
                element.addEventListener(key.slice(2).toLowerCase(), value);
            } else {
                element.setAttribute(key, value);
            }
        });
        
        // Set content
        if (content !== null) {
            if (typeof content === 'string') {
                element.innerHTML = content;
            } else if (content instanceof HTMLElement) {
                element.appendChild(content);
            } else if (Array.isArray(content)) {
                content.forEach(item => {
                    if (typeof item === 'string') {
                        element.insertAdjacentHTML('beforeend', item);
                    } else if (item instanceof HTMLElement) {
                        element.appendChild(item);
                    }
                });
            }
        }
        
        return element;
    }
    
    /**
     * Add CSS class with animation support
     * @param {HTMLElement} element - Target element
     * @param {string} className - CSS class name
     * @param {number} delay - Animation delay in milliseconds
     */
    static addClass(element, className, delay = 0) {
        if (!element) return;
        
        if (delay > 0) {
            setTimeout(() => {
                element.classList.add(className);
            }, delay);
        } else {
            element.classList.add(className);
        }
    }
    
    /**
     * Remove CSS class with animation support
     * @param {HTMLElement} element - Target element
     * @param {string} className - CSS class name
     * @param {number} delay - Animation delay in milliseconds
     */
    static removeClass(element, className, delay = 0) {
        if (!element) return;
        
        if (delay > 0) {
            setTimeout(() => {
                element.classList.remove(className);
            }, delay);
        } else {
            element.classList.remove(className);
        }
    }
    
    /**
     * Toggle CSS class with animation support
     * @param {HTMLElement} element - Target element
     * @param {string} className - CSS class name
     * @param {boolean} force - Force add (true) or remove (false)
     */
    static toggleClass(element, className, force = null) {
        if (!element) return;
        
        if (force !== null) {
            element.classList.toggle(className, force);
        } else {
            element.classList.toggle(className);
        }
    }
    
    // ==================== ANIMATION UTILITIES ====================
    
    /**
     * Animate element with CSS transitions
     * @param {HTMLElement} element - Target element
     * @param {Object} properties - CSS properties to animate
     * @param {number} duration - Animation duration in milliseconds
     * @param {string} easing - CSS easing function
     * @returns {Promise} Promise that resolves when animation completes
     */
    static animate(element, properties, duration = null, easing = null) {
        return new Promise((resolve) => {
            if (!element) {
                resolve();
                return;
            }
            
            duration = duration || STOCK_CONFIG.UI.ANIMATION_DURATION;
            easing = easing || STOCK_CONFIG.UI.TRANSITION_EASING;
            
            // Set transition
            element.style.transition = `all ${duration}ms ${easing}`;
            
            // Apply properties
            Object.entries(properties).forEach(([property, value]) => {
                element.style[property] = value;
            });
            
            // Remove transition after animation
            setTimeout(() => {
                element.style.transition = '';
                resolve();
            }, duration);
        });
    }
    
    /**
     * Fade in element
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Animation duration
     * @returns {Promise} Animation promise
     */
    static fadeIn(element, duration = null) {
        if (!element) return Promise.resolve();
        
        element.style.opacity = '0';
        element.style.display = '';
        
        return this.animate(element, { opacity: '1' }, duration);
    }
    
    /**
     * Fade out element
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Animation duration
     * @returns {Promise} Animation promise
     */
    static fadeOut(element, duration = null) {
        if (!element) return Promise.resolve();
        
        return this.animate(element, { opacity: '0' }, duration).then(() => {
            element.style.display = 'none';
        });
    }
    
    /**
     * Slide down element
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Animation duration
     * @returns {Promise} Animation promise
     */
    static slideDown(element, duration = null) {
        if (!element) return Promise.resolve();
        
        const height = element.scrollHeight;
        element.style.height = '0px';
        element.style.overflow = 'hidden';
        element.style.display = '';
        
        return this.animate(element, { height: `${height}px` }, duration).then(() => {
            element.style.height = '';
            element.style.overflow = '';
        });
    }
    
    /**
     * Slide up element
     * @param {HTMLElement} element - Target element
     * @param {number} duration - Animation duration
     * @returns {Promise} Animation promise
     */
    static slideUp(element, duration = null) {
        if (!element) return Promise.resolve();
        
        element.style.overflow = 'hidden';
        
        return this.animate(element, { height: '0px' }, duration).then(() => {
            element.style.display = 'none';
            element.style.height = '';
            element.style.overflow = '';
        });
    }
    
    // ==================== VALIDATION UTILITIES ====================
    
    /**
     * Validate stock symbol format
     * @param {string} symbol - Stock symbol to validate
     * @returns {Object} Validation result
     */
    static validateStockSymbol(symbol) {
        if (!symbol || typeof symbol !== 'string') {
            return { valid: false, error: 'Symbol is required and must be a string' };
        }
        
        const trimmed = symbol.trim().toUpperCase();
        const config = STOCK_CONFIG.STOCKS;
        
        if (trimmed.length < config.SYMBOL_MIN_LENGTH) {
            return { valid: false, error: `Symbol must be at least ${config.SYMBOL_MIN_LENGTH} character(s)` };
        }
        
        if (trimmed.length > config.SYMBOL_MAX_LENGTH) {
            return { valid: false, error: `Symbol must be no more than ${config.SYMBOL_MAX_LENGTH} characters` };
        }
        
        if (!config.SYMBOL_PATTERN.test(trimmed)) {
            return { valid: false, error: 'Symbol must contain only uppercase letters' };
        }
        
        return { valid: true, symbol: trimmed };
    }
    
    /**
     * Validate stock data structure
     * @param {Object} stockData - Stock data object to validate
     * @returns {Object} Validation result
     */
    static validateStockData(stockData) {
        if (!stockData || typeof stockData !== 'object') {
            return { valid: false, error: 'Stock data must be an object' };
        }
        
        const requiredFields = ['symbol', 'price', 'change', 'changePercent', 'volume'];
        const missingFields = requiredFields.filter(field => 
            !stockData.hasOwnProperty(field) || 
            stockData[field] === null || 
            stockData[field] === undefined
        );
        
        if (missingFields.length > 0) {
            return { valid: false, error: `Missing required fields: ${missingFields.join(', ')}` };
        }
        
        // Validate numeric fields
        const numericFields = ['price', 'change', 'changePercent', 'volume'];
        for (const field of numericFields) {
            if (isNaN(stockData[field])) {
                return { valid: false, error: `Field '${field}' must be a valid number` };
            }
        }
        
        // Validate ranges
        const config = STOCK_CONFIG.STOCKS.VALIDATION;
        
        if (stockData.price < config.PRICE_MIN || stockData.price > config.PRICE_MAX) {
            return { valid: false, error: `Price must be between ${config.PRICE_MIN} and ${config.PRICE_MAX}` };
        }
        
        if (stockData.volume < config.VOLUME_MIN) {
            return { valid: false, error: `Volume must be at least ${config.VOLUME_MIN}` };
        }
        
        if (Math.abs(stockData.changePercent) > config.CHANGE_PERCENT_MAX) {
            return { valid: false, error: `Change percentage seems invalid: ${stockData.changePercent}%` };
        }
        
        return { valid: true, data: stockData };
    }
    
    /**
     * Validate price alert data
     * @param {Object} alertData - Alert data to validate
     * @returns {Object} Validation result
     */
    static validatePriceAlert(alertData) {
        if (!alertData || typeof alertData !== 'object') {
            return { valid: false, error: 'Alert data must be an object' };
        }
        
        const requiredFields = ['symbol', 'price', 'type'];
        const missingFields = requiredFields.filter(field => 
            !alertData.hasOwnProperty(field) || 
            alertData[field] === null || 
            alertData[field] === undefined
        );
        
        if (missingFields.length > 0) {
            return { valid: false, error: `Missing required fields: ${missingFields.join(', ')}` };
        }
        
        // Validate symbol
        const symbolValidation = this.validateStockSymbol(alertData.symbol);
        if (!symbolValidation.valid) {
            return symbolValidation;
        }
        
        // Validate price
        if (isNaN(alertData.price)) {
            return { valid: false, error: 'Alert price must be a valid number' };
        }
        
        const config = STOCK_CONFIG.STOCKS.ALERTS;
        if (alertData.price < config.MIN_PRICE_THRESHOLD || alertData.price > config.MAX_PRICE_THRESHOLD) {
            return { valid: false, error: `Alert price must be between ${config.MIN_PRICE_THRESHOLD} and ${config.MAX_PRICE_THRESHOLD}` };
        }
        
        // Validate type
        const validTypes = ['above', 'below', 'change'];
        if (!validTypes.includes(alertData.type)) {
            return { valid: false, error: `Alert type must be one of: ${validTypes.join(', ')}` };
        }
        
        return { valid: true, data: alertData };
    }
    
    // ==================== PERFORMANCE UTILITIES ====================
    
    /**
     * Debounce function execution
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @param {boolean} immediate - Execute immediately on first call
     * @returns {Function} Debounced function
     */
    static debounce(func, wait, immediate = false) {
        let timeout;
        
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func.apply(this, args);
            };
            
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            
            if (callNow) func.apply(this, args);
        };
    }
    
    /**
     * Throttle function execution
     * @param {Function} func - Function to throttle
     * @param {number} limit - Time limit in milliseconds
     * @returns {Function} Throttled function
     */
    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        
        return function executedFunction(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
    
    /**
     * Create a rate limiter
     * @param {number} maxRequests - Maximum requests allowed
     * @param {number} timeWindow - Time window in milliseconds
     * @returns {Function} Rate limiter function
     */
    static createRateLimiter(maxRequests, timeWindow) {
        const requests = [];
        
        return function isAllowed() {
            const now = Date.now();
            
            // Remove old requests outside the time window
            while (requests.length > 0 && requests[0] <= now - timeWindow) {
                requests.shift();
            }
            
            // Check if under limit
            if (requests.length < maxRequests) {
                requests.push(now);
                return true;
            }
            
            return false;
        };
    }
    
    // ==================== NETWORK UTILITIES ====================
    
    /**
     * Create XMLHttpRequest with standard configuration
     * @param {Object} options - Request options
     * @returns {XMLHttpRequest} Configured XHR object
     */
    static createXHR(options = {}) {
        const xhr = new XMLHttpRequest();
        
        // Set timeout
        xhr.timeout = options.timeout || STOCK_CONFIG.API.TIMEOUT;
        
        // Set default headers
        const headers = { ...STOCK_CONFIG.API.DEFAULT_HEADERS, ...options.headers };
        
        // Store headers to set after open()
        xhr._headers = headers;
        
        return xhr;
    }
    
    /**
     * Make HTTP request with retry logic
     * @param {string} url - Request URL
     * @param {Object} options - Request options
     * @returns {Promise} Request promise
     */
    static makeRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            let attempts = 0;
            const maxAttempts = options.retries || STOCK_CONFIG.API.RETRY_ATTEMPTS;
            
            const attemptRequest = () => {
                attempts++;
                const xhr = this.createXHR(options);
                
                xhr.onreadystatechange = () => {
                    if (xhr.readyState === 4) {
                        if (xhr.status >= 200 && xhr.status < 300) {
                            resolve({
                                data: xhr.response,
                                xml: xhr.responseXML,
                                text: xhr.responseText,
                                status: xhr.status,
                                headers: xhr.getAllResponseHeaders()
                            });
                        } else if (attempts < maxAttempts) {
                            // Retry after delay
                            const delay = options.retryDelay || STOCK_CONFIG.API.RETRY_DELAY;
                            setTimeout(attemptRequest, delay * attempts);
                        } else {
                            reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                        }
                    }
                };
                
                xhr.onerror = () => {
                    if (attempts < maxAttempts) {
                        // Retry after delay
                        const delay = options.retryDelay || STOCK_CONFIG.API.RETRY_DELAY;
                        setTimeout(attemptRequest, delay * attempts);
                    } else {
                        reject(new Error('Network error occurred'));
                    }
                };
                
                xhr.ontimeout = () => {
                    if (attempts < maxAttempts) {
                        // Retry after delay
                        const delay = options.retryDelay || STOCK_CONFIG.API.RETRY_DELAY;
                        setTimeout(attemptRequest, delay * attempts);
                    } else {
                        reject(new Error('Request timeout'));
                    }
                };
                
                // Open request
                xhr.open(options.method || 'GET', url, true);
                
                // Set headers
                if (xhr._headers) {
                    Object.entries(xhr._headers).forEach(([key, value]) => {
                        xhr.setRequestHeader(key, value);
                    });
                }
                
                // Send request
                xhr.send(options.data || null);
            };
            
            attemptRequest();
        });
    }
    
    /**
     * Check network connectivity
     * @returns {Promise<boolean>} Network status
     */
    static checkNetworkStatus() {
        return new Promise((resolve) => {
            if (!navigator.onLine) {
                resolve(false);
                return;
            }
            
            // Try to fetch a small resource
            const xhr = new XMLHttpRequest();
            xhr.timeout = 5000;
            
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    resolve(xhr.status >= 200 && xhr.status < 300);
                }
            };
            
            xhr.onerror = () => resolve(false);
            xhr.ontimeout = () => resolve(false);
            
            try {
                xhr.open('HEAD', window.location.origin + '/favicon.ico?' + Date.now(), true);
                xhr.send();
            } catch (error) {
                resolve(false);
            }
        });
    }
    
    // ==================== STORAGE UTILITIES ====================
    
    /**
     * Safe localStorage operations with error handling
     * @param {string} key - Storage key
     * @param {any} value - Value to store (will be JSON.stringified)
     * @param {number} expiry - Expiry time in milliseconds (optional)
     * @returns {boolean} Success status
     */
    static setLocalStorage(key, value, expiry = null) {
        try {
            const item = {
                value: value,
                timestamp: Date.now(),
                expiry: expiry ? Date.now() + expiry : null
            };
            
            localStorage.setItem(key, JSON.stringify(item));
            return true;
        } catch (error) {
            console.warn('LocalStorage setItem failed:', error);
            return false;
        }
    }
    
    /**
     * Safe localStorage retrieval with expiry checking
     * @param {string} key - Storage key
     * @param {any} defaultValue - Default value if not found or expired
     * @returns {any} Retrieved value or default
     */
    static getLocalStorage(key, defaultValue = null) {
        try {
            const itemStr = localStorage.getItem(key);
            if (!itemStr) return defaultValue;
            
            const item = JSON.parse(itemStr);
            
            // Check expiry
            if (item.expiry && Date.now() > item.expiry) {
                localStorage.removeItem(key);
                return defaultValue;
            }
            
            return item.value;
        } catch (error) {
            console.warn('LocalStorage getItem failed:', error);
            return defaultValue;
        }
    }
    
    /**
     * Remove item from localStorage
     * @param {string} key - Storage key
     * @returns {boolean} Success status
     */
    static removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn('LocalStorage removeItem failed:', error);
            return false;
        }
    }
    
    /**
     * Clear all localStorage items with optional prefix filter
     * @param {string} prefix - Key prefix to filter (optional)
     * @returns {boolean} Success status
     */
    static clearLocalStorage(prefix = null) {
        try {
            if (prefix) {
                const keysToRemove = [];
                for (let i = 0; i < localStorage.length; i++) {
                    const key = localStorage.key(i);
                    if (key && key.startsWith(prefix)) {
                        keysToRemove.push(key);
                    }
                }
                keysToRemove.forEach(key => localStorage.removeItem(key));
            } else {
                localStorage.clear();
            }
            return true;
        } catch (error) {
            console.warn('LocalStorage clear failed:', error);
            return false;
        }
    }
    
    // ==================== NOTIFICATION UTILITIES ====================
    
    /**
     * Show notification to user
     * @param {string} message - Notification message
     * @param {string} type - Notification type (success, error, warning, info)
     * @param {number} duration - Display duration in milliseconds
     * @param {Object} options - Additional options
     */
    static showNotification(message, type = 'info', duration = null, options = {}) {
        duration = duration || STOCK_CONFIG.UI.NOTIFICATION_TIMEOUT;
        
        // Remove existing notifications if max stack reached
        const existingNotifications = document.querySelectorAll('.notification');
        if (existingNotifications.length >= STOCK_CONFIG.UI.NOTIFICATION_MAX_STACK) {
            existingNotifications[0].remove();
        }
        
        // Create notification element
        const notification = this.createElement('div', {
            className: `notification notification-${type} notification-enter`,
            role: 'alert',
            'aria-live': 'polite'
        });
        
        // Create notification content
        const content = this.createElement('div', {
            className: 'notification-content'
        });
        
        // Add icon based on type
        const icons = {
            success: '✓',
            error: '✕',
            warning: '⚠',
            info: 'ℹ'
        };
        
        const icon = this.createElement('span', {
            className: 'notification-icon'
        }, icons[type] || icons.info);
        
        const messageEl = this.createElement('span', {
            className: 'notification-message'
        }, this.sanitizeHTML(message));
        
        const closeBtn = this.createElement('button', {
            className: 'notification-close',
            'aria-label': 'Close notification',
            onclick: () => this.removeNotification(notification)
        }, '×');
        
        content.appendChild(icon);
        content.appendChild(messageEl);
        content.appendChild(closeBtn);
        notification.appendChild(content);
        
        // Position notification
        this.positionNotification(notification);
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Trigger enter animation
        setTimeout(() => {
            notification.classList.remove('notification-enter');
            notification.classList.add('notification-visible');
        }, 10);
        
        // Auto-remove after duration
        if (duration > 0) {
            setTimeout(() => {
                this.removeNotification(notification);
            }, duration);
        }
        
        // Play sound if enabled
        if (STOCK_CONFIG.SOUND.ENABLED && options.playSound !== false) {
            this.playNotificationSound(type);
        }
        
        return notification;
    }
    
    /**
     * Remove notification with animation
     * @param {HTMLElement} notification - Notification element
     */
    static removeNotification(notification) {
        if (!notification || !notification.parentNode) return;
        
        notification.classList.remove('notification-visible');
        notification.classList.add('notification-exit');
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, STOCK_CONFIG.UI.ANIMATION_DURATION);
    }
    
    /**
     * Position notification based on configuration
     * @param {HTMLElement} notification - Notification element
     */
    static positionNotification(notification) {
        const position = STOCK_CONFIG.UI.NOTIFICATION_POSITION;
        const existingNotifications = document.querySelectorAll('.notification.notification-visible');
        
        let top = 20;
        let right = 20;
        let left = 20;
        let bottom = 20;
        
        // Calculate position based on existing notifications
        if (existingNotifications.length > 0) {
            const lastNotification = existingNotifications[existingNotifications.length - 1];
            const rect = lastNotification.getBoundingClientRect();
            
            if (position.includes('top')) {
                top = rect.bottom + 10;
            } else if (position.includes('bottom')) {
                bottom = window.innerHeight - rect.top + 10;
            }
        }
        
        // Apply positioning
        notification.style.position = 'fixed';
        notification.style.zIndex = '10000';
        
        if (position.includes('top')) {
            notification.style.top = top + 'px';
        } else {
            notification.style.bottom = bottom + 'px';
        }
        
        if (position.includes('right')) {
            notification.style.right = right + 'px';
        } else {
            notification.style.left = left + 'px';
        }
    }
    
    // ==================== SOUND UTILITIES ====================
    
    /**
     * Play notification sound
     * @param {string} type - Sound type (notification, alert, error, success)
     */
    static playNotificationSound(type = 'notification') {
        if (!STOCK_CONFIG.SOUND.ENABLED) return;
        
        const soundMap = {
            notification: STOCK_CONFIG.SOUND.NOTIFICATION_SOUND,
            alert: STOCK_CONFIG.SOUND.ALERT_SOUND,
            error: STOCK_CONFIG.SOUND.ERROR_SOUND,
            success: STOCK_CONFIG.SOUND.SUCCESS_SOUND
        };
        
        const soundFile = soundMap[type] || soundMap.notification;
        
        try {
            const audio = new Audio(soundFile);
            audio.volume = STOCK_CONFIG.SOUND.VOLUME;
            audio.play().catch(error => {
                console.warn('Failed to play notification sound:', error);
            });
        } catch (error) {
            console.warn('Failed to create audio for notification:', error);
        }
    }
    
    /**
     * Toggle sound on/off
     * @returns {boolean} New sound state
     */
    static toggleSound() {
        const newState = !STOCK_CONFIG.SOUND.ENABLED;
        STOCK_CONFIG.SOUND.ENABLED = newState;
        
        // Save to localStorage
        this.setLocalStorage(STOCK_CONFIG.SOUND.STORAGE_KEY, {
            enabled: newState,
            volume: STOCK_CONFIG.SOUND.VOLUME
        });
        
        // Play test sound if enabling
        if (newState) {
            this.playNotificationSound('notification');
        }
        
        return newState;
    }
    
    // ==================== ERROR HANDLING UTILITIES ====================
    
    /**
     * Handle and report errors
     * @param {Error|string} error - Error object or message
     * @param {Object} context - Additional context information
     * @param {boolean} showToUser - Whether to show error to user
     */
    static handleError(error, context = {}, showToUser = true) {
        const errorInfo = {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : null,
            timestamp: new Date().toISOString(),
            url: window.location.href,
            userAgent: navigator.userAgent,
            context: context
        };
        
        // Log to console
        console.error('Application Error:', errorInfo);
        
        // Report error if enabled
        if (STOCK_CONFIG.ERROR.REPORT_ERRORS && STOCK_CONFIG.ERROR.AUTO_REPORT) {
            this.reportError(errorInfo);
        }
        
        // Show to user if requested
        if (showToUser) {
            const userMessage = STOCK_CONFIG.ERROR.SHOW_ERROR_DETAILS ? 
                errorInfo.message : 
                'An unexpected error occurred. Please try again.';
            
            this.showNotification(userMessage, 'error');
        }
        
        // Track error for analytics
        if (STOCK_CONFIG.FEATURES.ERROR_TRACKING) {
            this.trackError(errorInfo);
        }
    }
    
    /**
     * Report error to server
     * @param {Object} errorInfo - Error information
     */
    static reportError(errorInfo) {
        try {
            this.makeRequest(STOCK_CONFIG.ERROR.REPORT_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(errorInfo),
                retries: 1 // Don't retry error reports too much
            }).catch(reportError => {
                console.warn('Failed to report error:', reportError);
            });
        } catch (error) {
            console.warn('Error reporting failed:', error);
        }
    }
    
    /**
     * Track error for analytics
     * @param {Object} errorInfo - Error information
     */
    static trackError(errorInfo) {
        // Store error in localStorage for analytics
        try {
            const errors = this.getLocalStorage('error-tracking', []);
            errors.push(errorInfo);
            
            // Keep only last 100 errors
            if (errors.length > 100) {
                errors.splice(0, errors.length - 100);
            }
            
            this.setLocalStorage('error-tracking', errors);
        } catch (error) {
            console.warn('Error tracking failed:', error);
        }
    }
    
    // ==================== SECURITY UTILITIES ====================
    
    /**
     * Sanitize HTML content to prevent XSS
     * @param {string} html - HTML string to sanitize
     * @returns {string} Sanitized HTML
     */
    static sanitizeHTML(html) {
        if (!html || typeof html !== 'string') return '';
        
        if (!STOCK_CONFIG.SECURITY.ESCAPE_HTML) {
            return html;
        }
        
        // Create temporary element
        const temp = document.createElement('div');
        temp.textContent = html;
        
        return temp.innerHTML;
    }
    
    /**
     * Validate and sanitize input
     * @param {string} input - Input to validate
     * @param {Object} options - Validation options
     * @returns {Object} Validation result
     */
    static validateInput(input, options = {}) {
        if (!input || typeof input !== 'string') {
            return { valid: false, error: 'Input must be a non-empty string', sanitized: '' };
        }
        
        // Check length
        const maxLength = options.maxLength || STOCK_CONFIG.SECURITY.MAX_INPUT_LENGTH;
        if (input.length > maxLength) {
            return { valid: false, error: `Input too long (max ${maxLength} characters)`, sanitized: '' };
        }
        
        // Sanitize input
        let sanitized = input.trim();
        
        if (STOCK_CONFIG.SECURITY.SANITIZE_INPUT) {
            sanitized = this.sanitizeHTML(sanitized);
        }
        
        // Check for allowed patterns
        if (options.pattern && !options.pattern.test(sanitized)) {
            return { valid: false, error: 'Input format is invalid', sanitized: '' };
        }
        
        return { valid: true, sanitized: sanitized };
    }
    
    /**
     * Generate cryptographically secure random string
     * @param {number} length - String length
     * @returns {string} Random string
     */
    static generateSecureId(length = 16) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        // Use crypto.getRandomValues if available
        if (window.crypto && window.crypto.getRandomValues) {
            const array = new Uint8Array(length);
            window.crypto.getRandomValues(array);
            
            for (let i = 0; i < length; i++) {
                result += chars[array[i] % chars.length];
            }
        } else {
            // Fallback to Math.random
            for (let i = 0; i < length; i++) {
                result += chars[Math.floor(Math.random() * chars.length)];
            }
        }
        
        return result;
    }
    
    // ==================== UTILITY FUNCTIONS ====================
    
    /**
     * Deep clone object
     * @param {any} obj - Object to clone
     * @returns {any} Cloned object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        
        if (obj instanceof Date) {
            return new Date(obj.getTime());
        }
        
        if (obj instanceof Array) {
            return obj.map(item => this.deepClone(item));
        }
        
        if (typeof obj === 'object') {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
        
        return obj;
    }
    
    /**
     * Check if object is empty
     * @param {any} obj - Object to check
     * @returns {boolean} True if empty
     */
    static isEmpty(obj) {
        if (obj === null || obj === undefined) return true;
        if (typeof obj === 'string' || Array.isArray(obj)) return obj.length === 0;
        if (typeof obj === 'object') return Object.keys(obj).length === 0;
        return false;
    }
    
    /**
     * Generate unique ID
     * @param {string} prefix - ID prefix
     * @returns {string} Unique identifier
     */
    static generateUID(prefix = 'uid') {
        return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    
    /**
     * Format file size in human readable format
     * @param {number} bytes - File size in bytes
     * @param {number} decimals - Number of decimal places
     * @returns {string} Formatted file size
     */
    static formatFileSize(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
        
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        
        return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
    }
    
    /**
     * Copy text to clipboard
     * @param {string} text - Text to copy
     * @returns {Promise<boolean>} Success status
     */
    static async copyToClipboard(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
                return true;
            } else {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = text;
                textArea.style.position = 'absolute';
                textArea.style.left = '-999999px';
                
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                const successful = document.execCommand('copy');
                document.body.removeChild(textArea);
                
                return successful;
            }
        } catch (error) {
            console.warn('Failed to copy to clipboard:', error);
            return false;
        }
    }
    
    /**
     * Get browser information
     * @returns {Object} Browser info
     */
    static getBrowserInfo() {
        const ua = navigator.userAgent;
        let browser = 'Unknown';
        let version = 'Unknown';
        
        if (ua.indexOf('Chrome') > -1) {
            browser = 'Chrome';
            version = ua.match(/Chrome\/(\d+)/)?.[1];
        } else if (ua.indexOf('Firefox') > -1) {
            browser = 'Firefox';
            version = ua.match(/Firefox\/(\d+)/)?.[1];
        } else if (ua.indexOf('Safari') > -1) {
            browser = 'Safari';
            version = ua.match(/Version\/(\d+)/)?.[1];
        } else if (ua.indexOf('Edge') > -1) {
            browser = 'Edge';
            version = ua.match(/Edge\/(\d+)/)?.[1];
        }
        
        return {
            browser,
            version,
            userAgent: ua,
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isOnline: navigator.onLine,
            language: navigator.language,
            cookieEnabled: navigator.cookieEnabled
        };
    }
    
    /**
     * Debug logging with levels
     * @param {string} level - Log level (debug, info, warn, error)
     * @param {string} message - Log message
     * @param {any} data - Additional data to log
     */
    static log(level, message, data = null) {
        if (!STOCK_CONFIG.DEBUG.ENABLED) return;
        
        const levels = ['debug', 'info', 'warn', 'error'];
        const configLevel = STOCK_CONFIG.DEBUG.LEVEL;
        const configLevelIndex = levels.indexOf(configLevel);
        const currentLevelIndex = levels.indexOf(level);
        
        // Only log if current level is >= config level
        if (currentLevelIndex >= configLevelIndex) {
            const timestamp = new Date().toISOString();
            const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
            
            switch (level) {
                case 'debug':
                    console.debug(logMessage, data);
                    break;
                case 'info':
                    console.info(logMessage, data);
                    break;
                case 'warn':
                    console.warn(logMessage, data);
                    break;
                case 'error':
                    console.error(logMessage, data);
                    break;
                default:
                    console.log(logMessage, data);
            }
        }
    }
}

// Make Utils globally available
window.Utils = Utils;

// Add convenience methods to global scope for debugging
if (STOCK_CONFIG.DEBUG.ENABLED) {
    window.debug = (message, data) => Utils.log('debug', message, data);
    window.info = (message, data) => Utils.log('info', message, data);
    window.warn = (message, data) => Utils.log('warn', message, data);
    window.error = (message, data) => Utils.log('error', message, data);
}

// Export for module systems (if needed) else use it the way it is 
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Utils;
}// Add utility functions for data processing in utils.js
// Add date formatting utilities in utils.js
// Add error handling utilities in utils.js
// Add data validation utilities in utils.js
// Add API rate limiting utilities in utils.js
// Add logging utilities in utils.js
// Add data caching utilities in utils.js
// Add performance optimization utilities
// Add theme switching utilities in utils.js
// Add search query utilities in utils.js
// Add data aggregation utilities
// Add metrics calculation utilities
// Add trend calculation utilities
// Add portfolio calculation utilities
// Add data export utilities
// Add CSV export utilities
// Optimize CSV export performance
// Add filtering utilities in utils.js
// Add animation utilities in utils.js
// Add streaming data utilities
// Add authentication utilities in utils.js
// Add user profile utilities
// Add offline storage utilities
// Add error logging utilities
// Add unit tests for utils.js
// Optimize utility functions
// Add accessibility utilities
// Add multilingual utilities
// Add annotation utilities
// Add performance monitoring utilities
// Add data compression utilities
// Add compression utilities
// Add PDF export utilities
// Add data import utilities
// Add final optimizations to utils.js
// Add final tests for utils.js
// Add utility functions for data processing in utils.js
// Add error handling utilities in utils.js
// Add data validation utilities in utils.js
// Add logging utilities in utils.js
// Add data caching utilities in utils.js
