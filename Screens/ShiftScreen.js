import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { UPCOMING_SHIFTS, SERVER_BASE_URL } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';
import Menu from '../Components/Menu';
import Description from "../Components/Description";
import Logout from '../Components/Logout';
import Home from "../Components/Home";
import { Alert } from "react-native";
import BackgroundImage from "../utility/BackGroundImage";

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
  const [box1Data, setBox1Data] = useState([]);
  const [box2Data, setBox2Data] = useState([]);
  const [box3Data, setBox3Data] = useState([]);
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);
  const [selectedBoxData, setSelectedBoxData] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [shifts, setShifts] = useState([]);
  const route = useRoute();
  const userRole = route.params?.userRole;
  const navigation = useNavigation();


  const handleDataBoxPress = (data) => {
    setSelectedBoxData(data.description);
    setDescriptionVisible(!isDescriptionVisible);
  };

  const toggleMenu = () => {
    if( route.name !== 'UploadImgScreen' ) {
      setMenuVisible(!isMenuVisible);
    }
    console.log("onko menu näkyvissä:" + isMenuVisible)
  };

  const navigateToReportHours = () => {
    navigation.navigate('ReportHours');

  };
  const formatShiftData = (shift) => {
    const date = new Date(shift.date);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    const startTime = shift.startTime ? shift.startTime.substring(0, 5) : '';
    const endTime = shift.endTime ? shift.endTime.substring(0, 5) : '';

    const description = shift.description || '';

    const frontPageDisplay = `${formattedDate} , ${startTime} - ${endTime}`;

    return { frontPageDisplay, description };
  };

  useEffect(() => {
    const fetchBoxData = async () => {
      try {
        const authToken = await AsyncStorage.getItem('userToken');
        console.log('Fetching shifts with token:', authToken);
        const response = await fetch(`${SERVER_BASE_URL}${UPCOMING_SHIFTS}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const shifts = await response.json();
        console.log('Fetched shifts:', shifts);

        if (shifts.length > 0) setBox1Data(formatShiftData(shifts[0]));
        if (shifts.length > 1) setBox2Data(formatShiftData(shifts[1]));
        if (shifts.length > 2) setBox3Data(formatShiftData(shifts[2]));
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };

    fetchBoxData();
  }, []);

  const groupShiftsByMonth = (shifts) => {
    const grouped = {};
    shifts.forEach(shift => {
      const month = new Date(shift.date).getMonth();
      const year = new Date(shift.date).getFullYear();
      const monthYear = `${month}-${year}`;
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      grouped[monthYear].push(shift);
    });
    return grouped;
  };
  
  const fetchShifts = async () => {
    try {
      const authToken = await AsyncStorage.getItem("userToken");
      if (!authToken) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

      const response = await fetch(`${SERVER_BASE_URL}${UPCOMING_SHIFTS}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const groupedShifts = groupShiftsByMonth(data);
        setShifts(groupedShifts);
      } else {
        Alert.alert("Error", "Failed to fetch shifts");
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      Alert.alert("Error", "An error occurred while fetching shifts");
    }
    console.log(`${SERVER_BASE_URL}${UPCOMING_SHIFTS}`);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  //triggers an effect when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(false);
      fetchShifts();
    }, [])
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
    >
      <BackgroundImage style={styles.backgroundImage}/>
      <TouchableOpacity style={styles.button} onPress={toggleMenu}>
        <Ionicons name="menu" size={45} color="white" />
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={isMenuVisible}
        onRequestClose={() => {
          setMenuVisible(false);
        }}
      >
        <TouchableWithoutFeedback onPress={() => {
          console.log('TouchableWithoutFeedback klikattu');
          toggleMenu();
        }}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
        <View style={styles.menuContainer}>
          <Menu userRole={userRole} />
        </View>
      </Modal>
      <Home />
      <Logout />
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.label}>NEXT SHIFTS</Text>
      <TouchableOpacity
        style={styles.dataBox}
        onPress={() => handleDataBoxPress(box1Data)}
      >
        <Text style={styles.dataBoxText}>{box1Data.frontPageDisplay}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dataBox}
        onPress={() => handleDataBoxPress(box2Data)}
      >
        <Text style={styles.dataBoxText}>{box2Data.frontPageDisplay}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dataBox}
        onPress={() => handleDataBoxPress(box3Data)}
      >
        <Text style={styles.dataBoxText}>{box3Data.frontPageDisplay}</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => setDescriptionVisible(false)}>
        <Description
          isVisible={isDescriptionVisible}
          data={selectedBoxData}
          onClose={() => setDescriptionVisible(false)}
        />

      </TouchableWithoutFeedback>
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
    height: 250,
    position: "absolute",
    top: screenHeight * +0.08,
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
    paddingTop: 100,
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
    width: "70%",
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,

  },
  dataBoxText: {
    fontSize: 16,
    color: "black",
    fontFamily: "Saira-Regular",
    fontWeight: "bold",
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
  logoutbutton: {
    position: 'absolute',
    top: 20,
    right: 20,
    padding: 10,
  }
});