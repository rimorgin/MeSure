import { CameraDeviceFormat } from "react-native-vision-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import { Alert, Platform } from 'react-native';


export const convertBlobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob)
        reader.onloadend = () => {
        resolve(reader.result); // The Base64 string is in reader.result
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};

export const convertBase64ToBlob = (base64: any, mimeType = 'image/png') => {
  const byteCharacters = atob(base64); // Decode the Base64 string
  const byteNumbers = new Array(byteCharacters.length).fill(null).map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

// cameraHelpers.js
export const getCoinWidth = (coin: number) => {
  switch (coin) {
    case 1:
      return '23.0';
    case 5:
      return '24.0';
    case 10:
      return '25.0';
    default:
      return null; // Return null if no valid coin is selected
  }
};

export const getBodyPartSpecificURL = (bodyPart: string) => {
  let urlScheme; 
  switch (bodyPart) {
    case 'fingers':
      urlScheme = 'measure-fingers';
      break;  // Add break here to stop execution
    case 'wrist':
      urlScheme = 'measure-wrist';
      break;  // Add break here to stop execution
    default:
      break;
  }
  //backend live deployment 
  //return `http://34.81.21.169:8080/${urlScheme}`;

  //backend local deployment 
  return `http://10.15.20.39:8080/${urlScheme}`;
  //return `http://localhost:5000/${urlScheme}`;
};


export const processImageHelper = async (photo: any, coin: number, bodyPart: string) => {
  const width = getCoinWidth(coin);
  const url = getBodyPartSpecificURL(bodyPart)

  try {
    if (!photo) {
      console.error('No photo to process!');
      return;
    }

    const formData = new FormData();
    const fileName = typeof photo === 'string' ? photo.split('/').pop() : photo?.path?.split('/').pop();
    const photoUri = typeof photo === 'string' ? photo : `file://${photo?.path}`;

    formData.append('image', { uri: photoUri, type: 'image/jpeg', name: fileName || 'image.jpg' } as any);
    formData.append('width', String(width));

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      console.error('Server Response Error:', await response.text());
      throw new Error('Image processing failed');
    }

    console.log(response)
    const blob = await response.blob();
    //const blob = await response.blob() as string;
    console.log(blob);
    const base64String = await convertBlobToBase64(blob) as string;
    return base64String; // Return the base64 string
  } catch (error) {
    console.error('Error during image processing:', error);
    return null; // Return null in case of an error
  } 
};

export const saveImageTOLocalStorage = async (base64String:any) => {
  // Define the file path
  const fileUri = FileSystem.documentDirectory + 'myImage.png'; // Change the file name and extension as needed

  // Convert base64 string to binary data
  const base64Data = base64String.replace(/^data:image\/\w+;base64,/, ''); // Remove the prefix if present

  // Validate base64 string
  if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
    throw new Error('Invalid base64 string');
  }
  // Write the file
  await FileSystem.writeAsStringAsync(fileUri, base64Data, {
    encoding: FileSystem.EncodingType.Base64,
  });

  console.log('File saved to:', fileUri);
  
  // Save to Media Library
  const asset = await MediaLibrary.createAssetAsync(fileUri);
  console.log('File saved to Media Library:', asset);
};

/*
export const saveImageToGallery = async (base64String: any, fileName = 'image.jpg') => {
  try {
    // Request media library permissions
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'We need storage permission to save the image.');
      return;
    }

    // Ensure base64String is not empty
    if (!base64String) {
      throw new Error('Base64 string is empty');
    }

    // If the base64String contains a data URI, strip out the prefix
    let base64Code = base64String;
    if (base64String.startsWith('data:image/')) {
      const base64Parts = base64String.split(';base64,');
      if (base64Parts.length > 1) {
        base64Code = base64Parts[1]; // Extract only the Base64 part
      } else {
        throw new Error('Invalid Base64 image data');
      }
    }

    // Check if the Base64 string is valid (length must be divisible by 4)
    if (base64Code.length % 4 !== 0) {
      throw new Error('Base64 string is not valid: incorrect length');
    }

    // Define file path for saving
    const filePath = FileSystem.documentDirectory + fileName;

    // Write the Base64 string to the file system
    await FileSystem.writeAsStringAsync(filePath, base64Code, {
      encoding: FileSystem.EncodingType.Base64,
    });

    // Save the image file to the device gallery
    await MediaLibrary.saveToLibraryAsync(filePath);

    // Show success message
    Alert.alert('Success', 'Image saved to your gallery.');
  } catch (error: any) {
    console.error('Error saving image:', error);
    Alert.alert('Error', `Failed to save the image: ${error.message}`);
  }
};
*/

// Helper function to reduce the ratio
export const reduceRatio = (numerator: number, denominator: number) => {
  let temp;
  let left;
  let right;

  const gcd = (a: any, b: any) => {
    if (b === 0) return a;
    return gcd(b, a % b);
  };

  if (numerator === denominator) return '1:1';

  if (+numerator < +denominator) {
    temp = numerator;
    numerator = denominator;
    denominator = temp;
  }

  const divisor = gcd(+numerator, +denominator);

  if (typeof temp === 'undefined') {
    left = numerator / divisor;
    right = denominator / divisor;
  } else {
    left = denominator / divisor;
    right = numerator / divisor;
  }

  if (left === 8 && right === 5) {
    left = 16;
    right = 10;
  }

  return `${left}:${right}`;
};

// Define the sortFormats function
export const sortFormats = (a: CameraDeviceFormat, b: CameraDeviceFormat) => {
  const aResolution = a.photoWidth * a.photoHeight;
  const bResolution = b.photoWidth * b.photoHeight;
  return bResolution - aResolution; // Sort in descending order of resolution
};

export const cropImage = async (path: string, imageWidth: number, imageHeight: number) => {
  try {
    if (!path || !imageWidth || !imageHeight) {
      throw new Error("Path, imageWidth, and imageHeight are required for cropping.");
    }

    // Desired aspect ratio (4:3) for the height
    const aspectRatio = 4 / 3;

    // Calculate the crop height based on the aspect ratio, but maintain the width
    let cropHeight = imageWidth * aspectRatio;  // Calculate height based on the 4:3 aspect ratio
    if (cropHeight > imageHeight) {
      cropHeight = imageHeight;  // If the calculated height exceeds the image height, use the full height
    }

    // Center the crop vertically while maintaining the full width
    const cropRect = {
      originX: 0,  // No horizontal cropping, keep the full width
      originY: (imageHeight - cropHeight) / 2,  // Center the crop vertically
      width: imageWidth,  // Keep the full width
      height: cropHeight,  // Apply the calculated height
    };

    // Perform cropping using ImageManipulator
    const result = await ImageManipulator.manipulateAsync(path, [
      {
        crop: cropRect,  // Cropping action
      },
    ]);
    return result.uri;  // Returns the URI of the cropped image
  } catch (error) {
    console.error("Error cropping image:", error);
    throw error;
  }
};

