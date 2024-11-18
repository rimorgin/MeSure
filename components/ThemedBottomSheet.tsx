import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import BottomSheet, { BottomSheetView } from '@gorhom/bottom-sheet';
import CustomBackdrop from '@/components/BottomSheet/BackDrop'; // Adjust the import as necessary

// Define a type for the ref
export type ThemedBottomSheetRef = {
  open: () => void;
  close: () => void;
};

type Props = {
  snapPoints?: string[];
  children: React.ReactNode;
};

const ThemedBottomSheet = forwardRef<ThemedBottomSheetRef, Props>((props, ref) => {
  const { snapPoints = ['85%'], children } = props;
  const bottomSheetRef = useRef<BottomSheet>(null);

  useImperativeHandle(ref, () => ({
    open: () => {
      bottomSheetRef.current?.snapToIndex(1);
    },
    close: () => {
      bottomSheetRef.current?.close();
    },
  }));

  const handleSheetChanges = (index: number) => {
    console.log('Bottom sheet changed to index:', index);
  };

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={-1}  
      snapPoints={snapPoints} 
      enablePanDownToClose={true}
      style={styles.bottomSheet}
      onChange={handleSheetChanges}
      backdropComponent={CustomBackdrop}
    >
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  bottomSheet: {
    // Add your desired styles here
    backgroundColor: 'white',
    borderRadius: 20,
  },
  contentContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
});

export default ThemedBottomSheet;