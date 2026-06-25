# Metro UI Design System

Modern Metro-style UI component library inspired by Windows 8's Modern UI design language.

[![npm version](https://img.shields.io/npm/v/metro-ui-design-system.svg)](https://www.npmjs.com/package/metro-ui-design-system)
[![License](https://img.shields.io/npm/l/metro-ui-design-system.svg)](https://github.com/ethanfly/metro-ui/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/ethanfly/metro-ui.svg?style=social)](https://github.com/ethanfly/metro-ui)

## Features

- **Live Tiles** - Interactive tiles with flip, slide, and badge animations
- **Form Components** - Custom select, multi-select, cascade select, checkboxes, radios, toggles, sliders
- **Navigation** - Menubar, pivot, breadcrumb, pagination, stepper, hub layout
- **Feedback** - Toast notifications, alerts, progress bars, spinners, skeletons
- **Interactive** - Dropdowns, dialogs, flyouts, app bar, file upload, color picker
- **i18n Support** - Built-in Chinese/English language switching
- **Dark Mode** - Built-in theme support with CSS variables
- **Zero Dependencies** - Pure HTML/CSS/JS, no frameworks required

## Installation

### npm

\`ash
npm install metro-ui-design-system
\`

### CDN

\`html
<link rel="stylesheet" href="https://unpkg.com/metro-ui-design-system/dist/metro-ui.min.css">
<script src="https://unpkg.com/metro-ui-design-system/dist/metro-ui.min.js"></script>
\`

### Manual

Download from [GitHub Releases](https://github.com/ethanfly/metro-ui/releases).

## Quick Start

\`html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="node_modules/metro-ui-design-system/dist/metro-ui.min.css">
</head>
<body>
  <!-- Your content -->
  
  <script src="node_modules/metro-ui-design-system/dist/metro-ui.min.js"></script>
</body>
</html>
\`

## Components

### Layout
- **Live Tiles** - Metro-style tiles with flip/slide animations
- **Hub** - Horizontal scrolling layout with sections

### Forms
- **Buttons** - Primary, ghost, danger, success variants
- **Inputs** - Text inputs with icons and validation states
- **Textarea** - Multi-line text input
- **Select** - Custom dropdown with search
- **Multi-Select** - Multi-select with tags
- **Cascade** - Linked dropdowns (e.g., country → city)
- **Search** - Search box with clear button
- **Toggle** - Switch controls
- **Checkbox** - Custom checkboxes
- **Radio** - Custom radio buttons
- **Slider** - Range slider with value display
- **Number Input** - Numeric input with increment/decrement

### Data Display
- **Tags** - Removable tag chips
- **Tag Input** - Input with tag creation
- **Avatar** - User avatars with status indicators
- **Badge** - Status badges
- **List View** - Grouped list with icons
- **Breadcrumb** - Navigation path
- **Pagination** - Page navigation
- **Stepper** - Multi-step process indicator

### Feedback
- **Alert** - Info, success, warning, error messages
- **Toast** - Non-blocking notifications
- **Progress** - Determinate and indeterminate progress bars
- **Spinner** - Loading indicators
- **Rating** - Star rating component
- **Color Picker** - Color swatch selector

### Interactive
- **Dropdown** - Click-triggered dropdown menus
- **Menu Bar** - Application menu bar
- **Pivot** - Tab-style navigation
- **Flyout** - Floating panels
- **Dialog** - Modal dialogs
- **App Bar** - Bottom command bar

### Utilities
- **File Upload** - Drag-and-drop file upload
- **Skeleton** - Loading placeholders
- **Empty State** - Empty content placeholder
- **Tooltip** - Hover tooltips
- **Icons** - 50+ SVG icon set

## Usage Examples

### Buttons

\`html
<button class="btn">Default</button>
<button class="btn btn--primary">Primary</button>
<button class="btn btn--danger">Danger</button>
<button class="btn btn--success">Success</button>
\`

### Live Tiles

\`html
<button class="tile tile-md bg-blue">
  <div class="tile-face tile-brand">
    <span class="tile-glyph"><svg class="glyph"><use href="#i-mail"/></svg></span>
    <div class="tile-title">Mail</div>
  </div>
</button>
\`

### Toast Notifications

\`javascript
metroToast({
  type: 'success',
  title: 'Success',
  message: 'Operation completed!',
  duration: 4000
});
\`

### Custom Select

\`html
<div class="metro-select" data-metro-select>
  <div class="metro-select-trigger">
    <span class="placeholder">Choose option</span>
    <svg class="metro-select-arrow" width="20" height="20" viewBox="0 0 24 24" 
         fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  </div>
  <div class="metro-select-panel">
    <div class="metro-option" data-value="1">Option 1</div>
    <div class="metro-option" data-value="2">Option 2</div>
  </div>
</div>
\`

### Menu Bar

\`html
<nav class="menubar" role="navigation">
  <button class="menubar-item">File</button>
  <button class="menubar-item">Edit</button>
  <button class="menubar-item">View</button>
  <button class="menubar-item">Help</button>
</nav>
\`

## Theming

Metro UI uses CSS custom properties for easy customization:

\`css
:root {
  --metro-accent: #0078d4;
  --metro-accent-d: #106ebe;
  --metro-success: #107c10;
  --metro-warning: #ff8c00;
  --metro-error: #d13438;
  
  --metro-space-1: 4px;
  --metro-space-2: 8px;
  --metro-space-3: 12px;
  --metro-space-4: 16px;
  
  --metro-font-family: 'Segoe UI', system-ui, sans-serif;
}

[data-theme="dark"] {
  --metro-bg: #1e1e1e;
  --metro-fg: #ffffff;
  --metro-line: #3f3f3f;
}
\`

### Dark Mode Toggle

\`javascript
// Enable dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Disable dark mode
document.documentElement.removeAttribute('data-theme');
\`

## i18n Support

Built-in language switching between Chinese and English:

\`html
<!-- Bilingual elements -->
<span class="lang-zh">中文</span>
<span class="lang-en">English</span>

<!-- Language toggle button -->
<button data-lang-toggle>切换语言</button>
\`

\`javascript
// Switch language programmatically
document.documentElement.setAttribute('data-lang', 'en'); // or 'zh'
\`

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Development

\`ash
# Clone repository
git clone https://github.com/ethanfly/metro-ui.git
cd metro-ui

# Build dist files
npm run build

# Start local server
npx serve
\`

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details.

## Links

- **npm**: https://www.npmjs.com/package/metro-ui-design-system
- **GitHub**: https://github.com/ethanfly/metro-ui
- **Demo**: https://ethanfly.github.io/metro-ui/index.html
- **Docs**: https://ethanfly.github.io/metro-ui/docs.html

---

Made with ❤️ by Ethan
