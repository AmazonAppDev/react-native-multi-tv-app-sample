import React from 'react';
import { View, Text, StyleSheet, Modal } from 'react-native';
import { scaledPixels } from '@/hooks/useScale';
import { SpatialNavigationFocusableView, SpatialNavigationRoot, DefaultFocus } from 'react-tv-space-navigation';

interface ConfirmationDialogProps {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent={true} animationType="fade" onRequestClose={onCancel}>
      <View style={styles.overlay}>
        <SpatialNavigationRoot isActive={visible}>
          <View style={styles.dialog}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.message}>{message}</Text>

            <View style={styles.buttonContainer}>
              <DefaultFocus>
                <SpatialNavigationFocusableView onSelect={onCancel}>
                  {({ isFocused }) => (
                    <View style={[styles.button, styles.cancelButton, isFocused && styles.buttonFocused]}>
                      <Text style={[styles.buttonText, isFocused && styles.buttonTextFocused]}>{cancelText}</Text>
                    </View>
                  )}
                </SpatialNavigationFocusableView>
              </DefaultFocus>

              <SpatialNavigationFocusableView onSelect={onConfirm}>
                {({ isFocused }) => (
                  <View style={[styles.button, styles.confirmButton, isFocused && styles.buttonFocused]}>
                    <Text style={[styles.buttonText, isFocused && styles.buttonTextFocused]}>{confirmText}</Text>
                  </View>
                )}
              </SpatialNavigationFocusableView>
            </View>
          </View>
        </SpatialNavigationRoot>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#1a1a1a',
    borderRadius: scaledPixels(10),
    padding: scaledPixels(40),
    minWidth: scaledPixels(600),
    maxWidth: scaledPixels(800),
    borderWidth: scaledPixels(2),
    borderColor: '#333',
  },
  title: {
    color: '#fff',
    fontSize: scaledPixels(32),
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: scaledPixels(20),
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  message: {
    color: '#fff',
    fontSize: scaledPixels(24),
    textAlign: 'center',
    marginBottom: scaledPixels(40),
    lineHeight: scaledPixels(32),
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: scaledPixels(20),
  },
  button: {
    paddingVertical: scaledPixels(15),
    paddingHorizontal: scaledPixels(40),
    borderRadius: scaledPixels(5),
    minWidth: scaledPixels(150),
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  confirmButton: {
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
  },
  buttonFocused: {
    backgroundColor: '#fff',
    borderWidth: scaledPixels(2),
    borderColor: '#fff',
  },
  buttonText: {
    color: '#fff',
    fontSize: scaledPixels(20),
    fontWeight: 'bold',
  },
  buttonTextFocused: {
    color: '#000',
  },
});

export default ConfirmationDialog;
