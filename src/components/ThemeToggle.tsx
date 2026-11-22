import { useTheme } from '../contexts/ThemeContext';
import styles from './ThemeToggle.module.css';

const ThemeToggle = () => {
    const { theme, setTheme } = useTheme();

    const cycleTheme = () => {
        const themes: Array<'light' | 'dark' | 'system'> = ['light', 'dark', 'system'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const getIcon = () => {
        if (theme === 'light') return '☀️';
        if (theme === 'dark') return '🌙';
        return '💻'; // system
    };

    const getLabel = () => {
        if (theme === 'light') return 'Light mode';
        if (theme === 'dark') return 'Dark mode';
        return 'System theme';
    };

    return (
        <button
            onClick={cycleTheme}
            className={styles.toggle}
            aria-label={`Current: ${getLabel()}. Click to change theme`}
            title={getLabel()}
        >
            <span className={styles.icon}>{getIcon()}</span>
        </button>
    );
};

export default ThemeToggle;
