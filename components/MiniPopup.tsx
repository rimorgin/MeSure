import { Ionicons } from '@expo/vector-icons';
import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Easing,
  Text,
} from 'react-native';

interface Popup{
    isVisible: boolean;
    toggleVisibility: (isVisible: boolean) => void;
    height?: number;
    duration?: number;
    children: React.ReactNode;
}

const AnimatedPopup = ({ isVisible, toggleVisibility, children, height = 100, duration = 300 } : Popup) => {
  const animationValue = useRef(new Animated.Value(isVisible ? 1 : 0)).current;

  React.useEffect(() => {
    Animated.timing(animationValue, {
      toValue: isVisible ? 1 : 0,
      duration,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  }, [isVisible]);

  const heightInterpolation = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, height],
  });

  return (
    <Animated.View
      style={[styles.popup, { height: heightInterpolation }]}
    >
      {isVisible && (
      <TouchableOpacity onPress={toggleVisibility} style={styles.button}>
        <Ionicons
          name='close'
          size={25}
          color='#E1AAA2'
        />
      </TouchableOpacity>
      )}
      {isVisible && <View style={styles.content}>{children}</View>}
      
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  popup: {
    backgroundColor: '#E1AAA2',
    width: '60%',
    borderRadius: 8,
    overflow: 'hidden',
    alignSelf: 'center',
    position: 'absolute',
    top: -39,
    left: -92
  },
  button: {
    padding: 2,
    backgroundColor: 'white',
    width: 30,
    borderRadius: 5,
    position: 'absolute',
    right: 10,
    top: 10,
    zIndex: 20
  },
  content: {
    padding: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AnimatedPopup;
