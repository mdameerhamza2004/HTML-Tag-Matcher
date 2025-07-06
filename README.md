
# HTML Tag Matcher - Stacks Project

A modern web application that validates HTML tags using the Stack data structure. This project demonstrates how stacks can be used to solve real-world problems in web development.

## 🚀 Features

### Core Functionality
- **HTML Tag Validation**: Validates opening and closing HTML tags for proper matching
- **Stack Visualization**: Real-time visualization of the stack data structure during validation
- **Step-by-Step Analysis**: Watch the validation process step by step with animations
- **Detailed Error Reporting**: Comprehensive error messages with line numbers and suggestions
- **Tag Analysis**: Complete breakdown of all tags found in the HTML code

### User Interface
- **Modern Design**: Clean, responsive interface with gradient backgrounds
- **Real-time Feedback**: Instant status updates and visual indicators
- **Interactive Elements**: Buttons, tooltips, and smooth animations
- **Mobile Responsive**: Works perfectly on desktop, tablet, and mobile devices

### Educational Features
- **How It Works Section**: Explains the stack algorithm and validation process
- **Common Issues Guide**: Helps users understand typical HTML tag problems
- **Sample Code**: Pre-loaded examples to demonstrate functionality
- **Keyboard Shortcuts**: Quick access to common functions

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Custom CSS with Flexbox and Grid layouts
- **Icons**: Font Awesome 6.0
- **Fonts**: Inter (Google Fonts)
- **No Dependencies**: Pure vanilla JavaScript implementation

## 📋 How It Works

### Stack Algorithm
The HTML Tag Matcher uses a **Last-In-First-Out (LIFO)** stack data structure:

1. **Scan HTML**: Parse the HTML code character by character
2. **Opening Tags**: When an opening tag is found, push it onto the stack
3. **Closing Tags**: When a closing tag is found:
   - If stack is empty → Error (extra closing tag)
   - If tags match → Pop from stack (successful match)
   - If tags don't match → Error (mismatched tags)
4. **Final Check**: If stack is not empty → Error (unclosed tags)

### Example
```html
<div>
  <p>Hello</p>
</div>
```

**Stack Operations:**
1. Push `<div>` → Stack: [`<div>`]
2. Push `<p>` → Stack: [`<div>`, `<p>`]
3. Pop `<p>` (matches `</p>`) → Stack: [`<div>`]
4. Pop `<div>` (matches `</div>`) → Stack: []
5. **Result**: Valid HTML ✅

## 🎯 Usage

### Getting Started
1. Open `index.html` in any modern web browser
2. Enter HTML code in the text area
3. Click "Validate Tags" for instant validation
4. Use "Step Through" to watch the validation process

### Features Guide

#### Input Section
- **Text Area**: Enter your HTML code here
- **Clear Button**: Remove all content
- **Load Sample**: Load example HTML for testing

#### Action Buttons
- **Validate Tags**: Quick validation with results
- **Step Through**: Animated step-by-step validation

#### Results Section
- **Tag Analysis**: List of all tags with their status
- **Stack Visualization**: Real-time stack display
- **Detailed Report**: Comprehensive validation summary

### Keyboard Shortcuts
- `Ctrl + Enter`: Validate tags
- `Ctrl + S`: Step through validation
- `Ctrl + K`: Clear all content

## 🔍 Validation Rules

### Valid HTML Patterns
- ✅ Properly nested tags: `<div><p></p></div>`
- ✅ Self-closing tags: `<img />`, `<br />`
- ✅ Mixed content: `<div>Text <strong>bold</strong></div>`

### Common Errors Detected
- ❌ **Unclosed tags**: `<div><p>Hello</div>`
- ❌ **Mismatched tags**: `<div><p>Hello</div></p>`
- ❌ **Extra closing tags**: `<div>Hello</div></p>`
- ❌ **Missing opening tags**: `<p>Hello</p></div>`

## 📱 Browser Compatibility

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## 🎨 Design Features

### Visual Elements
- **Gradient Backgrounds**: Modern purple-blue gradients
- **Card-based Layout**: Clean, organized information display
- **Status Indicators**: Color-coded validation status
- **Smooth Animations**: CSS transitions and keyframe animations
- **Responsive Grid**: Adapts to different screen sizes

### Color Scheme
- **Primary**: Purple gradient (#667eea to #764ba2)
- **Success**: Green (#28a745)
- **Error**: Red (#dc3545)
- **Warning**: Yellow (#ffc107)
- **Info**: Blue (#17a2b8)

## 🚀 Performance

- **Fast Processing**: Handles large HTML files efficiently
- **Memory Efficient**: Minimal memory footprint
- **No External Dependencies**: Lightweight and fast loading
- **Optimized Algorithms**: Efficient stack operations

## 📚 Educational Value

This project demonstrates several important concepts:

### Data Structures
- **Stack Implementation**: LIFO operations (push, pop, peek)
- **Array-based Stack**: Simple and efficient implementation
- **Stack Applications**: Real-world use case for stacks

### Web Development
- **HTML Parsing**: Regular expressions for tag extraction
- **DOM Manipulation**: Dynamic content updates
- **Event Handling**: User interaction management
- **CSS Grid/Flexbox**: Modern layout techniques

### Problem Solving
- **Algorithm Design**: Systematic approach to validation
- **Error Handling**: Comprehensive error detection and reporting
- **User Experience**: Intuitive interface design

## 🔧 Customization

### Modifying Styles
Edit `styles.css` to customize:
- Color schemes
- Layout dimensions
- Animation timings
- Typography

### Adding Features
Extend `script.js` to add:
- Additional validation rules
- Export functionality
- More visualization options
- Performance optimizations

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Feel free to contribute to this project by:
- Reporting bugs
- Suggesting new features
- Improving documentation
- Enhancing the UI/UX

## 📞 Support

For questions or support, please refer to the project documentation or create an issue in the repository.

---

**Built with ❤️ for educational purposes** 
