import { useState, useEffect, useRef } from 'react';

/**
 * Options for configuring the lazy image loading behavior
 */
interface UseLazyImageOptions {
    /** Margin around the viewport to start loading images (default: '200px') */
    rootMargin?: string;
    /** Percentage of image visibility required to trigger loading (default: 0.01) */
    threshold?: number;
}

/**
 * Custom hook for lazy loading images using Intersection Observer API.
 * Only loads images when they enter the viewport, improving initial page load performance.
 *
 * @param src - The image source URL to lazy load
 * @param options - Configuration options for the Intersection Observer
 * @returns Object containing the image state and ref to attach to img element
 *
 * @example
 * ```tsx
 * const { imageSrc, isLoading, isError, imgRef } = useLazyImage('/path/to/image.jpg', {
 *     rootMargin: '200px',
 *     threshold: 0.01
 * });
 *
 * return (
 *     <>
 *         {isLoading && <Skeleton />}
 *         {isError && <ErrorMessage />}
 *         <img ref={imgRef} src={imageSrc} alt="Description" />
 *     </>
 * );
 * ```
 */
export const useLazyImage = (
    src: string,
    options: UseLazyImageOptions = {}
) => {
    const { rootMargin = '200px', threshold = 0.01 } = options;
    const [imageSrc, setImageSrc] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const imgRef = useRef<HTMLImageElement>(null);

    useEffect(() => {
        if (!imgRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const img = new Image();
                        img.src = src;

                        img.onload = () => {
                            setImageSrc(src);
                            setIsLoading(false);
                        };

                        img.onerror = () => {
                            setIsError(true);
                            setIsLoading(false);
                        };

                        observer.disconnect();
                    }
                });
            },
            { rootMargin, threshold }
        );

        observer.observe(imgRef.current);

        return () => observer.disconnect();
    }, [src, rootMargin, threshold]);

    return { imageSrc, isLoading, isError, imgRef };
};
