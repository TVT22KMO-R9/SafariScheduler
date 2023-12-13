import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
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

    return (    // IMAGE on default taustakuva, yläpalkki pysyy vihreänä navigaattorin taustakuva vaihtuu jos on, jos ei niin default
     
      <NavigationContainer style={styles.maincontainer}>
       
       
        <View style={{flex:1}}>
        <Image source={require('./assets/background.png')} style={styles.backgroundImage} />
          {hasLoggedIn ? (
              <>
              <View style={{flex: 1}}>
              <GestureHandlerRootView style={{backgroundColor: 'transparent',}}>
              
              <View style={{top: 0, left:0, width: '100%', height: '10%', backgroundColor: 'transparent', padding: 0, margin: 0,}}> 
                <TopBarComponent handleLogout={handleLogOut} userRole={userData?.role} /> 
              </View>
              </GestureHandlerRootView>
              
                <MainAppNavigator screenProps={{ userData: userData, handleLogout: handleLogOut}}/>
                </View>
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
  backgroundImage: {
    position: 'absolute',
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover',
    zIndex: -1,
  },
  maincontainer: {
    flex: 1,
    backgroundColor: 'transparent',
   
    width: screenWidth,
    height: screenHeight,
    position: 'absolute',
  },
  
});