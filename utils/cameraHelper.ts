import { CameraDeviceFormat } from "react-native-vision-camera";
import * as ImageManipulator from 'expo-image-manipulator';


export const convertBlobToBase64 = (blob: Blob) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
        resolve(reader.result); // The Base64 string is in reader.result
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
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

    const blob = await response.blob();
    const base64String = await convertBlobToBase64(blob) as string;
    return base64String; // Return the base64 string
  } catch (error) {
    console.error('Error during image processing:', error);
    return null; // Return null in case of an error
  } 
};

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