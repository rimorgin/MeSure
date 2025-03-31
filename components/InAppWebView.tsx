import { StyleSheet, View } from 'react-native'
import { useRef } from 'react'
import { WebView } from 'react-native-webview';

type Props = {
    uri: string
}

export default function InAppWebView({uri, ...rest}: Props) {
  const webRef = useRef(null)
  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        originWhitelist={['*']}
        source={{ uri: uri }}
      />
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})