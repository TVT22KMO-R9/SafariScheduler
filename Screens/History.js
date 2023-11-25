import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from '@react-navigation/native';
import { SERVER_BASE_URL, LAST_31_SHIFTS_ENDPOINT } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from '../Components/Menu';
import Description from "../Components/Description";

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
  ScrollView,
} from "react-native";

export default function ShiftScreen() {
  const [shifts, setShifts] = useState([]);
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [selectedBoxData, setSelectedBoxData] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const userRole = route.params?.userRole;

  const handleDataBoxPress = (data) => {
    setSelectedBoxData(data);
    setDescriptionVisible(!isDescriptionVisible);
  };

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const navigation = useNavigation();


  const formatShiftData = (shift) => {
    const date = new Date(shift.date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const startTime = shift.startTime ? shift.startTime.substring(0, 5) : '';
    const endTime = shift.endTime ? shift.endTime.substring(0, 5) : '';

    return `${formattedDate} ${startTime} - ${endTime}`;
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
        const data = await response.json();
        setDataFunction(data);
      } catch (error) {
        console.error(`Error fetching data for ${setDataFunction.name}`, error);
      }
    };

    const fetchShiftData = async () => {
      await fetchData(`${SERVER_BASE_URL}${LAST_31_SHIFTS_ENDPOINT}`, setShifts);
    };

    fetchShiftData();
  }, []);

  return (
    <KeyboardAvoidingView style={styles.container}>
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
          <Menu userRole={userRole} />
        </View>
      </Modal>
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.label}>YOUR HISTORY</Text>
      <ScrollView style={styles.scrollView}>
      {shifts.map((shift, index) => (
        <TouchableOpacity
          key={index}
          style={styles.dataBox}
          onPress={() => handleDataBoxPress(formatShiftData(shift))}
        >
          <Text style={styles.dataBoxText}>{formatShiftData(shift)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
      <TouchableWithoutFeedback onPress={() => setDescriptionVisible(false)}>
        <Description
          isVisible={isDescriptionVisible}
          data={selectedBoxData}
          onClose={() => setDescriptionVisible(false)}
        />
      </TouchableWithoutFeedback>
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
    width: 150,
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
    marginTop: 70,
  },
  button: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  dataBox: {
    backgroundColor: "white",
    width: "70%",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 2,
    alignSelf: "center",
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
  scrollView: {
    flex: 1,
    width: '100%',
  },
});