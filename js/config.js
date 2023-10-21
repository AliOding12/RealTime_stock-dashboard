/**
 * Client-side Configuration for Stock Dashboard
 * This file contains all configurable settings for the frontend application
 * 
 * @author Stock Dashboard Team
 * @version 1.0.0
 * @since 2025-01-15
 */

'use strict';

/**
 * Main configuration object
 * All configuration settings are organized into logical groups
 */
const CONFIG = {
    /**
     * Application metadata
     */
    APP: {
        NAME: 'Real-Time Stock Dashboard',
        VERSION: '1.0.0',
        AUTHOR: 'Stock Dashboard Team',
        BUILD_DATE: '2025-01-15',
        ENVIRONMENT: 'production', // 'development' | 'staging' | 'production'
        BASE_URL: window.location.origin
    },

    /**
     * API endpoint configurations
     */
    API: {
        // Main endpoints
        STOCK_DATA: 'php/get_stock_data.php',
        HEALTH_CHECK: 'php/health_check.php',
        STOCK_DETAILS: 'php/get_stock_details.php',
        HISTORICAL_DATA: 'php/get_historical_data.php',
        
        // Request settings
        TIMEOUT: 30000, // 30 seconds
        RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 2000, // 2 seconds
        
        // Rate limiting
        MAX_REQUESTS_PER_MINUTE: 60,
        REQUEST_QUEUE_SIZE: 10,
        
        // Headers
        DEFAULT_HEADERS: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
        }
    },

    /**
     * Real-time polling configurations
     */
    POLLING: {
        // Default interval settings
        DEFAULT_INTERVAL: 30000,    // 30 seconds
        MIN_INTERVAL: 5000,         // 5 seconds (minimum allowed)
        MAX_INTERVAL: 3600000,      // 1 hour (maximum allowed)
        
        // Retry and error handling
        RETRY_DELAY: 5000,          // Retry after 5 seconds on error
        MAX_RETRIES: 3,             // Maximum consecutive failures before stopping
        EXPONENTIAL_BACKOFF: true,  // Use exponential backoff for retries
        BACKOFF_MULTIPLIER: 2,      // Backoff multiplier
        
        // Connection management
        HEARTBEAT_INTERVAL: 60000,  // Send heartbeat every minute
        CONNECTION_TIMEOUT: 15000,  // Connection timeout
        
        // Performance optimization
        ADAPTIVE_POLLING: true,     // Adjust polling based on market hours
        MARKET_HOURS_INTERVAL: 15000, // 15 seconds during market hours
        AFTER_HOURS_INTERVAL: 60000,  // 1 minute after hours
        
        // Pause/resume settings
        AUTO_PAUSE_ON_ERROR: true,  // Auto-pause on consecutive errors
        AUTO_RESUME_DELAY: 30000,   // Auto-resume after 30 seconds
        PAUSE_ON_TAB_BLUR: false,   // Pause when tab loses focus
        RESUME_ON_TAB_FOCUS: false  // Resume when tab gains focus
    },

    /**
     * User interface configurations
     */
    UI: {
        // Animation settings
        ANIMATION_DURATION: 300,        // Default animation duration (ms)
        TRANSITION_EASING: 'ease-in-out', // CSS transition easing
        CARD_ANIMATION_DELAY: 50,       // Stagger delay for card animations
        
        // Loading states
        LOADING_MIN_DISPLAY: 500,       // Minimum loading display time
        LOADING_SPINNER_DELAY: 200,     // Delay before showing spinner
        
        // Notifications
        NOTIFICATION_TIMEOUT: 5000,     // Auto-hide notifications after 5s
        NOTIFICATION_MAX_STACK: 3,      // Maximum stacked notifications
        NOTIFICATION_POSITION: 'top-right', // Position: top-left, top-right, bottom-left, bottom-right
        
        // Grid layout
        GRID_COLUMNS_MIN: 1,            // Minimum grid columns
        GRID_COLUMNS_MAX: 4,            // Maximum grid columns
        GRID_GAP: 20,                   // Grid gap in pixels
        CARD_MIN_WIDTH: 280,            // Minimum card width
        CARD_MAX_WIDTH: 400,            // Maximum card width
        
        // Responsive breakpoints
        BREAKPOINTS: {
            MOBILE: 768,                // Mobile breakpoint
            TABLET: 1024,               // Tablet breakpoint
            DESKTOP: 1200               // Desktop breakpoint
        },
        
        // Color themes
        THEME: {
            DEFAULT: 'light',           // Default theme
            AVAILABLE: ['light', 'dark', 'auto'], // Available themes
            AUTO_SWITCH: true,          // Auto switch based on system preference
            STORAGE_KEY: 'dashboard-theme' // LocalStorage key for theme
        },
        
        // Accessibility
        ACCESSIBILITY: {
            REDUCED_MOTION: false,      // Respect prefers-reduced-motion
            HIGH_CONTRAST: false,       // High contrast mode
            FOCUS_VISIBLE: true,        // Enhanced focus indicators
            ARIA_LIVE_UPDATES: true     // Screen reader announcements
        }
    },

    /**
     * Data formatting configurations
     */
    FORMAT: {
        // Currency formatting
        CURRENCY_SYMBOL: '$',
        CURRENCY_DECIMALS: 2,
        CURRENCY_LOCALE: 'en-US',
        
        // Percentage formatting
        PERCENTAGE_DECIMALS: 2,
        PERCENTAGE_SIGN: '%',
        SHOW_PERCENTAGE_SIGN: true,
        SHOW_POSITIVE_SIGN: true,
        
        // Number formatting
        VOLUME_ABBREVIATIONS: true,     // Use K, M, B abbreviations
        VOLUME_DECIMALS: 1,             // Decimal places for abbreviated volumes
        THOUSAND_SEPARATOR: ',',        // Thousands separator
        DECIMAL_SEPARATOR: '.',         // Decimal separator
        
        // Date/Time formatting
        DATETIME_FORMAT: 'MM/DD/YYYY HH:mm:ss',
        TIME_FORMAT: 'HH:mm:ss',
        DATE_FORMAT: 'MM/DD/YYYY',
        TIMEZONE: 'America/New_York',   // Market timezone
        
        // Price change indicators
        PRICE_CHANGE_ICONS: {
            UP: '▲',
            DOWN: '▼',
            NEUTRAL: '■'
        },
        
        // Color coding
        COLORS: {
            POSITIVE: '#4CAF50',        // Green for gains
            NEGATIVE: '#f44336',        // Red for losses
            NEUTRAL: '#757575',         // Gray for no change
            WARNING: '#FF9800',         // Orange for warnings
            INFO: '#2196F3'             // Blue for info
        }
    },

    /**
     * Sound and notification settings
     */
    SOUND: {
        ENABLED: false,                 // Sound notifications enabled by default
        VOLUME: 0.5,                    // Volume level (0.0 - 1.0)
        
        // Sound files
        NOTIFICATION_SOUND: 'assets/sounds/notification.mp3',
        ALERT_SOUND: 'assets/sounds/alert.mp3',
        ERROR_SOUND: 'assets/sounds/error.mp3',
        SUCCESS_SOUND: 'assets/sounds/success.mp3',
        
        // Sound triggers
        PLAY_ON_UPDATE: false,          // Play sound on data update
        PLAY_ON_ALERT: true,            // Play sound on price alerts
        PLAY_ON_ERROR: true,            // Play sound on errors
        PLAY_ON_CONNECTION_RESTORED: true, // Play sound when connection restored
        
        // Sound settings storage
        STORAGE_KEY: 'dashboard-sound-settings'
    },

    /**
     * Client-side caching configurations
     */
    CACHE: {
        ENABLED: true,                  // Enable client-side caching
        
        // Cache durations (milliseconds)
        STOCK_DATA_DURATION: 30000,     // Cache stock data for 30 seconds
        HISTORICAL_DATA_DURATION: 300000, // Cache historical data for 5 minutes
        METADATA_DURATION: 3600000,     // Cache metadata for 1 hour
        
        // Cache limits
        MAX_ENTRIES: 100,               // Maximum cache entries
        MAX_SIZE: 5242880,              // Maximum cache size (5MB)
        
        // Cache keys
        KEYS: {
            STOCK_DATA: 'stock-data-',
            HISTORICAL_DATA: 'historical-data-',
            USER_PREFERENCES: 'user-preferences',
            FAVORITES: 'favorite-stocks',
            ALERTS: 'price-alerts'
        },
        
        // Cache cleanup
        AUTO_CLEANUP: true,             // Automatically clean expired entries
        CLEANUP_INTERVAL: 300000,       // Cleanup every 5 minutes
        CLEANUP_ON_START: true          // Cleanup on application start
    },

    /**
     * Feature flags and experimental features
     */
    FEATURES: {
        // Chart features
        MINI_CHARTS: true,              // Show mini charts on cards
        INTERACTIVE_CHARTS: false,      // Enable interactive chart modals
        CHART_ANIMATIONS: true,         // Animate chart updates
        
        // Advanced features
        PRICE_ALERTS: true,             // Enable price alert system
        FAVORITES: true,                // Enable favorite stocks
        PORTFOLIO_TRACKING: false,      // Portfolio tracking (future feature)
        NEWS_INTEGRATION: false,        // News feed integration (future feature)
        
        // UI features
        FULLSCREEN_MODE: true,          // Enable fullscreen toggle
        DARK_MODE: true,                // Enable dark mode
        KEYBOARD_SHORTCUTS: true,       // Enable keyboard shortcuts
        CONTEXT_MENUS: false,           // Right-click context menus
        
        // Performance features
        VIRTUAL_SCROLLING: false,       // Virtual scrolling for large lists
        LAZY_LOADING: true,             // Lazy load non-critical resources
        SERVICE_WORKER: false,          // Service worker for offline support
        
        // Analytics and tracking
        ERROR_TRACKING: true,           // Track JavaScript errors
        PERFORMANCE_MONITORING: false, // Monitor performance metrics
        USER_ANALYTICS: false           // User behavior analytics
    },

    /**
     * Stock-specific configurations
     */
    STOCKS: {
        // Default symbols to track
        DEFAULT_SYMBOLS: ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA'],
        
        // Symbol validation
        SYMBOL_MIN_LENGTH: 1,
        SYMBOL_MAX_LENGTH: 5,
        SYMBOL_PATTERN: /^[A-Z]{1,5}$/,
        
        // Price alert settings
        ALERTS: {
            MAX_ALERTS_PER_STOCK: 5,
            MIN_PRICE_THRESHOLD: 0.01,
            MAX_PRICE_THRESHOLD: 999999,
            DEFAULT_ALERT_TYPE: 'above', // 'above' | 'below' | 'change'
            STORAGE_KEY: 'stock-alerts'
        },
        
        // Favorites settings
        FAVORITES: {
            MAX_FAVORITES: 20,
            STORAGE_KEY: 'favorite-stocks',
            AUTO_ADD_TO_TOP: true
        },
        
        // Data validation
        VALIDATION: {
            PRICE_MIN: 0,
            PRICE_MAX: 999999,
            VOLUME_MIN: 0,
            CHANGE_PERCENT_MAX: 100 // Maximum % change to consider valid
        }
    },

    /**
     * Market hours and trading configurations
     */
    MARKET: {
        // Trading hours (Eastern Time)
        HOURS: {
            OPEN: '09:30',              // Market open time
            CLOSE: '16:00',             // Market close time
            TIMEZONE: 'America/New_York' // Market timezone
        },
        
        // Trading days
        TRADING_DAYS: [1, 2, 3, 4, 5], // Monday through Friday
        
        // Holidays (simplified - would normally come from API)
        HOLIDAYS: [
            '2025-01-01', // New Year's Day
            '2025-01-20', // Martin Luther King Jr. Day
            '2025-02-17', // Presidents' Day
            '2025-04-18', // Good Friday
            '2025-05-26', // Memorial Day
            '2025-07-04', // Independence Day
            '2025-09-01', // Labor Day
            '2025-11-27', // Thanksgiving
            '2025-12-25'  // Christmas
        ],
        
        // Extended hours
        EXTENDED_HOURS: {
            PRE_MARKET_START: '04:00',
            PRE_MARKET_END: '09:30',
            AFTER_HOURS_START: '16:00',
            AFTER_HOURS_END: '20:00'
        }
    },

    /**
     * Security and privacy configurations
     */
    SECURITY: {
        // Input validation
        SANITIZE_INPUT: true,
        MAX_INPUT_LENGTH: 1000,
        
        // XSS protection
        ESCAPE_HTML: true,
        ALLOW_HTML_TAGS: [], // No HTML tags allowed by default
        
        // Rate limiting (client-side)
        RATE_LIMIT: {
            ENABLED: true,
            MAX_REQUESTS: 100,          // Max requests per time window
            TIME_WINDOW: 60000,         // Time window in milliseconds (1 minute)
            BLOCK_DURATION: 300000     // Block duration on rate limit (5 minutes)
        },
        
        // Content Security Policy
        CSP: {
            REPORT_VIOLATIONS: false,
            REPORT_URI: '/api/csp-report'
        }
    },

    /**
     * Development and debugging configurations
     */
    DEBUG: {
        ENABLED: false,                 // Enable debug mode
        LEVEL: 'info',                 // Debug level: 'error', 'warn', 'info', 'debug'
        
        // Console logging
        CONSOLE_LOGGING: true,
        LOG_API_CALLS: false,
        LOG_PERFORMANCE: false,
        LOG_USER_ACTIONS: false,
        
        // Visual debugging
        SHOW_GRID_LINES: false,
        SHOW_TIMING_INFO: false,
        HIGHLIGHT_UPDATES: false,
        
        // Mock data for development
        USE_MOCK_DATA: false,
        MOCK_API_DELAY: 1000,
        MOCK_ERROR_RATE: 0,            // 0-1 probability of mock errors
        
        // Performance monitoring
        TRACK_MEMORY_USAGE: false,
        TRACK_RENDER_TIME: false,
        TRACK_API_RESPONSE_TIME: false
    },

    /**
     * Error handling configurations
     */
    ERROR: {
        // Error reporting
        REPORT_ERRORS: true,
        AUTO_REPORT: false,             // Automatically report errors
        REPORT_ENDPOINT: '/api/error-report',
        
        // Error recovery
        AUTO_RETRY: true,
        MAX_RETRY_ATTEMPTS: 3,
        RETRY_DELAY: 2000,
        
        // Error display
        SHOW_ERROR_DETAILS: false,      // Show technical error details to users
        ERROR_TIMEOUT: 10000,           // Auto-hide errors after 10 seconds
        
        // Fallback behavior
        GRACEFUL_DEGRADATION: true,     // Gracefully handle feature failures
        OFFLINE_MODE: false,            // Enable offline mode when possible
        
        // Error types to handle
        HANDLE_NETWORK_ERRORS: true,
        HANDLE_PARSE_ERRORS: true,
        HANDLE_VALIDATION_ERRORS: true,
        HANDLE_PERMISSION_ERRORS: true
    },

    /**
     * Localization and internationalization
     */
    I18N: {
        DEFAULT_LOCALE: 'en-US',
        SUPPORTED_LOCALES: ['en-US', 'es-ES', 'fr-FR', 'de-DE'],
        FALLBACK_LOCALE: 'en-US',
        
        // Date and number formatting
        USE_BROWSER_LOCALE: true,
        CURRENCY_DISPLAY: 'symbol',     // 'symbol', 'code', 'name'
        NUMBER_GROUPING: true,
        
        // Translation loading
        LAZY_LOAD_TRANSLATIONS: false,
        CACHE_TRANSLATIONS: true,
        TRANSLATION_CACHE_DURATION: 3600000 // 1 hour
    }
};

