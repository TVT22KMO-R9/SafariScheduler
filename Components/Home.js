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
      <Ionicons name="home-outline" size={40} color="white" />
    </TouchableOpacity>
  );
};  

const ScreenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
    logoutbutton: {
        position: 'absolute',
        left: ScreenWidth/2,
        marginLeft: -20,
        paddingTop: 10,
        backgroundColor: 'transparent',
      }
    });

export default Home;