import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
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
    const [box4Data, setBox4Data] = useState("");
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
        // Fetch data for box 1
        fetch("YOUR_BACKEND_ENDPOINT_FOR_BOX1")
          .then((response) => response.text())
          .then((data) => setBox1Data(data))
          .catch((error) => console.error("Error fetching data for box 1", error));
      
        // Fetch data for box 2
        fetch("YOUR_BACKEND_ENDPOINT_FOR_BOX2")
          .then((response) => response.text())
          .then((data) => setBox2Data(data))
          .catch((error) => console.error("Error fetching data for box 2", error));

          fetch("YOUR_BACKEND_ENDPOINT_FOR_BOX3")
          .then((response) => response.text())
          .then((data) => setBox3Data(data))
          .catch((error) => console.error("Error fetching data for box 2", error));

          fetch("YOUR_BACKEND_ENDPOINT_FOR_BOX4")
          .then((response) => response.text())
          .then((data) => setBox4Data(data))
          .catch((error) => console.error("Error fetching data for box 2", error));
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
    <View style={styles.dataBox}>
      <Text style={styles.dataBoxText}>{box4Data}</Text>
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
    fontSize: screenHeight * 0.07,
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
    padding: 7,
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
    fontSize: screenWidth * 0.1,
    fontFamily: 'Saira-Regular',
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
},
  });

  