/**
 * Environment-specific configuration overrides
 */
const ENVIRONMENT_OVERRIDES = {
    development: {
        DEBUG: {
            ENABLED: true,
            LEVEL: 'debug',
            CONSOLE_LOGGING: true,
            LOG_API_CALLS: true,
            LOG_PERFORMANCE: true,
            USE_MOCK_DATA: false
        },
        POLLING: {
            DEFAULT_INTERVAL: 10000     // 10 seconds for development
        },
        CACHE: {
            ENABLED: false              // Disable cache in development
        },
        ERROR: {
            SHOW_ERROR_DETAILS: true,
            REPORT_ERRORS: false
        }
    },
    
    staging: {
        DEBUG: {
            ENABLED: true,
            LEVEL: 'warn',
            CONSOLE_LOGGING: true
        },
        ERROR: {
            REPORT_ERRORS: true,
            AUTO_REPORT: false
        }
    },
    
    production: {
        DEBUG: {
            ENABLED: false,
            CONSOLE_LOGGING: false
        },
        ERROR: {
            REPORT_ERRORS: true,
            AUTO_REPORT: true,
            SHOW_ERROR_DETAILS: false
        },
        SECURITY: {
            RATE_LIMIT: {
                ENABLED: true
            }
        }
    }
};

/**
 * Apply environment-specific overrides
 */
