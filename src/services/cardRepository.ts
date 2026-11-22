import { DatabaseEntry } from '../types/databaseEntry';

/**
 * Repository class for managing card data access.
 * Implements the Repository Pattern to abstract data access from components.
 * Data is loaded once and cached for subsequent requests.
 *
 * @example
 * ```typescript
 * // Get all cards
 * const cards = await cardRepository.getAll();
 *
 * // Get filtered cards
 * const filtered = await cardRepository.getFiltered('lightning bolt');
 * ```
 */
class CardRepository {
    /** Cached card data to avoid re-loading from JSON */
    private data: DatabaseEntry[] | null = null;

    /**
     * Loads card data from JSON file.
     * Data is cached after first load to improve performance.
     *
     * @returns Promise resolving to array of database entries
     * @private
     */
    async loadData(): Promise<DatabaseEntry[]> {
        if (this.data) return this.data;
        const module = await import('../data/data.json');
        this.data = module.default;
        return this.data;
    }

    /**
     * Retrieves all card entries from the data source.
     *
     * @returns Promise resolving to all database entries
     */
    async getAll(): Promise<DatabaseEntry[]> {
        return this.loadData();
    }

    /**
     * Filters card entries based on a search term.
     * Searches across all fields in the database entry.
     *
     * @param filter - Case-insensitive search term to filter cards
     * @returns Promise resolving to filtered array of database entries
     *
     * @example
     * ```typescript
     * // Search for cards with "miscut" in any field
     * const miscutCards = await cardRepository.getFiltered('miscut');
     * ```
     */
    async getFiltered(filter: string): Promise<DatabaseEntry[]> {
        const data = await this.loadData();
        if (!filter) return data;

        return data.filter(entry =>
            Object.values(entry).some(value =>
                value?.toLowerCase().includes(filter.toLowerCase())
            )
        );
    }
}

/**
 * Singleton instance of CardRepository.
 * Use this instance throughout the application for consistent data access.
 */
export const cardRepository = new CardRepository();
