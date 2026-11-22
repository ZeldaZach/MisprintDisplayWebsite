/**
 * Utility functions for image path handling
 */

/**
 * Converts a Dropbox URL to a local image path.
 * Uses the same slugification logic as the Python download script.
 *
 * @param url - The Dropbox URL from the data.json file
 * @param size - The desired image size (300px, 750px, or large)
 * @returns Local path to the image file
 *
 * @example
 * ```ts
 * const url = "https://www.dropbox.com/s/abc123/image.jpeg?dl=1";
 * const path = getLocalImagePath(url, "750px");
 * // Returns: "resources/images-750px/https-www-dropbox-com-s-abc123-image-jpeg-dl-1.jpeg"
 * ```
 */
export function getLocalImagePath(url: string, size: '300px' | '750px' | 'large'): string {
    // Extract the file extension first
    const urlParts = url.split('.');
    const extension = urlParts[urlParts.length - 1].split('?')[0]; // Get extension before query params

    const urlNoHeader = url.split('/');

    // Slugify the URL (convert to lowercase, replace all special chars with hyphens)
    // This matches Python's slugify library behavior
    const slugified = urlNoHeader[urlNoHeader.length - 1]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')  // Replace ALL non-alphanumeric with hyphens (including dots)
        .replace(/^-+|-+$/g, '');      // Remove leading/trailing hyphens

    const [beginning, ...middle] = slugified.split("-");
    const last = middle.pop();

    return `resources/images-${size}/${beginning}-${middle.join('-')}.${last}`;
}

/**
 * Gets WebP version of an image path
 *
 * @param path - The original image path
 * @returns Path with .webp extension
 */
export function getWebPPath(path: string): string {
    return path.replace(/\.(jpg|jpeg|png)$/i, '.webp');
}
