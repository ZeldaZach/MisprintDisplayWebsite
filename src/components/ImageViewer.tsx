import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import FocusTrap from 'focus-trap-react';
import { useImageViewer } from '../contexts/ImageViewerContext';
import styles from './ImageViewer.module.css';

/**
 * Fullscreen image viewer modal with zoom and pan capabilities.
 *
 * Features:
 * - Fullscreen overlay with backdrop
 * - Zoom in/out (0.5x to 5x) with mouse wheel or buttons
 * - Pan/drag when zoomed in
 * - Keyboard shortcuts (+, -, 0, Escape)
 * - Focus trap for accessibility
 * - Automatic focus management
 * - Prevents body scrolling when open
 *
 * Keyboard Shortcuts:
 * - `+` or `=`: Zoom in
 * - `-` or `_`: Zoom out
 * - `0`: Reset zoom
 * - `Escape`: Close viewer
 *
 * Accessibility:
 * - ARIA dialog role
 * - Focus trapped within modal
 * - Returns focus to trigger element on close
 * - Screen reader announcements
 *
 * @returns React portal rendering the fullscreen viewer
 *
 * @example
 * ```tsx
 * const { openViewer } = useImageViewer();
 *
 * <button onClick={() => openViewer('image.jpg', 'Card Name')}>
 *     View Fullscreen
 * </button>
 * <ImageViewer />
 * ```
 */
const ImageViewer = () => {
    const { state, closeViewer } = useImageViewer();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const closeButtonRef = useRef<HTMLButtonElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);

    // Reset zoom and position when image changes
    useEffect(() => {
        if (state.isOpen) {
            setIsImageLoaded(false);
            setZoom(1);
            setPosition({ x: 0, y: 0 });
            document.body.style.overflow = 'hidden';

            // Save the previously focused element
            previousFocusRef.current = document.activeElement as HTMLElement;

            // Move focus to close button
            setTimeout(() => {
                closeButtonRef.current?.focus();
            }, 0);

            const handleKeyDown = (e: KeyboardEvent) => {
                if (e.key === 'Escape') {
                    closeViewer();
                } else if (e.key === '+' || e.key === '=') {
                    handleZoomIn();
                } else if (e.key === '-' || e.key === '_') {
                    handleZoomOut();
                } else if (e.key === '0') {
                    handleResetZoom();
                }
            };

            document.addEventListener('keydown', handleKeyDown);

            return () => {
                document.removeEventListener('keydown', handleKeyDown);
                document.body.style.overflow = '';
            };
        } else if (previousFocusRef.current) {
            // Return focus to the previously focused element when modal closes
            previousFocusRef.current.focus();
        }
    }, [state.isOpen, closeViewer]);

    // Zoom functions
    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 5));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 0.5));
    const handleResetZoom = () => {
        setZoom(1);
        setPosition({ x: 0, y: 0 });
    };

    // Mouse wheel zoom
    const handleWheel = (e: React.WheelEvent) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.1 : 0.1;
        setZoom(prev => Math.max(0.5, Math.min(5, prev + delta)));
    };

    // Pan functionality
    const handleMouseDown = (e: React.MouseEvent) => {
        if (zoom > 1) {
            setIsDragging(true);
            setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && zoom > 1) {
            setPosition({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    if (!state.isOpen || !state.imageSrc) return null;

    return createPortal(
        <FocusTrap
            focusTrapOptions={{
                escapeDeactivates: false,
                clickOutsideDeactivates: false
            }}
        >
            <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="viewer-title" aria-describedby="viewer-desc">
                <h2 id="viewer-title" className="sr-only">
                    {state.cardName}
                </h2>
                <p id="viewer-desc" className="sr-only">
                    Fullscreen image viewer. Use zoom controls or mouse wheel to zoom. Press Escape to close.
                </p>
                <button
                    ref={closeButtonRef}
                    className={styles.closeButton}
                    onClick={closeViewer}
                    aria-label="Close fullscreen viewer"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                {/* Zoom Controls */}
                <div className={styles.zoomControls}>
                <button
                    className={styles.zoomButton}
                    onClick={(e) => { e.stopPropagation(); handleZoomIn(); }}
                    aria-label="Zoom in"
                    title="Zoom in (+)"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8" strokeWidth={2} />
                        <path d="m21 21-4.35-4.35M11 8v6M8 11h6" strokeLinecap="round" strokeWidth={2} />
                    </svg>
                </button>
                <button
                    className={styles.zoomButton}
                    onClick={(e) => { e.stopPropagation(); handleZoomOut(); }}
                    aria-label="Zoom out"
                    title="Zoom out (-)"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <circle cx="11" cy="11" r="8" strokeWidth={2} />
                        <path d="m21 21-4.35-4.35M8 11h6" strokeLinecap="round" strokeWidth={2} />
                    </svg>
                </button>
                <button
                    className={styles.zoomButton}
                    onClick={(e) => { e.stopPropagation(); handleResetZoom(); }}
                    aria-label="Reset zoom"
                    title="Reset zoom (0)"
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" strokeWidth={2} strokeLinecap="round" />
                        <path d="M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" strokeWidth={2} strokeLinecap="round" />
                        <path d="M3 16h5v5" strokeWidth={2} strokeLinecap="round" />
                    </svg>
                </button>
                <div className={styles.zoomLevel}>{Math.round(zoom * 100)}%</div>
            </div>

            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <div
                ref={containerRef}
                className={styles.imageContainer}
                onClick={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
                onWheel={handleWheel}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                style={{ cursor: zoom > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
                {!isImageLoaded && (
                    <div className={styles.loader}>
                        <div className={styles.spinner} />
                    </div>
                )}
                <img
                    ref={imageRef}
                    src={state.imageSrc}
                    alt={state.cardName || 'Card image'}
                    className={styles.image}
                    onLoad={() => setIsImageLoaded(true)}
                    style={{
                        opacity: isImageLoaded ? 1 : 0,
                        transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                    draggable={false}
                />
            </div>
        </div>
        </FocusTrap>,
        document.body
    );
};

export default ImageViewer;
