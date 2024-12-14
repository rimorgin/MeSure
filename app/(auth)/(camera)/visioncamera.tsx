
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
import { white } from '@/constants/Colors';
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

const { width, height } = Dimensions.get('screen');

export default function CameraApp() {
  const device = useCameraDevice('back');
  const { hasPermission } = useCameraPermission();
  const [mediaLibraryPermission] = ImagePicker.useMediaLibraryPermissions();
  const camera = useRef<Camera>(null);
  const { showCameraIntro } = useIsAppFirstLaunchStore();
  const [isCameraInitialized, initializeCamera] = useState(false)
  // Allow photo state to accept both PhotoFile objects and URI strings
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
  const theme = useColorSchemeTheme();

  const [fingerSizes, setFingerSizes] = useState({
    thumb: '',
    index: '',
    middle: '',
    ring: '',
    pinky: '',
  });
  const [wristSize, setWristSize] = useState('');

  const takePhoto = async () => {
  try {
    if (camera.current == null) throw new Error("Camera ref is null!");
      // Capture the photo
      const photo = await camera.current.takePhoto({
        flash: 'on',
        enableShutterSound: false,
      });
      // Crop the image to a 4:3 aspect ratio
      const croppedImageUri = await cropImage(photo.path, photo.width, photo.height);
      // Update state with the cropped photo
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
      // Directly set the URI string as the photo
      setPhoto(result.assets[0].uri);
    } else {
      alert('You did not select any image.');
    }
  };

  const format = useCameraFormat(device, [
    { 
      fps: 'max',
      photoAspectRatio: 16/9,
      photoResolution: 'max'
    }
  ]);


  const fps = format?.maxFps

  const processConfirmedImage = async () => {
    setLoading(true);
    try {
      const data = await processImageHelper(photo, coin, bodyPart);

      if (!data) {
        alert('Failed to process image');
        throw new Error('Failed to process image')
      }
      
      setPhoto(`data:image/jpeg;base64,${data.processed_image}`);
      //console.log(data.hand_label)
      
      if (bodyPart === 'fingers') {
        const measurements = data?.finger_measurement;
        
        // Assuming finger_measurement array order is: pinky, ring, middle, index, thumb
        if (data?.hand_label === 'Left') {
          setFingerSizes({
            pinky: parseFloat(measurements[0]).toFixed(2).toString(),
            ring: parseFloat(measurements[1]).toFixed(2).toString(),
            middle: parseFloat(measurements[2]).toFixed(2).toString(),
            index: parseFloat(measurements[3]).toFixed(2).toString(),
            thumb: parseFloat(measurements[4]).toFixed(2).toString(),
          });
        } else {
          setFingerSizes({
            pinky: parseFloat(measurements[4]).toFixed(2).toString(),
            ring: parseFloat(measurements[3]).toFixed(2).toString(),
            middle: parseFloat(measurements[2]).toFixed(2).toString(),
            index: parseFloat(measurements[1]).toFixed(2).toString(),
            thumb: parseFloat(measurements[0]).toFixed(2).toString(),
          });
        }
      } else if (bodyPart === 'wrist') {
        const measurement = data?.wrist_measurement;
        //console.log(data)
        setWristSize(parseFloat(measurement).toFixed(2).toString());
      }
      setLoading(false);
      setMeasured(true)
    } catch (error) {
      console.error(error);
      setLoading(false);
      setMeasured(false)
    }
    
    //console.log(fingerSizes)
    //console.log(wristSize)
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
      await setFingerMeasurements(userId, fingerSizes)
    } else {
      await setWristMeasurement(userId, wristSize)
    }
    setLoading(false);
    router.navigate('/(auth)/(tabs)/profile')
  }
  const handleSaveImage = async () => {
    await saveImageToGallery(photo, userFullName || 'image', bodyPart)
    //await saveImageToGallery(photo, `${userFullName}-${bodyPart}-size.jpg`)
  };

   useEffect(() => {
    if (!hasPermission && !mediaLibraryPermission?.granted) {
      router.replace('/permissions?routeBack=visioncamera')
    }

  },[hasPermission, mediaLibraryPermission?.granted])

  useEffect(() => {
    //set to false initially to make help dialog appears first
    if (showCameraIntro) {
      setShowHelpDialog(true);
      setShowBodyPartDialog(false);
      setShowCoinDialog(false);
    } else {
      setShowHelpDialog(false);
      setShowBodyPartDialog(true);
      setShowCoinDialog(true);
    }
  },[showCameraIntro])

  useEffect(() => {
    initializeCamera(true);
    // This function will run when the component unmounts
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

  //console.log('zustand',fingerMeasurements)
  //console.log('zustand',wristMeasurement)
  
  return (
    <>
    <FocusAwareStatusBar barStyle={theme === 'dark' ? 'dark-content' : 'light-content'} animated/>
    <TouchableWithoutFeedback 
      onPress={Keyboard.dismiss}
    >
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
        }} // Hide the dialog after selection
      />
      <HelpDialog
        showHelpDialog={showHelpDialog}
        setShowHelpDialog={() => setShowHelpDialog(!showHelpDialog)}
      />
      {loading && (
      <Loader/>
    )}
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
              setMeasured(false)
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
          {bodyPart && (
            <Image
              source={bodyPart === 'fingers' 
                  ? 
                require(`@/assets/images/cameraoverlay/edgedFinger.png`) 
                  : 
                require(`@/assets/images/cameraoverlay/edgedWrist.png`)
              }
              style={bodyPart === 'fingers' ? styles.overlayImage : [styles.image, {position: 'absolute', zIndex: 500}]}
            />
          )}
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
              isActive={isCameraInitialized}
              ref={camera}
              photo={true}
              format={format}
              fps={fps}
              pixelFormat="yuv"
              focusable
              photoQualityBalance='quality'
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
    height: (width * 1.15) * (4 / 3),
    width: width * 1.16,
    left: -55,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 500
  },
  textInputContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 25,
    flexDirection: 'row'
  },
  textInput: {
    borderWidth:3,
    borderColor: white,
    padding: 3,
    paddingHorizontal: 8,
    color: white,
    fontSize: scaledSize(13),
    textAlign: 'center'
  },
  text: {
    color: white,
    marginBottom:3,
    textAlign: 'center'
  }
});
