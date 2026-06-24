# Metro UI Design System

A comprehensive Metro design system inspired by Windows 8's Modern UI, featuring live tiles, enhanced form components, and smooth animations.

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

## 🎨 Features

- **Live Tiles** - Interactive tiles with flip, slide, and badge animations
- **Enhanced Form Components** - Beautiful inputs, selects, checkboxes, radios, toggles
- **Custom Select Dropdowns** - Fully customizable with search, multi-select, and cascade support
- **Modern UI Elements** - Toasts, modals, accordions, tabs, and more
- **Smooth Animations** - Metro-style transitions and motion effects
- **Responsive Design** - Mobile-first approach with flexible layouts
- **Dark Mode Ready** - Built-in theme support with CSS variables

## 📦 Installation

### npm

```bash
npm install metro-ui-design-system
```

### CDN

```html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/metro-ui-design-system/dist/metro-ui.min.css">

<!-- JavaScript -->
<script src="https://unpkg.com/metro-ui-design-system/dist/metro-ui.min.js"></script>
```

### Manual Download

Download the latest release from [GitHub Releases](https://github.com/yourusername/metro-ui-design-system/releases).

## 🚀 Quick Start

### 1. Include the files

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My Metro App</title>
  
  <!-- Metro UI CSS -->
  <link rel="stylesheet" href="node_modules/metro-ui-design-system/dist/metro-ui.min.css">
</head>
<body>
  <!-- Your content here -->
  
  <!-- Metro UI JavaScript -->
  <script src="node_modules/metro-ui-design-system/dist/metro-ui.min.js"></script>
  <script>
    // Initialize Metro UI
    MetroUI.init();
  </script>
</body>
</html>
```

### 2. Use components

```html
<!-- Live Tile -->
<div class="tile tile-medium" data-tile="flip">
  <div class="tile-face tile-face-front">
    <div class="tile-icon">📊</div>
    <div class="tile-title">Dashboard</div>
  </div>
  <div class="tile-face tile-face-back">
    <div class="tile-content">View Stats</div>
  </div>
</div>

<!-- Enhanced Input -->
<div class="input-wrapper input-enhanced">
  <label>Email Address</label>
  <input type="email" class="input" placeholder="Enter your email">
  <span class="input-icon">📧</span>
</div>

<!-- Custom Select -->
<div class="metro-select">
  <div class="metro-select-trigger">
    <span class="placeholder">Choose an option</span>
    <svg class="metro-select-arrow">...</svg>
  </div>
  <div class="metro-select-panel">
    <div class="metro-option" data-value="1">Option 1</div>
    <div class="metro-option" data-value="2">Option 2</div>
  </div>
</div>
```

## 📚 Components

### Tiles

```html
<!-- Basic Tile -->
<div class="tile tile-small">Small</div>
<div class="tile tile-medium">Medium</div>
<div class="tile tile-wide">Wide</div>
<div class="tile tile-large">Large</div>

<!-- Flip Tile -->
<div class="tile tile-medium" data-tile="flip">
  <div class="tile-face tile-face-front">Front</div>
  <div class="tile-face tile-face-back">Back</div>
</div>

<!-- Slide Tile -->
<div class="tile tile-medium" data-tile="slide">
  <div class="tile-face">Slide Content</div>
</div>

<!-- Tile with Badge -->
<div class="tile tile-medium">
  <div class="tile-badge">3</div>
  <div class="tile-title">Messages</div>
</div>
```

### Form Components

#### Enhanced Inputs

```html
<!-- Basic Enhanced Input -->
<div class="input-wrapper input-enhanced">
  <input type="text" class="input" placeholder="Username">
</div>

<!-- Input with Icon -->
<div class="input-wrapper input-enhanced">
  <span class="input-icon">🔍</span>
  <input type="text" class="input" placeholder="Search...">
</div>

<!-- Input with Validation -->
<div class="input-wrapper input-enhanced input-success">
  <input type="email" class="input" value="user@example.com">
  <span class="input-validation">✓ Valid email</span>
</div>

<div class="input-wrapper input-enhanced input-error">
  <input type="email" class="input" value="invalid">
  <span class="input-validation">✗ Invalid email</span>
</div>
```

#### Custom Select

```html
<!-- Single Select -->
<div class="metro-select">
  <div class="metro-select-trigger">
    <span class="placeholder">Select option</span>
    <svg class="metro-select-arrow">...</svg>
  </div>
  <div class="metro-select-panel">
    <div class="metro-option" data-value="opt1">Option 1</div>
    <div class="metro-option" data-value="opt2">Option 2</div>
  </div>
</div>

<!-- Select with Search -->
<div class="metro-select" data-search="true">
  <div class="metro-select-trigger">
    <span class="placeholder">Search and select</span>
    <svg class="metro-select-arrow">...</svg>
  </div>
  <div class="metro-select-panel">
    <div class="metro-select-search">
      <input type="text" placeholder="Search...">
    </div>
    <div class="metro-option" data-value="apple">Apple</div>
    <div class="metro-option" data-value="banana">Banana</div>
  </div>
</div>

<!-- Multi-Select -->
<div class="metro-select metro-select-multi">
  <div class="metro-select-trigger">
    <div class="selected-tags"></div>
    <span class="placeholder">Select multiple</span>
    <svg class="metro-select-arrow">...</svg>
  </div>
  <div class="metro-select-panel">
    <div class="metro-option" data-value="tag1">
      <span class="metro-checkbox"></span>
      Tag 1
    </div>
    <div class="metro-option" data-value="tag2">
      <span class="metro-checkbox"></span>
      Tag 2
    </div>
  </div>
</div>

<!-- Cascade Select -->
<div class="metro-select" id="province">
  <div class="metro-select-trigger">
    <span class="placeholder">Province</span>
    <svg class="metro-select-arrow">...</svg>
  </div>
  <div class="metro-select-panel">
    <div class="metro-option" data-value="guangdong">广东省</div>
    <div class="metro-option" data-value="zhejiang">浙江省</div>
  </div>
</div>

<div class="metro-select" id="city" data-disabled="true">
  <div class="metro-select-trigger">
    <span class="placeholder">City</span>
    <svg class="metro-select-arrow">...</svg>
  </div>
  <div class="metro-select-panel">
    <!-- Dynamically populated -->
  </div>
</div>
```

#### Toggle Switches

```html
<div class="toggle-wrapper">
  <input type="checkbox" id="toggle1" class="toggle">
  <label for="toggle1">Enable notifications</label>
</div>
```

#### Checkboxes & Radios

```html
<!-- Enhanced Checkbox -->
<div class="checkbox-wrapper checkbox-enhanced">
  <input type="checkbox" id="check1">
  <label for="check1">Accept terms</label>
</div>

<!-- Enhanced Radio -->
<div class="radio-wrapper radio-enhanced">
  <input type="radio" name="option" id="radio1">
  <label for="radio1">Option A</label>
</div>
```

### Toast Notifications

```javascript
// Show success toast
MetroUI.toast({
  type: 'success',
  message: 'Operation completed successfully!'
});

// Show error toast
MetroUI.toast({
  type: 'error',
  message: 'Something went wrong',
  duration: 5000
});

// Show info toast
MetroUI.toast({
  type: 'info',
  message: 'New update available',
  action: {
    text: 'Update Now',
    callback: () => console.log('Update clicked')
  }
});
```

### Modals

```html
<!-- Modal Trigger -->
<button class="btn btn-primary" data-modal="modal1">Open Modal</button>

<!-- Modal -->
<div class="modal" id="modal1">
  <div class="modal-overlay"></div>
  <div class="modal-content">
    <div class="modal-header">
      <h3>Modal Title</h3>
      <button class="modal-close">&times;</button>
    </div>
    <div class="modal-body">
      <p>Modal content here</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" data-modal-close>Cancel</button>
      <button class="btn btn-primary">Confirm</button>
    </div>
  </div>
</div>
```

## 🎨 Theming

Metro UI uses CSS custom properties for easy theming:

```css
:root {
  /* Colors */
  --metro-accent: #0078d4;
  --metro-accent-d: #106ebe;
  --metro-success: #107c10;
  --metro-warning: #ff8c00;
  --metro-error: #d13438;
  
  /* Spacing */
  --metro-space-1: 4px;
  --metro-space-2: 8px;
  --metro-space-3: 12px;
  --metro-space-4: 16px;
  --metro-space-5: 20px;
  --metro-space-6: 24px;
  
  /* Typography */
  --metro-font-family: 'Segoe UI', system-ui, sans-serif;
  --metro-fs-base: 14px;
  --metro-fs-large: 16px;
  --metro-fs-xlarge: 20px;
  
  /* Effects */
  --metro-shadow: 0 2px 8px rgba(0,0,0,0.1);
  --metro-shadow-large: 0 8px 16px rgba(0,0,0,0.14);
  --metro-radius: 4px;
  --metro-transition: all 0.2s ease;
}

/* Dark theme */
[data-theme="dark"] {
  --metro-bg: #1e1e1e;
  --metro-bg-soft: #2d2d2d;
  --metro-fg: #ffffff;
  --metro-fg-secondary: #cccccc;
  --metro-line: #3f3f3f;
}
```

## 🔧 JavaScript API

### Initialize

```javascript
// Auto-initialize on DOM ready
MetroUI.init();

// Initialize specific component
MetroUI.initTiles();
MetroUI.initSelects();
MetroUI.initForms();
```

### Toast API

```javascript
MetroUI.toast({
  type: 'success' | 'error' | 'warning' | 'info',
  message: 'Your message',
  duration: 3000, // milliseconds
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left',
  action: {
    text: 'Action text',
    callback: () => {}
  }
});
```

### Modal API

```javascript
// Open modal
MetroUI.modal.open('modal-id');

// Close modal
MetroUI.modal.close('modal-id');
```

### Events

```javascript
// Select change event
document.querySelector('.metro-select').addEventListener('metro-select-change', (e) => {
  console.log('Selected:', e.detail.value, e.detail.label);
});

// Multi-select change event
document.querySelector('.metro-select-multi').addEventListener('metro-select-change', (e) => {
  console.log('Selected values:', e.detail.values);
});
```

## 📖 Examples

Check out the [demo page](https://yourusername.github.io/metro-ui-design-system/) for live examples and interactive demos.

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by Microsoft's Metro design language
- Built with modern CSS and vanilla JavaScript
- No external dependencies

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/metro-ui-design-system/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/metro-ui-design-system/discussions)

---

Made with ❤️ by the Metro UI Team
