import { Image, StyleSheet, Platform, TouchableOpacity, TouchableHighlight } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/provider/AuthContext';
import { useIsAppFirstLaunchStore } from '@/state/appStore';

export default function HomeScreen() {
    const { signOut } = useSession();
    const{ resetApp } = useIsAppFirstLaunchStore();

    const handleSignOut = () => {
      signOut();
    }

  return (
    
    <ParallaxScrollView
      roundedHeader
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/dark-bgcloth.png')}
          style={styles.headerImg}
        />
      }
      headerOverlayedContent={
        <Image 
          source={require('@/assets/images/avatars/7294794.jpg')}
          style={styles.avatar}
        />
      }
      >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Profile</ThemedText>
    
        <TouchableOpacity
          style={styles.button}
          onPress={handleSignOut}
        >
            <ThemedText type="default">Logout</ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={resetApp}
        >
            <ThemedText type="default">Reset First Launch</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  profileContainer: {
    
  },
  avatar: {
    borderRadius: 40,
    width: 150,
    height: 150,
    top:50
  },
  headerImg: {
    height: '100%',
    width: '100%',
    bottom: 0,
    left: 0,
    position: 'absolute',
    //opacity: 0.2
  },
  button: {
    padding: 16,
  }
});
