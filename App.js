import React from 'react';
import { StyleSheet } from 'react-native';
import Main from './components/Main.js';
import Menu from './components/Menu.js';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';



const Stack = createNativeStackNavigator();


const App = () => {

  return (
  <NavigationContainer>
    <Stack.Navigator screenOptions={{
    headerShown: false
    }}>
      <Stack.Screen name="Main" component={Main}/>
      <Stack.Screen name="Menu" component={Menu} />
    </Stack.Navigator>
  </NavigationContainer>
  
  );
};

const styles = StyleSheet.create({
  
  
});

export default App;
