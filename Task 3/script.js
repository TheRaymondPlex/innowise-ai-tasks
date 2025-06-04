/**
 * SQL Analytics Tool
 * JavaScript functionality for database analysis
 * 
 * @author Igor Novak - Junior+ PHP Developer at Innowise
 * @version 1.0
 */

// Global variables
let sqlDatabase = null;
let sqlWasm = null;
let dbInitialized = false;
// Notification queue system
let notificationQueue = [];
let isProcessingNotifications = false;

// DOM Elements
const dbStatus = document.getElementById('dbStatus');
const statusIcon = document.getElementById('statusIcon');
const statusText = document.getElementById('statusText');
const initDbBtn = document.getElementById('initDbBtn');
const executeBtn = document.getElementById('executeBtn');
const sqlQuery = document.getElementById('sqlQuery');
const resultsCard = document.getElementById('resultsCard');
const dbStats = document.getElementById('dbStats');
const totalOrders = document.getElementById('totalOrders');
const totalCustomers = document.getElementById('totalCustomers');
const totalRevenue = document.getElementById('totalRevenue');

// Predefined SQL queries for each task
const predefinedQueries = {
    task1: `-- Task 1: Calculate total sales volume for March 2024
SELECT SUM(amount) as total_sales
FROM orders 
WHERE strftime('%Y-%m', order_date) = '2024-03';`,
    
    task2: `-- Task 2: Find the customer who spent the most overall
SELECT customer, SUM(amount) as total_spent
FROM orders 
GROUP BY customer 
ORDER BY total_spent DESC 
LIMIT 1;`,
    
    task3: `-- Task 3: Calculate average order value for the last three months
SELECT ROUND(AVG(amount), 2) as average_order_value
FROM orders 
WHERE order_date >= '2024-02-01';`,
    
    custom: `-- Custom Query - Explore the data
SELECT * FROM orders 
ORDER BY order_date DESC;`
};

// Expected results for validation
const expectedResults = {
    task1: { total_sales: 27000 },
    task2: { customer: 'Alice', total_spent: 20000 },
    task3: { average_order_value: 6000 }
};

/**
 * Initialize the application
 */
async function initializeApp() {
    console.log('SQL Analytics Tool initializing...');
    updateStatus('loading', 'Loading SQL.js...');
    
    try {
        // Initialize SQL.js
        sqlWasm = await initSqlJs({
            locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
        });
        
        updateStatus('offline', 'Ready to initialize database');
        console.log('SQL.js loaded successfully');
        
        // Add event listeners
        addEventListeners();
        
    } catch (error) {
        console.error('Error loading SQL.js:', error);
        updateStatus('offline', 'Failed to load SQL.js');
        showNotification('Failed to load SQL.js library', 'error');
    }
}

/**
 * Add event listeners
 */
function addEventListeners() {
    // SQL editor input listener
    sqlQuery.addEventListener('input', handleQueryInput);
    
    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);
    
    // Auto-resize textarea
    sqlQuery.addEventListener('input', autoResizeTextarea);
}

/**
 * Handle SQL query input changes
 */
function handleQueryInput() {
    const hasQuery = sqlQuery.value.trim().length > 0;
    executeBtn.disabled = !dbInitialized || !hasQuery;
}

/**
 * Auto-resize textarea based on content
 */
function autoResizeTextarea() {
    sqlQuery.style.height = 'auto';
    sqlQuery.style.height = Math.max(200, sqlQuery.scrollHeight) + 'px';
}

/**
 * Handle keyboard shortcuts
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter to execute query
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!executeBtn.disabled) {
            executeQuery();
        }
    }
    
    // Escape to hide results
    if (event.key === 'Escape') {
        hideResults();
    }
}

/**
 * Initialize database with sample data
 */
