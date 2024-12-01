import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper function to check if email is new
export const isEmailNew = async (email: string): Promise<boolean> => {
  const storedEmails = await AsyncStorage.getItem('loggedEmails');
  const loggedEmails = storedEmails ? JSON.parse(storedEmails) : [];

  if (loggedEmails.includes(email)) {
    return false; // Email has logged in before
  } else {
    loggedEmails.push(email);
    await AsyncStorage.setItem('loggedEmails', JSON.stringify(loggedEmails));
    return true; // Email is new
  }
};