import { ActivityIndicator, StyleSheet, View } from 'react-native'
import { Colors } from '@/constants/Colors'

export default function Loader() {
    return (
      <View style={styles.loadingOverlay}>
        <ActivityIndicator 
          size={50} 
          color={Colors.light.tint} 
        />
      </View>
    )
}

const styles = StyleSheet.create({
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 10, // Ensure it appears on top
  },
})