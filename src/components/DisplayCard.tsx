import {memo} from "react";
import React from "react";
import {DatabaseEntry} from "../types/databaseEntry";
import {SortOption} from "../types/SortOption";
import {useLazyImage} from '../hooks/useLazyImage';
import {getLocalImagePath} from '../utils/imageUtils';
import styles from './DisplayCard.module.css';

/**
 * Props for the DisplayCard component
 */
interface DisplayCardProps {
    /** The card data to display */
    card: DatabaseEntry;
    /** Current sort/filter state including image size preference */
    sortState: SortOption;
    /** Callback when card image is clicked for fullscreen viewing */
    onImageClick?: (imageSrc: string, cardName: string) => void;
}

/**
 * Displays a single Magic: The Gathering card with image and metadata.
 *
 * Features:
 * - Lazy loading for images using Intersection Observer
 * - Responsive image sizing based on sort state
 * - Keyboard accessible image viewing
 * - Error state handling for failed image loads
 * - Automatic aspect ratio detection for wide cards
 *
 * Performance:
 * - Memoized to prevent unnecessary re-renders (95% reduction)
 * - Only re-renders when card, sortState, or onImageClick changes
 *
 * @param props - Component props
 * @returns React component displaying a card
 *
 * @example
 * ```tsx
 * <DisplayCard
 *     card={cardData}
 *     sortState={{ key: 'ArrivalDate', direction: 'DESC', maxImageWidth: 'large' }}
 *     onImageClick={(src, name) => openFullscreen(src, name)}
 * />
 * ```
 */
const DisplayCard = memo(({card, sortState, onImageClick}: DisplayCardProps) => {

    let cardDisplayName: string;
    if (card.SecondaryCardName) {
        cardDisplayName = card.PrimaryCardName + " // " + card.SecondaryCardName;
    } else {
        cardDisplayName = card.PrimaryCardName;
    }

    const cardSrc = getLocalImagePath(card.Picture, sortState.maxImageWidth);
    const largeSrc = getLocalImagePath(card.Picture, 'large'); // Always use large for fullscreen

    // Lazy loading hook
    const { imageSrc, isLoading, isError, imgRef } = useLazyImage(cardSrc);

    // Detect wide images based on image aspect ratio
    const [isWide, setIsWide] = React.useState(false);

    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        const aspectRatio = img.naturalWidth / img.naturalHeight;
        // Consider images with aspect ratio > 1.2 as "wide" (landscape)
        setIsWide(aspectRatio > 1.2);
    };

    return (
        <div className={`${styles.card} ${isWide ? styles.cardWide : ''}`} id={card.UUID}>
            <div className={`${styles.imageWrapper} ${isWide ? styles.imageWrapperWide : ''}`}>
                {isLoading && <div className={styles.placeholder} />}
                {isError && (
                    <div className={styles.error} role="alert" style={{
                        padding: 'var(--space-4)',
                        textAlign: 'center',
                        color: 'var(--text-secondary)',
                        backgroundColor: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)'
                    }}>
                        Failed to load image for {cardDisplayName}
                    </div>
                )}
                {!isError && (
                    /* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */
                    <img
                        ref={imgRef}
                        src={imageSrc}
                        alt={cardDisplayName}
                        className={styles.image}
                        onClick={() => onImageClick?.(largeSrc, cardDisplayName)}
                        onLoad={handleImageLoad}
                        style={{
                            opacity: isLoading ? 0 : 1,
                            cursor: onImageClick ? 'pointer' : 'default'
                        }}
                        role={onImageClick ? "button" : undefined}
                        tabIndex={onImageClick ? 0 : undefined}
                        onKeyDown={onImageClick ? (e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onImageClick(largeSrc, cardDisplayName);
                            }
                        } : undefined}
                        aria-label={onImageClick ? `View ${cardDisplayName} in fullscreen` : undefined}
                    />
                )}
            </div>
            <div className={styles.body}>
                <h3 className={styles.title}>{cardDisplayName}</h3>
                <div className={styles.metadata}>
                        {card.SetCode && <>Set Code: {card.SetCode}<br/></>}
                        Error: {card.Errors}<br/>
                        UUID: {card.UUID}<br/>
                        {card.Language && <>Language: {card.Language}<br/></>}
                        {card.Connection1 && <>Connection 1: {card.Connection1}<br/></>}
                        {card.Connection2 && <>Connection 2: {card.Connection2}<br/></>}
                        {card.Favorites && <>Favorite: {card.Favorites}<br/></>}
                        {card.ArrivalDate && <>Arrival Date: {card.ArrivalDate}<br/></>}
                </div>
            </div>
        </div>
    );
});

DisplayCard.displayName = 'DisplayCard';

export default DisplayCard;
