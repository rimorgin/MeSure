// components/ConfirmCoinAlertDialog.tsx

import React from 'react';
import  ThemedModal  from '@/components/ThemedModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { Image, TouchableOpacity } from 'react-native';

interface ConfirmCoinAlertDialogProps {
  showCoinDialog: boolean;
  setShowCoinDialog: (showCoinDialog: boolean) => void;
  bodyPart?: string;
  coin?: number;
  setCoin: React.Dispatch<React.SetStateAction<number>>;
}

const ConfirmCoinAlertDialog: React.FC<ConfirmCoinAlertDialogProps> = ({
  showCoinDialog = false,
  setShowCoinDialog,
  coin,
  setCoin,
  bodyPart = 'body part',
}) => {
  return (
    <ThemedModal 
      showModal={showCoinDialog} 
      onClose={() => setShowCoinDialog(false)}
      height={300}
    >
    <ThemedText type="semititle" style={{ textAlign: 'left', width: '100%', paddingLeft: 10, paddingTop: 10 }}>
        Instructions
    </ThemedText>
    <ThemedText style={{ padding: 10, marginVertical: 10 }} type="default">
        Tap the old 1 Peso Coin as reference, ensure that the old 1 Peso coin is visible in the image along with your {bodyPart}, as it will be used to determine the reference width. 
    </ThemedText>
    <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
      {/* 
        <ThemedTouchableFilled onPress={() => setCoin(1)}>
        <ThemedText type="default">1 Peso</ThemedText>
        </ThemedTouchableFilled>
        <ThemedTouchableFilled onPress={() => setCoin(5)}>
        <ThemedText type="default">5 Peso</ThemedText>
        </ThemedTouchableFilled>
        <ThemedTouchableFilled onPress={() => setCoin(10)}>
        <ThemedText type="default">10 Peso</ThemedText>
        </ThemedTouchableFilled>
      */}
      <TouchableOpacity onPress={() => setCoin(1)}>
        <Image 
          source={require('@/assets/images/coins/coin1.png')}
          style={{width: 60, height: 60}}
        />
      </TouchableOpacity>
 
      
    </ThemedView>
    </ThemedModal>
  );
};

export default ConfirmCoinAlertDialog;
