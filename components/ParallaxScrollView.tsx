import type { PropsWithChildren, ReactElement } from 'react';
import { Dimensions, StyleProp, StyleSheet, useColorScheme, ViewStyle } from 'react-native';
import Animated, {
  interpolate,
  useAnimatedRef,
  useAnimatedStyle,
  useScrollViewOffset,
} from 'react-native-reanimated';

import { ThemedView } from '@/components/ThemedView';
import FocusAwareStatusBar from './navigation/FocusAwareStatusBarTabConf';

const DEFAULT_HEADER_HEIGHT = 250;
const height = Dimensions.get('screen').height

type Props = PropsWithChildren<{
  headerOverlayedContent?: ReactElement;
  headerImage?: ReactElement;
  headerHeight?: number;
  headerBackgroundColor: { dark: string; light: string };
  overlayedContent?: boolean;
  roundedHeader?: boolean;
  noContentPadding?: boolean;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
}>;

export default function ParallaxScrollView({
  children,
  headerOverlayedContent,
  headerImage,
  headerHeight = DEFAULT_HEADER_HEIGHT, // Use DEFAULT_HEADER_HEIGHT if headerHeight is not provided
  headerBackgroundColor,
  overlayedContent = false,
  roundedHeader = false,
  noContentPadding = false,
  scrollable = true,
  style
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
      style={[styles.container, style, { 
        height: headerHeight 
      }]}
    >
      <FocusAwareStatusBar animated barStyle="light-content"/>
      <Animated.ScrollView 
        ref={scrollRef} 
        scrollEventThrottle={16}
        scrollEnabled={scrollable}
        nestedScrollEnabled={scrollable}
      >
        <Animated.View
          style={[
            styles.header,
            { 
              backgroundColor: headerBackgroundColor[colorScheme],
              height: headerHeight,
              borderBottomLeftRadius: roundedHeader ? 30 : 0,
              borderBottomRightRadius: roundedHeader ? 30 : 0,
            },
            headerAnimatedStyle,
          ]}>
          {headerImage}
          {headerOverlayedContent && 
            <ThemedView 
              transparent
              style={styles.headerOverlayedContent}
            >
              {headerOverlayedContent}
            </ThemedView>
          }
        </Animated.View>
        <ThemedView 
          style={[
            overlayedContent ? styles.overlayedContent : styles.content, 
            {padding: noContentPadding ? 0 : 32}
          ]}
        >{children}  
        </ThemedView>
      </Animated.ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex:1
  },
  header: {
    flex: 0.6,
    top: 0,
    zIndex: 1,
    overflow:'hidden'
  },
  headerOverlayedContent: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    padding: 15,
  },
  content: {
    flex: 0.4,
    width: '100%',
    overflow: 'hidden',
    zIndex: 10
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
    //backgroundColor: 'rgba(0,0,0,0)'
  },
});
