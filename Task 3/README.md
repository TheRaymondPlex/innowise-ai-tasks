# SQL Analytics Tool - Task 3

## 📋 Project Description

This is the third test assignment completed as part of an artificial intelligence skills assessment in the department. The task was to create a web-based SQL analytics tool for analyzing online store sales data using SQLite with predefined queries to solve specific business questions.

## 🎯 Features

The application provides comprehensive SQL analysis functionality:

### Core Features
- **In-Browser SQLite Database**: Complete SQLite implementation using SQL.js
- **Interactive Query Builder**: Advanced SQL editor with syntax highlighting
- **Predefined Queries**: Ready-to-use queries for all task requirements
- **Real-time Validation**: Automatic checking against expected results
- **Database Initialization**: One-click setup with sample data
- **Query Formatting**: Automatic SQL formatting and beautification

### Analysis Features
- **Sales Analytics**: Total sales volume calculations for specific periods
- **Customer Analytics**: Top customer identification and spending analysis  
- **Performance Metrics**: Average order value calculations
- **Data Exploration**: Custom query capabilities for deeper analysis
- **Visual Results**: Clean table presentation with sorting and pagination

### User Experience
- **Modern Dark UI**: Professional interface inspired by Discord/GitHub
- **Responsive Design**: Works seamlessly across all devices
- **Keyboard Shortcuts**: Ctrl+Enter to execute, Escape to close results
- **Real-time Feedback**: Live status updates and notifications
- **Task Progress Tracking**: Visual indicators for completed tasks

## 🛠 Technology Stack

### Frontend
- **HTML5**: Semantic markup with accessibility features
- **CSS3**: Modern styling with CSS Variables and BEM methodology
- **JavaScript ES6+**: Async/await, modern DOM manipulation
- **Bootstrap 5.3.6**: Latest responsive framework
- **Bootstrap Icons**: Comprehensive icon library

### Database & Libraries
- **SQL.js 1.8.0**: SQLite compiled to WebAssembly
- **SQLite**: In-memory database for query execution
- **Prism.js**: SQL syntax highlighting
- **Chart.js**: Data visualization capabilities (future enhancement)

## 🎨 Design Features

- **Modern Dark Theme**: Consistent with Discord/GitHub aesthetics
- **BEM Methodology**: Clean, maintainable CSS architecture
- **CSS Variables**: Consistent theming and easy customization
- **Loading States**: Visual feedback during database operations
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: ARIA labels, keyboard navigation, screen reader support

## 🚀 Quick Start

### Prerequisites
- Modern web browser with JavaScript enabled
- Internet connection (for loading SQL.js library and CDN resources)

### Installation
1. Copy all files to your web server directory or open directly in browser
2. Open `index.html` in your web browser
3. Click "Initialize Database" to load sample data
4. Start running SQL queries!

### Using Built-in Server
```bash
cd "Task 3"
python -m http.server 8080
# or
php -S localhost:8080
```
Then open `http://localhost:8080` in your browser.

## 💡 Task Solutions

The tool includes predefined queries for all three required tasks:

### Task 1: March 2024 Sales Volume
```sql
-- Calculate total sales volume for March 2024
SELECT SUM(amount) as total_sales
FROM orders 
WHERE strftime('%Y-%m', order_date) = '2024-03';
```
**Expected Result**: $27,000

### Task 2: Top Spending Customer
```sql
-- Find the customer who spent the most overall
SELECT customer, SUM(amount) as total_spent
FROM orders 
GROUP BY customer 
ORDER BY total_spent DESC 
LIMIT 1;
```
**Expected Result**: Alice ($20,000)

### Task 3: Average Order Value
```sql
-- Calculate average order value for the last three months
SELECT ROUND(AVG(amount), 2) as average_order_value
FROM orders 
WHERE order_date >= '2024-02-01';
```
**Expected Result**: $6,000

## 📊 Sample Data

The application uses the following sample dataset:

| ID | Customer | Amount | Order Date |
|----|----------|---------|------------|
| 1  | Alice    | $5,000  | 2024-03-01 |
| 2  | Bob      | $8,000  | 2024-03-05 |
| 3  | Alice    | $3,000  | 2024-03-15 |
| 4  | Charlie  | $7,000  | 2024-02-20 |
| 5  | Alice    | $10,000 | 2024-02-28 |
| 6  | Bob      | $4,000  | 2024-02-10 |
| 7  | Charlie  | $9,000  | 2024-03-22 |
| 8  | Alice    | $2,000  | 2024-03-30 |

