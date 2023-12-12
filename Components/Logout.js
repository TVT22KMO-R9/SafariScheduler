import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { removeToken, checkToken, getToken} from '../utility/Token';
import { RefreshTokenCheck, removeRefreshToken } from '../utility/RefreshTokenCheck';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Remove the token from storage
      await removeToken();
      // Check if the token is removed successfully
      const tokenAfterLogout = await getToken();
      if (tokenAfterLogout) {
        throw new Error('Token was not removed from storage');
      }

      // jos löytyy refresh token, poista sekin
      const hasRefreshToken = await checkToken();
      if(hasRefreshToken) {
        await removeRefreshToken();
      }
      
      console.log('Token after logout:', tokenAfterLogout);

      // Navigate to the login screen
      navigation.navigate('Login');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Logout Failed', 'An error occurred during logout.');
    }
  };

  return (
    <TouchableOpacity style={styles.logoutbutton} onPress={handleLogout}>
      <Ionicons name="log-in-outline" size={45} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    logoutbutton: {
        position: 'absolute',
        top: 20,
        right: 20,
        padding: 10,
      }
    });

export default Logout;