import { StyleSheet, Platform, SafeAreaView, StatusBar, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Ionicons } from '@expo/vector-icons';
import useColorSchemeTheme from '@/hooks/useColorScheme';
import { Colors } from '@/constants/Colors';
import { useState } from 'react';
import FocusAwareStatusBar from '@/components/navigation/FocusAwareStatusBarTabConf';
import { Drawer } from 'react-native-drawer-layout';

export default function Favorites() {
  const theme = useColorSchemeTheme();
  const [openFilter, setOpenFilter] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <FocusAwareStatusBar barStyle="dark-content" animated />
      <ThemedView style={styles.row}>
        <ThemedText font='montserratBold' type='title'>Favorites</ThemedText>
        <Ionicons.Button 
          style={styles.filterButton}
          name='filter' 
          size={30}
          backgroundColor='transparent'
          color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}
          onPress={() => setOpenFilter(prev => !prev)} // Correctly opens the Drawer
        />
      </ThemedView>
      <Drawer
        drawerPosition='right'
        open={openFilter}
        onOpen={() => setOpenFilter(true)}
        onClose={() => setOpenFilter(false)}
        renderDrawerContent={() => (
          <View style={styles.drawerContent}>
            <ThemedText>Filter Options</ThemedText>
          </View>
        )}
      >
        <View style={styles.mainContent}>
          <ThemedText>Main content goes here</ThemedText>
        </View>
      </Drawer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterButton: {
    paddingHorizontal: 10,
  },
  drawerContent: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 16,
  },
  mainContent: {
    flex: 1,
    padding: 16,
  },
});
