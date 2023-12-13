import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, View } from 'react-native';
import { useFonts } from 'expo-font';
import TopBarComponent from './Components/TopBarComponent';
import MainAppNavigator from './Components/MainAppNavigator';
import AppEntryNavigator from './Components/AppEntryNavigator';
import { useEffect } from 'react/cjs/react.development';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BackgroundImage from './utility/BackGroundImage';


const Stack = createStackNavigator();

export default function App() {
    const [hasLoggedIn, setHasLoggedIn] = React.useState(false); // triggeröi kumpi navigaattori käytössä returnissa
    const [userData, setUserData] = React.useState(null); // käyttäjän tiedontallennukseen ja välittämiseen



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
        
      
        <View style={{ flex: 1} }>
          {hasLoggedIn ? (
              <>
              
              <GestureHandlerRootView>
              <View style={{ height: screenHeight * 0.1}}> 
                <TopBarComponent handleLogOut={handleLogOut} userRole={userData?.role} /> 
              </View>
              </GestureHandlerRootView>
                <MainAppNavigator screenProps={{ userData: userData, handleLogout: handleLogOut}}/>
              </>
          ) : (
              <AppEntryNavigator handleLogin={handleLogin} handleLogOut={handleLogOut} setUserData={setUserData} />
          )}
        </View>
        <StatusBar style="auto" />
      </NavigationContainer>
  )
  
}

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
  
});