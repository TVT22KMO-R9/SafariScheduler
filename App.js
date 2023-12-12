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
import DeleteShifts from './Screens/DeleteShifts';
import MyShifts from './Screens/MyShifts';
import History from './Screens/History';
import EditEmails from './Screens/EditEmails';
import OtherShifts from './Screens/OtherShifts';
import OtherHistory from './Screens/OthersHistory';

const Stack = createStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'Saira-Regular': require('./assets/fonts/Saira-Regular.ttf'),
  });
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Welcome"
          component={Welcome}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUser}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ShiftScreen"
          component={ShiftScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ReportHours"
          component={ReportHours}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="ManageShifts"
          component={ManageShifts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="DeleteShifts"
          component={DeleteShifts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="MyShifts"
          component={MyShifts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OtherShifts"
          component={OtherShifts}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="OthersHistory"
          component={OtherHistory}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="History"
          component={History}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="EditEmails"
          component={EditEmails}
          options={{ headerShown: false }}
        />
          
      </Stack.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}