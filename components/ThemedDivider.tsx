import React from 'react';
import { View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Colors } from '@/constants/Colors';

interface DividerProps {
  width?: number;
  orientation?: 'horizontal' | 'vertical';
  color?: { light?: string; dark?: string };
  marginX?: number;
  marginY?: number;
  dividerStyle?: any;
}

const ThemedDivider: React.FC<DividerProps> = ({
  width = 1,
  orientation = 'horizontal',
  color,
  marginX = 1,
  marginY = 1,
  dividerStyle,
}) => {
  const themeColor = useThemeColor({ light: Colors.light.divider, dark: Colors.dark.divider }, 'divider');

  const dividerStyles = [
    { 
      width: orientation === 'horizontal' ? '100%' : width,
      height: orientation === 'vertical' ? '100%' : width,
      backgroundColor: themeColor,
      marginHorizontal: marginX ? marginX : 0,
      marginVertical: marginY ? marginY : 0,
    },
    dividerStyle,
  ];

  return <View style={dividerStyles} />;
};

export default ThemedDivider;
