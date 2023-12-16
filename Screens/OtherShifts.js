import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation, useRoute } from '@react-navigation/native';
import ShiftCard from "../Components/ShiftCard";
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  ScrollView,
  Modal,
  TouchableWithoutFeedback,
  StyleSheet
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EMPLOYEE_COMING_SHIFTS, SERVER_BASE_URL } from "@env";
import BackgroundImage from "../utility/BackGroundImage";

const OtherShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
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

  const groupShiftsByLastName = (shifts) => {
    const grouped = {};
    shifts.forEach(shift => {
      const lastName = shift.lastName;
      if (!grouped[lastName]) {
        grouped[lastName] = [];
      }
      grouped[lastName].push(shift);
    });
    return grouped;
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
    return `${hours}:${minutes}`;
  };

  const fetchShifts = async () => {
    try {
      const authToken = await AsyncStorage.getItem("userToken");
      if (!authToken) {
        // Handle authentication token not found
        return;
      }

      const response = await fetch(`${SERVER_BASE_URL}${EMPLOYEE_COMING_SHIFTS}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      if (response.ok) {
        const data = await response.json();
        const groupedShifts = groupShiftsByLastName(data);
        setShifts(groupedShifts);
      } else {
        // Handle failed to fetch shifts
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      // Handle error while fetching shifts
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const renderShiftsByLastName = (shiftsByLastName) => {
    return Object.keys(shiftsByLastName).map(lastName => (
      <TouchableOpacity
        key={lastName}
        onPress={() => {
          setMenuVisible(false);
          setSelectedWorker((prevSelected) => (prevSelected === lastName ? null : lastName));
        }}
        style={styles.workerContainer}
      >
        <Text style={styles.lastNameHeader}>{lastName}</Text>
      </TouchableOpacity>
    ));
  };

  const renderShiftsByMonth = () => {
    if (!selectedWorker) {
      return null;
    }
  
    const workerShifts = groupShiftsByMonth(shifts[selectedWorker]);
  
    return (
      <View>
        <TouchableOpacity onPress={() => setSelectedWorker(null)}>
          <Text style={styles.lastNameHeader}>{`${selectedWorker}`}</Text>
        </TouchableOpacity>
        {Object.keys(workerShifts).map(monthYear => {
          const [month, year] = monthYear.split('-');
          const monthName = new Date(year, month - 1).toLocaleString('en-US', { month: 'long' });
  
          return (
            <View key={monthYear}>
              <Text style={styles.monthYearHeader}>{`${monthName} ${year}`}</Text>
              {workerShifts[monthYear].map(shift => (
                <ShiftCard
                  key={`${shift.day}-${month}-${year}`}
                  shift={{
                    ...shift,
                    day: shift.day,
                    weekday: new Date(shift.date).toLocaleString('en-US', { weekday: 'short' }),
                    startTime: shift.startTime, // Assume this is already in correct format
                    endTime: shift.endTime,   // Assume this is already in correct format
                    breaksTotal: shift.breaksTotal, // Or any other relevant shift data
                    description: shift.description,
                  }}
                  style={styles.shiftCard}
                />
              ))}
            </View>
          );
        })}
      </View>
    );
  };

  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(false);
      fetchShifts();
    }, [])
  );

  return (
    <View style={styles.container}>
      <BackgroundImage style={styles.backgroundImage} />
      <ScrollView style={styles.scrollView}>
        <Text style={styles.pageHeader}>Upcoming shifts</Text>
        {selectedWorker ? renderShiftsByMonth() : renderShiftsByLastName(shifts)}
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
    marginTop: 90,
  },
  pageHeader: {
    textAlign: 'center',
    color: 'white',
    fontSize: 25,
    paddingBottom: 20,
  },

  backButton: {
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
    paddingVertical: 10,
  },
  lastNameHeader:{
    fontSize: Dimensions.get("window").width * 0.14,
    fontFamily: "Saira-Regular",
    color: "white",
    textAlign: "center",
    marginVertical: 10,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    textTransform: "uppercase",
  }
});

export default OtherShifts;
