import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import ShiftScreen from '../Screens/ShiftScreen';
import ReportHours from '../Screens/ReportHours';
import ManageShifts from '../Screens/ManageShifts';
import DeleteShifts from '../Screens/DeleteShifts';
import MyShifts from '../Screens/MyShifts';
import History from '../Screens/History';
import EditEmails from '../Screens/EditEmails';
import UploadImgScreen from '../Screens/UploadImgScreen';
import Settings from '../Screens/Settings';



const Stack = createStackNavigator();

export default function MainAppNavigator() {
    


    // TODO: pass handleLogin and handleLogout to the screens that need them

    return (
        <Stack.Navigator initialRouteName="ShiftScreen">
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
                name="History"
                component={History}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditEmails"
                component={EditEmails}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="UploadImgScreen"
                component={UploadImgScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Settings"
                component={Settings}
                options={{ headerShown: false }}
            />
          
        </Stack.Navigator>
    )
}

 /* */