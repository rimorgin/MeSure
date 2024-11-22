import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import CustomBackdrop from '@/components/BottomSheet/BackDrop'; // Adjust the import as necessary
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import CustomBackground from './BottomSheet/Background';

// Define a type for the ref
export type ThemedBottomSheetRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  preventHiding?: boolean;
  snapPoints?: string[];
  index?: number;
  noBackDrop?: boolean;
  children: React.ReactNode;
};

const ThemedBottomSheet = forwardRef<ThemedBottomSheetRef, Props>((props, ref) => {
  const { snapPoints = ['85%'], index = -1, noBackDrop = false, preventHiding = false, children } = props;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const theme = useColorSchemeTheme();

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.snapToIndex(1);
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  const handleSheetChanges = (index: number) => {
    if (preventHiding && index === -1) {
      // Prevent the bottom sheet from closing
      bottomSheetRef.current?.snapToIndex(0);
    }
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={index}  
      snapPoints={snapPoints} 
      enablePanDownToClose={!preventHiding}
      style={styles.bottomSheet}
      onChange={handleSheetChanges}
      backdropComponent={noBackDrop ? null : CustomBackdrop}
      backgroundComponent={CustomBackground}
    >
      <BottomSheetView style={[
        styles.contentContainer,
        {backgroundColor: theme === 'light' ? '#F8F4EC' : '#1c1c1d'}
      ]}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheet: {
    // Add your desired styles here
    borderRadius: 20,
    elevation: 3, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { 
        width: 0, 
        height: 2 
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
  },
});

export default ThemedBottomSheet;