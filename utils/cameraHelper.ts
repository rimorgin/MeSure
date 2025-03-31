import { CameraDeviceFormat } from "react-native-vision-camera";
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

// cameraHelpers.js
export const getCoinWidth = (coin: number) => {
  switch (coin) {
    case 1:
      return '23.0';
    case 5:
      return '25.0';
    case 10:
      return '27.0';
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
  return `https://python.jaitolentino.studio/${urlScheme}`;
  //return `http://172.20.10.2:8080/${urlScheme}`;
  //return `http://172.16.0.20:8080/${urlScheme}`
  // return `http://10.168.20.104:8080/
};


export const processImageHelper = async (photo: any, coin: number, bodyPart: string) => {
  const width = getCoinWidth(coin);
  const url = getBodyPartSpecificURL(bodyPart)

  console.log('url-used ',url)

  try {
    if (!photo) {
      console.error('No photo to process!');
      return;
    }

    const formData = new FormData();
    const fileName = typeof photo === 'string' ? photo.split('/').pop() : photo?.path?.split('/').pop();
    const photoUri = typeof photo === 'string' ? photo : `file://${photo?.path}`;

    formData.append('image', { uri: photoUri, type: 'image/jpeg', name: fileName || 'image.jpg' } as any);
    formData.append('width', String(20.5));

    const response = await fetch(url, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Server returned an error: ${response.status} - ${response.statusText}`);
    }

    // Parse the response based on content type
    const contentType = response.headers.get('Content-Type');

    if (contentType?.includes('application/json')) {
      const json = await response.json();
      console.log("JSON: "+json['finger_measurements']);
      // Extract the measurements and image from the response
      const { finger_measurement, wrist_measurement, hand_label, processed_image } = json;

      // Return the measurements and processed image (Base64 string)
      return {
        finger_measurement,
        wrist_measurement,
        hand_label,
        processed_image, // This is already in Base64 format
      };
      } else {
      throw new Error('Unsupported response type from the server.');
    }
  } catch (error) {
    console.error('Error during image processing:', error);
    return null; // Return null in case of an error
  } 
};

export const saveImageToGallery = async (base64String: any, user: string, label: string) => {
  try {
   
   // Define the file path (adjust the file name and extension as needed)
    const fileUri = FileSystem.documentDirectory + `${user}-${label}.jpg`; // Using .jpg as the file extension

    // Remove the base64 prefix (data:image/jpeg;base64,)
    const base64Data = base64String.replace(/^data:image\/\w+;base64,/, '');

    // Validate the base64 string
    if (!/^[A-Za-z0-9+/=]+$/.test(base64Data)) {
      throw new Error('Invalid base64 string');
    }

    // Write the file to the document directory
    await FileSystem.writeAsStringAsync(fileUri, base64Data, {
      encoding: FileSystem.EncodingType.Base64,
    });

    //console.log('File saved to:', fileUri);

    // Save to the media library (gallery)
    const asset = await MediaLibrary.createAssetAsync(fileUri);
    //console.log('File saved to Media Library:', asset);

    // Optionally, save it to an album
    const album = await MediaLibrary.getAlbumAsync('MeSure');
    if (album == null) {
      await MediaLibrary.createAlbumAsync('MeSure', asset, false);
    } else {
      await MediaLibrary.addAssetsToAlbumAsync([asset], album.id, false);
    }

    return asset;
  } catch (error) {
    console.error('Error saving image:', error);
  }
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