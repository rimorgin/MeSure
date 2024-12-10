import React, { useEffect, useState } from 'react';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFont } from '@/provider/FontContext';
import { useMediaLibraryPermissions } from 'expo-image-picker';
import { useCameraPermission } from 'react-native-vision-camera';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

export default function CameraLayout() {
  const { fontStyles } = useFont();
  const [loading, setLoading] = useState(true); // State to show loading until permissions are resolved
  const [initialRoute, setInitialRoute] = useState(''); // Default to 'permissions'
  
  // Permissions state
  const { hasPermission } = useCameraPermission();
  const [mediaLibraryPermission] = useMediaLibraryPermissions();
  
  // Route from search params
  const route = useLocalSearchParams<{route: string}>();

  /* 
  useEffect(() => {
    console.log('camera 1st render ', hasPermission);
    console.log('libs 1st render ', mediaLibraryPermission?.granted);

    // Check if permissions are granted and handle route navigation
    if (hasPermission && mediaLibraryPermission?.granted) {
      if (route && !route) {
        router.replace(`/(camera)/${route}`);
      }
    } else {
      setInitialRoute('permissions');
    }

    setLoading(false); // Permissions resolved
  }, [hasPermission, mediaLibraryPermission?.granted]);
  

  if (loading) {
    // Optional: Show a loading screen while permissions are being checked
    return (
      <ThemedView style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ThemedText>Loading...</ThemedText>
      </ThemedView>
    );
  }
  */

  return (
    <Stack>
      <Stack.Screen
        name="permissions"
        options={{
          headerShown: true,
          headerTitle: 'Permissions',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 25,
            fontFamily: fontStyles.montserratBold,
          },
          headerLeft: () => (
            <TouchableOpacity style={{ left: 20 }} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={32} />
            </TouchableOpacity>
          ),
        }}
      />
      <Stack.Screen name="visioncamera" options={{ headerShown: false }} />
      <Stack.Screen name="arcamera" options={{
          headerShown: true,
          headerTitle: 'Try-On',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 25,
            fontFamily: fontStyles.montserratBold,
          },
          headerLeft: () => (
            <TouchableOpacity style={{ left: 20 }} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={32} />
            </TouchableOpacity>
          ),
        }} />
    </Stack>
  );
}
