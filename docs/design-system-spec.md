# AI Fitness Coach - Design System Specification

This document provides detailed specifications for the visual and interactive elements of the AI Fitness Coach application. It is the single source of truth for developers implementing the front end.

## 1. Visual Foundation

### 1.1. Typography

- **Font Family:**
  - **Primary:** `Inter` (for all UI text, including headings and body)
  - **Monospace:** `Fira Code` (for any code snippets or data display where applicable)
- **Type Scale (based on 16px root):**
  - **h1 (4xl):** 2.25rem (36px), font-weight: 900
  - **h2 (3xl):** 1.875rem (30px), font-weight: 800
  - **h3 (2xl):** 1.5rem (24px), font-weight: 700
  - **h4 (xl):** 1.25rem (20px), font-weight: 700
  - **Body (base):** 1rem (16px), font-weight: 400
  - **Small (sm):** 0.875rem (14px), font-weight: 400
  - **Extra Small (xs):** 0.75rem (12px), font-weight: 400
- **Line Heights:**
  - **Headings:** 1.2
  - **Body Text:** 1.6

### 1.2. Spacing

- **Base Unit:** 1 unit = 4px.
- **Scale:** All margins, paddings, and layout gaps should use multiples of the base unit.
  - `p-1` = 4px
  - `p-2` = 8px
  - `p-3` = 12px
  - `p-4` = 16px
  - `p-6` = 24px
  - `p-8` = 32px

### 1.3. Layout

- **Grid:** A 12-column grid system should be used for all page layouts.
- **Gutters:** 24px
- **Container Widths:**
  - **Default Max Width:** `1280px`
  - **Page Padding:** `24px` on all sides.

---

## 2. Component Library

This section defines the specifications for reusable components.

### 2.1. Buttons

- **Hierarchy:**
  - **Primary:** Solid background (`primary` color), white text. Used for the main call to action on a page.
  - **Secondary:** Solid background (`surface-dark` or `white`), primary text color. Used for secondary actions.
  - **Tertiary/Ghost:** No background, primary text color. Used for less prominent actions.
  - **Destructive:** Solid background (red color), white text. Used for actions that delete data.
- **States:** All buttons must have defined `default`, `hover`, `active`, `focus`, and `disabled` states.
  - **Focus State:** Must show a visible outline/ring around the button.

### 2.2. Cards

- **Base Style:**
  - **Background:** `surface-dark` (dark theme) or `white` (light theme).
  - **Border Radius:** `rounded-xl` (0.75rem / 12px).
  - **Border:** 1px solid `border-dark` (dark theme) or `e2e8f0` (light theme).
  - **Padding:** `p-6` (24px).

### 2.3. Form Inputs

- **Base Style:**
  - **Background:** `background-dark` (dark theme) or `gray-100` (light theme).
  - **Border:** 1px solid `border-dark` or `e2e8f0`.
  - **Padding:** `px-4 py-3`.
  - **Border Radius:** `rounded-lg` (0.5rem / 8px).
- **States:** Must have `default`, `focus`, `error`, and `disabled` states.
  - **Focus State:** 2px solid ring in `primary` color.
  - **Error State:** Border color changes to semantic `error` red color.

---

## 3. UX Pattern Consistency Rules

### 3.1. Feedback & Notifications (Toasts)
- **Position:** Top-right corner of the screen.
- **Types:** `Success` (green), `Error` (red), `Warning` (yellow), `Info` (blue).
- **Dismissal:** Should be dismissible by the user via a close button. Automatically dismiss after 5 seconds, except for critical errors.

### 3.2. Modals
- **Backdrop:** A dark, semi-transparent backdrop (`bg-black/70`) must be used.
- **Dismissal:** Can be dismissed by clicking the backdrop, pressing the `Escape` key, or clicking a "Close" or "Cancel" button.
- **Focus Management:** Focus must be trapped within the modal until it is closed.

---

## 4. Responsive Design

### 4.1. Breakpoints
- **sm:** 640px
- **md:** 768px
- **lg:** 1024px
- **xl:** 1280px

### 4.2. Strategy
- The application should be mobile-first.
- **Navigation:** On smaller screens (`< lg`), the primary sidebar navigation should collapse into a hamburger menu.
- **Grids:** Multi-column layouts (e.g., dashboard cards) should stack vertically on smaller screens.

---

## 5. Accessibility

### 5.1. Compliance Target
- **Target:** WCAG 2.1 Level AA.

### 5.2. Guidelines
- **Color Contrast:** All text must meet a minimum contrast ratio of 4.5:1 against its background.
- **Keyboard Navigation:** All interactive elements (buttons, links, form fields) must be reachable and operable via the keyboard alone. The tab order must be logical.
- **Focus Indicators:** All focusable elements must have a highly visible focus state (e.g., the ring specified for buttons and inputs).
- **ARIA:** Use ARIA attributes where necessary to provide semantic meaning for screen readers (e.g., `aria-label` for icon-only buttons, roles for custom components).
- **Images:** All `<img>` tags must have descriptive `alt` attributes. For decorative images, use `alt=""`.
- **Forms:** All form inputs must be associated with a `<label>` tag. Error messages must be programmatically associated with their respective inputs.
