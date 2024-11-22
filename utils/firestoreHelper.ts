import firestore from '@react-native-firebase/firestore';

// Save or update a user
export const saveUser = async (userId: string, userData: any) => {
  try {
    await firestore()
      .collection('users')
      .doc(userId)
      .set(userData, { merge: true }); // Merges fields instead of overwriting
    console.log('User saved/updated successfully!');
  } catch (error: any) {
    console.error('Error saving/updating user:', error.message);
  }
};

// Fetch user data
export const fetchUser = async (userId: string) => {
  try {
    const userDoc = await firestore().collection('users').doc(userId).get();
    if (userDoc.exists) {
      return userDoc.data();
    } else {
      console.log('User not found!');
      return null;
    }
  } catch (error: any) {
    
    console.error('Error fetching user:', error.message);
  }
};

// Delete user
export const deleteUser = async (userId: string) => {
  try {
    await firestore().collection('users').doc(userId).delete();
    console.log('User deleted successfully!');
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
  }
};


// Update measurements
export const updateMeasurements = async (userId: string, measurements: any) => {
  try {
    await firestore().collection('users').doc(userId).update({
      measurements: measurements,
    });
    console.log('Measurements updated successfully!');
  } catch (error: any) {
    console.error('Error updating measurements:', error.message);
  }
};