async function initializeDatabase() {
    const button = initDbBtn;
    const spinner = button.querySelector('.spinner-border');
    const buttonText = button.querySelector('.btn-text');
    
    // Update button state
    button.disabled = true;
    spinner.classList.remove('d-none');
    buttonText.textContent = 'Initializing...';
    updateStatus('loading', 'Initializing database...');
    
    try {
        // Create new database
        sqlDatabase = new sqlWasm.Database();
        
        // Create table and insert data
        const initScript = `
            CREATE TABLE orders (
                id INTEGER PRIMARY KEY,
                customer TEXT,
                amount REAL,
                order_date DATE
            );

            INSERT INTO orders (customer, amount, order_date) VALUES
            ('Alice', 5000, '2024-03-01'),
            ('Bob', 8000, '2024-03-05'),
            ('Alice', 3000, '2024-03-15'),
            ('Charlie', 7000, '2024-02-20'),
            ('Alice', 10000, '2024-02-28'),
            ('Bob', 4000, '2024-02-10'),
            ('Charlie', 9000, '2024-03-22'),
            ('Alice', 2000, '2024-03-30');
        `;
        
        sqlDatabase.exec(initScript);
        dbInitialized = true;
        
        // Update status and UI
        updateStatus('online', 'Database ready');
        updateDatabaseStats();
        executeBtn.disabled = sqlQuery.value.trim().length === 0;
        
        // Show success message
        showNotification('Database initialized successfully!', 'success');
        
        console.log('Database initialized with sample data');
        
    } catch (error) {
        console.error('Error initializing database:', error);
        updateStatus('offline', 'Initialization failed');
        showNotification(`Database initialization failed: ${error.message}`, 'error');
    } finally {
        // Restore button state
        button.disabled = false;
        spinner.classList.add('d-none');
        buttonText.textContent = 'Initialize Database';
    }
}

/**
 * Update database statistics
 */
function updateDatabaseStats() {
    if (!dbInitialized || !sqlDatabase) return;
    
    try {
        // Get total orders
        const ordersResult = sqlDatabase.exec('SELECT COUNT(*) as count FROM orders');
        const ordersCount = ordersResult[0]?.values[0][0] || 0;
        
        // Get unique customers
        const customersResult = sqlDatabase.exec('SELECT COUNT(DISTINCT customer) as count FROM orders');
        const customersCount = customersResult[0]?.values[0][0] || 0;
        
        // Get total revenue
        const revenueResult = sqlDatabase.exec('SELECT SUM(amount) as total FROM orders');
        const revenueTotal = revenueResult[0]?.values[0][0] || 0;
        
        // Update UI
        totalOrders.textContent = ordersCount;
        totalCustomers.textContent = customersCount;
        totalRevenue.textContent = `$${revenueTotal.toLocaleString()}`;
        
        // Show stats
        dbStats.style.display = 'block';
        
    } catch (error) {
        console.error('Error updating database stats:', error);
    }
}

/**
 * Load predefined query
 */
function loadPredefinedQuery(taskId) {
    if (predefinedQueries[taskId]) {
        sqlQuery.value = predefinedQueries[taskId];
        autoResizeTextarea();
        handleQueryInput();
        
        // Update button states
        document.querySelectorAll('.sql-tool__btn--outline').forEach(btn => {
            btn.classList.remove('active');
        });
        
        event.target.closest('button').classList.add('active');
        
        showNotification(`Loaded ${taskId === 'custom' ? 'custom' : 'Task ' + taskId.slice(-1)} query`, 'info');
    }
}

/**
 * Format SQL query (basic formatting)
 */
