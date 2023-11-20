import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { UPCOMING_SHIFTS, SERVER_BASE_URL} from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from '../Components/Menu';
import ShiftDescription from "../Components/shiftDescription";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";

export default function ShiftScreen() {
    const [box1Data, setBox1Data] = useState("");
    const [box2Data, setBox2Data] = useState("");
    const [box3Data, setBox3Data] = useState("");
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [selectedBox, setSelectedBox] = useState(null);
    const route = useRoute();
    const userRole = route.params?.userRole;

    const openShiftDescription = (boxData) => {
      setSelectedBox(boxData);
      setMenuVisible(true);
    };

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
      };

    const navigation = useNavigation();

    const navigateToMenu = () => {
        navigation.navigate('Menu');
      };

    const navigateToReportHours = () => {
        navigation.navigate('ReportHours');
        
      };

      useEffect(() => {
        const fetchData = async (endpoint, setDataFunction) => {
          try {
            const authToken = await AsyncStorage.getItem('userToken');
            const response = await fetch(endpoint, {
              headers: {
                Authorization: `Bearer ${authToken}`,
              },
            });
            const data = await response.text();
            setDataFunction(data);
          } catch (error) {
            console.error(`Error fetching data for ${setDataFunction.name}`, error);
          }
        };
        

        const fetchBoxData = async () => {
          await fetchData(SERVER_BASE_URL + UPCOMING_SHIFTS, setBox1Data);
          await fetchData(SERVER_BASE_URL + UPCOMING_SHIFTS, setBox2Data);
          await fetchData(SERVER_BASE_URL + UPCOMING_SHIFTS, setBox3Data);
        };
      
        fetchBoxData();
      }, []);
    

return (
    <KeyboardAvoidingView
      style={styles.container}
    >
    <Image
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
    />
    <TouchableOpacity onPress={toggleMenu} style={styles.button}>
        <Ionicons name="menu" size={45} color="white" />
    </TouchableOpacity>
    
    <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.label}>NEXT SHIFTS</Text>
      <TouchableOpacity
        onPress={() => openShiftDescription(box1Data)}
        style={styles.dataBox}
      >
        <Text style={styles.dataBoxText}>{box1Data}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openShiftDescription(box2Data)}
        style={styles.dataBox}
      >
        <Text style={styles.dataBoxText}>{box2Data}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => openShiftDescription(box3Data)}
        style={styles.dataBox}
      >
        <Text style={styles.dataBoxText}>{box3Data}</Text>
      </TouchableOpacity>
      <TouchableOpacity
          style={styles.reportHoursButton}
          onPress={navigateToReportHours}
        >
          <Text style={styles.reportHoursButtonText}>REPORT HOURS</Text>
        </TouchableOpacity>

        <Modal
        animationType="slide"
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => {
          setMenuVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.menuContainer}>
        <Menu userRole={userRole}/>
        </View>
      </Modal>
  
    </KeyboardAvoidingView>
  );
}
const window = Dimensions.get('window');
const screenWidth = window.width;
const screenHeight = window.height;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
        width: 200,
        height: 500,
        position: "absolute",
        top: screenHeight * -0.1,
        resizeMode: "contain",
      },
    backgroundImage: {
      position: "absolute",
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    label: {
    fontSize: screenHeight * 0.05,
    fontWeight: "bold",
    paddingTop: 170,
      fontFamily: "Saira-Regular",
      color: "white",
      textShadowColor: "rgba(0, 0, 0, 1)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 10,
    },
    button: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    },
    dataBox: {
        backgroundColor: "white",
        width: "80%",
        padding: 10,
        margin: 10,
        borderRadius: 5,
        alignItems: "center",
      },
      dataBoxText: {
        fontSize: 16,
        color: "black",
      },
      overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: Dimensions.get('window').width * 0.75,
    height: '100%',
    backgroundColor: 'white',
  },
  reportHoursButton: {
    width: '80%',
    backgroundColor: 'rgba(0, 150, 255, 0.7)',
    padding: 13,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    bottom: screenHeight * 0.1,
    borderColor: 'black',
    borderWidth: 2,
},
reportHoursButtonText: {
    color: 'white',
    fontSize: screenWidth * 0.08,
    fontFamily: 'Saira-Regular',
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
},
  });

  