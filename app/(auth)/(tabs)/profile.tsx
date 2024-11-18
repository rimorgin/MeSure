import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Dimensions, useColorScheme, Switch } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/provider/AuthContext';
import { useColorSchemeStore, useIsAppFirstLaunchStore } from '@/state/appStore';
import { appData } from '@/assets/data/appData';
import { Colors, white } from '@/constants/Colors';
import ThemedDivider from '@/components/ThemedDivider';
import auth from '@react-native-firebase/auth';
import { Collapsible } from '@/components/Collapsible';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { router } from 'expo-router';
import useColorSchemeTheme from '@/hooks/useColorScheme';


const { width } = Dimensions.get('screen');

export default function ProfileScreen() {
    const { signOut } = useSession();
    const theme = useColorSchemeTheme() ?? 'light';
    const { toggleTheme } = useColorSchemeStore();
    const isEnabled = theme === 'dark';

    const handleSignOut = () => {
      signOut();
    }

    const handleToggleScheme = () => {
      toggleTheme(theme === 'light' ? 'dark' : 'light');
    };

  return (
    <ParallaxScrollView
      headerHeight={width * 0.5}
      roundedHeader
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/dark-bgcloth.png')}
          style={styles.headerImg}
        />
      }
      headerOverlayedContent={
        <ThemedView
          transparent
          style={styles.headerContent}
        >
          <ThemedView
            transparent
            style={{flexDirection: 'column', gap: 5}}
          >
            <ThemedText
              font='cocoGothicBold'
              type='title'
              customColor={white}
              style={{marginLeft:-10}}
            >
              Vondat {'\n'} Gatchalian
            </ThemedText>
            <ThemedText
              font='montserratLight' 
              type="default"
              customColor={white}
            >{auth().currentUser?.email}
            </ThemedText>
          </ThemedView>
          <Image 
            source={appData.profile.dp}
            style={styles.avatar}
          />
        </ThemedView>
      }
      >
      <ThemedText type="default" style={{marginVertical:10}}>Inventories</ThemedText>
      <ThemedView style={styles.inventories}>
        <Collapsible 
          transparent
          icon='resize'
          dropdownIconPlacement='right'
          title='Saved Measurements'
          height={150}
        >
          <ThemedView
            transparent
            style={styles.dropdownContent}
          >
             <ThemedText 
              type="default" 
              textAligned='center'
            >You currently have no saved measurements.
            </ThemedText>
             <ThemedTouchableFilled
                variant='opacity'
                onPress={() => router.push('/(auth)/(tabs)/camera')}
             >
              <ThemedText type="default">Add Measurement</ThemedText>
             </ThemedTouchableFilled>
          </ThemedView>
        </Collapsible>
        <ThemedDivider width={1.2} marginY={5}/>
        <Collapsible 
          transparent
          icon='hand-right'
          dropdownIconPlacement='right'
          title='Saved Try-Ons'
          height={150}
        >
          <ThemedView
            transparent
            style={styles.dropdownContent}
          >
            <ThemedText 
              type="default" 
              textAligned='center'
            >    No saved try-ons yet. Browse and save your favorites here.
            </ThemedText>
             <ThemedTouchableFilled
                variant='opacity'
                onPress={() => router.push('/(auth)/(tabs)/')}
             >
              <ThemedText type="default">Browse now</ThemedText>
             </ThemedTouchableFilled>
          </ThemedView>
        </Collapsible>
        
      </ThemedView>
      <ThemedText type="default" style={{marginVertical:10}}>Preferences</ThemedText>
      <ThemedView style={styles.inventories}>
        <TouchableOpacity
          style={styles.button}
          onPress={handleToggleScheme}
        >
           <Ionicons
            name={theme === 'light' ? 'sunny' : 'moon'}
            size={25}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
          <ThemedText type="default">Theme</ThemedText>
          <Switch
            trackColor={{ false: '#767577', true: '#563126' }}
            thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleScheme}
            value={isEnabled}
            style={{position:'absolute', right: 0}}
          />
        </TouchableOpacity>
        <ThemedDivider width={1.2} marginY={3}/>
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignOut}
        >
           <Ionicons
            name='log-out'
            size={25}
            color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          />
          <ThemedText type="default">Logout</ThemedText>
        </TouchableOpacity>
        {/* 
        <ThemedDivider />
        
        <TouchableOpacity
          style={styles.button}
          onPress={resetApp}
        >
         
          <ThemedText type="default">Reset First Launch</ThemedText>
        </TouchableOpacity>
        */}
      </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1, 
    alignItems:'flex-start',
    gap: 8,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    width: '100%'
  },
  inventories: {
    alignItems:'flex-start',
    gap: 8,
    backgroundColor: '#F0F0F0',
    borderWidth: 2,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 20,
    width: '100%'
  },
  dropdownContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -18,
    gap: 10
  },
  avatar: {
    borderRadius: 40,
    width: width * 0.30,
    height: width * 0.30,
  },
  headerContent: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    height: '100%'
  },
  headerImg: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0.888
  },
  button: {
    padding: 5,
    marginLeft: 5,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  }
});