## 🔧 Code Architecture

```
Task 3/
├── index.html          # Main application interface
├── styles.css          # BEM methodology styles with dark theme
├── script.js           # JavaScript functionality with SQLite
└── README.md          # Project documentation
```

### JavaScript Architecture
- **Database Layer**: SQLite.js integration with query execution
- **UI Layer**: DOM manipulation and user interaction handling
- **Validation Layer**: Task result verification against expected values
- **Notification System**: User feedback and status updates

### CSS Architecture (BEM)
- **sql-tool**: Main component block
- **sql-tool__element**: Component elements (header, card, button, etc.)
- **sql-tool__element--modifier**: Element variations (primary, success, etc.)

## 🎯 Query Execution Workflow

1. **Database Initialization**: Load SQLite.js and create in-memory database
2. **Data Loading**: Execute table creation and data insertion scripts
3. **Query Input**: User enters SQL query or selects predefined query
4. **Execution**: Query runs against SQLite database with error handling
5. **Result Display**: Format and present results in responsive tables
6. **Validation**: Check results against expected task outcomes
7. **Progress Tracking**: Update task completion status

## 🔍 Advanced Features

### Query Editor
- **Syntax Highlighting**: SQL keywords and structure highlighting
- **Auto-formatting**: Automatic query beautification
- **Auto-resize**: Dynamic textarea sizing based on content
- **Keyboard Shortcuts**: Ctrl+Enter execution, Escape to close

### Results Display
- **Responsive Tables**: Mobile-friendly result presentation
- **Performance Metrics**: Query execution time tracking
- **Row Counting**: Accurate result set size reporting
- **Error Handling**: Detailed SQL error messages and suggestions

### Task Validation
- **Automatic Detection**: Pattern matching to identify task queries
- **Result Verification**: Compare outputs against expected values
- **Visual Feedback**: Color-coded task completion indicators
- **Progress Tracking**: Real-time task completion status

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

## 🔐 Security Features

- **XSS Protection**: HTML escaping for all dynamic content
- **SQL Injection Prevention**: Parameterized queries where applicable
- **Content Security**: Controlled external resource loading
- **Error Handling**: Secure error messages without sensitive data exposure

## 📈 Future Enhancements

Potential improvements for future versions:
- **Data Visualization**: Interactive charts and graphs for query results
- **Query History**: Save and retrieve previously executed queries
- **Export Functionality**: CSV/Excel export for query results
- **Advanced Analytics**: Built-in statistical functions and aggregations
- **Multi-table Support**: Extended schema with joins and relationships
- **Query Performance**: Query optimization suggestions and analysis
- **Collaborative Features**: Share queries and results with team members

## 🔧 Technical Implementation

### SQLite.js Integration
```javascript
// Initialize SQL.js with WebAssembly
const SQL = await initSqlJs({
    locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
});

// Create database and execute queries
const db = new SQL.Database();
const results = db.exec(sqlQuery);
```

### Query Validation System
```javascript
// Automatic task detection and validation
function validateTaskResult(query, results) {
    const taskId = detectTaskFromQuery(query);
    const expected = expectedResults[taskId];
    const isCorrect = compareResults(results, expected);
    updateTaskStatus(taskId, isCorrect);
}
```

### Modern CSS Architecture
```css
/* CSS Variables for consistent theming */
:root {
  --st-bg-primary: #0d1117;
  --st-accent-primary: #238636;
  --st-transition: all 0.2s ease-in-out;
}

/* BEM methodology for maintainable styles */
.sql-tool__card {
  background-color: var(--st-bg-secondary);
  transition: var(--st-transition);
}
```

## 📄 License

This project is created for educational and assessment purposes as part of a departmental skills evaluation.

---

**Note**: This application demonstrates modern web development practices including client-side database operations, advanced CSS architecture, and interactive data analysis tools. It showcases the ability to create production-ready applications with clean code, responsive design, and comprehensive user experience features. 