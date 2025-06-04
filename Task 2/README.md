# FakeStore API Testing Tool - Task 2

## 📋 Project Description

This is the second test assignment completed as part of an artificial intelligence skills assessment in the department. The task was to develop automated tests to validate data provided by the FakeStore API to detect errors and anomalies in product data.

## 🎯 Features

The application provides comprehensive API testing functionality:

### Core Testing Features
- **API Response Validation**: Verifies server response code (expected 200)
- **JSON Structure Validation**: Ensures valid JSON format and array structure
- **Product Data Validation**: Comprehensive validation of product attributes:
  - `title` (name) - must not be empty
  - `price` (price) - must not be negative
  - `rating.rate` - must not exceed 5 and must be numeric (0-5 range)
  - Required fields presence validation

### Reporting Features
- **Real-time Test Execution**: Live progress indication with loading animations
- **Comprehensive Test Results**: Detailed breakdown of all validation tests
- **Defective Products List**: Table view of products containing data quality issues
- **Performance Metrics**: Response time measurement and display
- **Visual Status Indicators**: Color-coded results for quick assessment

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern styling using CSS Variables and BEM methodology
- **JavaScript ES6+**: Async/await, Fetch API, modern DOM manipulation
- **Bootstrap 5.3.6**: Latest version for responsive design and components
- **Bootstrap Icons**: Comprehensive icon library

### Backend
- **PHP 8+**: Object-oriented approach with type declarations
- **cURL**: HTTP client for API requests
- **JSON**: Data exchange format

## 🎨 Design Features

- **Modern Dark Theme**: Inspired by Discord and GitHub interfaces
- **Responsive Design**: Works seamlessly across all devices
- **BEM Methodology**: CSS classes follow Block Element Modifier naming convention
- **Loading States**: Visual feedback during API testing process
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support
- **Error Handling**: Comprehensive error states and user feedback

## 🚀 Quick Start

### Prerequisites
- Web server with PHP support (Apache, Nginx, or built-in PHP server)
- PHP 7.4+ with cURL extension enabled
- Modern web browser

### Installation
1. Copy all files to your web server directory
2. Ensure PHP has cURL extension enabled
3. Open `index.html` in your web browser
4. Click "Run API Tests" to start testing

### Using Built-in PHP Server
```bash
cd "Task 2"
php -S localhost:8080
```
Then open `http://localhost:8080` in your browser.

## 💡 Test Scenarios

The tool automatically executes the following test scenarios:

### 1. API Connectivity Tests
- **Response Code Validation**: Ensures API returns HTTP 200
- **JSON Structure Validation**: Verifies response is valid JSON array
- **Response Time Measurement**: Tracks API performance

### 2. Product Data Quality Tests
- **Title Validation**: Checks for empty or missing product titles
- **Price Validation**: Identifies negative or invalid pricing
- **Rating Validation**: Ensures ratings are within 0-5 range
- **Required Fields**: Validates presence of essential product attributes

### 3. Data Completeness Tests
- **Missing Fields Detection**: Identifies products lacking required data
- **Data Type Validation**: Ensures proper data types for each field
- **Overall Quality Assessment**: Provides summary of data integrity

## 📊 Test Results Format

### Summary Metrics
- **Response Code**: HTTP status code from API
- **Total Products**: Number of products retrieved
- **Defects Found**: Count of products with data quality issues
- **Response Time**: API response duration in milliseconds

### Detailed Results
- Individual test outcomes with pass/fail status
- Specific error messages for failed validations
- Categorized defect types for easy analysis

### Defective Products Table
- Product ID and truncated title
- List of specific issues found
- Detailed view option for further investigation

## 🔧 Code Architecture

```
Task 2/
├── index.html          # Main application interface
├── styles.css          # BEM methodology CSS styles
├── script.js           # Frontend JavaScript functionality
├── api-tester.php      # PHP backend API testing logic
└── README.md          # Project documentation
```

### PHP Backend (`api-tester.php`)
- **FakeStoreApiTester Class**: Main testing logic
- **cURL Implementation**: Handles API requests with error handling
- **Validation Methods**: Comprehensive product data validation
- **JSON Response**: Structured test results output

### JavaScript Frontend (`script.js`)
- **Async/Await Pattern**: Modern JavaScript for API communication
- **DOM Manipulation**: Dynamic result display and interaction
- **Error Handling**: Comprehensive error states and user feedback
- **Notifications System**: User-friendly status messages

## 🎯 API Testing Methodology

### Test Design Principles
- **Comprehensive Coverage**: Tests all specified validation criteria
- **Error Detection**: Identifies various types of data anomalies
- **Performance Monitoring**: Tracks API response times
- **User Experience**: Clear reporting of test outcomes

### Validation Rules Implementation
1. **Title Validation**: `!empty(trim($title))`
2. **Price Validation**: `is_numeric($price) && $price >= 0`
3. **Rating Validation**: `is_numeric($rating) && $rating >= 0 && $rating <= 5`
4. **Required Fields**: Validates presence of id, title, price, rating

## 👨‍💻 Developer Information

**Developer**: Igor Novak  
**Position**: Junior+ PHP Developer  
**Company**: Innowise (PHP Department)  
**Technology Used**: Claude-4-Sonnet (Thinking Model)  
**Development Date**: 2025  

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔍 Testing Results Analysis

Based on the FakeStore API data validation, the tool typically identifies:

### Common Data Quality Issues
- Products with unusually high or low ratings
- Pricing inconsistencies across similar products
- Missing or incomplete product descriptions
- Category classification accuracy

### Expected API Behavior
- Consistent 200 HTTP response codes
- Valid JSON array structure with 20 products
- Complete product data with all required fields
- Realistic rating values within 0-5 range

## 📈 Future Enhancements

Potential improvements for future versions:
- **Historical Testing**: Store and compare test results over time
- **Custom Validation Rules**: User-defined validation criteria
- **Export Functionality**: CSV/PDF reports generation
- **Scheduling**: Automated periodic testing
- **API Comparison**: Multi-endpoint testing and comparison
- **Performance Benchmarking**: Response time trend analysis

## 🔐 Security Features

- **XSS Protection**: HTML escaping for all user-displayed content
- **CORS Headers**: Proper cross-origin resource sharing configuration
- **Input Validation**: Sanitization of all data inputs
- **Error Handling**: Secure error messages without sensitive information disclosure

## 📄 License

This project is created for educational and assessment purposes as part of a departmental skills evaluation.

---

**Note**: This application demonstrates modern web development practices including API testing methodologies, error handling, responsive design, and clean code architecture following industry best practices for quality assurance and automated testing. 