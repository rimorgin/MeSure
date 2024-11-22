import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

interface userDoc {
  authId: string; // UID of the authenticated user
  name?: string;
  profile?: string;
  email: string;
  username: string;
  cart?: [];
  favorites?: [];
  measurements?: Record<string, any>; // Generic object type for measurements
}

/**
 * Creates a Firestore document for a new user upon registration.
 * @param userDoc - User document properties
 */
export async function createUserDoc({
  authId,
  name = '',
  profile = '',
  email,
  username,
  cart = [],
  favorites = [],
  measurements = {},
}: userDoc): Promise<void> {
  try {
    // Get the current authenticated user
    const currentUser = auth().currentUser;

    if (!currentUser) {
      throw new Error('User is not authenticated. Cannot create user document.');
    }

    if (currentUser.uid !== authId) {
      throw new Error('Provided authId does not match the authenticated user.');
    }

    // Prepare the document data
    const userDocData: userDoc = {
      authId,
      name,
      profile,
      email,
      username,
      cart,
      favorites,
      measurements,
    };

    // Create the document in the Firestore `user` collection with the UID as the document ID
    await firestore()
      .collection('user')
      .doc(authId)
      .set(userDocData);

    console.log('User document created successfully:', authId);
  } catch (error) {
    console.error('Error creating user document:', error);
    throw error; // Optionally rethrow the error for upstream handling
  }
}
