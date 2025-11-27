import './styles/design-system.css';
import './styles/utilities.css';
import SortingDropdown from "./components/SortingDropdown";
import DisplayCards from "./components/DisplayCards";
import ImageViewer from "./components/ImageViewer";
import {ThemeProvider} from './contexts/ThemeContext';
import {ImageViewerProvider} from './contexts/ImageViewerContext';
import {SortProvider} from './contexts/SortContext';

function App() {
    return (
        <ThemeProvider>
            <ImageViewerProvider>
                <SortProvider>
                    <a href="#main-content" className="sr-only" style={{
                        position: 'fixed',
                        top: '1rem',
                        left: '1rem',
                        zIndex: 10000,
                        padding: '1rem',
                        background: 'var(--bg-primary)',
                        border: '2px solid var(--primary)',
                        borderRadius: 'var(--radius-md)',
                        textDecoration: 'none',
                        color: 'var(--text-primary)',
                        fontWeight: 'var(--font-semibold)'
                    }} onFocus={(e) => e.currentTarget.classList.remove('sr-only')} onBlur={(e) => e.currentTarget.classList.add('sr-only')}>
                        Skip to main content
                    </a>
                    <div className="container">
                        <h1 style={{
                            fontSize: 'var(--text-3xl)',
                            fontWeight: 'var(--font-bold)',
                            marginBottom: 'var(--space-6)',
                            color: 'var(--text-primary)'
                        }}>Zach's Magic Misprint Collection</h1>

                        <section aria-labelledby="filters-heading">
                            <h2 id="filters-heading" className="sr-only">
                                Filter and Sort Controls
                            </h2>
                            <SortingDropdown />
                        </section>

                        <main id="main-content">
                            <section aria-labelledby="cards-heading">
                                <h2 id="cards-heading" className="sr-only">
                                    Card Gallery
                                </h2>
                                <DisplayCards />
                            </section>
                        </main>
                    </div>
                    <ImageViewer />
                </SortProvider>
            </ImageViewerProvider>
        </ThemeProvider>
    );
}

export default App;
