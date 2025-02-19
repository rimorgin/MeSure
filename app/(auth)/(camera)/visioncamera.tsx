import React, { useRef, useState, useEffect } from 'react';
import { Dimensions, StatusBar, StyleSheet, Text, TouchableOpacity, View, Image, SafeAreaView, Platform, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { 
  Camera, 
  PhotoFile, 
  useCameraDevice, 
  useCameraFormat,
  useCameraPermission
} from 'react-native-vision-camera';
import * as ImagePicker from 'expo-image-picker';
import { white, black } from '@/constants/Colors';
import Ionicons from '@expo/vector-icons/Ionicons';
import { cropImage, processImageHelper, saveImageToGallery } from '@/utils/cameraHelper';
import { router } from 'expo-router';
import ConfirmCoinAlertDialog from '@/components/CameraHelpers/ConfirmCoinAlertDialog';
import ConfirmBodyPartAlertDialog from '@/components/CameraHelpers/ConfirmBodyPartAlertDialog';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import Loader from '@/components/Loader';
import { useUserStore, useUserMeasurementStorage, useIsAppFirstLaunchStore } from '@/store/appStore';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Feather } from '@expo/vector-icons';
import HelpDialog from '@/components/CameraHelpers/HelpDialog';
import { scaledSize } from '@/utils/fontSizer';
import { useIsFocused } from '@react-navigation/native';
import {useAppState} from '@react-native-community/hooks'
import { Accelerometer, Gyroscope, Magnetometer } from 'expo-sensors';
import AntDesign from '@expo/vector-icons/AntDesign';

const { width, height } = Dimensions.get('screen');

