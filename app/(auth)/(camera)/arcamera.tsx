import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useRef } from 'react';
import InAppWebView from '@/components/InAppWebView';
import { useLocalSearchParams } from 'expo-router';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { useCameraPermission } from 'react-native-vision-camera';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import * as MediaLibrary from 'expo-media-library';
import { captureRef } from 'react-native-view-shot';

export default function ArLink() {
  // Fetch the arlink from params
  const { arlink } = useLocalSearchParams<{ arlink: string }>();
  const theme = useColorSchemeTheme();
  const { hasPermission } = useCameraPermission();
  const [mediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const arRef = useRef(null);

  //console.log(arlink);
  useEffect(() => {
    if (!hasPermission && !mediaLibraryPermission?.granted) {
      router.replace(`/permissions?routeBack=arcamera&arlink=${arlink}`)
    }

  },[hasPermission, mediaLibraryPermission?.granted])

  const onSaveImageAsync = async () => {
    try {
      const localUri = await captureRef(arRef, {
        height: 440,
        quality: 1,
      });

      await MediaLibrary.saveToLibraryAsync(localUri);
      if (localUri) {
        alert('Saved!');
      }
    } catch (e) {
      console.log(e);
    }
  };

  

  if (!hasPermission && !mediaLibraryPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text>No camera device found!</Text>
      </View>
    );
  }

  if (!arlink) {
    // Handle the case where arlink is not available
    return <View style={styles.container}><Text>No AR link found</Text></View>;
  }

  return (
    <View style={styles.container}>
      <FocusAwareStatusBar barStyle={theme === 'light' ? 'dark-content' : 'light-content'} animated/>
      {/* Pass the URI to the InAppWebView */}
      <View style={styles.arcontainer} ref={arRef}>
        <InAppWebView uri={arlink} />
      </View>
      {/*<TouchableOpacity style={styles.captureButton} onPress={onSaveImageAsync}/>*/}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    top: -20
  },
  arcontainer: {
    flex: 1
  },
  captureButton: {
    position: 'absolute',
    bottom: 125,
    alignSelf: 'center',
    padding: 25,
    borderColor: 'white',
    borderWidth: 4,
    borderRadius: 50,
    zIndex: 2,
  },
});
