import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const fetchUserUid = async () => {
  try {
    const currentUser = await auth().currentUser; // Get the currently logged-in user
    if (currentUser) {
      const uid = currentUser.uid; // Access the UID directly
      return uid; // Return the UID
    } else {
      return null;
    }
  } catch (error) {
    return null;
  }
};

export const fetchUserDocIdByAuthId = async (authId?: string) => {
  const uid = await auth().currentUser?.uid;

  try {
    // Query the 'user' collection where the authId field matches the given uid
    const snapshot = await firestore()
      .collection('user')
      .where('authId', '==', uid)  // Matching the authId
      .limit(1)
      .get();

    // Check if documents exist
    if (!snapshot.empty) {
      // Return the document IDs as an array
      const userDocId = snapshot.docs[0].id;
      return userDocId;  // Return the array of document IDs
    } else {
      console.log('No user found with this authId');
      return '';
    }
  } catch (error) {
    console.error('Error fetching user by authId:', error);
    return '';
  }
};

export const fetchUserDocDataByAuthId = async (authId?: string) => {
  let uid;
  if (authId === '') {
    uid = fetchUserUid()
  } else {
    uid = authId;
  }
  try {
    // Query the 'user' collection where the authId field matches the given authId
    const snapshot = await firestore()
      .collection('user')
      .where('authId', '==', uid)  // Matching the authId
      .limit(1)
      .get();

    // Check if documents exist
    if (!snapshot.empty) {
      const userData = snapshot.docs[0].data(); // Extract data from the documents
      console.log(userData);  // Process the user data as needed
    } else {
      console.log('No user found with this authId');
    }
  } catch (error) {
    console.error('Error fetching user by authId:', error);
  }
};
