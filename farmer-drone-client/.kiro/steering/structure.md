# Project Structure & Conventions

## Folder Organization

```
src/
├── assets/          # Images, logos, static assets
├── components/      # Reusable UI components (Navbar, ChatFloat, LanguageDropdown)
├── context/         # React Context providers (LanguageContext)
├── data/            # Static data files (fields.js, prices.json)
├── pages/           # Route-level page components
├── utils/           # Helper functions and utilities
├── App.jsx          # Main app component with routing
├── main.jsx         # React app entry point
└── index.css        # Global styles and Tailwind imports
```

## Naming Conventions

- **Components**: PascalCase (e.g., `Navbar.jsx`, `ChatFloat.jsx`)
- **Pages**: PascalCase (e.g., `Home.jsx`, `Login.jsx`, `DroneUpload.jsx`)
- **Utilities**: camelCase (e.g., `scanPlanner.js`, `cropScanWindows.js`)
- **Data files**: camelCase (e.g., `fields.js`, `prices.json`)
- **Context**: PascalCase with "Context" suffix (e.g., `LanguageContext.jsx`)

## Code Style Patterns

### Component Structure
- Use functional components with hooks
- Import statements at top, grouped by: external libraries, then internal modules
- Export default at bottom
- Use destructuring for props and hooks

### Styling
- Tailwind utility classes for all styling
- Responsive design with `md:` breakpoints
- Color scheme: emerald/green for primary, yellow for accents, slate/gray for neutrals
- Custom animations defined in `tailwind.config.js`

### Routing
- React Router DOM v7 with `<Routes>` and `<Route>`
- Conditional navbar rendering based on route
- Use `useNavigate()` for programmatic navigation
- Use `useLocation()` for route-based logic

### Internationalization
- All user-facing text uses `t()` function from `useLanguage()` hook
- Translation keys stored in `LanguageContext.jsx`
- Language preference persisted in localStorage
- Supported languages: en, hi, ta, bn, mr, te

### State Management
- React Context for global state (language, auth)
- Local state with `useState` for component-specific data
- localStorage for persistence (auth tokens, language preference)

### File Comments
- Top-level comment with file path (e.g., `// src/components/Navbar.jsx`)
- Minimal inline comments; prefer self-documenting code

## Key Architectural Patterns

1. **Context-based i18n**: All text content is internationalized via LanguageContext
2. **Route-based layout**: Navbar and ChatFloat only show on authenticated routes
3. **Data-driven UI**: Field data and scan schedules driven by static data files
4. **Utility-first CSS**: No custom CSS classes; all styling via Tailwind utilities
5. **Component composition**: Small, focused components composed into pages

## Import Patterns

```javascript
// External libraries first
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Internal modules second
import { useLanguage } from "../context/LanguageContext";
import Navbar from "../components/Navbar";
```

## ESLint Rules

- Unused variables allowed if they match pattern `^[A-Z_]` (constants)
- React Hooks rules enforced
- React Refresh plugin for HMR
- ECMAScript 2020+ features enabled
