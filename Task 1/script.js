/**
 * Monthly Expense Calculator
 * JavaScript functionality for expense tracking and calculations
 */

// Global variables
let expenses = [];

// DOM Elements
const expenseForm = document.getElementById('expenseForm');
const categoryInput = document.getElementById('categoryInput');
const amountInput = document.getElementById('amountInput');
const expenseTableBody = document.getElementById('expenseTableBody');
const calculateBtn = document.getElementById('calculateBtn');
const resultsCard = document.getElementById('resultsCard');
const totalAmountElement = document.getElementById('totalAmount');
const averageDailyElement = document.getElementById('averageDaily');
const topExpensesElement = document.getElementById('topExpenses');

/**
 * Initialize the application
 */
function initializeApp() {
    // Load sample data from the table
    loadSampleData();
    
    // Add event listeners
    expenseForm.addEventListener('submit', handleAddExpense);
    calculateBtn.addEventListener('click', handleCalculateResults);
    
    console.log('Expense Calculator initialized successfully');
}

/**
 * Load sample data from the existing table
 */
function loadSampleData() {
    const tableRows = expenseTableBody.querySelectorAll('tr');
    expenses = [];
    
    tableRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length >= 2) {
            const category = cells[0].textContent.trim();
            const amount = parseFloat(cells[1].textContent.replace(/,/g, ''));
            
            if (category && !isNaN(amount)) {
                expenses.push({ category, amount });
            }
        }
    });
    
    console.log('Sample data loaded:', expenses);
}

/**
 * Handle form submission to add new expense
 * @param {Event} event - Form submit event
 */
function handleAddExpense(event) {
    event.preventDefault();
    
    const category = categoryInput.value.trim();
    const amount = parseFloat(amountInput.value);
    
    // Validation
    if (!category) {
        showNotification('Please enter a category', 'error');
        return;
    }
    
    if (isNaN(amount) || amount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        return;
    }
    
    // Add expense to array
    const newExpense = { category, amount };
    expenses.push(newExpense);
    
    // Add to table
    addExpenseToTable(newExpense);
    
    // Clear form
    categoryInput.value = '';
    amountInput.value = '';
    
    // Show success message
    showNotification('Expense added successfully!', 'success');
    
    // Hide results if visible
    hideResults();
    
    console.log('New expense added:', newExpense);
}

/**
 * Add expense to the table
 * @param {Object} expense - Expense object with category and amount
 */
