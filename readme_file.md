# Real-Time Stock Dashboard

A modern, real-time stock market dashboard built with PHP, XML, and XMLHttpRequest (XHR) for live market data updates. This project demonstrates the power of traditional web technologies in creating dynamic, responsive financial applications.


## Features

- **Real-Time Updates**: Live stock price updates using XHR polling
- **XML Data Processing**: Server-side XML generation and client-side parsing
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Advanced Caching**: Intelligent caching system to optimize API calls
- **Error Handling**: Robust error handling with graceful fallbacks
- **Market Status**: Real-time market open/close status indication
- **Interactive Charts**: Mini price trend charts for each stock
- **Sound Notifications**: Optional audio alerts for price changes
- **Customizable Intervals**: Configurable update frequencies
- **Stock Favorites**: Add stocks to favorites for quick access
- **Price Alerts**: Set custom price alerts for specific stocks
- **Fullscreen Mode**: Immersive fullscreen dashboard experience

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript, XMLHttpRequest
- **Backend**: PHP 7.4+, cURL, DOM/SimpleXML
- **Data Format**: XML for data exchange
- **API**: Alpha Vantage Stock API
- **Caching**: File-based caching system
- **Logging**: Monolog for comprehensive logging
- **Development**: Composer, PHPUnit, PHP CodeSniffer

## Requirements

### System Requirements
- PHP 7.4 or higher
- Apache/Nginx web server
- cURL extension enabled
- JSON extension enabled
- XML/DOM extensions enabled
- Write permissions for cache directories

### PHP Extensions Required
```bash
php -m | grep -E "(curl|json|xml|dom|simplexml)"
```

### API Requirements
- Alpha Vantage API key (free tier available)
- Internet connection for API calls

## Installation

### 1. Clone the Repository
```bash
git clone https://github.com/AliOding12/stock-dashboard.git
cd stock-dashboard
```

### 2. Install Dependencies (Optional)
```bash
composer install
```

### 3. Set Up Directories and Permissions
```bash
# Create required directories
mkdir -p data/cache/stocks data/cache/metadata data/logs assets/images/stock-icons

# Set permissions
chmod -R 755 data/
chmod -R 777 data/cache/ data/logs/
```

### 4. Configure Alpha Vantage API
1. Sign up for a free API key at [Alpha Vantage](https://www.alphavantage.co/support/#api-key)
2. Copy your API key
3. Update `php/config.php`:
```php
define('ALPHA_VANTAGE_API_KEY', 'YOUR_API_KEY_HERE');
```

### 5. Configure Web Server

#### Apache (.htaccess already included)
Make sure mod_rewrite, mod_headers, and mod_expires are enabled.

#### Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/stock-dashboard;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php7.4-fpm.sock;
        fastcgi_index index.php;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }

    location /data/ {
        deny all;
    }
}
```

### 6. Test Installation
1. Open your browser and navigate to your installation URL
2. You should see the dashboard loading with stock data
3. Check browser console for any JavaScript errors
4. Check `data/logs/` for any PHP errors

## Configuration

### Stock Symbols
Edit `php/config.php` to customize tracked stocks:
```php
define('STOCK_SYMBOLS', ['AAPL', 'GOOGL', 'MSFT', 'AMZN', 'TSLA', 'META', 'NVDA']);
```

### Update Intervals
Default intervals can be modified in `js/config.js`:
```javascript
POLLING: {
    DEFAULT_INTERVAL: 30000, // 30 seconds
    MIN_INTERVAL: 5000,      // 5 seconds minimum
    MAX_INTERVAL: 3600000,   // 1 hour maximum
}
```

### Cache Settings
Adjust caching behavior in `php/config.php`:
```php
define('CACHE_DURATION', 60); // Cache for 60 seconds
define('CACHE_ENABLED', true);
```

### Debug Mode
Enable debug mode for development:
```php
define('DEBUG_MODE', true);
```

## Usage

### Basic Usage
1. Open the dashboard in your web browser
2. Stock data will automatically load and update
3. Use the control panel to adjust update intervals
4. Click on stock cards for detailed information

### Advanced Features
- **Pause Updates**: Click the pause button to stop automatic updates
- **Manual Refresh**: Use the refresh button for immediate updates
- **Fullscreen Mode**: Click fullscreen for an immersive experience
- **Set Alerts**: Click the alert button on any stock card
- **Add Favorites**: Mark frequently watched stocks as favorites

### Keyboard Shortcuts
- `Space`: Pause/Resume updates
- `R`: Manual refresh
- `F`: Toggle fullscreen
- `S`: Toggle sound notifications

## API Endpoints

### Get Stock Data
```
GET /php/get_stock_data.php
Content-Type: application/xml

