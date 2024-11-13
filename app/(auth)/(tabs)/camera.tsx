import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, useColorScheme, View, Image } from 'react-native';
import { 
  Camera, 
  PhotoFile, 
  useCameraDevice, 
  useCameraFormat, 
  useCameraPermission
} from 'react-native-vision-camera';
import { ThemedView } from '@/components/ThemedView';
import * as ImagePicker from 'expo-image-picker';
import { Colors, white } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('screen');

export default function CameraApp() {
  const theme = useColorScheme() ?? 'light';
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const camera = useRef<Camera>(null);

  // Allow photo state to accept both PhotoFile objects and URI strings
  const [photo, setPhoto] = useState<PhotoFile | string>();

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No camera device found!</Text>
      </View>
    );
  }

  const takePhoto = async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");

      const photo = await camera.current.takePhoto({
        flash: 'on',
        enableShutterSound: false,
      });
      setPhoto(photo);
    } catch (e) {
      console.error("Failed to take photo!", e);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      // Directly set the URI string as the photo
      setPhoto(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const format = useCameraFormat(device, [
    { photoResolution: { width: 1920, height: 1080 } }
  ]);

  const processImage = async () => {
    console.log('Process image');
  };

  useEffect(() => {
    if (!hasPermission) {
      requestPermission();
    }
  }, [hasPermission]);

  if (!hasPermission) {
    return <ActivityIndicator color={theme === 'light' ? Colors.light.tint : Colors.dark.tint} />;
  }

  return (
    <ThemedView style={styles.container}>
      <StatusBar animated barStyle="dark-content" />
      {photo ? (
        <>
          <Image 
            source={{ uri: typeof photo === 'string' ? photo : `file://${photo.path}` }} 
            style={StyleSheet.absoluteFill} 
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={() => setPhoto(undefined)}>
              <Ionicons 
                size={50}
                name="repeat-outline"
                color={white}
                style={{ backgroundColor: 'transparent' }}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.confirmButton} onPress={processImage}>
              <Text style={styles.confirmText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Ionicons 
                size={45}
                name="download-outline"
                color={white}
                style={{ backgroundColor: 'transparent' }}
              />
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Camera 
            style={StyleSheet.absoluteFill} 
            device={device} 
            isActive={true} 
            ref={camera} 
            photo={true}
            photoQualityBalance="quality"
            format={format}
            preview
            fps={30}
          />
          <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
          <TouchableOpacity onPress={pickImage} style={styles.mediaLibs}>
            <Ionicons 
              size={50}
              name="image-outline"
              color={white}
              style={{ backgroundColor: 'transparent' }}
            />
          </TouchableOpacity>
        </>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    left: width / 2.25,
    padding: 25,
    borderColor: 'white',
    borderWidth: 4,
    borderRadius: 50,
  },
  confirmButton: {
    padding: 15,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 30,
  },
  mediaLibs: {
    position: 'absolute',
    bottom: 42,
    left: width / 5.5,
  },
  buttonContainer: {
    flexDirection: 'row',
    bottom: 40,
    position: 'absolute',
    width: '100%',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  confirmText: {
    textAlign: 'center',
    color: 'white',
  },
});
