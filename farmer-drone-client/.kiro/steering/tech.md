# Technology Stack

## Build System & Tooling

- **Build Tool**: Vite 7.2.4
- **Package Manager**: npm
- **Node Version**: Modern (ES modules, ecmaVersion 2020+)

## Frontend Framework

- **React**: 19.2.0 (with React DOM 19.2.0)
- **Router**: React Router DOM 7.11.0
- **Styling**: Tailwind CSS 3.4.19 with PostCSS and Autoprefixer

## Key Libraries

- **HTTP Client**: Axios 1.13.2
- **Icons**: Lucide React 0.562.0
- **Date Utilities**: date-fns 4.1.0

## Code Quality

- **Linter**: ESLint 9.39.1 with flat config
- **Plugins**: 
  - @eslint/js
  - eslint-plugin-react-hooks
  - eslint-plugin-react-refresh

## Common Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Development Notes

- Uses ES modules (`"type": "module"` in package.json)
- Vite dev server runs on default port (usually 5173)
- Hot module replacement enabled via @vitejs/plugin-react
- Tailwind configured to scan all JSX/TSX files in src directory
