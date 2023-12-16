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
    const weekday = date.toLocaleString('en-US', { weekday: 'short' }).substring(0, 3);
    return { day, weekday };
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
        const groupedShifts = groupShiftsByUserId(data);
        setShifts(groupedShifts);

        console.log("Shifts:", data);
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

  const groupShiftsByUserId = (shifts) => {
    const grouped = {};
    shifts.forEach(shift => {
      const userId = shift.userId;
      const date = new Date(shift.date);
      const month = date.getMonth() + 1; // getMonth() returns a zero-based month
      const year = date.getFullYear();
      const monthYear = `${month}-${year}`;
  
      if (!grouped[userId]) {
        grouped[userId] = {
          firstName: shift.firstName,
          lastName: shift.lastName,
          shifts: {},
        };
      }
  
      if (!grouped[userId].shifts[monthYear]) {
        grouped[userId].shifts[monthYear] = [];
      }
  
      grouped[userId].shifts[monthYear].push(shift);
    });
    return grouped;
  };


  const renderShiftsByUserId = () => {
    return Object.keys(shifts).map(userId => {
      const user = shifts[userId];
      return (
        <View key={userId}>
          <TouchableOpacity onPress={() => setSelectedWorker(user)}>
            <Text style={styles.lastNameHeader}>
              {user.firstName || user.lastName
                ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
                : 'Anonymous'}
            </Text>
          </TouchableOpacity>
          {selectedWorker && selectedWorker.userId === userId && renderShiftsByMonth(user.shifts)}
        </View>
      );
    });
  };

  const renderShiftsByMonth = () => {
    if (!selectedWorker) {
      return null;
    }
  
    
  const workerShifts = selectedWorker.shifts;

  const currentDate = new Date();
  const currentMonth = currentDate.getMonth() + 1; // getMonth() returns a zero-based month
  const currentYear = currentDate.getFullYear();
  
    return (
      <View>
        <TouchableOpacity onPress={() => setSelectedWorker(null)}>
          <Text style={styles.lastNameHeader}>
            {selectedWorker.firstName || selectedWorker.lastName
              ? `${selectedWorker.firstName || ''} ${selectedWorker.lastName || ''}`.trim()
              : 'Anonymous'}
          </Text>
        </TouchableOpacity>
        {Object.keys(workerShifts).map(monthYear => {
          const [month, year] = monthYear.split('-');
          const monthName = new Date(year, month).toLocaleString('en-US', { month: 'long' });
  
          const monthHeader = month !== currentMonth || year !== currentYear
            ? <Text style={styles.monthHeader}>{`${monthName} ${year}`}</Text>
            : null;
  

  return (
    <View key={monthYear}>
      {monthHeader}
      <View style={{alignItems: "center", justifyContent: "center"}}>
      {workerShifts[monthYear] && workerShifts[monthYear].map(shift => {
        const { day, weekday } = formatDate(shift.date);
        const formattedShift = {
          ...shift,
          day,
          weekday,
          month: monthName,
          year,
          startTime: formatTime(shift.startTime),
          endTime: shift.endTime && formatTime(shift.endTime),
        };return (
          <ShiftCard key={shift.id} shift={formattedShift} />
        );
      
      })
      }
      </View>
    </View>
  );
})}


      </View>
    );
    
  }
  

  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(false);
      fetchShifts();
    }, [])
  );

  return (
    <View style={styles.container}>
      <BackgroundImage style={styles.backgroundImage}/>
      <ScrollView style={styles.scrollView}>
      
      <Text style={styles.headerText}>OTHER SHIFTS</Text> 
        {renderShiftsByUserId()}
        {renderShiftsByMonth()}
      </ScrollView>
    </View>
  );
};

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
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
  headerText: {
    textAlign: "center",
    color: "white",
    fontSize: 25,
    paddingBottom: 20,
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    paddingTop: screenHeight * 0.15,
  },
  shiftContainer: {
    backgroundColor: "rgba(255, 255, 255, 0)",
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: Dimensions.get("window").width * 0.9,
    alignItems: "center",
    justifyContent: "center",

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
  button: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
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

/*  const renderShiftsByLastName = (shiftsByLastName) => {
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
  }; */

  /**  const groupShiftsByMonth = (shifts) => {
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
  }; */

  /** 
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
  }; */