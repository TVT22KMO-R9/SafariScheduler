import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const Logout = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      // Remove the token from storage
      await AsyncStorage.removeItem('userToken');
      // Check if the token is removed successfully
      const tokenAfterLogout = await AsyncStorage.getItem('userToken');
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