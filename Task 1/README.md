# Monthly Expense Calculator - Task 1

## 📋 Project Description

This is the first test assignment completed as part of an artificial intelligence skills assessment in the department. The task was to develop a web application for calculating the main indicators of monthly expenses based on a user's list of expenses.

## 🎯 Features

The application provides the following functionality:

### Core Features
- **Add New Expenses**: Users can input expense categories and amounts through a user-friendly form
- **View Expense List**: All expenses are displayed in a responsive table format
- **Remove Expenses**: Each expense entry can be deleted with a single click
- **Calculate Results**: Comprehensive expense analysis with one button click

### Calculation Results
- **Total Amount of Expenses**: Sum of all entered expenses
- **Average Daily Expense**: Total amount divided by 30 days (monthly average)
- **Top 3 Largest Expenses**: Displays the three highest expense categories ranked by amount

## 🛠 Technology Stack

- **HTML5**: Semantic markup with accessibility considerations
- **CSS3**: Modern styling using CSS Variables and BEM methodology
- **JavaScript ES6+**: Vanilla JavaScript with modern features
- **Bootstrap 5.3.6**: Latest version for responsive design and components
- **Bootstrap Icons**: Icon library for enhanced UI

## 🎨 Design Features

- **Modern Dark Theme**: Inspired by Discord and GitHub interfaces
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **BEM Methodology**: CSS classes follow Block Element Modifier naming convention
- **Accessibility**: Proper ARIA labels, keyboard navigation, and focus management
- **Smooth Animations**: CSS transitions and hover effects for better UX

## 🚀 Quick Start

1. Open `index.html` in any modern web browser
2. The application loads with sample data (Groceries, Rent, Transportation, etc.)
3. Add new expenses using the form at the top
4. Click "Calculate Results" to see your expense analysis
5. Remove individual expenses using the trash icon buttons

## 💡 Usage Examples

### Sample Data (Pre-loaded)
```
Category        | Amount ($)
----------------|----------
Groceries       | 15,000
Rent           | 40,000
Transportation | 5,000
Entertainment  | 10,000
Communication  | 2,000
Gym            | 3,000
```

### Expected Results for Sample Data
- **Total Expenses**: $75,000
- **Average Daily**: $2,500 (75,000 ÷ 30)
- **Top 3 Expenses**: 
  1. Rent ($40,000)
  2. Groceries ($15,000)
  3. Entertainment ($10,000)

## 🔧 Code Structure

```
Task 1/
├── index.html          # Main HTML file
├── styles.css          # CSS styles (BEM methodology)
├── script.js           # JavaScript functionality
└── README.md          # Project documentation
```

## 🎯 Key Implementation Features

- **Data Validation**: Form inputs are validated before adding to the expense list
- **Error Handling**: Comprehensive error messages and user feedback
- **Data Persistence**: Expenses are maintained in memory during the session
- **Number Formatting**: Currency amounts are properly formatted with commas and dollar signs
- **XSS Protection**: HTML escaping prevents cross-site scripting attacks
- **Keyboard Shortcuts**: Ctrl/Cmd+Enter to calculate, Escape to hide results

## 👨‍💻 Developer Information

**Developer**: Igor Novak  
**Position**: Junior+ PHP Developer  
**Company**: Innowise (PHP Department)  
**Technology Used**: Claude-4-Sonnet (Thinking Model)  
**Development Date**: 2024  

## 📱 Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🔍 Testing

The application has been tested for:
- ✅ Form validation and submission
- ✅ Expense addition and removal
- ✅ Calculation accuracy
- ✅ Responsive design on multiple screen sizes
- ✅ Keyboard navigation and accessibility
- ✅ Cross-browser compatibility

## 📈 Future Enhancements

Potential improvements for future versions:
- Local storage persistence
- Export to CSV/PDF functionality
- Category grouping and filtering
- Monthly/yearly view options
- Expense trends and charts
- Multiple currency support

## 📄 License

This project is created for educational and assessment purposes as part of a departmental skills evaluation.

---

**Note**: This application demonstrates modern web development practices including responsive design, accessibility standards, and clean code architecture following industry best practices. 