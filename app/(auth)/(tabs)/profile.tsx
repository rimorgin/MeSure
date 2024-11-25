import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Dimensions, Switch, FlatList } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useSession } from '@/provider/AuthContext';
import { useColorSchemeStore, useIsAppFirstLaunchStore, useUserStore, useUserMeasurementStorage } from '@/store/appStore';
import { appData } from '@/assets/data/appData';
import { Colors, darkBrown, white } from '@/constants/Colors';
import ThemedDivider from '@/components/ThemedDivider';
import auth from '@react-native-firebase/auth';
import { Collapsible } from '@/components/Collapsible';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { router } from 'expo-router';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import * as WebBrowser from 'expo-web-browser';
import { PurchasesCard } from '@/components/ThemedCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const data = [
  {
    id: 0,
    name: 'to pay',
    iconProvider: 'MaterialIcons',
    iconName: 'payments',
    link: 'payments'
  },
  {
    id: 1,
    name: 'to ship',
    iconProvider: 'MaterialCommunityIcons',
    iconName: 'shipping-pallet',
    link: 'ship',
  },
  {
    id: 2,
    name: 'to receive',
    iconProvider: 'MaterialIcons',
    iconName: 'local-shipping',
    link: 'receive'
  },
  {
    id: 3,
    name: 'to rate',
    iconProvider: 'MaterialIcons',
    iconName: 'star-rate',
    link: 'rate'
  }
]

const { width } = Dimensions.get('screen');

