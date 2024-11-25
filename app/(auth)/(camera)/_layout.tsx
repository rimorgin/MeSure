import React, { useEffect, useState } from 'react';
import { router, Stack } from 'expo-router';
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
  const [initialRoute, setInitialRoute] = useState('permissions'); // Default to 'permissions'
  const { hasPermission } = useCameraPermission() ?? { hasPermission: false };
  const [mediaLibraryPermission] = useMediaLibraryPermissions() ?? [null];

  useEffect(() => {
    // Check permissions and set the appropriate initial route
    if (hasPermission && mediaLibraryPermission?.granted) {
      setInitialRoute('visioncamera');
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

  return (
    <Stack initialRouteName={initialRoute}>
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
    </Stack>
  );
}
