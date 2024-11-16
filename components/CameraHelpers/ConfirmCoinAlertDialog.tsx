// components/ConfirmCoinAlertDialog.tsx

import React from 'react';
import  ThemedModal  from '@/components/ThemedModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTouchableFilled } from '@/components/ThemedButton';

interface ConfirmCoinAlertDialogProps {
  showCoinDialog: boolean;
  bodyPart?: string;
  coin?: number;
  setCoin: React.Dispatch<React.SetStateAction<number>>;
}

const ConfirmCoinAlertDialog: React.FC<ConfirmCoinAlertDialogProps> = ({
  showCoinDialog = false,
  coin,
  setCoin,
  bodyPart = 'body part'
}) => {
  return (
    <ThemedModal showModal={showCoinDialog} height={300}>
    <ThemedText type="semititle" style={{ textAlign: 'left', width: '100%', paddingLeft: 10, paddingTop: 10 }}>
        What coin are you using?
    </ThemedText>
    <ThemedText style={{ padding: 10, marginVertical: 10 }} type="default">
        A coin is needed to be captured in the image together with your {bodyPart} as it will be used as the reference width.
    </ThemedText>
    <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
        <ThemedTouchableFilled onPress={() => setCoin(1)}>
        <ThemedText type="default">1 Peso</ThemedText>
        </ThemedTouchableFilled>
        <ThemedTouchableFilled onPress={() => setCoin(5)}>
        <ThemedText type="default">5 Peso</ThemedText>
        </ThemedTouchableFilled>
        <ThemedTouchableFilled onPress={() => setCoin(10)}>
        <ThemedText type="default">10 Peso</ThemedText>
        </ThemedTouchableFilled>
    </ThemedView>
    </ThemedModal>
  );
};

export default ConfirmCoinAlertDialog;
