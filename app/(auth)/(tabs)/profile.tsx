import { Image, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/provider/AuthContext';
import { useIsAppFirstLaunchStore } from '@/state/appStore';
import { appData } from '@/data/appData';
import { white } from '@/constants/Colors';
import ThemedDivider from '@/components/ThemedDivider';

const { width } = Dimensions.get('screen');

export default function HomeScreen() {
    const { signOut } = useSession();
    const{ resetApp } = useIsAppFirstLaunchStore();

    const handleSignOut = () => {
      signOut();
    }

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
          <ThemedText
            font='cocoGothicBold'
            type='title'
            customColor={white}
            style={{marginLeft:-10}}
          >
            Vondat {'\n'} Gatchalian
          </ThemedText>
          <Image 
          source={appData.dp}
          style={styles.avatar}
        />
        </ThemedView>
        
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
        <ThemedText type="title">Saved Measurements</ThemedText>
        <ThemedDivider />
        <ThemedText type="title">Saved Try Ons</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
  
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
    padding: 16,
  }
});