Response:
<?xml version="1.0" encoding="UTF-8"?>
<stockData>
    <timestamp>2025-01-15 10:30:00</timestamp>
    <stock>
        <symbol>AAPL</symbol>
        <name>Apple Inc.</name>
        <price>150.25</price>
        <change>2.15</change>
        <changePercent>1.45</changePercent>
        <volume>25687431</volume>
        <lastUpdate>2025-01-15 10:30:00</lastUpdate>
    </stock>
    <!-- Additional stock entries -->
</stockData>
```

### Health Check
```
GET /php/health_check.php
Content-Type: application/json

Response:
{
    "status": "ok",
    "timestamp": "2025-01-15T10:30:00Z",
    "version": "1.0.0"
}
```

## 🧪 Testing

### Run PHP Tests
```bash
composer test
```

### Run Code Style Checks
```bash
composer cs-check
```

### Run Static Analysis
```bash
composer analyse
```

### Manual Testing
1. Test with network disconnection
2. Test with invalid API key
3. Test with malformed API responses
4. Test browser compatibility
5. Test mobile responsiveness

## Performance Optimization

### Caching Strategy
- API responses cached for 60 seconds by default
- Client-side caching for reduced server requests
- Metadata caching for improved response times

### Network Optimization
- Gzip compression enabled
- Static asset caching
- Optimized polling intervals
- Request deduplication

### Memory Management
- Efficient XML parsing
- Garbage collection for old cache files
- Memory limit monitoring

## Troubleshooting

### Common Issues

#### No Data Loading
1. Check API key configuration
2. Verify internet connection
3. Check PHP error logs in `data/logs/`
4. Ensure cache directory is writable

#### Slow Updates
1. Reduce update interval
2. Check API rate limits
3. Verify cache settings
4. Monitor network performance

#### JavaScript Errors
1. Check browser console
2. Verify all JS files are loaded
3. Test in different browsers
4. Check for CORS issues

### Log Files
- PHP Errors: `data/logs/php_errors.log`
- API Errors: `data/logs/api_errors.log`
- Access Logs: `data/logs/access.log`
- Cache Logs: `data/logs/cache.log`

## Security Considerations

- API keys are server-side only
- CORS headers properly configured
- Input validation and sanitization
- Directory traversal protection
- Cache file access restrictions

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -am 'Add new feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

### Coding Standards
- Follow PSR-12 coding standards
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Alpha Vantage](https://www.alphavantage.co/) for providing stock market data
- [Monolog](https://github.com/Seldaek/monolog) for logging functionality
- [Guzzle HTTP](https://github.com/guzzle/guzzle) for HTTP client capabilities

## Support

For support, email abbasali1214313@gmail.com or create an issue on GitHub.

## Roadmap

- [ ] WebSocket implementation for real-time updates
- [ ] Chart.js integration for advanced charting
- [ ] User authentication system
- [ ] Portfolio tracking features
- [ ] Mobile app development
- [ ] Docker containerization
- [ ] Redis caching support
- [ ] GraphQL API implementation

---

**Built with ❤️ Not Complete Yet but with JS, XML, and XHR maybe PHP be Used too**