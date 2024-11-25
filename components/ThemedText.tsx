import { Text, type TextProps, StyleSheet, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useFont } from '@/provider/FontContext';

const {width, fontScale} = Dimensions.get('screen')

export const getFontSize = (size:number) => { return size / fontScale };

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  customColor?: string; // New prop for custom color
  type?: 'default' | 'xtitle' | 'title' | 'semititle' | 'defaultSemiBold' | 'subtitle' | 'link';
  size?: number;
  textAligned?: "auto" | "left" | "right" | "center" | "justify";
  font?: 
    | 'none' 
    | 'spaceMonoRegular' 
    | 'cocoGothicLight'
    | 'cocoGothicUltraLight'
    | 'cocoGothicRegular' 
    | 'cocoGothicBold' 
    | 'glacialIndifferenceRegular' 
    | 'glacialIndifferenceBold' 
    | 'glacialIndifferenceItalic'
    | 'itcNewBaskerville'
    | 'montserratRegular'
    | 'montserratExtraLight'
    | 'montserratLight'
    | 'montserratThin'
    | 'montserratMedium'
    | 'montserratBold'
    | 'montserratSemiBold'; // Font type // Completed font list with all
};

export function ThemedText({
  style,
  lightColor, 
  darkColor, 
  customColor, // Custom color override
  type = 'default',
  font = 'none',
  size = getFontSize(16),
  textAligned = 'auto',
  ...rest
}: ThemedTextProps) {
  const { fontsLoaded, fontStyles } = useFont();

  // Use custom color if provided, otherwise determine color based on theme
  const color = customColor || useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  // Determine font family based on the provided 'font' prop
  const fontFamily = font === 'none' ? 'system' : fontStyles[font];

  //console.log(width / 30)
  if (!fontsLoaded) {
    return null;
  }

  return (
    <Text
      style={[
        { color, fontFamily, fontSize: size, textAlign: textAligned },
        type === 'default' ? styles.default : undefined,
        type === 'xtitle' ? styles.xtitle : undefined,
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
    fontSize: getFontSize(16),
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '600',
  },
  xtitle: {
    fontSize: 38,
  },
  title: {
    fontSize: getFontSize(32),
    letterSpacing: 2
  },
  semititle: {
    fontSize: getFontSize(24), 
    letterSpacing: 2.5
  },
  subtitle: {
    fontSize: getFontSize(20),
  },
  link: {
    lineHeight: 30,
    fontSize: 14,
    fontWeight: '300',
    color: '#D4AF37', 
  },
});