function formatQuery() {
    let query = sqlQuery.value;
    
    if (!query.trim()) {
        showNotification('No query to format', 'warning');
        return;
    }
    
    // Basic SQL formatting
    query = query
        .replace(/\s+/g, ' ')
        .replace(/,\s*/g, ',\n  ')
        .replace(/\bSELECT\b/gi, 'SELECT')
        .replace(/\bFROM\b/gi, '\nFROM')
        .replace(/\bWHERE\b/gi, '\nWHERE')
        .replace(/\bGROUP BY\b/gi, '\nGROUP BY')
        .replace(/\bORDER BY\b/gi, '\nORDER BY')
        .replace(/\bLIMIT\b/gi, '\nLIMIT')
        .replace(/\bJOIN\b/gi, '\nJOIN')
        .replace(/\bUNION\b/gi, '\nUNION')
        .trim();
    
    sqlQuery.value = query;
    autoResizeTextarea();
    showNotification('Query formatted', 'success');
}

/**
 * Clear SQL query
 */
function clearQuery() {
    sqlQuery.value = '';
    autoResizeTextarea();
    handleQueryInput();
    hideResults();
    
    // Remove active state from buttons
    document.querySelectorAll('.sql-tool__btn--outline').forEach(btn => {
        btn.classList.remove('active');
    });
    
    showNotification('Query cleared', 'info');
}

/**
 * Execute SQL query
 */
async function executeQuery() {
    if (!dbInitialized || !sqlDatabase) {
        showNotification('Database not initialized', 'error');
        return;
    }
    
    const query = sqlQuery.value.trim();
    if (!query) {
        showNotification('Please enter a SQL query', 'warning');
        return;
    }
    
    const button = executeBtn;
    const spinner = button.querySelector('.spinner-border');
    const buttonText = button.querySelector('.btn-text');
    
    // Update button state
    button.disabled = true;
    spinner.classList.remove('d-none');
    buttonText.textContent = 'Executing...';
    
    const startTime = performance.now();
    
    try {
        console.log('Executing query:', query);
        
        // Execute query
        const results = sqlDatabase.exec(query);
        const executionTime = Math.round(performance.now() - startTime);
        
        // Display results
        displayQueryResults(results, query, executionTime);
        
        // Check if this matches any expected task results
        validateTaskResult(query, results);
        
        showNotification('Query executed successfully', 'success');
        
    } catch (error) {
        console.error('Query execution error:', error);
        displayQueryError(error.message, Math.round(performance.now() - startTime));
        showNotification(`Query error: ${error.message}`, 'error');
    } finally {
        // Restore button state
        button.disabled = false;
        spinner.classList.add('d-none');
        buttonText.textContent = 'Execute Query';
    }
}

/**
 * Display query results
 */
function displayQueryResults(results, query, executionTime) {
    const resultsTableContainer = document.getElementById('resultsTableContainer');
    const queryInfo = document.getElementById('queryInfo');
    const executionTimeElement = document.getElementById('executionTime');
    const rowCountElement = document.getElementById('rowCount');
    
    // Update meta information
    executionTimeElement.textContent = `${executionTime}ms`;
    
    if (!results.length) {
        // No results (e.g., INSERT, UPDATE, DELETE)
        rowCountElement.textContent = 'Query executed';
        resultsTableContainer.innerHTML = '<p class="text-center text-muted p-4">Query executed successfully (no results to display)</p>';
        queryInfo.innerHTML = '<p class="mb-0"><strong>Status:</strong> Query executed successfully</p>';
        queryInfo.className = 'sql-tool__query-info success';
    } else {
        const result = results[0];
        const rowCount = result.values.length;
        rowCountElement.textContent = `${rowCount} row${rowCount !== 1 ? 's' : ''}`;
        
        // Generate table HTML
        const tableHtml = generateResultsTable(result);
        resultsTableContainer.innerHTML = tableHtml;
        
        // Update query info
        queryInfo.innerHTML = `
            <p class="mb-2"><strong>Status:</strong> Query executed successfully</p>
            <p class="mb-0"><strong>Columns:</strong> ${result.columns.length} | <strong>Rows:</strong> ${rowCount}</p>
        `;
        queryInfo.className = 'sql-tool__query-info success';
    }
    
    // Show results
    showResults();
}

/**
 * Display query error
 */
