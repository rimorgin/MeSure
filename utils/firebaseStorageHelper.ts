import storage from '@react-native-firebase/storage';

// Upload profile image to Firebase Storage
export const uploadProfileImage = async (userId: string, imageUri: any) => {
  try {
    const reference = storage().ref(`profiles/${userId}.jpg`);
    await reference.putFile(imageUri);
    const url = await reference.getDownloadURL();
    console.log('Profile image uploaded successfully!');
    return url; // Return the download URL
  } catch (error: any) {
    console.error('Error uploading profile image:', error.message);
  }
};

// Delete profile image from Firebase Storage
export const deleteProfileImage = async (userId: string) => {
  try {
    const reference = storage().ref(`profiles/${userId}.jpg`);
    await reference.delete();
    console.log('Profile image deleted successfully!');
  } catch (error: any) {
    console.error('Error deleting profile image:', error.message);
  }
};
