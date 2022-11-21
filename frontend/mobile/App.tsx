import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={[styles.h4, styles.textCenter]}>Hello world</Text>
      <Text>when you're free... I'd really like to have a meeting so you can help me with some stuff in my setup environment. pretty sure I'm missing something super small, and I spent 2 hours yesterday just searching and searching but not getting anything.</Text>
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
    paddingHorizontal: 40,
  },
  textCenter:{
    textAlign: 'center',
  },
  h4:{
    fontSize: 20,
    fontWeight: 'bold',
  }
});
