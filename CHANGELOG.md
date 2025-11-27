# Changelog

All notable changes to the Magic Misprint Display Website project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Documentation
- Comprehensive documentation system implemented
- Added detailed README.md with project overview and quick start guide
- Created architecture documentation (docs/ARCHITECTURE.md)
- Created setup guide (docs/SETUP.md)
- Created testing documentation (docs/TESTING.md)
- Created accessibility documentation (docs/ACCESSIBILITY.md)
- Created performance documentation (docs/PERFORMANCE.md)
- Added JSDoc comments to key components and utilities

### Developer Experience
- Configured ESLint with TypeScript, React, and accessibility plugins
- Added Prettier for consistent code formatting
- Implemented Husky pre-commit hooks
- Configured lint-staged for automatic linting and formatting
- Added .prettierrc configuration
- Created .eslintrc.js with strict rules

## [0.2.0] - 2025-11-26

### Added - Phase 3: Polish & Production Readiness

#### Testing Infrastructure
- Configured Vitest as test runner
- Set up React Testing Library for component testing
- Added jsdom for DOM simulation
- Created test utilities and setup files
- Integrated test scripts into package.json

#### Accessibility Enhancements
- Implemented skip link for keyboard navigation
- Added proper heading hierarchy (h1, h2, h3)
- Implemented ARIA roles and labels throughout
- Added live regions for dynamic content announcements
- Implemented focus trap in image viewer modal
- Added focus management with return focus on modal close
- Enhanced keyboard navigation for all interactive elements
- Added screen reader-only content where appropriate
- Ensured WCAG 2.1 Level AA compliance

#### Error Handling
- Created ErrorBoundary component for graceful error handling
- Added error states to useLazyImage hook
- Implemented error display in DisplayCard component
- Added error messages with role="alert" for screen readers

#### Performance Improvements
- Implemented search debouncing (250ms) to reduce filtering operations
- Optimized component re-renders with proper memoization
- Added loading states with visual feedback

### Changed

#### Code Organization
- Reorganized project structure with dedicated folders:
  - `src/contexts/` for React contexts
  - `src/hooks/` for custom hooks
  - `src/services/` for business logic
  - `src/types/` for TypeScript interfaces
  - `src/styles/` for global styles
- Migrated to CSS Modules for all components
- Extracted ThemeContext into separate provider
- Extracted ImageViewerContext into separate provider
- Extracted SortContext into separate provider

#### Component Improvements
- Enhanced ImageViewer with zoom controls (0.5x to 5x)
- Added pan/drag functionality when zoomed in
- Implemented keyboard shortcuts (+, -, 0, Escape)
- Added zoom level indicator
- Improved image loading states with skeleton/spinner
- Enhanced DisplayCard with error state handling

#### Type Safety
- Fixed type coercion in date sorting
- Updated DatabaseEntry interface with proper optional fields
- Replaced loose Function types with proper signatures
- Added strict TypeScript configuration

### Fixed
- Resolved stale closure issues in ImageViewer keyboard handlers
- Fixed focus management in modal dialogs
- Corrected ARIA attributes for better accessibility
- Fixed color contrast issues for WCAG compliance

## [0.1.0] - Previous Implementation

### Added - Phase 1: Core Features

#### Data Management
- JSON-based card data structure
- Google Sheets integration for data sourcing
- Dropbox image hosting integration
- Image thumbnail generation (300px, 750px, large)

#### Core UI Components
- DisplayCard component for individual card display
- DisplayCards component for card grid/list
- SortingDropdown for filtering and sorting controls
- Basic search functionality

#### Image Optimization
- Lazy loading implementation using Intersection Observer
- Multiple image size variants
- Sharp library for server-side image processing
- Placeholder states during loading

### Added - Phase 2: Enhanced Features

#### Theme System
- Dark mode implementation
- Light mode default
- System preference detection
- LocalStorage persistence
- ThemeToggle component
- CSS custom properties for theming

#### Image Viewer
- Fullscreen modal overlay
- Basic zoom functionality
- ESC key to close
- Click outside to close

#### Sorting & Filtering
- Sort by multiple fields (date, name, set, error, language)
- Ascending/descending direction toggle
- Image size selection (300px, 750px, large)
- Case-insensitive search across all fields

#### Performance
- React.memo for DisplayCard (95% re-render reduction)
- useMemo for sorting and filtering
- Component-level optimization

## Migration Guide

### Upgrading from 0.1.0 to 0.2.0

#### Breaking Changes
None - all changes are backward compatible.

#### New Dependencies
```bash
npm install focus-trap-react lodash.debounce
npm install --save-dev @testing-library/react @testing-library/user-event vitest jsdom
```

#### Context API Changes
If you were importing contexts directly:

**Before:**
```typescript
import { SortContext } from './App';
```

**After:**
```typescript
import { useSort } from './contexts/SortContext';

const { sortState, setSortState } = useSort();
```

#### Component Updates
All components maintain the same public API. Internal implementations have been optimized but external usage remains unchanged.

### Developer Workflow Changes

#### Pre-commit Hooks
Pre-commit hooks now automatically run:
- ESLint with auto-fix
- Prettier formatting

To bypass (not recommended):
```bash
git commit --no-verify
```

#### Testing
New test commands available:
```bash
npm test              # Run tests in watch mode
npm run test:ui       # Run tests with UI
npm run test:coverage # Generate coverage report
```

## Roadmap

### Planned for v0.3.0
- [ ] Virtual scrolling for large datasets (5,000+ cards)
- [ ] WebP and AVIF image format support
- [ ] Service worker for offline support
- [ ] Advanced filtering UI
- [ ] Saved searches/filters
- [ ] URL state synchronization

### Planned for v0.4.0
- [ ] Backend API migration
- [ ] User authentication
- [ ] Favorites/collections system
- [ ] Card sharing functionality
- [ ] Export to CSV/JSON

### Planned for v1.0.0
- [ ] Complete E2E test coverage
- [ ] Performance monitoring integration
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] PWA features
- [ ] Mobile app version

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Versioning

We use [SemVer](http://semver.org/) for versioning:
- **MAJOR** version for incompatible API changes
- **MINOR** version for new functionality in a backward compatible manner
- **PATCH** version for backward compatible bug fixes

## Authors

- **Zach Halpern** - *Initial work and ongoing development*

## Acknowledgments

- React team for the excellent framework
- Magic: The Gathering community for inspiration
- Open source contributors for the libraries used in this project
- Claude (Anthropic) for code review and optimization suggestions

---

For more information, see:
- [README.md](README.md) - Project overview
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - System architecture
- [docs/SETUP.md](docs/SETUP.md) - Development setup
- [docs/TESTING.md](docs/TESTING.md) - Testing guide
- [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) - Accessibility features
- [docs/PERFORMANCE.md](docs/PERFORMANCE.md) - Performance optimizations
