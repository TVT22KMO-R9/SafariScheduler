import React from 'react';
import { TouchableOpacity, Alert, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';


const Home = (userRole) => {


 const navigation = useNavigation();   

    const navigateToHome = () => {
       navigation.navigate('ShiftScreen', { userRole });
    }
    

  return (
    <TouchableOpacity style={styles.logoutbutton} onPress={navigateToHome}>
      <Ionicons name="home-outline" size={40} color="rgba(143,138,134,255)" />
    </TouchableOpacity>
  );
};  

const ScreenWidth = Dimensions.get('window').width;
const containerH = Dimensions.get('window').height * 0.1;

const styles = StyleSheet.create({
    logoutbutton: {
        position: 'absolute',
        left: ScreenWidth/2,
        marginLeft: -20,
        paddingTop: containerH * 0.35,
        backgroundColor: 'transparent',
      }
    });

export default Home;