export default function ProfileScreen() {
    const { signOut } = useSession();
    const theme = useColorSchemeTheme() ?? 'light';
    const { toggleTheme } = useColorSchemeStore();
    const isEnabled = theme === 'dark';
    const { resetApp } = useIsAppFirstLaunchStore();
    const userFullName = useUserStore((state) => state.userFullName);
    const { fingerMeasurements, wristMeasurement } = useUserMeasurementStorage();
    const [result, setResult] = useState(null);

    const nameParts = userFullName?.split(' ') || [];

    // Set the first word as the first name
    const firstName = nameParts[0] || '';

    // Set the last word as the last name
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';

    
    const handleSignOut = () => {
      signOut();
    }

    const handleToggleScheme = () => {
      toggleTheme(theme === 'light' ? 'dark' : 'light');
    };

    // Function to open an external link
  const handleOpenInAppBrowser = async (url: any) => {
    try {
      const result = await WebBrowser.openBrowserAsync(url, {
        enableBarCollapsing: true, // Allows the toolbar to collapse
        dismissButtonStyle: 'close', // Adds a close button
        showTitle: true

      });

      if (result.type === 'dismiss') {
        console.log('Browser dismissed by the user');
      }
    } catch (error: any) {
      console.error('Error opening in-app browser:', error.message);
    }
  };
  return (
    <ParallaxScrollView
      headerHeight={width * 0.5}
      roundedHeader
      headerBackgroundColor={{ light: darkBrown, dark: '#1D3D47' }}
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
              {firstName} {'\n'} {lastName}
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
        <ThemedView style={styles.mainContainer}>
          <ThemedText type="default" style={{marginVertical:10}}>Purchases</ThemedText>  
          <ThemedView style={styles.inventories}>
            <FlatList
              data={data}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{justifyContent:'space-between'}}
              renderItem={({item}) => <PurchasesCard item={item} isOdd={false}/>}
            />
          </ThemedView>
          <ThemedText type="default" style={{marginVertical:10}}>Inventories</ThemedText>
          <ThemedView style={styles.inventories}>
            <Collapsible 
              transparent
              icon='resize'
              dropdownIconPlacement='right'
              title='Saved Measurements'
              height={!fingerMeasurements.index && 
                    !fingerMeasurements.middle && 
                    !fingerMeasurements.pinky &&
                    !fingerMeasurements.ring &&
                    !fingerMeasurements.thumb ? 150 : 250
                  }
            >
              <ThemedView
                transparent
                style={styles.dropdownContent}
              >
                <ThemedView  transparent style={{flexDirection:'row'}}> 
                  <ThemedView transparent style={{gap:5 }}>
                  <ThemedText 
                    type="default" 
                    style={{width:100}}
                    textAligned={!fingerMeasurements.index && 
                    !fingerMeasurements.middle && 
                    !fingerMeasurements.pinky &&
                    !fingerMeasurements.ring &&
                    !fingerMeasurements.thumb ? 'center' : 'left'
                  }
                  >{!fingerMeasurements.index && 
                    !fingerMeasurements.middle && 
                    !fingerMeasurements.pinky &&
                    !fingerMeasurements.ring &&
                    !fingerMeasurements.thumb ? `No saved finger sizes yet.` : (
                    <>
                      
                      <ThemedText font='montserratSemiBold'>Thumb: </ThemedText>
                      {`${fingerMeasurements.thumb} \n`} 
                      <ThemedText font='montserratSemiBold'>Index: </ThemedText>
                      {`${fingerMeasurements.index} \n`}
                      <ThemedText font='montserratSemiBold'>Middle: </ThemedText>
                      {`${fingerMeasurements.middle} \n`} 
                      <ThemedText font='montserratSemiBold'>Ring: </ThemedText>
                      {`${fingerMeasurements.ring} \n`}
                      <ThemedText font='montserratSemiBold'>Pinky: </ThemedText>
                      {`${fingerMeasurements.pinky} \n`}
                    </>
                  )}
                  </ThemedText>
                  </ThemedView>
                  <ThemedDivider orientation='vertical' opacity={0.2} marginX={10}/>
                  <ThemedView transparent style={{gap:5}}>
                    <ThemedText 
                      type="default" 
                      textAligned='center'
                      style={{width:100}}
                    >{!wristMeasurement ? `No saved wrist size yet.` : (
                      <>
                        <ThemedText font='montserratSemiBold'>Wrist: </ThemedText>
                        {`${wristMeasurement} \n`} 

                      </>
                    )}
                    </ThemedText>
                  </ThemedView>
                </ThemedView>
                <ThemedView
                  transparent
                  style={{flexDirection:'row', gap: 10}}>
                <ThemedTouchableFilled
                    variant='opacity'
                    onPress={() => router.push('/(camera)')}
                >
                  <ThemedText type="default">Find size</ThemedText>
                </ThemedTouchableFilled>
                <ThemedTouchableFilled
                    variant='opacity'
                    onPress={() => router.push('/(camera)')}
                >
                  <ThemedText type="default">Add Manually</ThemedText>
                </ThemedTouchableFilled>
                </ThemedView>
              </ThemedView>
            </Collapsible>
            <ThemedDivider width={1.2} opacity={0.1} marginY={5}/>
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
            <ThemedDivider width={1.2}  opacity={0.1} marginY={3}/>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.push('/(account)/')}
            >
              <MaterialCommunityIcons 
                name="account-cog" 
                size={25} 
                color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              />
              <ThemedText type="default">Account Settings</ThemedText>
            </TouchableOpacity>
           
            <ThemedDivider width={1.2}  opacity={0.1} marginY={3}/>
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

            <TouchableOpacity
              style={styles.button}
              onPress={resetApp}
            >
              <Ionicons
                name='refresh'
                size={25}
                color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              />
              <ThemedText type="default">RESET // debugging only</ThemedText>
            </TouchableOpacity>
            <ThemedView transparent> 
              <ThemedText
                style={{ marginBottom: 10 }}
              >
                Check out this link:
              </ThemedText>
              <ThemedText>{result && JSON.stringify(result)}</ThemedText>
              <TouchableOpacity 
              onPress={() => handleOpenInAppBrowser('https://google.com')}>
                <ThemedText type='link'>sample external in-app web</ThemedText>
              </TouchableOpacity>
            </ThemedView>
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
        </ThemedView>
      
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1, 
    width: '100%',
    paddingBottom: 65
  },
  inventories: {
    alignItems:'flex-start',
    gap: 8,
    backgroundColor: '#F1F0F0',
    //borderWidth: 2,
    //borderColor: darkBrown,
    padding: 10,
    borderRadius: 20,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
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
