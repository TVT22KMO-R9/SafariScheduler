import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import ShiftCard from "../Components/ShiftCard";
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
import Home from "../Components/Home";
import BackgroundImage from "../utility/BackGroundImage";

// MyShifts functional component
const MyShifts = () => {
  // State for storing shift data
  const [shifts, setShifts] = useState([]);
  // State for handling menu visibility
  const [isMenuVisible, setMenuVisible] = useState(false);

  // Accessing route parameters
  const route = useRoute();
  // Extracting the user role from route parameters
  const userRole = route.params?.userRole;

  // Function to toggle the visibility of the menu
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  // Function to format a date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString();
    const weekday = date.toLocaleString('en-US', { weekday: 'short' }).substring(0, 3);
    return { day, weekday };
  };

  // Function to group shifts by month
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

  // Function to format a time string
  const formatTime = (timeString) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`; // Returns time in HH:mm format
  };

  // Function to fetch shift data from the server
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
  };

  // UseEffect hook to fetch shifts when the component mounts
  useEffect(() => {
    fetchShifts();
  }, []);

  // Function to render shifts grouped by month
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

  // UseFocusEffect hook triggers when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(false);
      fetchShifts();
    }, [])
  );

  // JSX layout for the component
  return (
    <View style={styles.container}>
      <BackgroundImage style={styles.backgroundImage}/>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.headerText}>MY SHIFTS</Text> 
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
  headerText: {
    textAlign: "center",
    color: "white",
    fontSize: Dimensions.get("window").width * 0.08,
    paddingBottom: 20,
    borderBottomColor: "white",
    borderBottomWidth: 2,
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginTop: 90,
  },
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
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
    flex: 1,
    
    

  },
});

export default MyShifts;
