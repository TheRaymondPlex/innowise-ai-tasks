/**
 * FakeStore API Testing Tool
 * JavaScript frontend functionality
 * 
 * @author Igor Novak - Junior+ PHP Developer at Innowise
 * @version 1.0
 */

// DOM Elements
const runTestsBtn = document.getElementById('runTestsBtn');
const resultsCard = document.getElementById('resultsCard');
const responseCodeElement = document.getElementById('responseCode');
const totalProductsElement = document.getElementById('totalProducts');
const defectsCountElement = document.getElementById('defectsCount');
const responseTimeElement = document.getElementById('responseTime');
const testDetailsElement = document.getElementById('testDetails');
const defectsSectionElement = document.getElementById('defectsSection');
const defectsTableBody = document.getElementById('defectsTableBody');

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('API Testing Tool initialized successfully');
}

/**
 * Run API tests by calling PHP backend
 */
async function runTests() {
    const button = runTestsBtn;
    const spinner = button.querySelector('.spinner-border');
    const buttonText = button.querySelector('.btn-text');
    
    // Disable button and show loading state
    button.disabled = true;
    spinner.classList.remove('d-none');
    buttonText.textContent = 'Running Tests...';
    
    // Hide previous results
    hideResults();
    
    try {
        console.log('Starting API tests...');
        
        // Call PHP backend
        const response = await fetch('api-tester.php', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const results = await response.json();
        
        if (results.success) {
            displayResults(results);
            showNotification('Tests completed successfully!', 'success');
        } else {
            showNotification(`Test failed: ${results.error}`, 'error');
            displayErrorResults(results);
        }
        
        console.log('API tests completed:', results);
        
    } catch (error) {
        console.error('Error running tests:', error);
        showNotification(`Error running tests: ${error.message}`, 'error');
        displayErrorResults({
            error: error.message,
            responseCode: 'Error',
            totalProducts: 0,
            defectsCount: 0,
            responseTime: '0ms',
            testResults: [],
            defectiveProducts: []
        });
    } finally {
        // Restore button state
        button.disabled = false;
        spinner.classList.add('d-none');
        buttonText.textContent = 'Run API Tests';
    }
}

/**
 * Display test results in the UI
 * @param {Object} results - Test results from backend
 */
function displayResults(results) {
    // Update summary cards
    responseCodeElement.textContent = results.responseCode;
    totalProductsElement.textContent = results.totalProducts;
    defectsCountElement.textContent = results.defectsCount;
    responseTimeElement.textContent = results.responseTime;
    
    // Update card colors based on results
    updateResultCardColors(results);
    
    // Display test details
    displayTestDetails(results.testResults);
    
    // Display defective products if any
    if (results.defectsCount > 0) {
        displayDefectiveProducts(results.defectiveProducts);
        defectsSectionElement.style.display = 'block';
    } else {
        defectsSectionElement.style.display = 'none';
    }
    
    // Show results card
    showResults();
}

/**
 * Display error results
 * @param {Object} results - Error results
 */
function displayErrorResults(results) {
    responseCodeElement.textContent = results.responseCode || 'Error';
    totalProductsElement.textContent = results.totalProducts || 0;
    defectsCountElement.textContent = results.defectsCount || 0;
    responseTimeElement.textContent = results.responseTime || '0ms';
    
    // Show error in test details
    testDetailsElement.innerHTML = `
        <div class="api-tester__test-item">
            <span class="api-tester__test-name">Error</span>
            <div class="api-tester__test-status api-tester__test-status--fail">
                <i class="bi bi-x-circle-fill"></i>
                <span>${escapeHtml(results.error || 'Unknown error')}</span>
            </div>
        </div>
    `;
    
    defectsSectionElement.style.display = 'none';
    showResults();
}

/**
 * Update result card colors based on test results
 * @param {Object} results - Test results
 */
function updateResultCardColors(results) {
    const responseCard = responseCodeElement.closest('.api-tester__result-item');
    const defectsCard = defectsCountElement.closest('.api-tester__result-item');
    
    // Update response code card
    if (results.responseCode === 200) {
        responseCard.className = responseCard.className.replace(/api-tester__result-item--\w+/, 'api-tester__result-item--success');
    } else {
        responseCard.className = responseCard.className.replace(/api-tester__result-item--\w+/, 'api-tester__result-item--danger');
    }
    
    // Update defects card
    if (results.defectsCount === 0) {
        defectsCard.className = defectsCard.className.replace(/api-tester__result-item--\w+/, 'api-tester__result-item--success');
    } else {
        defectsCard.className = defectsCard.className.replace(/api-tester__result-item--\w+/, 'api-tester__result-item--warning');
    }
}

/**
 * Display detailed test results
 * @param {Array} testResults - Array of test results
 */
function displayTestDetails(testResults) {
    if (!testResults || testResults.length === 0) {
        testDetailsElement.innerHTML = '<p class="text-muted">No test details available</p>';
        return;
    }
    
    const detailsHtml = testResults.map(test => `
        <div class="api-tester__test-item">
            <span class="api-tester__test-name">${escapeHtml(test.name)}</span>
            <div class="api-tester__test-status ${test.passed ? 'api-tester__test-status--pass' : 'api-tester__test-status--fail'}">
                <i class="bi bi-${test.passed ? 'check-circle-fill' : 'x-circle-fill'}"></i>
                <span>${escapeHtml(test.message)}</span>
            </div>
        </div>
    `).join('');
    
    testDetailsElement.innerHTML = detailsHtml;
}

/**
 * Display defective products in table
 * @param {Array} defectiveProducts - Array of defective products
 */
function displayDefectiveProducts(defectiveProducts) {
    if (!defectiveProducts || defectiveProducts.length === 0) {
        defectsTableBody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No defective products found</td></tr>';
        return;
    }
    
    const tableHtml = defectiveProducts.map(product => `
        <tr>
            <td>${escapeHtml(product.id)}</td>
            <td>${escapeHtml(product.title)}</td>
            <td>
                ${product.defects.map(defect => 
                    `<span class="api-tester__issue-badge">${escapeHtml(defect)}</span>`
                ).join('')}
            </td>
            <td>
                <button class="api-tester__btn api-tester__btn--primary api-tester__btn--sm" onclick="showProductDetails(${product.id})">
                    <i class="bi bi-eye"></i>
                    View
                </button>
            </td>
        </tr>
    `).join('');
    
    defectsTableBody.innerHTML = tableHtml;
}

/**
 * Show product details (placeholder for future enhancement)
 * @param {number} productId - Product ID
 */
function showProductDetails(productId) {
    showNotification(`Product details for ID: ${productId} (Feature coming soon)`, 'info');
}

/**
 * Show results card with animation
 */
function showResults() {
    resultsCard.classList.remove('d-none');
    resultsCard.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hide results card
 */
function hideResults() {
    resultsCard.classList.add('d-none');
}

/**
 * Escape HTML to prevent XSS attacks
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Show notification message
 * @param {string} message - Message to show
 * @param {string} type - Type of notification (success, error, warning, info)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${getBootstrapType(type)} alert-dismissible fade show position-fixed`;
    notification.style.cssText = `
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    notification.innerHTML = `
        ${getNotificationIcon(type)}
        ${escapeHtml(message)}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    // Add to body
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

/**
 * Get Bootstrap alert type
 * @param {string} type - Notification type
 * @returns {string} Bootstrap type
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
 * Get notification icon based on type
 * @param {string} type - Notification type
 * @returns {string} Icon HTML
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
 * Handle keyboard shortcuts
 * @param {KeyboardEvent} event - Keyboard event
 */
function handleKeyboardShortcuts(event) {
    // Ctrl/Cmd + Enter to run tests
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        if (!runTestsBtn.disabled) {
            runTests();
        }
    }
    
    // Escape to hide results
    if (event.key === 'Escape') {
        hideResults();
    }
}

// Add keyboard event listener
document.addEventListener('keydown', handleKeyboardShortcuts);

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Make runTests function globally available
window.runTests = runTests;
window.showProductDetails = showProductDetails; 