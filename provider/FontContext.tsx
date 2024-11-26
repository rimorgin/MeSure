import React, { createContext, useContext, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

type FontContextType = {
  fontsLoaded: boolean;
  fontStyles: {
    borelRegular: string,
    cocoGothicLight: string;
    cocoGothicUltraLight: string;
    cocoGothicRegular: string;
    cocoGothicBold: string;
    emilysCandyRegular: string;
    glacialIndifferenceRegular: string;
    glacialIndifferenceBold: string;
    glacialIndifferenceItalic: string;
    itcNewBaskerville: string; // Added ITCNewBaskerville to font styles
    montserratRegular: string;
    montserratExtraLight: string;
    montserratLight: string;
    montserratThin: string;
    montserratMedium: string;
    montserratBold: string;
    montserratSemiBold: string;
    spaceMonoRegular: string;
    twinkleStarRegular: string;
  };
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, fontError] = useFonts({
    'Borel-Regular': require('@/assets/fonts/Borel-Regular.ttf'),
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'CocoGothic-Light': require('@/assets/fonts/CocoGothic-Light.ttf'),
    'CocoGothic-UltraLight': require('@/assets/fonts/CocoGothic-UltraLight.ttf'),
    'CocoGothic-Regular': require('@/assets/fonts/CocoGothic-Regular.ttf'),
    'CocoGothic-Bold': require('@/assets/fonts/CocoGothic-Bold.ttf'),
    'EmilysCandy-Regular': require('@/assets/fonts/EmilysCandy-Regular.ttf'),
    'GlacialIndifference-Regular': require('@/assets/fonts/GlacialIndifference-Regular.otf'),
    'GlacialIndifference-Bold': require('@/assets/fonts/GlacialIndifference-Bold.otf'),
    'GlacialIndifference-Italic': require('@/assets/fonts/GlacialIndifference-Italic.otf'),
    'ITCNewBaskerville': require('@/assets/fonts/ITCNewBaskerville.otf'),
    'Montserrat-Regular': require('@/assets/fonts/Montserrat-Regular.ttf'),
    'Montserrat-ExtraLight': require('@/assets/fonts/Montserrat-ExtraLight.ttf'),
    'Montserrat-Light': require('@/assets/fonts/Montserrat-Light.ttf'),
    'Montserrat-Thin': require('@/assets/fonts/Montserrat-Thin.ttf'),
    'Montserrat-Medium': require('@/assets/fonts/Montserrat-Medium.ttf'),
    'Montserrat-Bold': require('@/assets/fonts/Montserrat-Bold.ttf'),
    'Montserrat-SemiBold': require('@/assets/fonts/Montserrat-SemiBold.ttf'),
    'TwinkleStar-Regular': require('@/assets/fonts/TwinkleStar-Regular.ttf'),

  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  // Define all available font styles here
  const fontStyles = {
    borelRegular: 'Borel-Regular',
    spaceMonoRegular: 'SpaceMono-Regular',
    cocoGothicLight: 'CocoGothic-Light',
    cocoGothicUltraLight: 'CocoGothic-UltraLight',
    cocoGothicRegular: 'CocoGothic-Regular',
    cocoGothicBold: 'CocoGothic-Bold',
    emilysCandyRegular: 'EmilysCandy-Regular',
    glacialIndifferenceRegular: 'GlacialIndifference-Regular',
    glacialIndifferenceBold: 'GlacialIndifference-Bold',
    glacialIndifferenceItalic: 'GlacialIndifference-Italic',
    itcNewBaskerville: 'ITCNewBaskerville',
    montserratRegular: 'Montserrat-Regular',
    montserratExtraLight: 'Montserrat-ExtraLight',
    montserratLight: 'Montserrat-Light',
    montserratThin: 'Montserrat-Thin',
    montserratMedium: 'Montserrat-Medium',
    montserratBold: 'Montserrat-Bold',
    montserratSemiBold: 'Montserrat-SemiBold',
    twinkleStarRegular: 'TwinkleStar-Regular'
  };

  return (
    <FontContext.Provider value={{ fontsLoaded, fontStyles }}>
      {children}
    </FontContext.Provider>
  );
};

export const useFont = () => {
  const context = useContext(FontContext);
  if (!context) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
};