export default function CameraApp() {
  const theme = useColorSchemeTheme();
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();
  const [mediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const camera = useRef<Camera>(null);
  const { showCameraIntro } = useIsAppFirstLaunchStore();
  const isFocused = useIsFocused()
  const appState = useAppState()
  const isActive = isFocused && appState === "active"
  const [isCameraInitialized, initializeCamera] = useState(isActive);
  const [photo, setPhoto] = useState<PhotoFile | string>();
  const [coin, setCoin] = useState(0);
  const [bodyPart, setBodyPart] = useState('');
  const [loading, setLoading] = useState(false);
  const [measured, setMeasured] = useState(false);
  const [showBodyPartDialog, setShowBodyPartDialog] = useState(false);
  const [showCoinDialog, setShowCoinDialog] = useState(false);
  const [showHelpDialog, setShowHelpDialog] = useState(false);
  const [inputFocus, setInputFocus] = useState(false);
  const { userId } = useUserStore();
  const { setFingerMeasurements, setWristMeasurement } = useUserMeasurementStorage();
  const userFullName = useUserStore((state) => state.userFullName);
  const [zoom, setZoom] = useState(2);

  const [fingerSizes, setFingerSizes] = useState({
    thumb: '',
    index: '',
    middle: '',
    ring: '',
    pinky: '',
  });
  const [wristSize, setWristSize] = useState('');

  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [updatedGyroData, setupdatedGyroData] = useState({ x: 0, y: 0, });
  const [gyroEnabled, setGyroEnabled] = useState(true);

  const DEFAULT_GYRO_DATA = { x: 0, y: 48.375, z: 5.875 };
  const TOLERANCE = 0.5;  // Adjust this value as needed for sensitivity
  type GyroData = {
    x: number;
    y: number;
    z: number;
  };

  function IsCentered(gyroData: GyroData) {
    // Calculate the roll angle (rotation around the x-axis)
    const roll = Math.atan2(gyroData.y, gyroData.z) * (180 / Math.PI); // Convert to degrees
    // Calculate the pitch angle (rotation around the y-axis)
    const pitch = Math.atan2(-gyroData.x, Math.sqrt(gyroData.y * gyroData.y + gyroData.z * gyroData.z)) * (180 / Math.PI); // Convert to degrees

    // Check if the phone is leveled (roll and pitch near 0 degrees)
    if (Math.abs(roll) < .5 && Math.abs(pitch) < .5) {
      return true;
    } else {
      return false;
    }
  }

  function updatePosition(updatedGyroData: GyroData) {
    const roll = Math.atan2(updatedGyroData.y, updatedGyroData.z) * (180 / Math.PI);
    const pitch = Math.atan2(-updatedGyroData.x, Math.sqrt(updatedGyroData.y * updatedGyroData.y + updatedGyroData.z * updatedGyroData.z)) * (180 / Math.PI);

    // Map roll and pitch to x and y positions (clamped between -50 and 50)
    const mappedX = Math.max(-50, Math.min(50, roll));
    const mappedY = Math.max(-50, Math.min(50, pitch));

    setupdatedGyroData({x: mappedX, y: mappedY} );
  }

  useEffect(() => {
    let subscription: any;
    if (gyroEnabled) {
      subscription = Accelerometer.addListener((data) => {
        setGyroData(data);
        
        
      });
    } else {
      subscription?.remove();
    }
    return () => {
      subscription?.remove();
    }

  }, [gyroEnabled]);

  const takePhoto = async () => {
    try {
      if (camera.current == null) throw new Error("Camera ref is null!");
      const photo = await camera.current.takePhoto({
        
        flash: 'on',
        enableShutterSound: false,
      });
      const croppedImageUri = await cropImage(photo.path, photo.width, photo.height);
      setPhoto({ ...photo, path: croppedImageUri });
    } catch (e) {
      console.error("Failed to take photo or crop!", e);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const format = useCameraFormat(device, [
    { 
      fps: 'max',
      photoAspectRatio: 16/9,
      photoResolution: 'max',
      
    }
  ]);

  const fps = format?.maxFps;

  const processConfirmedImage = async () => {
    setLoading(true);
    try {
      const data = await processImageHelper(photo, coin, bodyPart);

      if (!data) {
        alert('Failed to process image');
        throw new Error('Failed to process image')
      }
      
      setPhoto(`data:image/jpeg;base64,${data.processed_image}`);
      
      if (bodyPart === 'fingers') {
        const measurements = data?.finger_measurement;
        console.log(data.finger_measurement);
       
        setFingerSizes({
          pinky: parseFloat(measurements['pinky']).toFixed(2).toString(),
          ring: parseFloat(measurements['ring']).toFixed(2).toString(),
          middle: parseFloat(measurements['middle']).toFixed(2).toString(),
          index: parseFloat(measurements['index']).toFixed(2).toString(),
          thumb: parseFloat(measurements['thumb']).toFixed(2).toString(),
        });
        
      } else if (bodyPart === 'wrist') {
        const measurement = data?.wrist_measurement;
        setWristSize(parseFloat(measurement).toFixed(2).toString());
      }
      setLoading(false);
      setMeasured(true);
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMeasured(false);
    }
  };

  const handleFingerChange = (name: string, value: string) => {
    setFingerSizes((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleFinishedMeasurement = async () => {
    setLoading(true);
    if (bodyPart === 'fingers') {
      await setFingerMeasurements(userId, fingerSizes);
    } else {
      await setWristMeasurement(userId, wristSize);
    }
    setLoading(false);
    router.navigate('/(auth)/(tabs)/profile');
  };

  const handleSaveImage = async () => {
    await saveImageToGallery(photo, userFullName || 'image', bodyPart);
  };



  useEffect(() => {
    if (!hasPermission && !mediaLibraryPermission?.granted) {
      router.replace('/permissions?routeBack=visioncamera');
    }
  }, [hasPermission, mediaLibraryPermission?.granted]);

  useEffect(() => {
    if (showCameraIntro) {
      setShowHelpDialog(true);
      setShowBodyPartDialog(false);
      setShowCoinDialog(false);
    } else {
      setShowHelpDialog(false);
      setShowBodyPartDialog(true);
      setShowCoinDialog(true);
    }
  }, [showCameraIntro]);

  useEffect(() => {
    initializeCamera(true);
    return () => {
      setBodyPart('');
      setCoin(0);
      setShowBodyPartDialog(false);
      setShowCoinDialog(false);
    };
  }, []);

  if (!hasPermission && !mediaLibraryPermission?.granted) {
    return (
      <View style={styles.container}>
        <Text>No camera device found!</Text>
      </View>
    );
  }

  if (!device) {
    return (
      <View style={styles.container}>
        <Text>No camera device found!</Text>
      </View>
    );
  }

  return (
    <>
      <FocusAwareStatusBar barStyle={theme === 'dark' ? 'dark-content' : 'light-content'} animated/>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
       
      <ConfirmCoinAlertDialog 
        setShowCoinDialog={() => setShowCoinDialog(false)} 
        showCoinDialog={showCoinDialog}
        bodyPart={bodyPart} 
        setCoin={(coin) => { 
          setCoin(coin); 
          setShowCoinDialog(false); 
        }} // Hide the dialog after selection
      />

          <ConfirmBodyPartAlertDialog
            setShowBodyPartDialog={() => setShowBodyPartDialog(false)}
            showBodyPartDialog={showBodyPartDialog} 
            bodyPart={bodyPart} 
            setBodyPart={(part) => { 
              setBodyPart(part); 
              setShowBodyPartDialog(false); 
            }}
          />
          <HelpDialog
            showHelpDialog={showHelpDialog}
            setShowHelpDialog={() => setShowHelpDialog(!showHelpDialog)}
          />
          {loading && <Loader/>}
          {photo ? (
            <>
              <TouchableOpacity 
                style={{top:50, left:0, position:'absolute', zIndex:1}}
                onPress={() => router.navigate('/profile')}
              >
                <Ionicons 
                  name='chevron-back' 
                  size={40} 
                  style={{marginLeft:20}}
                  color={white}
                />
              </TouchableOpacity>
              <Image
                source={{ uri: typeof photo === 'string' ? photo : `file://${photo.path}` }}
                style={styles.image}
              />
              <View
                style={[
                  styles.textInputContainer,
                  {top: inputFocus ? height * 0.48 : height * 0.7,}
                ]}
              > 
                {measured && (
                  bodyPart === 'fingers' ? (
                    <>
                      <View>
                        <Text style={styles.text}>Thumb</Text>
                        <TextInput 
                          keyboardType='numeric'
                          onFocus={()=> setInputFocus(true)}
                          onEndEditing={() => setInputFocus(false)}
                          style={styles.textInput}
                          value={fingerSizes.thumb}
                          defaultValue={fingerSizes.thumb}
                          onChangeText={(value) => handleFingerChange('thumb', value)}
                        />
                      </View>
                      <View>
                        <Text style={styles.text}>Index</Text>
                        <TextInput 
                          keyboardType='numeric'
                          onFocus={()=> setInputFocus(true)}
                          onEndEditing={() => setInputFocus(false)}
                          style={styles.textInput}
                          value={fingerSizes.index}
                          defaultValue={fingerSizes.index}
                          onChangeText={(value) => handleFingerChange('index', value)}
                        />
                      </View>
                      <View>
                        <Text style={styles.text}>Middle</Text>
                        <TextInput 
                          keyboardType='numeric'
                          onFocus={()=> setInputFocus(true)}
                          onEndEditing={() => setInputFocus(false)}
                          style={styles.textInput}
                          value={fingerSizes.middle}
                          defaultValue={fingerSizes.middle}
                          onChangeText={(value) => handleFingerChange('middle', value)}
                        />
                      </View>
                      <View>
                        <Text style={styles.text}>Ring</Text>
                        <TextInput 
                          keyboardType='numeric'
                          onFocus={()=> setInputFocus(true)}
                          onEndEditing={() => setInputFocus(false)}
                          style={styles.textInput}
                          value={fingerSizes.ring}
                          defaultValue={fingerSizes.ring}
                          onChangeText={(value) => handleFingerChange('ring', value)}
                        />
                      </View>
                      <View>
                        <Text style={styles.text}>Pinky</Text>
                        <TextInput 
                          keyboardType='numeric'
                          onFocus={()=> setInputFocus(true)}
                          onEndEditing={() => setInputFocus(false)}
                          style={styles.textInput}
                          value={fingerSizes.pinky}
                          defaultValue={fingerSizes.pinky}
                          onChangeText={(value) => handleFingerChange('pinky', value)}
                        />
                      </View>
                    </>
                  ) : (
                    <View>
                      <Text style={styles.text}>Wrist Size</Text>
                      <TextInput 
                        keyboardType='numeric'
                        onFocus={()=> setInputFocus(true)}
                        onEndEditing={() => setInputFocus(false)}
                        style={styles.textInput}
                        value={wristSize}
                        onChangeText={(value) => setWristSize(value)}
                      />
                    </View>
                  )
                )}
              </View>
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => {
                  setPhoto(undefined);
                  setMeasured(false);
                }}>
                  <Ionicons 
                    size={50}
                    name="repeat-outline"
                    color={white}
                    style={{ backgroundColor: 'transparent' }}
                  />
                </TouchableOpacity>
                {!measured && (
                  <TouchableOpacity style={styles.confirmButton} onPress={processConfirmedImage}>
                    <Text style={styles.confirmText}>Confirm</Text>
                  </TouchableOpacity>
                )}
                {measured && (
                  <TouchableOpacity style={styles.confirmButton} onPress={handleFinishedMeasurement}>
                    <Text style={styles.confirmText}>Ok</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={handleSaveImage}>
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
                    {/* Fixed Yellow Plus */}
          <AntDesign
            name="plus"
            size={50}
            color={ IsCentered(gyroData) ? "yellow" : white}
            style={[
              styles.gyroPlusIndicator,
              {
                position: "absolute",
                transform: [
                  { translateX: 0 + 10},
                  { translateY: 0 },
                ],
                opacity: 1, // Visible only when centered
              },
            ]}
          />
   {/* White Indicator (Follows Gyroscope Data) */}
{/* <AntDesign
  name="plus"
  size={50}
  color="white"
  style={[
    styles.gyroPlusIndicator,
    {
      position: "absolute",
      transform: [
        { translateX: updatedGyroData.y}, // Adjust relative to center
        { translateY: updatedGyroData.x},
      ],
      opacity: IsCentered(gyroData) ? 0 : 1, // Invisible when centered
    },
  ]}
/> */}
              {/*bodyPart && (
                <Image
                  source={bodyPart === 'fingers' 
                      ? 
                    require(`@/assets/images/cameraoverlay/edgedFingerLeft.png`) 
                      : 
                    require(`@/assets/images/cameraoverlay/edgedWrist.png`)
                  }
                  style={bodyPart === 'fingers' ? styles.overlayImage : [styles.image, {position: 'absolute', zIndex: 500}]}
                />
              )*/}
              <TouchableOpacity 
                style={{top:60, right:0, position:'absolute', zIndex:2}}
                onPress={() => setShowBodyPartDialog(true)}
              >
                <Ionicons 
                  name='accessibility-outline' 
                  size={40} 
                  style={{marginRight:20}}
                  color={white}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{top:120, right:0, position:'absolute', zIndex:2}}
                onPress={() => setShowCoinDialog(true)}
              >
                <Ionicons 
                  name='scan-circle-outline' 
                  size={50} 
                  style={{marginRight:13}}
                  color={white}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={{top:60, right:80, position:'absolute', zIndex:2}}
                onPress={() => setShowHelpDialog(true)}
              >
                <Feather 
                  name="help-circle" 
                  size={45} 
                  color={white} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={{top:50, left:0, position:'absolute', zIndex:2}}
                onPress={() => router.navigate('/profile')}
              >
                <Ionicons 
                  name='chevron-back' 
                  size={40} 
                  style={{marginLeft:20}}
                  color={white}
                />
              </TouchableOpacity>
              <View style={{flex: 1, width:'100%'}}>
                <View style={{opacity:0.7, backgroundColor:'#000', height: width * (4/3)/4, zIndex: 1}}/>
                <Camera
                  style={StyleSheet.absoluteFillObject}
                  device={device}
                  isActive={isActive}
                  ref={camera}
                  photo={true}
                  format={format}
                  fps={fps}
                  pixelFormat="yuv"
                  focusable
                  photoQualityBalance='quality'
                  zoom={zoom} 
                />
                <View style={{opacity:0.7, backgroundColor:'#000', height: width * (4/3)/4, zIndex: 1, bottom: 0,position:'absolute', width:'100%'}}/>
              </View>
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
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#000',
    alignItems: 'center',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  captureButton: {
    position: 'absolute',
    bottom: 40,
    left: width / 2.25,
    padding: 25,
    borderColor: 'white',
    borderWidth: 4,
    borderRadius: 50,
    zIndex: 2,
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
    zIndex: 2,
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
  image: {
    height: width * (4 / 3),
    width: width,
    alignSelf: 'center', // Center the image horizontally
  },
  overlayImage: {
    height: (width * 0.95) * (4 / 3),
    width: width * 1.12,
    left: -55,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 500
  },
  textInputContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: black,
    flexDirection: 'row'
  },
  textInput: {
    borderWidth:3,
    borderColor: white,
    padding: 3,
    margin: 5,
    paddingHorizontal: 8,
    color: white,
    fontWeight: '900',
    fontSize: scaledSize(13),
    textAlign: 'center'
  },
  text: {
    color: white,
    marginBottom:3,
    textAlign: 'center'
  },
  gyroPlusIndicator: {
    position: 'absolute', 
    top: '50%', 
    alignSelf: 'center', 
    zIndex: 5
  }

});
