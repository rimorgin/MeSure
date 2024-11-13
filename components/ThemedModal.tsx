import React from 'react';
import { Modal, View, StyleSheet, ModalProps, ViewStyle, Dimensions } from 'react-native';
import { ThemedView } from './ThemedView';

interface ThemedModalProps extends Omit<ModalProps, 'visible'> {
  animationType?: 'fade' | 'slide' | 'none';
  showModal: boolean;
  onClose?: () => void;
  width?: number | string;
  height?: number | string;
}

const ThemedModal: React.FC<ThemedModalProps> = ({
  showModal,
  onClose,
  width = '80%',
  height = '50%',
  animationType = 'none',
  transparent = true,
  children,
  ...modalProps
}) => {
  // Calculate width and height based on input or default to 80%/50%
  const calculateDimension = (dimension: string | number, axis: 'width' | 'height') => {
    if (typeof dimension === 'number') return dimension;
    const screenSize = axis === 'width' ? Dimensions.get('window').width : Dimensions.get('window').height;
    return parseFloat(dimension) / 100 * screenSize;
  };

  const modalWidth = calculateDimension(width, 'width');
  const modalHeight = calculateDimension(height, 'height');

  return (
    <Modal
      animationType={animationType}
      transparent={transparent}
      visible={showModal}
      onRequestClose={onClose}
      {...modalProps}
    >
      <ThemedView style={styles.centeredView}>
        <ThemedView style={[styles.modalView, { width: modalWidth, height: modalHeight }]}>
          {children}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  } as ViewStyle,
  modalView: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  } as ViewStyle,
});

export default ThemedModal;
