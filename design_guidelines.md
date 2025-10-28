# Design Guidelines: Travel Itinerary Calculator (25-Day COSMOS)

## Design Approach

**Selected Approach**: Design System (Material Design + Custom Enhancements)
**Justification**: This is a productivity-focused application for travel planning that requires clarity, efficiency, and data organization. Material Design provides excellent patterns for interactive calendars, timelines, and form inputs while maintaining visual polish.

**Key Design Principles**:
- **Clarity First**: Information hierarchy prioritizes dates, events, and timeline navigation
- **Efficient Interaction**: Quick event editing with inline controls, minimal clicks
- **Data Density Balance**: Displaying 25 days of information without overwhelming the user
- **Theme Flexibility**: Seamless dark/light mode transitions for all-day usage

---

## Typography

**Font Stack**: Inter (via Google Fonts)
- Primary heading: 2.5rem (40px), font-weight 800, tracking tight
- Section headings: 1.25rem (20px), font-weight 600
- Day numbers: 1.125rem (18px), font-weight 700
- Body text: 1rem (16px), font-weight 400-500
- Calendar dates: 0.875rem (14px), font-weight 500
- Secondary info: 0.875rem (14px), font-weight 400

**Hierarchy Rules**:
- Main title uses gradient text treatment with extrabold weight
- Section headers use semibold with clear spacing
- Timeline dates use medium-bold for scannability
- Event text uses regular weight for readability

---

## Layout System

**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Component padding: p-6 (1.5rem)
- Section gaps: gap-8 (2rem)
- Timeline items: gap-4 (1rem) vertically
- Inline element spacing: gap-2 or gap-4
- Container margins: mx-4 on mobile, mx-auto with max-width on desktop

**Grid Structure**:
- Desktop: Two-column layout (md:grid-cols-2) with equal widths
- Left column: Calendar + Summary (sticky configuration panel)
- Right column: Scrollable timeline (max-height: 80vh with custom scrollbar)
- Mobile: Single column stack with calendar first, then timeline

**Container System**:
- Outer container: max-w-7xl mx-auto with px-4
- Calendar container: max-w-md mx-auto (centered)
- Timeline container: Full width within column with rounded-2xl borders

**Vertical Rhythm**:
- Page top padding: py-8
- Section spacing: mb-12 for header, gap-8 between columns
- Timeline items: 1rem gaps with consistent internal padding
- Summary cards: 0.75rem internal padding

---

## Component Library

### Navigation & Header
- **Page Header**: Centered layout with gradient title text, descriptive subtitle below
- **Theme Toggle**: Top-right corner, icon-based switch (sun/moon icons from Heroicons)
- No traditional navigation menu needed for single-page app

### Calendar Component
- **Integration**: Flatpickr inline calendar (react-flatpickr wrapper)
- **Display**: Centered within container, max-width constraint
- **Date Range Display**: Large pill-shaped container showing selected range with gradient background
- **Clear Button**: Full-width, subtle button below calendar for resetting

### Timeline Components

**Day Item Card Structure**:
```
Grid: [Circle Number] [Date Info Column] [Action Button/Editor]
- Circle number: 2.5rem diameter, centered content
- Date column: Flex column with date (larger) and weekday (smaller)
- Action area: Flex end alignment for button/editor
```

**Day Item States**:
- Default: Clean card with subtle shadow
- Weekend: Distinct left border accent (4px) with tinted background
- Hover: Slight elevation increase with shadow enhancement
- With Event: Action button shows distinct treatment

**Event Management**:
- Inline editing mode replaces action button
- Input field with save/delete buttons
- Smooth transitions between states
- Event text displayed as badge when saved

### Summary Panel
- **Grid Layout**: 2-column grid for metrics
- **Metric Cards**: Centered content with large number (3xl), small label below
- **Status Message**: Centered text below metrics
- **Visual Treatment**: Subtle background with border, no heavy shadows

