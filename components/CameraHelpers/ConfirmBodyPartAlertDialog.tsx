// components/ConfirmCoinAlertDialog.tsx

import React from 'react';
import  ThemedModal  from '@/components/ThemedModal';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ThemedTouchableFilled } from '@/components/ThemedButton';

interface ConfirmBodyPartAlertDialogProps {
  showBodyPartDialog?: boolean;
  setShowBodyPartDialog: (showBodyPartDialog: boolean) => void;
  bodyPart: string;
  setBodyPart: React.Dispatch<React.SetStateAction<string>>;
}

const ConfirmBodyPartAlertDialog: React.FC<ConfirmBodyPartAlertDialogProps> = ({
  showBodyPartDialog = true,
  setShowBodyPartDialog,
  bodyPart,
  setBodyPart,
}) => {
  return (
      <ThemedModal 
        showModal={showBodyPartDialog} 
        onClose={() => setShowBodyPartDialog(false)}
        height={300}
      >
        <ThemedText type="semititle" style={{ textAlign: 'left', width: '100%', paddingLeft: 10, paddingTop: 10 }}>
          What body part are you measuring?
        </ThemedText>
        <ThemedText style={{ padding: 8, marginVertical: 5 }} type="default">
          Specify what you want to measure to get accurate results.
        </ThemedText>
        <ThemedView style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%', bottom: 35, position: 'absolute' }}>
          <ThemedTouchableFilled onPress={() => setBodyPart('fingers')}>
            <ThemedText type="default">Fingers</ThemedText>
          </ThemedTouchableFilled>
          <ThemedTouchableFilled onPress={() => setBodyPart('wrist')}>
            <ThemedText type="default">Wrist</ThemedText>
          </ThemedTouchableFilled>
        </ThemedView>
      </ThemedModal>
  );
};

export default ConfirmBodyPartAlertDialog;
