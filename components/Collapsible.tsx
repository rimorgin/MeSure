import React, { PropsWithChildren, useState, useEffect, useRef } from 'react';
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
import useColorSchemeTheme from '@/hooks/useColorScheme';

type IoniconName = 
  | 'search' | 'repeat' | 'link' | 'at' | 'push' | 'map' | 'filter' | 'key' | 'scale' | 'image' 
  | 'text' | 'alert' | 'checkbox' | 'menu' | 'radio' | 'timer' | 'close' | 'book' | 'pause' | 'resize' | 'hand-right'
  | 'chevron-forward-outline';

interface CollapsibleProps {
  title: string;
  transparent?: boolean;
  icon?: IoniconName;
  height?: number | 'auto';
  dropdownIconPlacement?: 'left' | 'right';
}

export function Collapsible({
  children,
  icon,
  title,
  height = 100,
  transparent = false,
  dropdownIconPlacement = 'right',
}: PropsWithChildren<CollapsibleProps>) {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0); // To store measured height
  const theme = useColorSchemeTheme() ?? 'light';

  // Animated value for rotation and height
  const rotationAnim = useRef(new Animated.Value(0)).current;
  const heightAnim = useRef(new Animated.Value(0)).current;

  // Measure the height of the content once when it is rendered
  const handleContentLayout = (event: any) => {
    const measuredHeight = event.nativeEvent.layout.height;
    if (measuredHeight !== contentHeight) {
      setContentHeight(measuredHeight); // Save measured height
    }
  };

  // Effect to handle animations
  useEffect(() => {
    const animationDuration = 150; // Adjust duration for faster animations

    // Run animations based on `isOpen`
    Animated.timing(rotationAnim, {
      toValue: isOpen ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: true,
    }).start();

    Animated.timing(heightAnim, {
      toValue: isOpen ? 1 : 0,
      duration: animationDuration,
      useNativeDriver: false, // height cannot be animated with native driver
    }).start();
  }, [isOpen]);

  // Interpolate rotation value for the chevron icon
  const rotateChevron = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '90deg'], // Rotate to 90 degrees when open
  });

  // Interpolate height value for the content
  const animatedContentStyle = {
    height: heightAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [0, height === 'auto' ? contentHeight : height], // Use dynamic height if 'auto'
    }),
    opacity: heightAnim, // Fading effect while expanding/collapsing
  };

  return (
    <ThemedView style={transparent ? styles.transparentBackground : undefined}>
      <TouchableOpacity
        style={[
          styles.heading,
          {
            justifyContent: dropdownIconPlacement === 'right' ? 'space-between' : 'flex-start',
            width: dropdownIconPlacement === 'right' ? '100%' : 'auto',
          },
        ]}
        onPress={() => setIsOpen((value) => !value)}
      >
        {/* Title and Icon */}
        {icon ? (
          <ThemedView
            transparent
            style={{ gap: 5, flexDirection: 'row', alignItems: 'center' }}
          >
            <Ionicons
              name={icon}
              size={25}
              color={theme === 'light' ? '#301713' : '#9BA1A6'}
              style={styles.icon}
            />
            <ThemedText type="defaultSemiBold">{title}</ThemedText>
          </ThemedView>
        ) : (
          <ThemedText type="defaultSemiBold">{title}</ThemedText>
        )}
        {dropdownIconPlacement === 'right' && (
          <Animated.View style={{ transform: [{ rotate: rotateChevron }] }}>
            <Ionicons
              name="chevron-forward-outline"
              size={18}
              color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              style={styles.icon}
            />
          </Animated.View>
        )}
      </TouchableOpacity>

      {/* Animated content container */}
      <Animated.View style={[styles.content, animatedContentStyle]}>
        {/* Measure content only once */}
        <View onLayout={handleContentLayout}>
          {children}
        </View>
      </Animated.View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginHorizontal: 6,
  },
  content: {
    marginTop: 6,
    overflow: 'hidden', // To ensure the content is hidden during collapse
    alignItems: 'center',
    justifyContent: 'center'
  },
  transparentBackground: {
    backgroundColor: 'rgba(0,0,0,0)', // Transparent background when the `transparent` prop is true
  },
});
