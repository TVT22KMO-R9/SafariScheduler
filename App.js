import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import Splash from './Screens/Splash';
import Welcome from './Screens/Welcome';
import Login from './Screens/Login';
import CreateUser from './Screens/CreateUser';
import ShiftScreen from './Screens/ShiftScreen';
import ReportHours from './Screens/ReportHours';
import ManageShifts from './Screens/ManageShifts';

const Stack = createStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'Saira-Black': require('./assets/fonts/Saira-Black.ttf'),
    'Jost-Black': require('./assets/fonts/Jost-Black.ttf'),
    'Saira-Thin': require('./assets/fonts/Saira-Thin.ttf'),
    'Saira-Light': require('./assets/fonts/Saira-Light.ttf'),
    'Saira-Regular': require('./assets/fonts/Saira-Regular.ttf'),
  });
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }} // Assuming you don't want a header for the splash screen
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }} // Customize your header options
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }} // Customize your header options
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUser}
          options={{ headerShown: false }} // Customize your header options
        />
        <Stack.Screen
          name="ShiftScreen"
          component={ShiftScreen}
          options={{ headerShown: false }} // Customize your header options
        />
        <Stack.Screen
          name="ReportHours"
          component={ReportHours}
          options={{ headerShown: false }} // Customize your header options
        />
        <Stack.Screen
          name="ManageShifts"
          component={ManageShifts}
          options={{ headerShown: false }} // Customize your header options
        />
        
          
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}

// If you have global styles you want to apply, you can define them here
const styles = StyleSheet.create({
  // Your styles
});