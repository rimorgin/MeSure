import Checkbox from 'expo-checkbox';
import { StyleSheet } from 'react-native';
import { ThemedView } from './ThemedView';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { darkBrown, mustard } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useState } from 'react';

interface CheckBoxProps extends React.ComponentProps<typeof Checkbox> {
    lightColor?: string,
    darkColor?: string,
    checked: boolean;
    setChecked: (checked: boolean) => void;
}

export function ThemedCheckBox({ checked, setChecked, lightColor, darkColor, ...props }: CheckBoxProps) {
    const theme = useColorSchemeTheme();
    const [touched, setTouched] = useState(false);

    const handleTouched = () => { 
        setTouched(true);
        setTimeout(() => {
            setTouched(false);
        }, 1);
    };

    return (
        <ThemedView transparent style={styles.checkboxContainer}>
            <Checkbox
                value={checked}
                onValueChange={setChecked}
                color={checked ? theme === 'light' ? mustard : darkBrown : undefined}
                style={{
                    borderColor: useThemeColor({light: lightColor, dark: darkColor}, 'checkbox'),
                    borderWidth: touched ? 3 : 1,
                }}
                onTouchStart={handleTouched}
                hitSlop={{bottom: 40, top: 40, left: 40, right: 40}}
                {...props} // Spread optional props last
            />
        </ThemedView>
    );
}

const styles = StyleSheet.create({
    checkboxContainer: {
        flexDirection: 'row',
        alignSelf: 'center',
    },
});
