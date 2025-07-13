# Design System - Aplikasi Absensi

## Overview

Design system yang modern, simple, dan elegant untuk aplikasi absensi siswa dan guru dengan fokus pada user experience yang baik dan responsivitas.

## Color Palette

### Primary Colors

- **Primary 50**: `#eff6ff` - Light background
- **Primary 100**: `#dbeafe` - Hover states
- **Primary 500**: `#3b82f6` - Main brand color
- **Primary 600**: `#2563eb` - Buttons, links
- **Primary 700**: `#1d4ed8` - Hover buttons

### Status Colors

- **Success**: `#22c55e` - Hadir, positive actions
- **Warning**: `#f59e0b` - Sakit, caution states
- **Danger**: `#ef4444` - Alpa, delete actions
- **Info**: `#3b82f6` - Izin, information

### Neutral Colors

- **Gray 50**: `#f8fafc` - Background
- **Gray 100**: `#f1f5f9` - Card backgrounds
- **Gray 600**: `#475569` - Secondary text
- **Gray 900**: `#0f172a` - Primary text

## Typography

### Font Family

- **Primary**: Inter (Google Fonts)
- **Fallback**: system-ui, sans-serif

### Font Sizes

- **Heading 1**: `text-3xl font-bold` - Page titles
- **Heading 2**: `text-xl font-semibold` - Section titles
- **Heading 3**: `text-lg font-semibold` - Card titles
- **Body**: `text-sm` - Regular text
- **Caption**: `text-xs` - Small text, labels

## Components

### Buttons

#### Primary Button

```css
.btn-primary {
  @apply bg-primary-600 hover:bg-primary-700 text-white font-medium py-2.5 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
```

#### Secondary Button

```css
.btn-secondary {
  @apply bg-white hover:bg-gray-50 text-gray-700 font-medium py-2.5 px-4 rounded-lg border border-gray-300 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed;
}
```

#### Button Sizes

- **Small**: `btn-sm` - `py-1.5 px-3 text-sm`
- **Large**: `btn-lg` - `py-3 px-6 text-lg`

### Input Fields

```css
.input-field {
  @apply w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 bg-white;
}
```

### Cards

```css
.card {
  @apply bg-white rounded-xl shadow-soft border border-gray-100 overflow-hidden;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-100 bg-gray-50;
}

.card-body {
  @apply p-6;
}
```

### Tables

```css
.table-container {
  @apply overflow-x-auto rounded-lg border border-gray-200;
}

.table {
  @apply min-w-full divide-y divide-gray-200;
}
```

### Status Badges

```css
.status-badge {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium;
}

.status-hadir {
  @apply bg-success-100 text-success-800;
}
.status-sakit {
  @apply bg-warning-100 text-warning-800;
}
.status-izin {
  @apply bg-primary-100 text-primary-800;
}
.status-alpa {
  @apply bg-danger-100 text-danger-800;
}
.status-terlambat {
  @apply bg-orange-100 text-orange-800;
}
```

### Alerts

```css
.alert {
  @apply p-4 rounded-lg border;
}

.alert-success {
  @apply bg-success-50 border-success-200 text-success-800;
}
.alert-error {
  @apply bg-danger-50 border-danger-200 text-danger-800;
}
.alert-warning {
  @apply bg-warning-50 border-warning-200 text-warning-800;
}
.alert-info {
  @apply bg-primary-50 border-primary-200 text-primary-800;
}
```

## Layout

### Container

```css
.container-responsive {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

### Grid System

```css
.grid-responsive {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4;
}
```

### Flexbox Utilities

```css
.flex-responsive {
  @apply flex flex-col sm:flex-row gap-4;
}
```

## Spacing

### Padding

- **Card**: `p-6`
- **Section**: `py-8`
- **Component**: `px-4 py-2`

### Margins

- **Section**: `mb-8`
- **Component**: `mb-6`
- **Element**: `mb-4`

### Gaps

- **Grid**: `gap-4`, `gap-6`
- **Flex**: `gap-2`, `gap-3`

## Shadows

### Soft Shadow

```css
shadow-soft: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04);
```

### Medium Shadow

```css
shadow-medium: 0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
```

## Animations

### Transitions

- **Default**: `transition-all duration-200`
- **Fast**: `transition-all duration-150`
- **Slow**: `transition-all duration-300`

### Keyframes

```css
@keyframes fadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

@keyframes slideUp {
  0% {
    transform: translateY(10px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
```

## Responsive Design

### Breakpoints

- **Mobile**: `< 640px`
- **Tablet**: `640px - 1024px`
- **Desktop**: `> 1024px`

### Mobile-First Approach

- Start with mobile design
- Use `sm:`, `md:`, `lg:`, `xl:` prefixes
- Progressive enhancement

### Navigation

- **Desktop**: Horizontal menu
- **Mobile**: Hamburger menu with slide-down

## Icons

### Heroicons

- **Size**: 24px (outline variant)
- **Color**: Inherit from parent
- **Spacing**: `mr-2` or `ml-2`

### Common Icons

- **User**: `UserIcon`, `UserGroupIcon`
- **Actions**: `PlusIcon`, `PencilIcon`, `TrashIcon`
- **Navigation**: `HomeIcon`, `ChartBarIcon`
- **Status**: `CheckIcon`, `ClockIcon`

## Best Practices

### Accessibility

- Use semantic HTML
- Proper contrast ratios
- Focus indicators
- Screen reader support

### Performance

- Optimize images
- Lazy loading
- Minimal JavaScript
- Efficient CSS

### User Experience

- Clear visual hierarchy
- Consistent spacing
- Intuitive navigation
- Responsive feedback

## Component Examples

### Card with Header

```jsx
<div className="card">
  <div className="card-header">
    <h2 className="text-lg font-semibold text-gray-900">Card Title</h2>
  </div>
  <div className="card-body">
    <p>Card content goes here</p>
  </div>
</div>
```

### Form Group

```jsx
<div className="form-group">
  <label className="form-label">Label</label>
  <input type="text" className="input-field" />
</div>
```

### Status Badge

```jsx
<span className="status-badge status-hadir">Hadir</span>
```

### Button with Icon

```jsx
<button className="btn-primary flex items-center">
  <PlusIcon className="h-5 w-5 mr-2" />
  Add Item
</button>
```