function addExpenseToTable(expense) {
    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${escapeHtml(expense.category)}</td>
        <td>${formatNumber(expense.amount)}</td>
        <td>
            <button class="expense-calculator__btn expense-calculator__btn--info expense-calculator__btn--sm me-1" onclick="editExpense(this)" title="Edit expense">
                <i class="bi bi-pencil"></i>
            </button>
            <button class="expense-calculator__btn expense-calculator__btn--danger expense-calculator__btn--sm" onclick="removeExpense(this)" title="Delete expense">
                <i class="bi bi-trash"></i>
            </button>
        </td>
    `;
    
    expenseTableBody.appendChild(newRow);
}

/**
 * Edit expense inline
 * @param {HTMLElement} button - Edit button element
 */
function editExpense(button) {
    const row = button.closest('tr');
    const categoryCell = row.querySelector('td:first-child');
    const amountCell = row.querySelector('td:nth-child(2)');
    const actionsCell = row.querySelector('td:last-child');
    
    // Check if already in edit mode
    if (row.classList.contains('editing')) {
        return;
    }
    
    // Store original values
    const originalCategory = categoryCell.textContent.trim();
    const originalAmount = parseCurrency(amountCell.textContent);
    
    // Set edit mode
    row.classList.add('editing');
    
    // Replace category cell with input
    categoryCell.innerHTML = `
        <input type="text" 
               class="expense-calculator__edit-input" 
               value="${escapeHtml(originalCategory)}"
               data-original="${escapeHtml(originalCategory)}"
               placeholder="Category">
    `;
    
    // Replace amount cell with input
    amountCell.innerHTML = `
        <input type="number" 
               class="expense-calculator__edit-input" 
               value="${originalAmount}"
               data-original="${originalAmount}"
               min="0" 
               step="0.01"
               placeholder="0.00">
    `;
    
    // Replace action buttons
    actionsCell.innerHTML = `
        <div class="expense-calculator__edit-actions">
            <button class="expense-calculator__btn expense-calculator__btn--edit-save expense-calculator__btn--sm" onclick="saveExpenseEdit(this)" title="Save changes">
                <i class="bi bi-check-lg"></i>
            </button>
            <button class="expense-calculator__btn expense-calculator__btn--edit-cancel expense-calculator__btn--sm" onclick="cancelExpenseEdit(this)" title="Cancel editing">
                <i class="bi bi-x-lg"></i>
            </button>
        </div>
    `;
    
    // Focus on category input
    const categoryInput = categoryCell.querySelector('input');
    categoryInput.focus();
    categoryInput.select();
    
    // Add keyboard event listeners for save/cancel
    const inputs = row.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                saveExpenseEdit(actionsCell.querySelector('.expense-calculator__btn--edit-save'));
            } else if (event.key === 'Escape') {
                event.preventDefault();
                cancelExpenseEdit(actionsCell.querySelector('.expense-calculator__btn--edit-cancel'));
            }
        });
    });
    
    // Hide results if visible
    hideResults();
    
    console.log('Edit mode activated for expense:', { originalCategory, originalAmount });
}

/**
 * Save expense edit
 * @param {HTMLElement} button - Save button element
 */
function saveExpenseEdit(button) {
    const row = button.closest('tr');
    const categoryCell = row.querySelector('td:first-child');
    const amountCell = row.querySelector('td:nth-child(2)');
    const actionsCell = row.querySelector('td:last-child');
    
    const categoryInput = categoryCell.querySelector('input');
    const amountInput = amountCell.querySelector('input');
    
    const newCategory = categoryInput.value.trim();
    const newAmount = parseFloat(amountInput.value);
    
    const originalCategory = categoryInput.dataset.original;
    const originalAmount = parseFloat(amountInput.dataset.original);
    
    // Validation
    if (!newCategory) {
        showNotification('Category cannot be empty', 'error');
        categoryInput.focus();
        return;
    }
    
    if (isNaN(newAmount) || newAmount <= 0) {
        showNotification('Please enter a valid amount', 'error');
        amountInput.focus();
        return;
    }
    
    // Update expenses array
    const expenseIndex = expenses.findIndex(exp => 
        exp.category === originalCategory && exp.amount === originalAmount
    );
    
    if (expenseIndex !== -1) {
        expenses[expenseIndex] = { category: newCategory, amount: newAmount };
    }
    
    // Update table cells
    categoryCell.textContent = newCategory;
    amountCell.textContent = formatNumber(newAmount);
    
    // Restore action buttons
    actionsCell.innerHTML = `
        <button class="expense-calculator__btn expense-calculator__btn--info expense-calculator__btn--sm me-1" onclick="editExpense(this)" title="Edit expense">
            <i class="bi bi-pencil"></i>
        </button>
        <button class="expense-calculator__btn expense-calculator__btn--danger expense-calculator__btn--sm" onclick="removeExpense(this)" title="Delete expense">
            <i class="bi bi-trash"></i>
        </button>
    `;
    
    // Remove edit mode
    row.classList.remove('editing');
    
    // Show success message
    showNotification('Expense updated successfully!', 'success');
    
    // Hide results if visible
    hideResults();
    
    console.log('Expense updated:', {
        from: { category: originalCategory, amount: originalAmount },
        to: { category: newCategory, amount: newAmount }
    });
}

/**
 * Cancel expense edit
 * @param {HTMLElement} button - Cancel button element
 */
function cancelExpenseEdit(button) {
    const row = button.closest('tr');
    const categoryCell = row.querySelector('td:first-child');
    const amountCell = row.querySelector('td:nth-child(2)');
    const actionsCell = row.querySelector('td:last-child');
    
    const categoryInput = categoryCell.querySelector('input');
    const amountInput = amountCell.querySelector('input');
    
    const originalCategory = categoryInput.dataset.original;
    const originalAmount = parseFloat(amountInput.dataset.original);
    
    // Restore original values
    categoryCell.textContent = originalCategory;
    amountCell.textContent = formatNumber(originalAmount);
    
    // Restore action buttons
    actionsCell.innerHTML = `
        <button class="expense-calculator__btn expense-calculator__btn--info expense-calculator__btn--sm me-1" onclick="editExpense(this)" title="Edit expense">
            <i class="bi bi-pencil"></i>
        </button>
        <button class="expense-calculator__btn expense-calculator__btn--danger expense-calculator__btn--sm" onclick="removeExpense(this)" title="Delete expense">
            <i class="bi bi-trash"></i>
        </button>
    `;
    
    // Remove edit mode
    row.classList.remove('editing');
    
    console.log('Edit cancelled for expense:', { category: originalCategory, amount: originalAmount });
}

/**
 * Remove expense from table and array
 * @param {HTMLElement} button - Delete button element
 */
function removeExpense(button) {
    const row = button.closest('tr');
    const categoryCell = row.querySelector('td:first-child');
    const amountCell = row.querySelector('td:nth-child(2)');
    
    if (categoryCell && amountCell) {
        const category = categoryCell.textContent.trim();
        const amount = parseCurrency(amountCell.textContent);
        
        // Remove from expenses array
        const expenseIndex = expenses.findIndex(exp => 
            exp.category === category && exp.amount === amount
        );
        
        if (expenseIndex !== -1) {
            expenses.splice(expenseIndex, 1);
        }
        
        // Remove from table
        row.remove();
        
        // Hide results if visible
        hideResults();
        
        showNotification('Expense removed successfully!', 'success');
        
        console.log('Expense removed:', { category, amount });
    }
}

/**
 * Handle calculate results button click
 */
function handleCalculateResults() {
    if (expenses.length === 0) {
        showNotification('Please add at least one expense to calculate results', 'warning');
        return;
    }
    
    // Calculate results
    const totalAmount = calculateTotalAmount();
    const averageDaily = calculateAverageDaily(totalAmount);
    const topThreeExpenses = getTopThreeExpenses();
    
    // Display results
    displayResults(totalAmount, averageDaily, topThreeExpenses);
    
    // Show results card
    showResults();
    
    console.log('Results calculated:', {
        total: totalAmount,
        averageDaily: averageDaily,
        topThree: topThreeExpenses
    });
}

/**
 * Calculate total amount of all expenses
 * @returns {number} Total amount
 */
function calculateTotalAmount() {
    return expenses.reduce((total, expense) => total + expense.amount, 0);
}

/**
 * Calculate average daily expense (total / 30 days)
 * @param {number} totalAmount - Total expense amount
 * @returns {number} Average daily expense
 */
function calculateAverageDaily(totalAmount) {
    return totalAmount / 30;
}

/**
 * Get top 3 largest expenses
 * @returns {Array} Array of top 3 expenses sorted by amount
 */
function getTopThreeExpenses() {
    return [...expenses]
        .sort((a, b) => b.amount - a.amount)
        .slice(0, 3);
}

/**
 * Display calculation results
 * @param {number} totalAmount - Total expense amount
 * @param {number} averageDaily - Average daily expense
 * @param {Array} topThreeExpenses - Top 3 expenses array
 */
function displayResults(totalAmount, averageDaily, topThreeExpenses) {
    // Update total amount
    totalAmountElement.textContent = formatCurrency(totalAmount);
    
    // Update average daily
    averageDailyElement.textContent = formatCurrency(averageDaily);
    
    // Update top expenses
    displayTopExpenses(topThreeExpenses);
}

/**
 * Display top 3 expenses
 * @param {Array} topExpenses - Array of top expenses
 */
function displayTopExpenses(topExpenses) {
    if (topExpenses.length === 0) {
        topExpensesElement.innerHTML = '<p class="text-muted">No expenses found</p>';
        return;
    }
    
    const topExpensesHtml = topExpenses.map((expense, index) => `
        <div class="expense-calculator__top-expense">
            <span class="expense-calculator__top-expense-category">
                ${index + 1}. ${escapeHtml(expense.category)}
            </span>
            <span class="expense-calculator__top-expense-amount">
                ${formatCurrency(expense.amount)}
            </span>
        </div>
    `).join('');
    
    topExpensesElement.innerHTML = topExpensesHtml;
}

/**
 * Show results card with animation
 */
function showResults() {
    resultsCard.style.display = 'block';
    resultsCard.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Hide results card
 */
function hideResults() {
    resultsCard.style.display = 'none';
}

/**
 * Format number as currency
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Format number with commas (without dollar sign)
 * @param {number} amount - Amount to format
 * @returns {string} Formatted number string
 */
function formatNumber(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Parse currency string to number
 * @param {string} currencyString - Currency string to parse
 * @returns {number} Parsed number
 */
function parseCurrency(currencyString) {
    return parseFloat(currencyString.replace(/[$,]/g, ''));
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
 * @param {string} type - Type of notification (success, error, warning)
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
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
    // Ctrl/Cmd + Enter to calculate results
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault();
        handleCalculateResults();
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

// Make removeExpense function globally available
window.removeExpense = removeExpense;

// Make edit functions globally available
window.editExpense = editExpense;
window.saveExpenseEdit = saveExpenseEdit;
window.cancelExpenseEdit = cancelExpenseEdit; 