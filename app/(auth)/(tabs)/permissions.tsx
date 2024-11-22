import * as React from "react";
import { Stack, useRouter } from "expo-router";
import {
  Alert,
  StyleSheet,
  Switch,
  TouchableHighlight,
  View,
} from "react-native";

import { useMediaLibraryPermissions } from "expo-image-picker";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { Camera, CameraPermissionStatus } from "react-native-vision-camera";
import { Ionicons } from "@expo/vector-icons";
import FocusAwareStatusBar from "@/components/navigation/FocusAwareStatusBarTabConf";

const ICON_SIZE = 26;

export default function PermissionsScreen() {
  const router = useRouter();
  const [cameraPermissionStatus, setCameraPermissionStatus] =
    React.useState<CameraPermissionStatus>("not-determined");

  const [mediaLibraryPermission, requestMediaLibraryPermission] =
    useMediaLibraryPermissions();

  const requestCameraPermission = async () => {
    const permission = await Camera.requestCameraPermission();

    setCameraPermissionStatus(permission);
  };

  React.useEffect(() => {
    if (
    cameraPermissionStatus === "granted" &&
    mediaLibraryPermission?.granted
    ) {
    router.replace("/camera");
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
        trackColor={{ true: "orange" }}
        value={mediaLibraryPermission?.granted}
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
        trackColor={{ true: "orange" }}
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