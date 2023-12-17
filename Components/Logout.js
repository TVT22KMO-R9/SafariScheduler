import React, {useEffect} from 'react';
import { TouchableOpacity, Alert, StyleSheet, DeviceEventEmitter, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { removeToken, checkToken, getToken} from '../utility/Token';
import { RefreshTokenCheck, removeRefreshToken } from '../utility/RefreshToken';
import { LOGOUT_ENDPOINT, SERVER_BASE_URL } from '@env';
import { removeBackground, removeBackgroundURL } from '../utility/BackGroundCheck';


const Logout = ({logOut}) => {
  const navigation = useNavigation();

  useEffect(() => {
    const logOutListener = DeviceEventEmitter.addListener('logout', handleLogout);
    return () => {
      logOutListener.remove();
    }
  }, []);
  

  const handleLogout = async () => {
    try {
      let temporaryTokenSave = await getToken(); // kopioidaan hetkeksi jotta saadaan myöhemmin servulle logout tehtyä kanssa -tero
      // Remove the token from storage
      await removeToken();
      // Check if the token is removed successfully
      const tokenAfterLogout = await checkToken();
      if (tokenAfterLogout) {
        throw new Error('Token was not removed from storage');
      }

      // jos löytyy refresh token, poista sekin. While loop jotta varmasti lähtee -tero
      let hasRefreshToken = await RefreshTokenCheck();
      while(hasRefreshToken) {
        await removeRefreshToken();
        hasRefreshToken = await RefreshTokenCheck();
      }
  
      // katso että refresh token poistui -tero
      const refreshTokenAfterLogout = await RefreshTokenCheck();
      if (refreshTokenAfterLogout) {
        throw new Error('Refresh token was not removed from storage');
      }
      
      console.log('Token after logout:', tokenAfterLogout);
      console.log('Refresh token after logout:', refreshTokenAfterLogout);
      console.log('Kutsutaan serverin logoutia');

      // poista mahdollinen taustakuva 
      await removeBackground();
      await removeBackgroundURL();
      // Kutsu serverin logouttia -tero
      await handleServerLogout(temporaryTokenSave);
      console.log('Server logout onnistui');

      temporaryTokenSave = null; // tyhjennys varmuuden vuoksi -tero

      // Navigate to the home screen - triggeröi navigationcontainerin vaihdon -tero
     logOut();
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Failed', 'An error occurred during logout.');
    }
  };

  const handleServerLogout = async (token) => {
    try {
      const response = await fetch(`${SERVER_BASE_URL}${LOGOUT_ENDPOINT}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error('Error during server logout:', error);
     // Alert.alert('Logout Failed', ' Error: ' + error);
    }
  }


  return (
    <TouchableOpacity style={styles.logoutbutton} onPress={handleLogout}>
      <Ionicons name="log-in-outline" size={45} color="rgba(143,138,134,255)" />
    </TouchableOpacity>
  );
};
const containerH = Dimensions.get('window').height * 0.1;

const styles = StyleSheet.create({
    logoutbutton: {
        position: 'absolute',
        right: 20,
        paddingTop: containerH * 0.35,
        backgroundColor: 'transparent',
      }
    });

export default Logout;