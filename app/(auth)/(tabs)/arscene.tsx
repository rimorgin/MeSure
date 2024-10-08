import { useSession } from "@/app/ctx";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useIsAppFirstLaunchStore } from "@/state/appStore";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context'


export default () => {
  const { signOut } = useSession();
  
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch)
  const resetFirstLaunch =  useIsAppFirstLaunchStore(({ resetFirstLaunch }) => resetFirstLaunch);

  const handlePress  = () => {
    signOut()
    resetFirstLaunch()
  }


  return (
    <SafeAreaView style={styles.f1}>
    <ThemedView >
        <ThemedText type="title">Explore</ThemedText>

        <ThemedText type="title">{firstLaunch.toString()}</ThemedText>
        
        <TouchableOpacity onPress={()=> alert(`${process.env.EXPO_PUBLIC_MMKV_ENCRYPTION_KEY}`)}><ThemedText type="default">ExpoKey</ThemedText></TouchableOpacity>

        <TouchableOpacity 
        onPress={handlePress}><ThemedText type="default">SignOut</ThemedText></TouchableOpacity>
    </ThemedView>
    </SafeAreaView>
  );
};

var styles = StyleSheet.create({
  f1: { flex: 1, backgroundColor:  '#66000000' },
});