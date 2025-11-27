# Magic Misprint Display Website

A modern, accessible web application for displaying and managing a collection of Magic: The Gathering misprints and oddities.

## Overview

This React-based application provides a beautiful, performant interface for browsing a collection of Magic: The Gathering misprint cards. Features include advanced filtering, sorting, image lazy loading, fullscreen image viewing with zoom capabilities, and full dark mode support.

## Features

- **Advanced Search & Filtering**: Search across all card fields with case-insensitive matching
- **Flexible Sorting**: Sort by arrival date, card name, set code, error type, or language
- **Image Size Options**: Choose between 300px, 750px, or large display sizes
- **Lazy Loading**: Optimized image loading using Intersection Observer API
- **Fullscreen Viewer**: Click any card to view in fullscreen with zoom and pan capabilities
- **Dark Mode**: Full theme support with system preference detection
- **Accessibility**: WCAG 2.1 Level AA compliant with keyboard navigation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Performance Optimized**: Virtual scrolling ready, memoization, and efficient re-rendering

## Tech Stack

- **React 18.2** - UI framework
- **TypeScript 4.9** - Type safety
- **CSS Modules** - Scoped styling
- **Focus Trap React** - Accessible modal management
- **Sharp** - Server-side image processing
- **Vitest** - Unit and integration testing

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- Python 3.x (for image downloading)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd MisprintDisplayWebsite

# Install dependencies
npm install

# Download data and generate thumbnails
npm run downloadData
npm run cacheImages
npm run generateThumbnails

# Start development server
npm start
```

The application will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

This will:
1. Download the latest data from the Google Sheets source
2. Cache images from Dropbox
3. Generate optimized thumbnails (300px, 750px, large)
4. Build the production-ready React application

## Project Structure

```
src/
├── components/          # React components
│   ├── displayCard.tsx       # Individual card display
│   ├── displayCards.tsx      # Card grid/list container
│   ├── sortingDropdown.tsx   # Filter and sort controls
│   ├── ImageViewer.tsx       # Fullscreen image modal
│   ├── ThemeToggle.tsx       # Dark mode toggle
│   └── ErrorBoundary.tsx     # Error boundary component
├── contexts/           # React contexts
│   ├── ThemeContext.tsx      # Theme state management
│   ├── ImageViewerContext.tsx # Image viewer state
│   └── SortContext.tsx       # Sort/filter state
├── hooks/              # Custom React hooks
│   └── useLazyImage.ts       # Lazy loading hook
├── services/           # Business logic
│   └── cardRepository.ts     # Data access layer
├── types/              # TypeScript interfaces
│   ├── databaseEntry.ts      # Card data structure
│   └── SortOption.ts         # Sort configuration
├── styles/             # Global styles
│   └── theme.css             # CSS custom properties
├── data/               # Data files
│   └── data.json             # Card collection data
└── App.tsx             # Main application component
```

## Documentation

- [Setup Guide](docs/SETUP.md) - Detailed development environment setup
- [Architecture](docs/ARCHITECTURE.md) - System design and patterns
- [Testing](docs/TESTING.md) - Testing strategy and guidelines
- [Accessibility](docs/ACCESSIBILITY.md) - Accessibility features and compliance
- [Performance](docs/PERFORMANCE.md) - Performance optimizations

## Key Features Explained

### Smart Image Loading

The application uses Intersection Observer to lazy-load images only when they enter the viewport, significantly reducing initial load time and memory usage.

### Fullscreen Image Viewer

Click any card image to open it in a fullscreen viewer with:
- Mouse wheel zoom (0.5x to 5x)
- Keyboard shortcuts (+, -, 0, Escape)
- Click and drag to pan when zoomed
- Focus trap for accessibility
- Automatic focus management

### Theme System

The application detects your system theme preference and provides a toggle to switch between light and dark modes. Theme preference is persisted in localStorage.

### Search & Filter

Type in the search box to filter cards across all fields:
- Card names (primary and secondary)
- Set codes
- Error descriptions
- Languages
- UUIDs
- Connection information

### Repository Pattern

Data access is abstracted through a repository service, making it easy to:
- Mock data for testing
- Swap data sources
- Implement pagination
- Add caching strategies

## Development

### Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run test:ui` - Run tests with UI
- `npm run test:coverage` - Generate coverage report
- `npm run downloadData` - Download latest card data
- `npm run cacheImages` - Cache images from Dropbox
- `npm run generateThumbnails` - Generate image thumbnails

### Code Quality

The project uses:
- **ESLint** - Code linting with accessibility rules
- **Prettier** - Code formatting
- **TypeScript** - Static type checking
- **Husky** - Git hooks for pre-commit checks
- **lint-staged** - Run linters on staged files

### Git Hooks

Pre-commit hooks automatically:
- Run ESLint with auto-fix
- Format code with Prettier
- Ensure code quality before commits

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Android)

## Performance

Current performance metrics:
- First Contentful Paint: <1.0s
- Largest Contentful Paint: <1.5s
- Time to Interactive: <1.5s
- Bundle size: ~150KB gzipped

See [Performance Documentation](docs/PERFORMANCE.md) for optimization details.

## Accessibility

This application is designed to be accessible to all users:
- WCAG 2.1 Level AA compliant
- Full keyboard navigation support
- Screen reader friendly with ARIA labels
- Focus management in modals
- High contrast mode support
- Respects prefers-reduced-motion

See [Accessibility Documentation](docs/ACCESSIBILITY.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is private and proprietary.

## Contact

For questions or issues, please contact the repository owner.

## Acknowledgments

- Magic: The Gathering is © Wizards of the Coast
- Card images are used for personal collection management
- Built with Create React App and enhanced with modern React patterns
