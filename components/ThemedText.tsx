import { Text, type TextProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFont } from '@/provider/FontContext'; // Import FontContext

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'semititle' | 'defaultSemiBold' | 'subtitle' | 'link';
  font?: 
    | 'none' 
    | 'spaceMonoRegular' 
    | 'cocoGothicRegular' 
    | 'cocoGothicBold' 
    | 'glacialIndifferenceRegular' 
    | 'glacialIndifferenceBold' 
    | 'glacialIndifferenceItalic'; // Options for each font style
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  font = 'none', // Default font is 'none' (system font)
  ...rest
}: ThemedTextProps) {
  // Access font context and loading state
  const { fontsLoaded, fontStyles } = useFont();

  // If fonts are not loaded, return nothing or a loading spinner
  if (!fontsLoaded) {
    return null; // You can replace this with a loading spinner if needed
  }

  // Determine the fontFamily based on the 'font' prop
  const fontFamily = font === 'none' ? 'system' : fontStyles[font];
  //console.log(fontFamily)

  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <Text
      style={[
        { color, fontFamily }, // Apply the font family from context
        type === 'default' ? styles.default : undefined,
        type === 'title' ? styles.title : undefined,
        type === 'semititle' ? styles.semititle : undefined,
        type === 'defaultSemiBold' ? styles.defaultSemiBold : undefined,
        type === 'subtitle' ? styles.subtitle : undefined,
        type === 'link' ? styles.link : undefined,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 32,
  },
  semititle: {
    fontSize: 24, 
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
    fontWeight: 'thin',
    color: '#D4AF37',
  },
});
