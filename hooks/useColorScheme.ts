import { useColorSchemeStore } from '@/state/appStore';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

export { useColorScheme } from 'react-native';

export default function useColorSchemeTheme(){
    const systemTheme = useColorScheme() ?? 'light';
    const { theme, toggleTheme } = useColorSchemeStore();

    // Update the store theme based on the system theme, if it’s not already set
    useEffect(() => {
        if (!theme) {
            toggleTheme(systemTheme);
        }
    }, [systemTheme, theme, toggleTheme]);

    return theme;
}
