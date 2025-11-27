import { createContext, useContext, useState, useMemo, Dispatch, SetStateAction, ReactNode } from 'react';
import { SortOption } from '../types/SortOption';

/** Default sort configuration */
const defaultStart: SortOption = {
    key: "ArrivalDate",
    direction: "DESC",
    maxImageWidth: "300px"
};

/**
 * Context value containing sort state and setter
 */
interface SortContextValue {
    /** Current sort/filter configuration */
    sortState: SortOption;
    /** Function to update sort state */
    setSortState: Dispatch<SetStateAction<SortOption>>;
}

/** React context for sharing sort state across components */
const SortContext = createContext<SortContextValue | undefined>(undefined);

/**
 * Props for SortProvider component
 */
interface SortProviderProps {
    /** Child components that can access sort context */
    children: ReactNode;
}

/**
 * Provider component for sort/filter state management.
 * Wraps the application to provide access to sort state throughout the component tree.
 *
 * @param props - Provider props
 * @returns Provider component
 *
 * @example
 * ```tsx
 * <SortProvider>
 *     <App />
 * </SortProvider>
 * ```
 */
export const SortProvider = ({ children }: SortProviderProps) => {
    const [sortState, setSortState] = useState<SortOption>(defaultStart);
    const value = useMemo(() => ({ sortState, setSortState }), [sortState]);
    return <SortContext.Provider value={value}>{children}</SortContext.Provider>;
};

/**
 * Custom hook to access sort context.
 * Must be used within a SortProvider.
 *
 * @returns Sort context value containing state and setter
 * @throws Error if used outside SortProvider
 *
 * @example
 * ```tsx
 * const { sortState, setSortState } = useSort();
 *
 * const handleSortChange = (key: string) => {
 *     setSortState(prev => ({ ...prev, key }));
 * };
 * ```
 */
export const useSort = () => {
    const context = useContext(SortContext);
    if (!context) {
        throw new Error('useSort must be used within SortProvider');
    }
    return context;
};
