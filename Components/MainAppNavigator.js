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
import UpdatePasswordScreen from '../Screens/UpdatePassword';
import OtherHistory from '../Screens/OthersHistory';
import OtherShifts from '../Screens/OtherShifts';
import EditOthersDetails from '../allsettings/EditOthersDetails';
import EditOwnDetails from '../allsettings/EditOwnDetails';
import EditRoles from '../Screens/EditRoles';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const Stack = createStackNavigator();

export default function MainAppNavigator({handleLogin, handleLogout, setUserData, userData, getUserData}) {
    

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
            <Stack.Screen
                name="UpdatePassword"
                component={UpdatePasswordScreen}
                options={{ headerShown: false }}
            />
            <Stack.Screen

                name="OthersHistory"
                component={OtherHistory}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="OtherShifts"
                component={OtherShifts}
                options={{ headerShown: false }}
            />

            <Stack.Screen
                name="EditOwnDetails"
                component={EditOwnDetails}
                options={{ headerShown: false }}
                initialParams={{ userData: userData, handleLogout: handleLogout }}
            />
            <Stack.Screen
                name="EditOthersDetails"
                component={EditOthersDetails}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="EditRoles"
                component={EditRoles}
                options={{ headerShown: false }}
                initialParams={{currentUserRole: userData?.role, currentUserId: userData?.userId}}
            />
        </Stack.Navigator>
    )
}

 /* */