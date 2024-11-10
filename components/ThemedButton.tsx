/* 
SAMPLE USE
<ThemedTouchableFilled 
  onPress={handlePress}
  variant="highlight"
  customColor="#ff6347" // Custom text color (e.g., Tomato)
  type="title" // Use title text style
  font="cocoGothicBold" // Use custom font
>
  Get Started
</ThemedTouchableFilled>
*/

import React, { ReactNode } from 'react';
import { Text, TouchableOpacity, TouchableHighlight, StyleSheet, ViewStyle, TextStyle, StyleProp } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useFont } from '@/provider/FontContext';
import { ThemedText } from './ThemedText';

interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
  variant?: 'opacity' | 'highlight'; // To switch between TouchableOpacity and TouchableHighlight
  customColor?: string; // Custom color override
  type?: 'default' | 'xtitle' | 'title' | 'semititle' | 'defaultSemiBold' | 'subtitle' | 'link'; // Text type for styling
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
    | 'montserratSemiBold'; // Font type
  style?: StyleProp<ViewStyle>;
}

const ThemedTouchableFilled: React.FC<ButtonProps> = ({ 
  onPress, 
  children, 
  variant = 'highlight', 
  customColor, 
  type = 'default', 
  font = 'none',
  style,
  ...rest
}) => {
  // Get theme colors for background and text
  const buttonBackgroundColor = useThemeColor({ light: Colors.light.button, dark: Colors.dark.button }, 'button');
  const buttonTextColor = customColor || useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, 'text');

  // Explicitly select the Touchable component (TouchableHighlight or TouchableOpacity)
  const ButtonComponent: React.ElementType = variant === 'highlight' ? TouchableHighlight : TouchableOpacity;

  const { fontsLoaded, fontStyles } = useFont();
  
  if (!fontsLoaded) {
    return null;
  }

  const fontFamily = font === 'none' ? 'system' : fontStyles[font];

  return (
    <ButtonComponent 
      style={[styles.buttonFilled, { backgroundColor: buttonBackgroundColor }, style ]} 
      onPress={onPress}
      underlayColor="#301713" // Only for TouchableHighlight
      {...rest}
    >
      <ThemedText style={[styles.buttonText, { color: buttonTextColor, fontFamily }, type === 'default' ? styles.default : undefined]}>
        {children}
      </ThemedText>
    </ButtonComponent>
  );
};

const ThemedTouchablePlain: React.FC<ButtonProps> = ({ 
  onPress, 
  children, 
  variant = 'highlight', 
  customColor, 
  type = 'default', 
  font = 'none',
  style,
  ...rest 
}) => {
  // Get theme colors for background and text. Transparent for PLAIN
  const buttonBackgroundColor = useThemeColor({ light: '#00FFFFFF', dark: '#00FFFFFF' }, 'background');
  const buttonTextColor = customColor || useThemeColor({ light: Colors.light.text, dark: Colors.dark.text }, 'text');

  // Explicitly select the Touchable component (TouchableHighlight or TouchableOpacity)
  const ButtonComponent: React.ElementType = variant === 'highlight' ? TouchableHighlight : TouchableOpacity;

  const { fontsLoaded, fontStyles } = useFont();
  
  if (!fontsLoaded) {
    return null;
  }

  const fontFamily = font === 'none' ? 'system' : fontStyles[font];

  return (
    <ButtonComponent 
      style={[styles.buttonPlain, { backgroundColor: buttonBackgroundColor }, style]} 
      onPress={onPress}
      underlayColor="#301713" // Only for TouchableHighlight
      {...rest}
    >
      <ThemedText style={[styles.buttonText, { color: buttonTextColor, fontFamily }, type === 'default' ? styles.default : undefined]}>
        {children}
      </ThemedText>
    </ButtonComponent>
  );
};

// Styles
const styles = StyleSheet.create({
  buttonFilled: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '70%',
  },
  buttonPlain: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
    width: '70%',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
});

export { ThemedTouchableFilled, ThemedTouchablePlain };

