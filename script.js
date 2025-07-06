// HTML Tag Matcher using Stack Data Structure
class HTMLTagMatcher {
    constructor() {
        this.stack = [];
        this.tags = [];
        this.errors = [];
        this.currentStep = 0;
        this.isStepping = false;
        this.stepDelay = 1000; // 1 second delay between steps

        this.initializeElements();
        this.bindEvents();
        this.loadSampleData();
    }

    initializeElements() {
        this.htmlInput = document.getElementById('htmlInput');
        this.validateBtn = document.getElementById('validateBtn');
        this.stepBtn = document.getElementById('stepBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.sampleBtn = document.getElementById('sampleBtn');
        this.statusIndicator = document.getElementById('statusIndicator');
        this.tagAnalysis = document.getElementById('tagAnalysis');
        this.stackVisualization = document.getElementById('stackVisualization');
        this.detailedReport = document.getElementById('detailedReport');
    }

    bindEvents() {
        this.validateBtn.addEventListener('click', () => this.validateTags());
        this.stepBtn.addEventListener('click', () => this.stepThroughValidation());
        this.clearBtn.addEventListener('click', () => this.clearAll());
        this.sampleBtn.addEventListener('click', () => this.loadSampleData());

        // Real-time validation on input
        this.htmlInput.addEventListener('input', () => {
            this.updateStatus('Ready', 'ready');
        });
    }

    // Stack operations
    push(tag) {
        this.stack.push(tag);
        this.updateStackVisualization();
    }

    pop() {
        if (this.stack.length > 0) {
            const popped = this.stack.pop();
            this.updateStackVisualization();
            return popped;
        }
        return null;
    }

    peek() {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : null;
    }

    isEmpty() {
        return this.stack.length === 0;
    }

    // Extract tags from HTML
    extractTags(html) {
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)\b[^>]*>/g;
        const tags = [];
        let match;
        let position = 0;

        while ((match = tagRegex.exec(html)) !== null) {
            const fullTag = match[0];
            const tagName = match[1];
            const isClosing = fullTag.startsWith('</');

            tags.push({
                name: tagName,
                fullTag: fullTag,
                isClosing: isClosing,
                position: match.index,
                line: this.getLineNumber(html, match.index)
            });
        }

        return tags;
    }

    getLineNumber(text, position) {
        return text.substring(0, position).split('\n').length;
    }

    // Main validation function
    validateTags() {
        const html = this.htmlInput.value.trim();

        if (!html) {
            this.showError('Please enter some HTML code to validate.');
            return;
        }

        this.updateStatus('Processing...', 'processing');
        this.resetResults();

        try {
            this.tags = this.extractTags(html);
            this.errors = [];
            this.stack = [];
            this.currentStep = 0;

            if (this.tags.length === 0) {
                this.showError('No HTML tags found in the input.');
                return;
            }

            // Validate each tag
            for (let i = 0; i < this.tags.length; i++) {
                const tag = this.tags[i];

                if (!tag.isClosing) {
                    // Opening tag - push to stack
                    this.push(tag.name);
                } else {
                    // Closing tag - check if it matches the top of stack
                    const topTag = this.peek();

                    if (this.isEmpty()) {
                        this.errors.push({
                            type: 'extra_closing',
                            tag: tag,
                            message: `Extra closing tag '${tag.name}' found at line ${tag.line}`
                        });
                    } else if (topTag === tag.name) {
                        // Tags match - pop from stack
                        this.pop();
                    } else {
                        // Tags don't match
                        this.errors.push({
                            type: 'mismatch',
                            tag: tag,
                            expected: topTag,
                            message: `Mismatched tag: expected '</${topTag}>' but found '</${tag.name}>' at line ${tag.line}`
                        });
                    }
                }
            }

            // Check for unclosed tags
            while (!this.isEmpty()) {
                const unclosedTag = this.pop();
                this.errors.push({
                    type: 'unclosed',
                    tag: { name: unclosedTag },
                    message: `Unclosed tag '<${unclosedTag}>'`
                });
            }

            this.displayResults();

        } catch (error) {
            this.showError('An error occurred during validation: ' + error.message);
        }
    }

