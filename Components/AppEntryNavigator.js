import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Splash from '../Screens/Splash';
import Welcome from '../Screens/Welcome';
import Login from '../Screens/Login';
import CreateUser from '../Screens/CreateUser';



const Stack = createStackNavigator();

export default function AppEntryNavigator({handleLogin, handleLogOut, setUserData}) {

    


    return (
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
                    initialParams={{ login: handleLogin, setUserData: setUserData }}
                />
                <Stack.Screen
                    name="CreateUser"
                    component={CreateUser}
                    options={{ headerShown: false }}
                />
            </Stack.Navigator>
    )


}