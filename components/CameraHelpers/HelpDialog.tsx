// components/ConfirmCoinAlertDialog.tsx

import React from 'react';
import  ThemedModal  from '@/components/ThemedModal';
import Slider from '../Slider';
import { appData } from '@/assets/data/appData';
import { useIsAppFirstLaunchStore } from '@/store/appStore';

interface HelpDialogProps {
  showHelpDialog: boolean;
  setShowHelpDialog: (showCoinDialog: boolean) => void;
}

const HelpDialog: React.FC<HelpDialogProps> = ({
  showHelpDialog = false,
  setShowHelpDialog,
}) => {
  const { hideCameraIntro } = useIsAppFirstLaunchStore();

  const handleClose = () => {
    setShowHelpDialog(false);
    hideCameraIntro()
  }
  
  return (
    <ThemedModal 
      showModal={showHelpDialog} 
      onClose={handleClose}
      height={'70%'}
      width={'90%'}
    >
    <Slider
      data={appData.cameraHelp}
      onFinish={handleClose}
      onSkip={handleClose}
    />
   
    </ThemedModal>
  );
};

export default HelpDialog;
