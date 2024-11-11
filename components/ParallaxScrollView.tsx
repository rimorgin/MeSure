import type { PropsWithChildren, ReactElement } from 'react';
import { StyleSheet, useColorScheme } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from './ThemedText';

const DEFAULT_HEADER_HEIGHT = 250;

type Props = PropsWithChildren<{
  headerImage: ReactElement;
  headerHeight?: number;
  headerBackgroundColor: { dark: string; light: string };
  overlayedContent?: boolean;
}>;

export default function ParallaxScrollView({
  children,
  headerImage,
  headerHeight = DEFAULT_HEADER_HEIGHT, // Use DEFAULT_HEADER_HEIGHT if headerHeight is not provided
  headerBackgroundColor,
  overlayedContent = false
}: Props) {
  const colorScheme = useColorScheme() ?? 'light';
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const scrollOffset = useScrollViewOffset(scrollRef);

  const headerAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollOffset.value,
            [-headerHeight, 0, headerHeight],
            [-headerHeight / 2, 0, headerHeight * 0.75]
          ),
        },
        {
          scale: interpolate(scrollOffset.value, [-headerHeight, 0, headerHeight], [2, 1, 1]),
        },
      ],
    };
  });
  //add option to have rounded header image at the bottom
  return (
    <ThemedView 
      style={[styles.container, { 
        height: headerHeight 
      }]}
    >
      <Animated.ScrollView ref={scrollRef} scrollEventThrottle={16}>
        <Animated.View
          style={[
            styles.header,
            { 
              backgroundColor: headerBackgroundColor[colorScheme],
              height: headerHeight
            },
            headerAnimatedStyle,
          ]}>
          {headerImage}
        </Animated.View>
        <ThemedView 
          style={overlayedContent ? styles.overlayedContent : styles.content}
        >{children}  
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 0.6,
    top: 0,
    overflow: 'hidden',
  },
  content: {
    flex: 0.4,
    padding: 32,
    gap: 16,
    width: '100%',
    overflow: 'hidden',
  },
  overlayedContent: {
    flex: 0.4,
    overflow: 'hidden',
    bottom: 0,
    marginTop: -20,
    left: 0,
    zIndex: 1,
    padding: 20,
    width: '100%',
    height: 'auto',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
