const fs = require('fs');
const path = require('path');

// Create dist directory
if (!fs.existsSync('dist')) {
  fs.mkdirSync('dist');
}

// Concatenate CSS files
const cssFiles = [
  'styles/tokens.css',
  'styles/base.css',
  'styles/tiles.css',
  'styles/components.css',
  'styles/layout.css',
  'styles/motion.css'
];

console.log('Building CSS...');
let cssContent = '/* Metro UI Design System v1.0.0 */\n\n';
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    cssContent += `/* ${file} */\n${content}\n\n`;
    console.log(`  ✓ Added ${file}`);
  }
});

fs.writeFileSync('dist/metro-ui.css', cssContent);
console.log('✓ CSS bundled: dist/metro-ui.css\n');

// Copy JS file
console.log('Building JS...');
let jsContent = '';
if (fs.existsSync('scripts/metro.js')) {
  jsContent = fs.readFileSync('scripts/metro.js', 'utf8');
  fs.writeFileSync('dist/metro-ui.js', jsContent);
  console.log('  ✓ Copied scripts/metro.js');
  console.log('✓ JS bundled: dist/metro-ui.js\n');
}

// Create minified versions (basic minification)
console.log('Creating minified versions...');
const minifiedCSS = cssContent
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\s+/g, ' ') // Collapse whitespace
  .replace(/\s*([{}:;,])\s*/g, '$1') // Remove space around punctuation
  .trim();

fs.writeFileSync('dist/metro-ui.min.css', minifiedCSS);
console.log('✓ Minified CSS: dist/metro-ui.min.css\n');

const minifiedJS = jsContent
  .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
  .replace(/\n\s*/g, '\n') // Remove leading whitespace
  .replace(/\n{2,}/g, '\n'); // Collapse multiple newlines

fs.writeFileSync('dist/metro-ui.min.js', minifiedJS);
console.log('✓ Minified JS: dist/metro-ui.min.js\n');

// Report file sizes
console.log('Build complete! File sizes:');
const files = ['dist/metro-ui.css', 'dist/metro-ui.min.css', 'dist/metro-ui.js', 'dist/metro-ui.min.js'];
files.forEach(file => {
  const stats = fs.statSync(file);
  const sizeKB = (stats.size / 1024).toFixed(2);
  console.log(`  ${file}: ${sizeKB} KB`);
});

console.log('\n✓ Build successful!');
