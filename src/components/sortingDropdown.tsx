import {DatabaseEntryKeys, DatabaseEntry} from "../types/databaseEntry";
import {SortOption} from "../types/SortOption";
import ThemeToggle from './ThemeToggle';
import styles from './SortingDropdown.module.css';
import {useState, useRef, useEffect, useMemo} from "react";
import {useSort} from '../contexts/SortContext';
import debounce from 'lodash.debounce';

interface NativeDropdownProps {
    label: string;
    items: readonly string[];
    onSelect: (item: string) => void;
    id: string;
}

const NativeDropdown = ({label, items, onSelect, id}: NativeDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setFocusedIndex(-1);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    useEffect(() => {
        if (isOpen && focusedIndex >= 0 && menuRef.current) {
            const items = menuRef.current.querySelectorAll('[role="menuitem"]');
            (items[focusedIndex] as HTMLElement)?.focus();
        }
    }, [focusedIndex, isOpen]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                setIsOpen(true);
                setFocusedIndex(0);
            }
            return;
        }

        switch (e.key) {
            case 'Escape':
                e.preventDefault();
                setIsOpen(false);
                setFocusedIndex(-1);
                buttonRef.current?.focus();
                break;
            case 'ArrowDown':
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % items.length);
                break;
            case 'ArrowUp':
                e.preventDefault();
                setFocusedIndex((prev) => (prev - 1 + items.length) % items.length);
                break;
            case 'Home':
                e.preventDefault();
                setFocusedIndex(0);
                break;
            case 'End':
                e.preventDefault();
                setFocusedIndex(items.length - 1);
                break;
        }
    };

    const handleItemClick = (item: string) => {
        onSelect(item);
        setIsOpen(false);
        setFocusedIndex(-1);
        buttonRef.current?.focus();
    };

    const handleItemKeyDown = (e: React.KeyboardEvent, item: string) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleItemClick(item);
        }
    };

    return (
        <div className={styles.dropdown} ref={dropdownRef}>
            <button
                ref={buttonRef}
                className={styles.dropdownToggle}
                onClick={() => setIsOpen(!isOpen)}
                onKeyDown={handleKeyDown}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={`${id}-menu`}
                id={id}
                type="button"
            >
                {label}
            </button>
            {isOpen && (
                // eslint-disable-next-line jsx-a11y/no-static-element-interactions
                <div
                    ref={menuRef}
                    className={styles.dropdownMenu}
                    aria-labelledby={id}
                    id={`${id}-menu`}
                    onKeyDown={handleKeyDown}
                >
                    {items.map((item, index) => (
                        <div
                            key={item}
                            className={styles.dropdownItem}
                            role="menuitem"
                            tabIndex={-1}
                            onClick={() => handleItemClick(item)}
                            onKeyDown={(e) => handleItemKeyDown(e, item)}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const SortingDropdown = () => {
    const { sortState, setSortState } = useSort();

    // Create debounced update function with 250ms delay
    const debouncedUpdate = useMemo(
        () => debounce((value: string) => {
            setSortState((prev) => ({
                ...prev,
                filterString: value.toLowerCase()
            }));
        }, 250),
        [setSortState]
    );

    // Clean up on unmount
    useEffect(() => {
        return () => {
            debouncedUpdate.cancel();
        };
    }, [debouncedUpdate]);

    return (
        <div className={styles.toolbar}>
            <div className={styles.controls}>
                <NativeDropdown
                    label={`Sort Key (${sortState.key})`}
                    items={DatabaseEntryKeys}
                    onSelect={(item) => setSortState((s: SortOption) => ({...s, key: item as keyof DatabaseEntry}))}
                    id="dropdown-sort-key"
                />

                <NativeDropdown
                    label={`Direction (${sortState.direction})`}
                    items={["ASC", "DESC"]}
                    onSelect={(item) => setSortState((s: SortOption) => ({...s, direction: item as "ASC" | "DESC"}))}
                    id="dropdown-sort-direction"
                />

                <ThemeToggle />
            </div>

            <div>
                <label htmlFor="search-input" className="sr-only">
                    Search cards by name, error, set code, or metadata
                </label>
                <input
                    id="search-input"
                    className={styles.search}
                    type="text"
                    placeholder="Search"
                    aria-describedby="search-help"
                    onChange={(e) => debouncedUpdate(e.target.value)}
                />
                <span id="search-help" className="sr-only">
                    Type to filter cards by any field
                </span>
            </div>
        </div>
    )
}

export default SortingDropdown;