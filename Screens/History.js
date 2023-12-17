import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import { SERVER_BASE_URL, LAST_31_SHIFTS_ENDPOINT } from '@env'
import AsyncStorage from '@react-native-async-storage/async-storage';


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
import BackgroundImage from "../utility/BackGroundImage";
import ShiftCard from "../Components/ShiftCard";

export default function History() {
  const [shifts, setShifts] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const userRole = route.params?.userRole;

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  const navigation = useNavigation();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString();
    const weekday = date.toLocaleString('en-US', { weekday: 'short' }).substring(0, 3);
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

      const response = await fetch(`${SERVER_BASE_URL}${LAST_31_SHIFTS_ENDPOINT}`, {
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
    console.log(`${SERVER_BASE_URL}${LAST_31_SHIFTS_ENDPOINT}`);
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  //triggers when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(false);
      fetchShifts();
    }, [])
  );

  const renderShiftsByMonth = () => {
    let currentMonth = '';
    let currentYear = '';

    return Object.keys(shifts).map(monthYear => {
      const [month, year] = monthYear.split('-');
      const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long' });

      const monthHeader = month !== currentMonth || year !== currentYear
        ? <Text style={styles.monthHeader}>{`${monthName} ${year}`}</Text>
        : null;

      currentMonth = month;
      currentYear = year;

      return (
        <View key={monthYear}>
          {monthHeader}
          {shifts[monthYear].map((shift, index) => {
            const { day, weekday } = formatDate(shift.date);
            const formattedShift = {
              ...shift,
              day,
              weekday,
              month: monthName,
              year,
              startTime: formatTime(shift.startTime),
              endTime: shift.endTime && formatTime(shift.endTime),
            };
            return (
              <ShiftCard key={shift.id} shift={formattedShift} />
            );
          })}
        </View>
      );
    });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
        <BackgroundImage style={styles.backgroundImage}/>
      <ScrollView style={styles.scrollView}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 25, paddingBottom: 20, paddingTop: 20 }}>My shift history</Text>
        {renderShiftsByMonth()}
      </ScrollView>
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
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    paddingHorizontal: 7,
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
    paddingHorizontal: 4,
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
  button: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
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
    marginTop: 70,
  },
});