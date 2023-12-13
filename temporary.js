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
import UploadImgScreen from './Screens/UploadImgScreen';
import Settings from './Screens/Settings';
import { useEffect } from 'react/cjs/react.production.min';

const Stack = createStackNavigator();

export default function App() {
    const [hasLoggedIn, setHasLoggedIn] = React.useState(false);
    const [userData, setUserData] = React.useState(null); // käyttäjän tiedontallennukseen ja välittämiseen

    const navigation = useNavigation();

    const handleLogin = (loginResponse) => { 
        setHasLoggedIn(true);
        setUserData(loginResponse);
    }

    const handleLogOut = () => {
        setHasLoggedIn(false);
        setUserData(null);
    }

    useEffect(() => {   // ekstra vahti jotta tiedot ei varmasti jää muistiin
        if(!hasLoggedIn) {
            setUserData(null);
        }
    }, [hasLoggedIn]);

    const [fontsLoaded] = useFonts({
        'Saira-Regular': require('./assets/fonts/Saira-Regular.ttf'),
    });

    return ( 
        <NavigationContainer>
            {hasLoggedIn ? (
                <>
                <TopBarComponent handleLogOut={handleLogOut} userRole={userData?.role} navigation={navigation} /> 
                <MainAppNavigator />
                </>) : (
                    <AppEntryNavigator handleLogin={handleLogin} handleLogOut={handleLogOut} setUserData={setUserData} />
                )}
            <StatusBar style="auto" />
        </NavigationContainer>
    )
}