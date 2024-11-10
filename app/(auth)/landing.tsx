import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import React from 'react'
import { Image, StyleSheet, TouchableOpacity, useWindowDimensions, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { useIsAppFirstLaunchStore } from '@/state/appStore'
import { useAssets } from 'expo-asset'
import { white, black } from '@/constants/Colors'
import { ThemedTouchableFilled } from '@/components/ThemedButton'

function Landing() {
  const { width, height } = useWindowDimensions(); 
  const firstLaunch = useIsAppFirstLaunchStore((state) => state.firstLaunch);
  const { setFirstLaunch } = useIsAppFirstLaunchStore();

  const [assets, error] = useAssets([require('@/assets/images/splash.png')]);
  
  const handlePress = () => {
    setFirstLaunch();
    router.push('/(auth)/(tabs)/')
  }

  

  return (
    <ThemedView style={styles.mainContainer}>
      <Image 
        style={[styles.image, {width: width, height: height,}]} 
        source={require('@/assets/images/dark-bgcloth.png')} 
      />
      <SafeAreaView style={styles.container}>
        <ThemedText 
          font='cocoGothicLight'
          type='semititle'
          customColor={white}
        > A.I. KHALAF GOLD
        </ThemedText>
        <ThemedView 
          transparent
          style={styles.andJewelry}
        >
          <ThemedText 
          font='cocoGothicRegular'
          type='subtitle'
          customColor={white}
          > &
          </ThemedText>
          <ThemedText 
          font='itcNewBaskerville'
          type='xtitle'
          customColor={white}
          > JEWELRY
          </ThemedText>
        </ThemedView>
        
        <ThemedTouchableFilled 
          onPress={handlePress}
          style={styles.button}
        >
          <ThemedText 
            font='montserratSemiBold' 
            style={{fontSize:12, letterSpacing:2}}
          > GET STARTED
          </ThemedText>
        </ThemedTouchableFilled>
      </SafeAreaView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    position: 'absolute',
  },
  andJewelry: {
    marginTop: -10,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  image: {
    resizeMode: 'cover',
    position: 'absolute',
  },
  button: {
    marginTop: 50,
    borderRadius:20,
    backgroundColor: white,
  },
})

export default Landing