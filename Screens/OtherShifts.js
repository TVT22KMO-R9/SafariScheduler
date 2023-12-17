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
  StyleSheet,
  TextInput,
  FlatList
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { EMPLOYEE_COMING_SHIFTS, SERVER_BASE_URL } from "@env";
import BackgroundImage from "../utility/BackGroundImage";

const OtherShifts = () => {
  const [shifts, setShifts] = useState([]);
  const [chosenShifts, setChosenShifts] = useState([]);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const route = useRoute();
  const userRole = route.params?.userRole;
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [workersForModal, setWorkersForModal] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);




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
        const workers = listWorkersFromResponse(data);
        setShifts(groupedShifts);
        setWorkersForModal(workers);

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

  useEffect(() => {
    console.log("Updated chosen shifts:", chosenShifts);
  }, [chosenShifts]);
  

  const handlePress = (worker) => {
    setSelectedWorker(worker);
    closeModal();

   
    const workerShifts = shifts[worker.id]?.shifts;  // haetaan työntekijän vuorot userId:llä
    if (workerShifts) {
      const groupedShifts = groupShiftsByMonth(Object.values(workerShifts).flat());
      setChosenShifts(groupedShifts);
      console.log("Chosen shifts:", groupedShifts);
    } else {
      setChosenShifts({}); 
    }
};

const groupShiftsByMonth = (shiftsArray) => {
  const grouped = {};
  shiftsArray.forEach(shift => {
      const monthYear = `${new Date(shift.date).getMonth()}-${new Date(shift.date).getFullYear()}`;
      if (!grouped[monthYear]) {
          grouped[monthYear] = [];
      }
      grouped[monthYear].push(shift);
  });
  return grouped;
};

const listWorkersFromResponse = (response) => {
  const uniqueUserIds = [...new Set(response.map(shift => shift.userId))];
  const workers = uniqueUserIds.map(userId => {
    const shift = response.find(shift => shift.userId === userId);
    const { firstName, lastName, role } = shift;
    return { id: userId, firstName, lastName, role };
  });
  console.log("Workers:", workers);
  return workers;
};


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

  const openModal = () => {
    setModalVisible(true);
    setFilteredWorkers(workersForModal);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = workersForModal.filter(worker =>
        `${worker.firstName} ${worker.lastName}`.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(workersForModal);
    }
  };
  


/***  const renderShiftsByUserId = () => {
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
  }; */



  const renderShiftsByMonth = () => {
    if (!selectedWorker || !chosenShifts) {
      return null;
    }

    console.log("Renderiin tulleet vuorot:" + chosenShifts);
  
    return (
      <View>
        {Object.keys(chosenShifts).map(monthYear => {
          const [month, year] = monthYear.split('-');
          const monthName = new Date(year, month ).toLocaleString('en-US', { month: 'long' });
  
          return (
            <View key={monthYear} style={{alignContent: 'center', justifyContent:'center'}}>
              <Text style={styles.monthHeader}>{`${monthName} ${year}`}</Text>
              {chosenShifts[monthYear].map(shift => {
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
                return <ShiftCard key={shift.id} shift={formattedShift} />;
              })}
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
      <BackgroundImage style={styles.backgroundImage}/>
      {selectedWorker === null ? (
        <View style={{justifyContent:'center', alignItems:'center'}}>
       <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
        
        <Text style={styles.welcomeText}>VIEW SHIFTS FOR:</Text>
        </View>
        ) : null}
     
      <TouchableOpacity
      style={[
      styles.button,
      { marginTop: selectedWorker !== null ? screenHeight * 0.1 : screenHeight * 0.01 }
      ]} onPress={openModal}>
        <Text style={styles.buttonText}>
          {selectedWorker
            ? `${selectedWorker.firstName} ${selectedWorker.lastName}`
            : "SELECT WORKER"}
        </Text>
      </TouchableOpacity>
      <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.searchBox}
                placeholder="Search by name"
                value={searchText}
                onChangeText={handleSearch}
              />
              <FlatList
                data={filteredWorkers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => handlePress(item)}
                    >
                      <Text style={styles.itemText}>
                        {item.firstName || item.lastName 
                          ? `${item.firstName || ''} ${item.lastName || ''}`.trim() 
                          : 'Anonymous: '+ item.id}
                        {item.role === 'WORKER' && ' (W)'}
                        {item.role === 'SUPERVISOR' && ' (S)'}
                        {item.role === 'MASTER' && ' (M)'}
                      </Text>
                    </TouchableOpacity>
                  )}
              />
              <TouchableOpacity onPress={closeModal} style={styles.buttonClose}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        
        <ScrollView style={styles.scrollView}>
      {selectedWorker && renderShiftsByMonth()}
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
    
  }, logo: {
    width: 200,
    height: 250,
    position: "absolute",
    top: screenHeight * +0.08,
    resizeMode: "contain",
  }, 
  welcomeText: {
    textAlign: "center",
    color: "white",
    fontSize: 25,
    fontFamily: "Saira-Regular",
    marginTop: screenHeight * 0.4,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
    backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: screenWidth * 0.8,
        borderColor: "white",
        borderWidth: 2,
        height: screenHeight * 0.07,
  },
  buttonText: {
    color: 'white',
    fontSize: screenWidth * 0.06,
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    alignItems: 'center',

    
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
  }, centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  searchBox: {
    height: screenHeight * 0.07,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    marginBottom: 20,
    borderRadius: 5,
    fontFamily: "Saira-Regular",
    fontSize: screenWidth * 0.06,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
    alignItems: "center",
  },
  itemText: {
    fontSize: screenWidth * 0.08,
    fontFamily: "Saira-Regular",
  },
  buttonClose: {
    backgroundColor: "rgba(205, 0, 0, 1)",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    borderColor: "black",
    borderWidth: 2,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
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