function displayQueryError(errorMessage, executionTime) {
    const resultsTableContainer = document.getElementById('resultsTableContainer');
    const queryInfo = document.getElementById('queryInfo');
    const executionTimeElement = document.getElementById('executionTime');
    const rowCountElement = document.getElementById('rowCount');
    
    // Update meta information
    executionTimeElement.textContent = `${executionTime}ms`;
    rowCountElement.textContent = 'Error';
    
    // Show error message
    resultsTableContainer.innerHTML = `
        <div class="text-center p-4">
            <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
            <h5 class="text-danger mt-3">Query Error</h5>
            <p class="text-muted">${escapeHtml(errorMessage)}</p>
        </div>
    `;
    
    // Update query info
    queryInfo.innerHTML = `
        <p class="mb-2"><strong>Status:</strong> Query failed</p>
        <p class="mb-0"><strong>Error:</strong> ${escapeHtml(errorMessage)}</p>
    `;
    queryInfo.className = 'sql-tool__query-info error';
    
    // Show results
    showResults();
}

/**
 * Generate HTML table from query results
 */
function generateResultsTable(result) {
    if (!result.columns.length) {
        return '<p class="text-center text-muted p-4">No data to display</p>';
    }
    
    let html = '<table class="sql-tool__results-table"><thead><tr>';
    
    // Generate header
    result.columns.forEach(column => {
        html += `<th>${escapeHtml(column)}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Generate rows
    if (result.values.length === 0) {
        html += `<tr><td colspan="${result.columns.length}" class="text-center text-muted">No rows returned</td></tr>`;
    } else {
        result.values.forEach(row => {
            html += '<tr>';
            row.forEach(cell => {
                const displayValue = cell === null ? '<em>NULL</em>' : escapeHtml(String(cell));
                html += `<td>${displayValue}</td>`;
            });
            html += '</tr>';
        });
    }
    
    html += '</tbody></table>';
    return html;
}

/**
 * Validate task result against expected values
 */
function validateTaskResult(query, results) {
    // Determine which task this might be
    let taskId = null;
    
    if (query.includes("strftime('%Y-%m', order_date) = '2024-03'")) {
        taskId = 'task1';
    } else if (query.includes('GROUP BY customer') && query.includes('ORDER BY') && query.includes('LIMIT 1')) {
        taskId = 'task2';
    } else if (query.includes('AVG(amount)') && query.includes("order_date >= '2024-02-01'")) {
        taskId = 'task3';
    }
    
    if (!taskId || !results.length) return;
    
    const result = results[0];
    const expected = expectedResults[taskId];
    
    if (!result.values.length) return;
    
    const resultRow = result.values[0];
    let isCorrect = false;
    
    try {
        switch (taskId) {
            case 'task1':
                isCorrect = Number(resultRow[0]) === expected.total_sales;
                break;
            case 'task2':
                isCorrect = resultRow[0] === expected.customer && Number(resultRow[1]) === expected.total_spent;
                break;
            case 'task3':
                isCorrect = Number(resultRow[0]) === expected.average_order_value;
                break;
        }
        
        // Update task status
        updateTaskStatus(taskId, isCorrect);
        
        if (isCorrect) {
            showNotification(`✅ ${taskId.toUpperCase()} completed correctly!`, 'success');
        } else {
            showNotification(`❌ ${taskId.toUpperCase()} result doesn't match expected value`, 'warning');
        }
        
    } catch (error) {
        console.error('Error validating task result:', error);
    }
}

/**
 * Update task status in UI
 */
function updateTaskStatus(taskId, isCompleted) {
    const taskItem = document.getElementById(taskId);
    const taskStatus = document.getElementById(`${taskId}Status`);
    
    if (isCompleted) {
        taskItem.classList.add('completed');
        taskStatus.innerHTML = '<i class="bi bi-check-circle-fill"></i>';
        taskStatus.className = 'sql-tool__task-status completed';
    } else {
        taskItem.classList.remove('completed');
        taskStatus.innerHTML = '<i class="bi bi-x-circle"></i>';
        taskStatus.className = 'sql-tool__task-status';
    }
}

