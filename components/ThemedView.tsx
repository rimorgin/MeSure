import { View, type ViewProps } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  transparent?: boolean; // New prop for transparent background
};

export function ThemedView({ style, lightColor, darkColor, transparent = false, ...otherProps }: ThemedViewProps) {
  // If transparent is true, use 'transparent' as the background color
  const backgroundColor = transparent 
    ? 'transparent' 
    : useThemeColor({ light: lightColor, dark: darkColor }, 'background');

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
