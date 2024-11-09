// FontContext.tsx
import React, { createContext, useContext, useEffect } from 'react';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

type FontContextType = {
  fontsLoaded: boolean;
  fontStyles: {
    spaceMonoRegular: string;
    cocoGothicRegular: string;
    cocoGothicBold: string;
    glacialIndifferenceRegular: string;
    glacialIndifferenceBold: string;
    glacialIndifferenceItalic: string;
  };
};

const FontContext = createContext<FontContextType | undefined>(undefined);

export const FontProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [fontsLoaded, fontError] = useFonts({
    'SpaceMono-Regular': require('@/assets/fonts/SpaceMono-Regular.ttf'),
    'CocoGothic-Regular': require('@/assets/fonts/CocoGothic-Regular.ttf'),
    'CocoGothic-Bold': require('@/assets/fonts/CocoGothic-Bold.ttf'),
    'GlacialIndifference-Regular': require('@/assets/fonts/GlacialIndifference-Regular.otf'),
    'GlacialIndifference-Bold': require('@/assets/fonts/GlacialIndifference-Bold.otf'),
    'GlacialIndifference-Italic': require('@/assets/fonts/GlacialIndifference-Italic.otf'),
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
    spaceMonoRegular: 'SpaceMono-Regular',
    cocoGothicRegular: 'CocoGothic-Regular',
    cocoGothicBold: 'CocoGothic-Bold',
    glacialIndifferenceRegular: 'GlacialIndifference-Regular',
    glacialIndifferenceBold: 'GlacialIndifference-Bold',
    glacialIndifferenceItalic: 'GlacialIndifference-Italic',
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
