import React, {ReactNode} from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { ThemedText } from './ThemedText';


interface ButtonProps {
  onPress: () => void;
  children: ReactNode;
}

const ThemedTouchableFilled: React.FC<ButtonProps> = ({ onPress, children }) => {
  return (
    <TouchableOpacity style={styles.buttonFilled} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const ThemedTouchablePlain: React.FC<ButtonProps> = ({ onPress, children }) => {
  return (
    <TouchableOpacity style={styles.buttonPlain} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
};

const ThemedButton = () => {
  return (
    <View>
      <Text>Hello, World!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
    buttonFilled:{
        backgroundColor: '#D4AF37',
        paddingVertical: 12,
        paddingHorizontal: 32,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
        width: '70%',
  },
      buttonPlain:{
        alignItems: 'center',
  },
})

export {ThemedTouchableFilled, ThemedTouchablePlain, ThemedButton};