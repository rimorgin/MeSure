import { Image, StyleSheet } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from './ThemedView';
import { useIsAppFirstLaunchStore, useUserStore } from '@/store/appStore';

interface HelloWaveProps {
  showIntro?: boolean;
}

export function HelloWave({} : HelloWaveProps) {
  const rotationAnimation = useSharedValue(0);
  const userFullName = useUserStore((state) => state.userFullName);
  const nameParts = userFullName?.split(' ') || [];

  // Set the first word as the first name
  const firstName = nameParts[0] || '';

  // Set the last word as the last name
  const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

  rotationAnimation.value = withRepeat(
    withSequence(withTiming(25, { duration: 150 }), withTiming(0, { duration: 150 })),
    4 // Run the animation 4 times
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotationAnimation.value}deg` }],
  }));

  return (
    <>
    {/* 
    {showIntro ? (
      <ThemedText style={styles.text}>👋</ThemedText>
    ) : (
      <Animated.View style={animatedStyle}>
        <ThemedText style={styles.text}>👋</ThemedText>
      </Animated.View>
    )}
    */}
    
    <ThemedView style={{flexDirection:'row', gap: 10, justifyContent: 'center', alignItems: 'center'}}>
    <Image 
      source={require('@/assets/images/app-icon.png')} 
      style={styles.image}
    />
    <ThemedView>
      <ThemedText type="semititle" font="cocoGothicBold">
        Welcome, {'\n'}
        <ThemedText type="default" font="montserratRegular">
          {firstName + ' ' + lastName}
        </ThemedText>
      </ThemedText>
    </ThemedView>
    </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  text: {
    fontSize: 40,
  },
  image: {
    width: 50,
    height: 50
  }
});