    // Step through validation with animation
    async stepThroughValidation() {
        const html = this.htmlInput.value.trim();

        if (!html) {
            this.showError('Please enter some HTML code to validate.');
            return;
        }

        this.updateStatus('Stepping through...', 'processing');
        this.resetResults();
        this.isStepping = true;
        this.stepBtn.disabled = true;

        try {
            this.tags = this.extractTags(html);
            this.errors = [];
            this.stack = [];
            this.currentStep = 0;

            if (this.tags.length === 0) {
                this.showError('No HTML tags found in the input.');
                return;
            }

            // Step through each tag
            for (let i = 0; i < this.tags.length; i++) {
                if (!this.isStepping) break; // Allow interruption

                const tag = this.tags[i];
                this.highlightCurrentTag(i);

                await this.delay(this.stepDelay);

                if (!tag.isClosing) {
                    // Opening tag
                    this.push(tag.name);
                    this.addStepMessage(`Pushed '<${tag.name}>' onto stack`);
                } else {
                    // Closing tag
                    const topTag = this.peek();

                    if (this.isEmpty()) {
                        this.errors.push({
                            type: 'extra_closing',
                            tag: tag,
                            message: `Extra closing tag '${tag.name}' found at line ${tag.line}`
                        });
                        this.addStepMessage(`Error: Extra closing tag '</${tag.name}>' found`);
                    } else if (topTag === tag.name) {
                        // Tags match
                        this.pop();
                        this.addStepMessage(`Matched '</${tag.name}>' with '<${tag.name}>' - popped from stack`);
                    } else {
                        // Tags don't match
                        this.errors.push({
                            type: 'mismatch',
                            tag: tag,
                            expected: topTag,
                            message: `Mismatched tag: expected '</${topTag}>' but found '</${tag.name}>' at line ${tag.line}`
                        });
                        this.addStepMessage(`Error: Expected '</${topTag}>' but found '</${tag.name}>'`);
                    }
                }

                this.updateStackVisualization();
            }

            // Check for unclosed tags
            while (!this.isEmpty()) {
                if (!this.isStepping) break;

                const unclosedTag = this.pop();
                this.errors.push({
                    type: 'unclosed',
                    tag: { name: unclosedTag },
                    message: `Unclosed tag '<${unclosedTag}>'`
                });
                this.addStepMessage(`Error: Unclosed tag '<${unclosedTag}>' found`);
                await this.delay(this.stepDelay);
            }

            this.displayResults();

        } catch (error) {
            this.showError('An error occurred during step-through: ' + error.message);
        } finally {
            this.isStepping = false;
            this.stepBtn.disabled = false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    highlightCurrentTag(index) {
        // Remove previous highlights
        const highlightedElements = document.querySelectorAll('.current-tag');
        highlightedElements.forEach(el => el.classList.remove('current-tag'));

        // Add highlight to current tag in input
        const textarea = this.htmlInput;
        const text = textarea.value;
        const tag = this.tags[index];

        // Create a temporary element to show highlighting
        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.top = '0';
        tempDiv.style.left = '0';
        tempDiv.style.pointerEvents = 'none';
        tempDiv.style.zIndex = '1000';
        tempDiv.style.backgroundColor = 'rgba(255, 215, 0, 0.3)';
        tempDiv.style.border = '2px solid #ffd700';
        tempDiv.style.borderRadius = '4px';
        tempDiv.style.padding = '2px 4px';
        tempDiv.textContent = tag.fullTag;

        // Position the highlight (simplified positioning)
        const lines = text.substring(0, tag.position).split('\n');
        const lineHeight = 20; // Approximate line height
        const charWidth = 8; // Approximate character width

        tempDiv.style.top = `${(lines.length - 1) * lineHeight + 20}px`;
        tempDiv.style.left = `${(lines[lines.length - 1].length) * charWidth + 20}px`;

        textarea.parentNode.style.position = 'relative';
        textarea.parentNode.appendChild(tempDiv);

        // Remove highlight after delay
        setTimeout(() => {
            if (tempDiv.parentNode) {
                tempDiv.parentNode.removeChild(tempDiv);
            }
        }, this.stepDelay);
    }

    addStepMessage(message) {
        const reportDiv = this.detailedReport;
        const stepDiv = document.createElement('div');
        stepDiv.className = 'report-item info';
        stepDiv.innerHTML = `<strong>Step ${this.currentStep + 1}:</strong> ${message}`;
        reportDiv.appendChild(stepDiv);
        this.currentStep++;
    }

    // Display results
    displayResults() {
        const isValid = this.errors.length === 0;

        if (isValid) {
            this.updateStatus('Valid HTML!', 'valid');
        } else {
            this.updateStatus(`Invalid HTML - ${this.errors.length} error(s)`, 'invalid');
        }

        this.displayTagAnalysis();
        this.updateStackVisualization();
        this.displayDetailedReport();
    }

    displayTagAnalysis() {
        const analysisDiv = this.tagAnalysis;
        analysisDiv.innerHTML = '';

        if (this.tags.length === 0) {
            analysisDiv.innerHTML = '<p class="placeholder">No tags found</p>';
            return;
        }

        const tagList = document.createElement('ul');
        tagList.className = 'tag-list';

        this.tags.forEach((tag, index) => {
            const listItem = document.createElement('li');
            listItem.className = 'tag-item';

            const tagName = document.createElement('span');
            tagName.className = 'tag-name';
            tagName.textContent = tag.fullTag;

            const tagStatus = document.createElement('span');
            tagStatus.className = 'tag-status';

            // Determine tag status
            if (tag.isClosing) {
                const matchingOpeningIndex = this.findMatchingOpeningTag(index);
                if (matchingOpeningIndex !== -1) {
                    tagStatus.textContent = 'Matched';
                    tagStatus.classList.add('matched');
                } else {
                    tagStatus.textContent = 'Unmatched';
                    tagStatus.classList.add('unmatched');
                }
            } else {
                const matchingClosingIndex = this.findMatchingClosingTag(index);
                if (matchingClosingIndex !== -1) {
                    tagStatus.textContent = 'Matched';
                    tagStatus.classList.add('matched');
                } else {
                    tagStatus.textContent = 'Unclosed';
                    tagStatus.classList.add('unmatched');
                }
            }

            listItem.appendChild(tagName);
            listItem.appendChild(tagStatus);
            tagList.appendChild(listItem);
        });

        analysisDiv.appendChild(tagList);
    }

    findMatchingOpeningTag(closingIndex) {
        const closingTag = this.tags[closingIndex];
        let stack = [];

        for (let i = closingIndex - 1; i >= 0; i--) {
            const tag = this.tags[i];
            if (!tag.isClosing) {
                if (tag.name === closingTag.name) {
                    if (stack.length === 0) return i;
                    stack.pop();
                } else {
                    stack.push(tag.name);
                }
            } else {
                stack.push(tag.name);
            }
        }
        return -1;
    }

    findMatchingClosingTag(openingIndex) {
        const openingTag = this.tags[openingIndex];
        let stack = [];

        for (let i = openingIndex + 1; i < this.tags.length; i++) {
            const tag = this.tags[i];
            if (tag.isClosing) {
                if (tag.name === openingTag.name) {
                    if (stack.length === 0) return i;
                    stack.pop();
                } else {
                    stack.push(tag.name);
                }
            } else {
                stack.push(tag.name);
            }
        }
        return -1;
    }

    updateStackVisualization() {
        const stackDiv = this.stackVisualization;
        stackDiv.innerHTML = '';

        if (this.stack.length === 0) {
            stackDiv.innerHTML = `
                <div class="stack-placeholder">
                    <i class="fas fa-layer-group"></i>
                    <p>Stack is empty</p>
                </div>
            `;
            return;
        }

        // Display stack items (top to bottom)
        for (let i = this.stack.length - 1; i >= 0; i--) {
            const stackItem = document.createElement('div');
            stackItem.className = 'stack-item';
            stackItem.textContent = `<${this.stack[i]}>`;
            stackDiv.appendChild(stackItem);
        }
    }

    displayDetailedReport() {
        const reportDiv = this.detailedReport;
        reportDiv.innerHTML = '';

        // Summary
        const summaryDiv = document.createElement('div');
        summaryDiv.className = 'report-item info';
        summaryDiv.innerHTML = `
            <strong>Validation Summary:</strong><br>
            • Total tags found: ${this.tags.length}<br>
            • Opening tags: ${this.tags.filter(t => !t.isClosing).length}<br>
            • Closing tags: ${this.tags.filter(t => t.isClosing).length}<br>
            • Errors found: ${this.errors.length}
        `;
        reportDiv.appendChild(summaryDiv);

        // Display errors
        if (this.errors.length > 0) {
            this.errors.forEach(error => {
                const errorDiv = document.createElement('div');
                errorDiv.className = 'report-item error';
                errorDiv.innerHTML = `<strong>Error:</strong> ${error.message}`;
                reportDiv.appendChild(errorDiv);
            });
        } else {
            const successDiv = document.createElement('div');
            successDiv.className = 'report-item success';
            successDiv.innerHTML = '<strong>Success!</strong> All HTML tags are properly matched and nested.';
            reportDiv.appendChild(successDiv);
        }
    }

    // Utility functions
    updateStatus(message, type) {
        this.statusIndicator.className = `status-indicator ${type}`;
        this.statusIndicator.querySelector('.status-text').textContent = message;
    }

    resetResults() {
        this.tagAnalysis.innerHTML = '<p class="placeholder">Processing...</p>';
        this.stackVisualization.innerHTML = `
            <div class="stack-placeholder">
                <i class="fas fa-layer-group"></i>
                <p>Stack will appear here during validation</p>
            </div>
        `;
        this.detailedReport.innerHTML = '<p class="placeholder">Processing...</p>';
    }

    showError(message) {
        this.updateStatus('Error', 'invalid');
        this.detailedReport.innerHTML = `
            <div class="report-item error">
                <strong>Error:</strong> ${message}
            </div>
        `;
    }

    clearAll() {
        this.htmlInput.value = '';
        this.updateStatus('Ready', 'ready');
        this.resetResults();
        this.stack = [];
        this.tags = [];
        this.errors = [];
        this.isStepping = false;
        this.stepBtn.disabled = false;
    }

    loadSampleData() {
        const sampleHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Sample Page</title>
</head>
<body>
    <div class="container">
        <h1>Welcome</h1>
        <p>This is a <strong>sample</strong> HTML page.</p>
        <ul>
            <li>Item 1</li>
            <li>Item 2</li>
        </ul>
    </div>
</body>
</html>`;

        this.htmlInput.value = sampleHTML;
        this.updateStatus('Sample loaded', 'ready');
    }
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HTMLTagMatcher();
});

// Add some additional utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
            case 'Enter':
                e.preventDefault();
                document.getElementById('validateBtn').click();
                break;
            case 's':
                e.preventDefault();
                document.getElementById('stepBtn').click();
                break;
            case 'k':
                e.preventDefault();
                document.getElementById('clearBtn').click();
                break;
        }
    }
});

// Add some helpful tooltips
document.addEventListener('DOMContentLoaded', () => {
    // Add tooltips to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        const text = button.textContent.trim();
        let shortcut = '';

        switch (text) {
            case 'Validate Tags':
                shortcut = 'Ctrl+Enter';
                break;
            case 'Step Through':
                shortcut = 'Ctrl+S';
                break;
            case 'Clear':
                shortcut = 'Ctrl+K';
                break;
        }

        if (shortcut) {
            button.title = `${text} (${shortcut})`;
        }
    });
}); 