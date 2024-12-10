import { useLocalSearchParams, useRouter } from "expo-router";
import {
  StyleSheet,
  Switch,
  View,
} from "react-native";

import { useMediaLibraryPermissions } from "expo-image-picker";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import { Ionicons } from "@expo/vector-icons";
import FocusAwareStatusBar from "@/components/navigation/FocusAwareStatusBarTabConf";
import { useEffect, useState } from "react";

const ICON_SIZE = 26;

export default function PermissionsScreen() {
  const router = useRouter();
  const { routeBack, arlink } = useLocalSearchParams<{routeBack: string, arlink:string}>();
  const [cameraPermissionStatus, setCameraPermissionStatus] =
   useState<CameraPermissionStatus>("not-determined");

  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    useMediaLibraryPermissions();

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();

    setCameraPermissionStatus(permission);
  };

  console.log(routeBack)
  console.log(arlink)

  useEffect(() => {
    if (
    cameraPermissionStatus === "granted" &&
    mediaLibraryPermission?.granted
    ) {
      if (routeBack === 'visioncamera') {
        router.replace(`/(camera)/visioncamera`);
      } else if (routeBack === 'arcamera') {
        router.replace(`/(camera)/arcamera?arlink=${arlink}`);
      }
    }
  })

  

  return (
    <ThemedView style={styles.container}>
    <FocusAwareStatusBar barStyle="dark-content" animated />
    <View style={styles.spacer} />
    
    <View style={styles.title}>
        <ThemedText font='cocoGothicRegular' type="subtitle" style={styles.subtitle}>
        MeSure needs access to a few permissions in order to work properly.
        </ThemedText>
    </View>
    <View style={styles.spacer} />

    <View style={[styles.row, {marginLeft: 10}]}>
        <Ionicons
        name="lock-closed-outline"
        color={"orange"}
        size={ICON_SIZE}
        />
        <ThemedText style={styles.footnote}>REQUIRED</ThemedText>
    </View>

    <View style={styles.spacer} />

   <View
        style={StyleSheet.compose(styles.row, styles.permissionContainer)}
    >
        <Ionicons name="library-outline" color={"gray"} size={ICON_SIZE} />
        <View style={styles.permissionText}>
        <ThemedText type="subtitle">Library</ThemedText>
        <ThemedText>Used for saving, viewing and more.</ThemedText>
        </View>
        <Switch
        trackColor={{ false: '#767577', true: '#563126' }}
        thumbColor={mediaLibraryPermission?.granted ? '#f5dd4b' : '#f4f3f4'}
        value={mediaLibraryPermission?.granted}
        ios_backgroundColor="#3e3e3e"
        // @ts-ignore
        onChange={async () => await requestMediaLibraryPermission()}
        />
    </View>

    <View style={styles.spacer} />
     <View
        style={StyleSheet.compose(styles.row, styles.permissionContainer)}
    >
        <Ionicons name="camera-outline" color={"gray"} size={ICON_SIZE} />
        <View style={styles.permissionText}>
        <ThemedText type="subtitle">Camera</ThemedText>
        <ThemedText>Used for taking photos, measuring finger sizes, and try ons.</ThemedText>
        </View>
        <Switch
        trackColor={{ false: '#767577', true: '#563126' }}
        thumbColor={cameraPermissionStatus === "granted" ? '#f5dd4b' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        value={cameraPermissionStatus === "granted"}
        onChange={requestCameraPermission}
        />
    </View>
    

    <View style={styles.spacer} />
    <View style={styles.spacer} />
    <View style={styles.spacer} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title:{
    alignItems: 'center',
    justifyContent: 'center',
    flex: 0.4
  },
  subtitle: {
    textAlign: "center",
    fontSize: 22
  },
  footnote: {
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 2,
    marginLeft: 5
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  spacer: {
    marginVertical: 8,
  },
  permissionContainer: {
    backgroundColor: "#ffffff20",
    borderRadius: 10,
    padding: 10,
    justifyContent: "space-between",
  },
  permissionText: {
    marginLeft: 10,
    flexShrink: 1,
  },
  continueButton: {
    padding: 10,
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 50,
    alignSelf: "center",
  },
});