### Buttons & Controls
- **Primary Actions**: Rounded-full pills with medium font-weight
- **Event Buttons**: Badge-style rounded-2xl with icon + text
- **Clear Button**: Rounded-lg with subtle background
- **Save/Delete**: Small inline buttons within editor (rounded-md)

### Cards & Containers
- **Main Panels**: backdrop-blur-sm with rounded-2xl corners
- **Day Items**: rounded-3/4 (0.75rem) with soft shadows
- **Summary Section**: rounded-xl with border treatment
- **Nested Cards**: Consistent corner radius hierarchy (larger outer, smaller inner)

---

## Dark Mode Implementation

**Theme Toggle**:
- Fixed position top-right corner with 1rem margin
- Smooth icon transition between sun/moon
- Persists preference to localStorage

**Dark Mode Adjustments**:
- All backgrounds invert appropriately
- Text contrast ratios maintain WCAG AA standards
- Borders become more subtle (reduced opacity)
- Shadows adapt to dark contexts
- Calendar maintains readability with inverted scheme
- Timeline items use darker cards with lighter borders
- Gradient treatments adapt to dark backgrounds

**Color Semantic Mapping** (general approach):
- Primary interactive elements maintain visibility
- Weekend highlighting adapts to dark theme
- Selected dates remain clearly distinguished
- Success states (events saved) use appropriate dark variants

---

## Responsive Behavior

**Breakpoints**:
- Mobile: < 768px (single column, simplified grid)
- Tablet/Desktop: ≥ 768px (two-column layout)

**Mobile Optimizations**:
- Calendar: Full width within container
- Timeline: Reduced max-height (50vh)
- Day items: Simplified grid (auto 1fr), button stacks below
- Summary: Maintains 2-column metric grid (compact)
- Spacing: Reduced padding (p-4 instead of p-6)
- Typography: Slightly smaller sizes for header

**Desktop Enhancements**:
- Sticky positioning for summary panel (optional)
- Larger calendar display
- More generous timeline scrolling area
- Enhanced hover states with transforms

---

## Interactions & Animations

**Principle**: Minimal, purposeful motion

**Implemented Animations**:
- Day item hover: translateY(-2px) with shadow increase (0.3s ease)
- Theme toggle: Icon rotation/fade (0.2s)
- Event editor: Smooth height expansion when opening
- Button hovers: Background color transitions (0.2s)
- Calendar date selection: Subtle scale on select

**No Animations For**:
- Page load (instant render)
- Timeline scrolling (native behavior)
- Text input interactions
- Layout shifts

---

## Accessibility

**Focus Management**:
- Visible focus rings on all interactive elements
- Keyboard navigation through timeline and calendar
- Tab order: Calendar → Clear button → Timeline items top to bottom

**Screen Reader Support**:
- Semantic HTML structure (header, main, section)
- ARIA labels for icon buttons (theme toggle, event actions)
- Date announcements in accessible format
- Event count announcements

**Form Inputs**:
- Clear labels for all input fields
- Error states with descriptive messages
- Sufficient touch targets (min 44x44px)

---

## Visual Hierarchy

**Information Priority**:
1. Selected date range (prominent display)
2. Timeline day numbers and dates (largest in cards)
3. Event information (when present)
4. Weekday names and summary metrics (secondary)

**Contrast & Emphasis**:
- Day numbers use highest contrast circular badges
- Dates use bold weight and larger size
- Events use distinct treatment when saved
- Weekends use subtle background differentiation

---

## Performance Considerations

- Virtualized timeline rendering for smooth scrolling
- Debounced event input saving
- Optimized re-renders (React.memo for day items)
- Lazy load Flatpickr library
- CSS-based animations (no JavaScript animation libraries)

---

## Component Structure Summary

1. **App Shell**: Max-width container with gradient background
2. **Header Section**: Centered title and description
3. **Two-Column Grid**: Calendar panel + Timeline panel
4. **Calendar Panel**: Date display, calendar, clear button, summary
5. **Timeline Panel**: Scrollable container with 25 day items
6. **Day Item**: Number badge, date info, event controls
7. **Theme Toggle**: Floating button (top-right)