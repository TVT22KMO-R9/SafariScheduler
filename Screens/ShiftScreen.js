import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { CUSTOM_SHIFT_AMOUNT_ENDPOINT, SERVER_BASE_URL } from '@env'
import Menu from './Menu';
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
    const route = useRoute();
    const userRole = route.params?.userRole;

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
            const response = await fetch(endpoint);
            const data = await response.text();
            setDataFunction(data);
          } catch (error) {
            console.error(`Error fetching data for ${setDataFunction.name}`, error);
          }
        };
      
        const fetchBoxData = async () => {
          await fetchData(SERVER_BASE_URL + CUSTOM_SHIFT_AMOUNT_ENDPOINT + "1", setBox1Data);
          await fetchData(SERVER_BASE_URL + CUSTOM_SHIFT_AMOUNT_ENDPOINT + "2", setBox2Data);
          await fetchData(SERVER_BASE_URL + CUSTOM_SHIFT_AMOUNT_ENDPOINT + "3", setBox3Data);
        };
      
        fetchBoxData();
      }, [isMenuVisible]);
    

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
    <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.label}>NEXT SHIFTS</Text>
    <View style={styles.dataBox}>
      <Text style={styles.dataBoxText}>{box1Data}</Text>
    </View>
    <View style={styles.dataBox}>
      <Text style={styles.dataBoxText}>{box2Data}</Text>
    </View>
    <View style={styles.dataBox}>
      <Text style={styles.dataBoxText}>{box3Data}</Text>
    </View>
    <TouchableOpacity
          style={styles.reportHoursButton}
          onPress={navigateToReportHours}
        >
          <Text style={styles.reportHoursButtonText}>REPORT HOURS</Text>
        </TouchableOpacity>
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

  