/**
 * Show query results
 */
function showResults() {
    resultsCard.classList.remove('d-none');
    resultsCard.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hide query results
 */
function hideResults() {
    resultsCard.classList.add('d-none');
}

/**
 * Update database status
 */
function updateStatus(status, text) {
    statusText.textContent = text;
    
    // Remove all status classes
    dbStatus.classList.remove('online', 'offline', 'loading');
    
    // Add new status class
    dbStatus.classList.add(status);
}

/**
 * Show notification message with queue system
 */
function showNotification(message, type = 'info') {
    // Add notification to queue
    notificationQueue.push({ message, type });
    
    // Process queue if not already processing
    if (!isProcessingNotifications) {
        processNotificationQueue();
    }
}

/**
 * Process notification queue with delay
 */
async function processNotificationQueue() {
    if (notificationQueue.length === 0) {
        isProcessingNotifications = false;
        return;
    }
    
    isProcessingNotifications = true;
    
    // Get the next notification from queue
    const { message, type } = notificationQueue.shift();
    
    // Show the notification
    displayNotification(message, type);
    
    // Wait before processing next notification (prevent overlap)
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Process next notification in queue
    processNotificationQueue();
}

/**
 * Display individual notification
 */
function displayNotification(message, type = 'info') {
    // Get existing notifications to calculate position
    const existingNotifications = document.querySelectorAll('.sql-tool-notification');
    let topPosition = 20;
    
    // Calculate position based on existing notifications
    existingNotifications.forEach(notification => {
        const rect = notification.getBoundingClientRect();
        topPosition = Math.max(topPosition, rect.bottom + 10 - window.scrollY);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${getBootstrapType(type)} alert-dismissible fade show position-fixed sql-tool-notification`;
    notification.style.cssText = `
        top: ${topPosition}px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        transform: translateX(100%);
        transition: transform 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        ${getNotificationIcon(type)}
        ${escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Animate in
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    // Handle manual close
    notification.querySelector('.btn-close').addEventListener('click', () => {
        removeNotification(notification);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            removeNotification(notification);
        }
    }, 5000);
}

/**
 * Remove notification with animation and reposition others
 */
function removeNotification(notification) {
    // Animate out
    notification.style.transform = 'translateX(100%)';
    notification.style.opacity = '0';
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
            // Reposition remaining notifications
            repositionNotifications();
        }
    }, 300);
}

/**
 * Reposition remaining notifications smoothly
 */
function repositionNotifications() {
    const notifications = document.querySelectorAll('.sql-tool-notification');
    let topPosition = 20;
    
    notifications.forEach(notification => {
        notification.style.transition = 'top 0.3s ease-out';
        notification.style.top = `${topPosition}px`;
        
        // Calculate next position
        const rect = notification.getBoundingClientRect();
        topPosition = topPosition + rect.height + 10;
    });
}

/**
 * Get Bootstrap alert type
 */
function getBootstrapType(type) {
    const typeMap = {
        success: 'success',
        error: 'danger',
        warning: 'warning',
        info: 'info'
    };
    return typeMap[type] || 'info';
}

/**
 * Get notification icon
 */
function getNotificationIcon(type) {
    const icons = {
        success: '<i class="bi bi-check-circle-fill me-2"></i>',
        error: '<i class="bi bi-exclamation-circle-fill me-2"></i>',
        warning: '<i class="bi bi-exclamation-triangle-fill me-2"></i>',
        info: '<i class="bi bi-info-circle-fill me-2"></i>'
    };
    
    return icons[type] || icons.info;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Make functions globally available
window.initializeDatabase = initializeDatabase;
window.executeQuery = executeQuery;
window.loadPredefinedQuery = loadPredefinedQuery;
window.formatQuery = formatQuery;
window.clearQuery = clearQuery; 