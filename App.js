import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>

      <Text style={{ color: '#000', fontSize: 50, marginTop: 30, marginBottom: 30, fontWeight: 'bold' }}>Hello World!</Text>

      <Text>::: REDICOM :::</Text>
      <Text style={{ color: '#999999', fontSize: 10, marginTop: 0, marginBottom: 10 }}>version 0.0.1</Text>
      
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
