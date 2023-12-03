import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import Menu from '../Components/Menu';
import Logout from '../Components/Logout';
import {
  View,
  Text,
  FlatList,
  Alert,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UPCOMING_SHIFTS, SERVER_BASE_URL } from "@env";

const MyShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const userRole = route.params?.userRole;

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString();
    const weekday = date.toLocaleString('default', { weekday: 'short' }).substring(0, 2);
    return { day, weekday };
  };

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
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`; // Returns time in HH:mm format
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

  const renderShiftsByMonth = () => {
    return Object.keys(shifts).map(monthYear => {
      const [month, year] = monthYear.split('-');
      const monthName = new Date(year, month).toLocaleString('default', { month: 'long' });
      return (
        <View key={monthYear}>
          <Text style={styles.monthHeader}>{`${monthName} ${year}`}</Text>
          {shifts[monthYear].map(shift => {
            const { day, weekday } = formatDate(shift.date);
            return (
              <View key={shift.id} style={styles.shiftContainer}>
                <View style={styles.weekdayContainer}>
                  <Text style={styles.dayText}>{day}</Text>
                  <Text style={styles.weekdayText}>{weekday.toUpperCase()}</Text>
                </View>
                <View style={styles.timeContainer}>
                  <Text style={styles.shiftText}>
                    {formatTime(shift.startTime)} - {shift.endTime && formatTime(shift.endTime)}
                  </Text>
                  <Text style={styles.shiftDescription}>{shift.description}</Text>
                </View>
              </View>
            );
          })}
        </View>
      );
    });
  };

  //triggers when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(false);
    }, [])
  );

  return (
    <View style={styles.container}>
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
      <Logout />
      <ScrollView style={styles.scrollView}>
      <Text style={{ textAlign: 'center', color: 'white', fontSize: 25, paddingBottom: 20, }}>Upcoming shifts</Text> 
        {renderShiftsByMonth()}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  shiftContainer: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: Dimensions.get("window").width * 0.9,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",

  },
  shiftText: {
    fontSize: Dimensions.get("window").width * 0.08,
    fontFamily: "Saira-Regular",
    color: "white",
    paddingHorizontal:7,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  timeContainer: {
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  shiftDescription: {
    fontSize: Dimensions.get("window").width * 0.05,
    color: "white",
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
  dayText: {
    fontSize: Dimensions.get("window").width * 0.15,
    fontWeight: 'bold',
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
    fontFamily: "Saira-Regular",
  },
  weekdayContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  weekdayText: {
    fontSize: Dimensions.get("window").width * 0.06,
    color: "white",
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 3,
  },
  dashText: {
    fontSize: Dimensions.get("window").width * 0.07,
    fontFamily: "Saira-Regular",
    color: "white",
    paddingHorizontal:4,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 4,
  },
  monthHeader: {
    fontSize: Dimensions.get("window").width * 0.1,
    fontFamily: "Saira-Regular",
    color: "white",
    textAlign: "center",
    marginVertical: 10,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textTransform: "uppercase",
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
  button: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
  },
  scrollView: {
    marginTop: 70,
  },
});

export default MyShifts;
