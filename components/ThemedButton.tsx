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
import { TouchableOpacity, TouchableHighlight, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';
import { useFont } from '@/provider/FontContext';

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
  disabled?: boolean;
}

const ThemedTouchableFilled: React.FC<ButtonProps> = ({ 
  onPress, 
  children, 
  variant = 'highlight', 
  customColor, 
  type = 'default', 
  font = 'none',
  disabled = false,
  style,
  ...rest
}) => {
  // Get theme colors for background and text
  const buttonBackgroundColor = useThemeColor({ light: Colors.light.button, dark: Colors.dark.button }, 'button');
  const buttonTextColor = customColor || useThemeColor({ light: Colors.dark.text, dark: Colors.light.text }, 'text');

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
      activeOpacity={0.5}
      disabled={disabled}
      {...rest}
    >
        {children}
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
  disabled = false,
  ...rest 
}) => {
  // Explicitly select the Touchable component (TouchableHighlight or TouchableOpacity)
  const ButtonComponent: React.ElementType = variant === 'highlight' ? TouchableHighlight : TouchableOpacity;

  const { fontsLoaded, fontStyles } = useFont();
  
  if (!fontsLoaded) {
    return null;
  }

  const fontFamily = font === 'none' ? 'system' : fontStyles[font];

  return (
    <ButtonComponent 
      style={[styles.buttonPlain, style]} 
      onPress={onPress}
      underlayColor="#301713" // Only for TouchableHighlight
      activeOpacity={0.5} //only for TouchableOpacity
      disabled={disabled}
      {...rest}
    >
        {children}
    </ButtonComponent>
  );
};

// Styles
const styles = StyleSheet.create({
  buttonFilled: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonPlain: {
    alignItems: 'center',
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

