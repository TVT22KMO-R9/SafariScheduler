import React from 'react';
import { TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';

const Home = () => {

    const navigation = useNavigation();

    const navigateToHome = () => {
        navigation.navigate('ShiftScreen');
    }

  return (
    <TouchableOpacity style={styles.logoutbutton} onPress={navigateToHome}>
      <Ionicons name="home-outline" size={40} color="white" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    logoutbutton: {
        position: 'absolute',
        top: 20,
        padding: 10,
      }
    });

export default Home;