function applyEnvironmentConfig() {
    const environment = CONFIG.APP.ENVIRONMENT;
    const overrides = ENVIRONMENT_OVERRIDES[environment];
    
    if (overrides) {
        // Deep merge overrides into main config
        mergeDeep(CONFIG, overrides);
    }
}

/**
 * Deep merge utility function
 * @param {Object} target - Target object
 * @param {Object} source - Source object
 * @returns {Object} Merged object
 */
function mergeDeep(target, source) {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            mergeDeep(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
}

/**
 * Validate configuration
 */
function validateConfig() {
    const errors = [];
    
    // Validate polling intervals
    if (CONFIG.POLLING.MIN_INTERVAL >= CONFIG.POLLING.MAX_INTERVAL) {
        errors.push('POLLING.MIN_INTERVAL must be less than POLLING.MAX_INTERVAL');
    }
    
    if (CONFIG.POLLING.DEFAULT_INTERVAL < CONFIG.POLLING.MIN_INTERVAL || 
        CONFIG.POLLING.DEFAULT_INTERVAL > CONFIG.POLLING.MAX_INTERVAL) {
        errors.push('POLLING.DEFAULT_INTERVAL must be between MIN_INTERVAL and MAX_INTERVAL');
    }
    
    // Validate cache settings
    if (CONFIG.CACHE.MAX_SIZE <= 0) {
        errors.push('CACHE.MAX_SIZE must be greater than 0');
    }
    
    // Validate format settings
    if (CONFIG.FORMAT.CURRENCY_DECIMALS < 0 || CONFIG.FORMAT.CURRENCY_DECIMALS > 10) {
        errors.push('FORMAT.CURRENCY_DECIMALS must be between 0 and 10');
    }
    
    if (errors.length > 0) {
        console.error('Configuration validation errors:', errors);
        throw new Error(`Configuration validation failed: ${errors.join(', ')}`);
    }
}

/**
 * Initialize configuration
 */
function initializeConfig() {
    try {
        // Apply environment overrides
        applyEnvironmentConfig();
        
        // Validate configuration
        validateConfig();
        
        // Log configuration in debug mode
        if (CONFIG.DEBUG.ENABLED) {
            console.log('Configuration initialized:', CONFIG);
        }
        
        return true;
    } catch (error) {
        console.error('Failed to initialize configuration:', error);
        return false;
    }
}

// Apply environment configuration 
initializeConfig();

// Make configuration globally available
window.STOCK_CONFIG = CONFIG;

// Freeze the configuration to prevent accidental modifications
Object.freeze(CONFIG);

// Export for module systems (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}// Add initial configuration in config.js
// Add API endpoint configurations in config.js
// Add caching configuration in config.js
// Add environment-specific settings in config.js
// Add custom chart settings in config.js
// Add error reporting settings in config.js
// Add dark mode settings in config.js
// Add watchlist settings in config.js
// Add performance metrics settings
// Add trend analysis settings
// Add portfolio settings in config.js
// Add export settings in config.js
// Add CSV export settings
// Add filter settings in config.js
// Add animation settings in config.js
// Add streaming settings in config.js
// Add authentication settings in config.js
// Add offline mode settings
// Add error logging settings
// Add test configuration settings
// Add accessibility settings
// Add language settings in config.js
// Add annotation settings in config.js
// Add performance monitoring settings
// Add compression settings
// Add PDF export settings
// Add import settings in config.js
// Add final configuration tweaks
// Add initial configuration in config.js
// Add API endpoint configurations in config.js
