import { useState } from 'react';
import { Image, StyleSheet, TouchableOpacity, Dimensions, Switch, View, Text, TextInput } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useColorSchemeStore, useUserStore, useUserMeasurementStorage } from '@/store/appStore';
import { appData } from '@/assets/data/appData';
import { Colors, darkBrown, mustard, white } from '@/constants/Colors';
import ThemedDivider from '@/components/ThemedDivider';
import { Collapsible } from '@/components/Collapsible';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemedTouchableFilled } from '@/components/ThemedButton';
import { router } from 'expo-router';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import ThemedModal from '@/components/ThemedModal';
import RatingStars from '@/components/ratingsStars';
import Loader from '@/components/Loader';

const { width } = Dimensions.get('screen');

export default function ProfileScreen() {
    const theme = useColorSchemeTheme() ?? 'light';
    const { toggleTheme } = useColorSchemeStore();
    const { userId, userEmail, userEmailVerified } = useUserStore();
    const isEnabled = theme === 'dark';
    const userFullName = useUserStore((state) => state.userFullName);
    const { 
      fingerMeasurements, 
      wristMeasurement, 
      USSizeFingerMeasurements, 
      USSizeWristMeasurement, 
      setFingerMeasurements, 
      setWristMeasurement 
    } = useUserMeasurementStorage();
    const [rating, setRating] = useState(0);
    const [showRating, setShowRating] = useState(false);
    const [showModalAddManually, setShowModalAddManually] = useState(false);
    const [fingerSizes, addFingerSizesManually] = useState({
      thumb: '',
      index: '',
      middle: '',
      ring: '',
      pinky: '',
      });
    const [wristSize, addWristSizesManually] = useState('');
    const [showBodyPartInput, setShowBodyPartInput] = useState<'fingers' | 'wrist' | null>(null);
    const [showUsSizesFinger, setShowUsSizesFinger] = useState(false);
    const [showUsSizesWrist, setShowUsSizesWrist] = useState(false);
    const [loading, setLoading] = useState(false);

    const nameParts = userFullName?.trim().split(' ') || [];

    // Set the first word as the first name
    const firstName = nameParts[0] || '';

    // Set the last word as the last name
    const lastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : '';
    
    const handleToggleScheme = () => {
      toggleTheme(theme === 'light' ? 'dark' : 'light');
    };

    const handleFingerChange = (name: string, value: string) => {
      addFingerSizesManually((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleCancelAddSizesManually = () => {
      setShowModalAddManually(false) 
      setShowBodyPartInput(null)
    }

    const handleSubmitAddMeasurement = async (type: string) => {
      setLoading(true);
      setShowModalAddManually(false);
      if (type === 'fingers') {
        await setFingerMeasurements(userId, fingerSizes);
      } else if (type === 'wrist') {
        await setWristMeasurement(userId, wristSize)
      }
      setLoading(false)
    }

  return (
    <>
    {loading && <Loader/>}
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
            >{userEmail}
            </ThemedText>
            <ThemedText
              font='montserratLight' 
              type="default"
              textAligned='right'
              customColor={'#CCC'}
            >{userEmailVerified ? '(verified)' : '(unverified)'}
            </ThemedText>
          </ThemedView>
          <Image 
            source={appData.profile.dp}
            style={styles.avatar}
          />
        </ThemedView>
      }
      >
        <>
        {
          /* STARS RATING */
          <ThemedModal
            showModal={showRating}
            onClose={() => setShowRating(false)}
          >
            <ThemedView 
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                gap:30
              }}
            >
              <Image 
                source={require('@/assets/images/wink.png')}
                style={{height:120, width:120}}
              />
              <ThemedView style={{gap:10}}>
                <ThemedText
                  font='cocoGothicBold'
                  type='subtitle'
                  style={{textAlign: 'center'}}
                >
                  how was your experience with our app?
                </ThemedText>
                <ThemedText
                  font='montserratRegular'
                  style={{textAlign: 'center'}}
                >
                  tap a star to give your rating
                </ThemedText>
              </ThemedView>
              <RatingStars
                interactive
                rating={rating}
                size={40}
                onChange={(newRating) => setRating(newRating)}
              />

              <ThemedView style={{flexDirection: 'row', width: '100%', gap:20}}>
                <TouchableOpacity
                  onPress={() => setShowRating(false)}
                  style={{alignItems: 'center', justifyContent: 'center', borderColor: darkBrown, borderWidth: 1, borderRadius: 10, width: 80}}
                >
                  <ThemedText>CANCEL</ThemedText>
                </TouchableOpacity>
                <ThemedTouchableFilled
                  onPress={() => {}}
                > 
                  <ThemedText>SUBMIT</ThemedText>
                </ThemedTouchableFilled>
              </ThemedView>
            </ThemedView>
          </ThemedModal>
        }
        {
          /* SIZES ADD MANUALLY */
          <ThemedModal
            showModal={showModalAddManually}
            onClose={handleCancelAddSizesManually}
          >
            <ThemedView 
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                padding: 20,
                gap:30
              }}
            >
              <Image 
                source={require('@/assets/images/hand.png')}
                style={{height:120, width:120}}
              />
              <ThemedView style={{gap:10}}>
                <ThemedText
                  font='cocoGothicBold'
                  type='subtitle'
                  style={{textAlign: 'center'}}
                >
                  {showBodyPartInput ? 'enter your sizes here in mm' : 'what body part you want to add manually?'}
                </ThemedText>
                {!showBodyPartInput && (
                <ThemedText
                  font='montserratRegular'
                  style={{textAlign: 'center'}}
                >
                  pick here...
                </ThemedText>
                )}
              </ThemedView>

              {!showBodyPartInput ? (
                <ThemedView style={{flexDirection: 'row', width: '100%', gap:20}}>
                  <TouchableOpacity
                    onPress={() => setShowBodyPartInput('fingers')}
                    style={{alignItems: 'center', justifyContent: 'center', borderColor: darkBrown, borderWidth: 1, borderRadius: 10, width: 80}}
                  >
                    <ThemedText>FINGERS</ThemedText>
                  </TouchableOpacity>
                  <ThemedTouchableFilled
                    onPress={() => setShowBodyPartInput('wrist')}
                  > 
                    <ThemedText>WRIST</ThemedText>
                  </ThemedTouchableFilled>
                </ThemedView>
              ) : (
                <>
                  {showBodyPartInput === 'fingers'? (
                    <>
                      <View style={styles.row}>
                        <View>
                          <Text style={[
                            styles.text,
                            {color: theme === 'light' ? darkBrown : mustard,}
                          ]}>Thumb</Text>
                          <TextInput 
                            keyboardType='numeric'
                            style={[styles.textInput, 
                              {
                                color: theme === 'light' ? darkBrown : mustard,
                                borderColor: theme === 'light' ? darkBrown : mustard,
                              }
                            ]}
                            value={fingerSizes.thumb}
                            defaultValue={fingerSizes.thumb}
                            onChangeText={(value) => handleFingerChange('thumb', value)}
                          />
                        </View>
                        <View>
                          <Text style={[
                            styles.text,
                            {color: theme === 'light' ? darkBrown : mustard,}
                          ]}>Index</Text>
                          <TextInput 
                          keyboardType='numeric'
                          style={[styles.textInput, 
                            {
                              color: theme === 'light' ? darkBrown : mustard,
                              borderColor: theme === 'light' ? darkBrown : mustard,
                            }
                          ]}
                          value={fingerSizes.index}
                          defaultValue={fingerSizes.index}
                          onChangeText={(value) => handleFingerChange('index', value)}
                        />
                        </View>
                        <View>
                          <Text style={[
                            styles.text,
                            {color: theme === 'light' ? darkBrown : mustard,}
                          ]}>Middle</Text>
                          <TextInput 
                          keyboardType='numeric'
                          style={[styles.textInput, 
                              {
                                color: theme === 'light' ? darkBrown : mustard,
                                borderColor: theme === 'light' ? darkBrown : mustard,
                              }
                            ]}
                          value={fingerSizes.middle}
                          defaultValue={fingerSizes.middle}
                          onChangeText={(value) => handleFingerChange('middle', value)}
                        />
                        </View>
                        <View>
                          <Text style={[
                            styles.text,
                            {color: theme === 'light' ? darkBrown : mustard,}
                          ]}>Ring</Text>
                          <TextInput 
                          keyboardType='numeric'
                          style={[styles.textInput, 
                              {
                                color: theme === 'light' ? darkBrown : mustard,
                                borderColor: theme === 'light' ? darkBrown : mustard,
                              }
                            ]}
                          value={fingerSizes.ring}
                          defaultValue={fingerSizes.ring}
                          onChangeText={(value) => handleFingerChange('ring', value)}
                        />
                        </View>
                        <View>
                          <Text style={[
                            styles.text,
                            {color: theme === 'light' ? darkBrown : mustard,}
                          ]}>Pinky</Text>
                          <TextInput 
                          keyboardType='numeric'
                          style={[styles.textInput, 
                              {
                                color: theme === 'light' ? darkBrown : mustard,
                                borderColor: theme === 'light' ? darkBrown : mustard,
                              }
                            ]}
                          value={fingerSizes.pinky}
                          defaultValue={fingerSizes.pinky}
                          onChangeText={(value) => handleFingerChange('pinky', value)}
                        />
                        </View>
                      </View>
                      <ThemedView style={{flexDirection: 'row', width: '100%', gap:20}}>
                        <TouchableOpacity
                          onPress={handleCancelAddSizesManually}
                          style={{alignItems: 'center', justifyContent: 'center', borderColor: darkBrown, borderWidth: 1, borderRadius: 10, width: 80}}
                        >
                          <ThemedText>CANCEL</ThemedText>
                        </TouchableOpacity>
                        <ThemedTouchableFilled
                          onPress={() => handleSubmitAddMeasurement('fingers')}
                          disabled={!fingerSizes.thumb || !fingerSizes.middle || !fingerSizes.pinky || !fingerSizes.ring || !fingerSizes.thumb}
                          style={{backgroundColor: !fingerSizes.thumb || !fingerSizes.middle || !fingerSizes.pinky || !fingerSizes.ring || !fingerSizes.thumb ? "#CCC" : mustard}}
                        > 
                          <ThemedText>SUBMIT</ThemedText>
                        </ThemedTouchableFilled>
                      </ThemedView>
                      </>
                  ) : (
                    <>
                    <View style={styles.row}>
                      <View>
                      <Text style={styles.text}>Wrist Size</Text>
                      <TextInput 
                        keyboardType='numeric'
                        style={styles.textInput}
                        value={wristSize}
                        onChangeText={(value) => addWristSizesManually(value)}
                      />
                      </View>
                    </View>
                     <ThemedView style={{flexDirection: 'row', width: '100%', gap:20}}>
                        <TouchableOpacity
                          onPress={handleCancelAddSizesManually}
                          style={{alignItems: 'center', justifyContent: 'center', borderColor: darkBrown, borderWidth: 1, borderRadius: 10, width: 80}}
                        >
                          <ThemedText>CANCEL</ThemedText>
                        </TouchableOpacity>
                        <ThemedTouchableFilled
                          onPress={() => handleSubmitAddMeasurement('wrist')}
                          disabled={!wristSize.length}
                          style={{backgroundColor: !wristSize.length ? "#CCC" : mustard}}
                        > 
                          <ThemedText>SUBMIT</ThemedText>
                        </ThemedTouchableFilled>
                      </ThemedView>
                    </>
                  )}
                </>
              )}
            </ThemedView>
            
          </ThemedModal>
        }
        <ThemedView style={styles.mainContainer}>
          <ThemedText type="default" style={{marginVertical:10}}>Purchases</ThemedText>
          <ThemedView style={styles.buttonContainers}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.navigate('/(account)/(purchases)/(orders)')}
            >
              <ThemedView
                transparent
                style={{flexDirection: 'row', gap: 10}}
              >
                <Ionicons
                  name='receipt'
                  size={22}
                  color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                />
                <ThemedText>Your orders</ThemedText>
              </ThemedView>
              <Ionicons
                name='chevron-forward'
                size={18}
                color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              />
            </TouchableOpacity>
            <ThemedDivider width={1.2} opacity={0.1} marginY={5}/>
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.navigate('/(account)/(purchases)/reviews')}
            >
              <ThemedView
                transparent
                style={{flexDirection: 'row', gap: 10}}
              >
                <MaterialIcons 
                  name="reviews" 
                  size={22} 
                  color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                />
                <ThemedText>Your reviews</ThemedText>
              </ThemedView>
              <Ionicons
                name='chevron-forward'
                size={18}
                color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              />
            </TouchableOpacity>
          </ThemedView>
          <ThemedText type="default" style={{marginVertical:10}}>Inventories</ThemedText>
          <ThemedView style={styles.buttonContainers}>
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
                  <ThemedView transparent style={{marginTop: 10, marginBottom: -10}}>
                  {fingerMeasurements.index && 
                    fingerMeasurements.middle && 
                    fingerMeasurements.pinky &&
                    fingerMeasurements.ring &&
                    fingerMeasurements.thumb && (
                      <TouchableOpacity 
                        onPress={() => setShowUsSizesFinger(!showUsSizesFinger)}
                        style={{alignSelf: 'center', marginBottom: 5}}
                      >
                        <ThemedText style={{textDecorationLine:'underline'}}>See US Size</ThemedText>
                      </TouchableOpacity>
                    )
                  }
                  <ThemedText 
                    type="default" 
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
                      {showUsSizesFinger ? `${USSizeFingerMeasurements.thumb}\n` : `${fingerMeasurements.thumb}\n`} 
                      <ThemedText font='montserratSemiBold'>Index: </ThemedText>
                      {showUsSizesFinger ? `${USSizeFingerMeasurements.index}\n` : `${fingerMeasurements.index}\n`}
                      <ThemedText font='montserratSemiBold'>Middle: </ThemedText>
                      {showUsSizesFinger ? `${USSizeFingerMeasurements.middle}\n` : `${fingerMeasurements.middle}\n`} 
                      <ThemedText font='montserratSemiBold'>Ring: </ThemedText>
                      {showUsSizesFinger ? `${USSizeFingerMeasurements.ring}\n` : `${fingerMeasurements.ring}\n`}
                      <ThemedText font='montserratSemiBold'>Pinky: </ThemedText>
                      {showUsSizesFinger ? `${USSizeFingerMeasurements.pinky}\n` : `${fingerMeasurements.pinky}\n`}
                    </>
                  )}
                  </ThemedText>
                  </ThemedView>
                  <ThemedDivider orientation='vertical' opacity={0.2} marginX={10}/>
                  <ThemedView transparent style={{marginTop: 10, marginBottom: -10}}>
                    <ThemedText 
                      type="default" 
                      textAligned='center'
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
                    onPress={() => router.navigate('/(camera)/visioncamera')}
                >
                  <ThemedText type="default">Find size</ThemedText>
                </ThemedTouchableFilled>
                <ThemedTouchableFilled
                    variant='opacity'
                    onPress={() => setShowModalAddManually(true)}
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
                    onPress={() => router.navigate('/(auth)/(tabs)/')}
                >
                  <ThemedText type="default">Browse now</ThemedText>
                </ThemedTouchableFilled>
              </ThemedView>
            </Collapsible>
            
          </ThemedView>
          <ThemedText type="default" style={{marginVertical:10}}>Preferences</ThemedText>
          <ThemedView style={styles.buttonContainers}>
            {/*
            <TouchableOpacity
              style={styles.button}
              onPress={handleToggleScheme}
            >
              <ThemedView
                transparent
                style={{flexDirection: 'row', gap: 10}}
              >
                <Ionicons
                  name={theme === 'light' ? 'sunny' : 'moon'}
                  size={25}
                  color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                />
                <ThemedText type="default">Theme</ThemedText>
              </ThemedView>
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
            */}
            <TouchableOpacity
              style={styles.button}
              onPress={() => router.navigate('/(account)/')}
            >
              <ThemedView
                transparent
                style={{flexDirection: 'row', gap: 10}}
              >
                <MaterialCommunityIcons 
                  name="account-cog" 
                  size={25} 
                  color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                />
                <ThemedText type="default">Account Settings</ThemedText>
              </ThemedView>
               <Ionicons
                  name='chevron-forward'
                  size={18}
                  color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                />
            </TouchableOpacity>
           
            <ThemedDivider width={1.2}  opacity={0.1} marginY={3}/>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowRating(true)}
            >
              <ThemedView transparent style={{flexDirection:'row', gap: 10}}>
                <Ionicons
                  name='star'
                  size={25}
                  color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                />
                <ThemedText type="default">Rate us</ThemedText>
               </ThemedView>
              <Ionicons
                name='chevron-forward'
                size={18}
                color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              />
            </TouchableOpacity>
            
            {/*
            <ThemedDivider width={1.2}  opacity={0.1} marginY={3}/>
            <TouchableOpacity
              style={styles.button}
              onPress={handleSignOut}
            >
              <ThemedView transparent style={{flexDirection:'row', gap: 10}}>
                <Ionicons
                  name='log-out'
                  size={25}
                  color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
                />
                <ThemedText type="default">Logout</ThemedText>
               </ThemedView>
              <Ionicons
                name='chevron-forward'
                size={18}
                color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
              />
            </TouchableOpacity>
             
            <ThemedDivider />
            
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
            */}
          </ThemedView>
        </ThemedView>
        </>   
    </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex:1, 
    width: '100%',
    paddingBottom: 65
  },
  buttonContainers: {
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
    paddingHorizontal: 8,
    gap: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%'
  },
  row: {
    flexDirection:'row', 
    justifyContent: 'space-between', 
    alignItems:'center',
    width: '100%'
  },
  textInput: {
    borderWidth:3,
    padding: 3,
    paddingHorizontal: 8,
    fontSize: width * 0.04,
    textAlign: 'center',
    marginBottom:3
  },
  text: {
    marginBottom:3,
    textAlign: 'center'
  }
});
