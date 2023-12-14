import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
  Dimensions,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DELETE_SHIFT, WORKERS, SERVER_BASE_URL, SHIFTS_EVERYONE } from "@env";
import BackgroundImage from "../utility/BackGroundImage";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  };
  return date.toLocaleString("default", options);
};

const DeleteShifts = () => {
  const [workers, setWorkers] = useState([]);
  const [allShifts, setAllShifts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]);
  const [isShiftDetailsVisible, setShiftDetailsVisible] = useState(false);
const [selectedShift, setSelectedShift] = useState(null);

  useEffect(() => {
    fetchAllShifts();
    fetchWorkers();
  }, []);

  const fetchAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return null;
      }
      return token;
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve authentication token");
      return null;
    }
  };

  const handleWorkerSelect = (workerId) => {
    setSelectedWorkerIds((prevIds) => {
      const newIds = prevIds.includes(workerId)
        ? prevIds.filter((id) => id !== workerId)
        : [...prevIds, workerId];
      console.log("Updated Selected Worker IDs:", newIds);
      return newIds;
    });
  };
  const filteredShifts = useMemo(() => {
    return allShifts.filter(
      (shift) =>
        selectedWorkerIds.length === 0 ||
        selectedWorkerIds.includes(shift.userId)
    );
  }, [allShifts, selectedWorkerIds]);

  const sortedShifts = useMemo(() => {
    if (!filteredShifts) {
      return [];
    }
    // Sort the shifts by date in ascending order
    return filteredShifts.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredShifts]);

  const fetchWorkers = async () => {
    const token = await fetchAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${SERVER_BASE_URL}${WORKERS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
        console.log("Fetched Workers:", data);
      } else {
        Alert.alert("Error", "Failed to fetch workers.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching workers.");
    }
  };

  const fetchAllShifts = async () => {
    const token = await fetchAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${SERVER_BASE_URL}${SHIFTS_EVERYONE}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setAllShifts(data);
        console.log("Fetched Shifts:", data);
      } else {
        Alert.alert("Error", "Failed to fetch shifts.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching shifts.");
    }
  };

  const groupShiftsByDate = (shifts) => {
    return shifts.reduce((groups, shift) => {
      const date = shift.date;
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(shift);
      return groups;
    }, {});
  };

  const groupedShifts = useMemo(() => {
    if (!filteredShifts) {
      return [];
    }
  
    const grouped = groupShiftsByDate(filteredShifts);
    return Object.keys(grouped).map((date) => ({
      date,
      shifts: grouped[date],
    }));
  }, [filteredShifts]);

  const openShiftDetails = (shift) => {
    setSelectedShift(shift);
    setShiftDetailsVisible(true);
  };

  const closeShiftDetails = () => {
    setSelectedShift(null);
    setShiftDetailsVisible(false);
  };

  const handleDeleteShift = async (shiftId) => {
    const token = await fetchAuthToken();
    if (!token) return;

    try {
      const deleteEndpoint = `${SERVER_BASE_URL}${DELETE_SHIFT.replace(
        "{shiftId}",
        shiftId
      )}`;
      const response = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        Alert.alert("Success", "Shift deleted successfully.");
        setWorkerShifts(workerShifts.filter((shift) => shift.id !== shiftId));
      } else {
        Alert.alert("Error", "Failed to delete the shift.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred.");
    }
  };

  return (
    <View style={styles.container}>
      <BackgroundImage style={styles.backgroundImage}/>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>SELECT WORKERS</Text>
      </TouchableOpacity>

      <FlatList
  data={groupedShifts}
  keyExtractor={(item) => item.date}
  renderItem={({ item }) => (
    <View>
      <Text style={styles.dateHeader}>{formatDate(item.date)}</Text>
      {item.shifts.map((shift) => (
        <TouchableOpacity
          key={shift.id}
          style={styles.shiftItem}
          onPress={() => openShiftDetails(shift)}
        >
          <Text style={styles.shiftText}>
            {`${shift.firstName} ${shift.lastName} ${shift.startTime.slice(
              0,
              -3
            )} - ${shift.endTime ? shift.endTime.slice(0, -3) : ''}`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )}
/>

<Modal
  animationType="slide"
  transparent={true}
  visible={isShiftDetailsVisible}
  onRequestClose={closeShiftDetails}
>
  <View style={styles.centeredView}>
    <View style={styles.modalView}>
      {selectedShift ? (
        <>
          <Text style={styles.dateHeader}>
            {formatDate(selectedShift.date)}
          </Text>
          <Text style={styles.shiftText}>
            {`${selectedShift.firstName} ${selectedShift.lastName} ${selectedShift.startTime.slice(
              0,
              -3
            )} - ${selectedShift.endTime ? selectedShift.endTime.slice(0, -3) : ''}`}
          </Text>
          {selectedShift.description ? (
            <Text style={styles.descriptionText}>
              Description: {selectedShift.description}
            </Text>
          ) : null}
          {selectedShift.breaksTotal ? (
            <Text style={styles.breaksText}>
              Breaks: {selectedShift.breaksTotal}
            </Text>
          ) : null}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={handleDeleteShift}
            >
              <Text style={styles.deleteButtonText}>Delete Shift</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeShiftDetails}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : null}
    </View>
  </View>
</Modal>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

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
    backgroundColor: "#f5f5f5", // Adjust the background color as needed
  },
  button: {
    backgroundColor: "rgba(83, 237, 255, 0.8)",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    width: screenWidth * 0.9,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    fontSize: screenWidth * 0.1,
    color: "white",
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 1,
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
    width: screenWidth * 0.9,
  },
  item: {
    padding: 10,
    borderRadius: 5,
    marginVertical: 2,
    borderColor: "black",
    borderWidth: 1,
    width: screenWidth * 0.75,
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "rgba(56, 251, 38, 0.8)",
    borderRadius: 5,
  },
  itemText: {
    fontSize: screenWidth * 0.08,
    fontFamily: "Saira-Regular",
  },
  buttonClose: {
    backgroundColor: "rgba(0, 205, 0, 1)",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    borderColor: "black",
    borderWidth: 2,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Saira-Regular",
    fontSize: screenWidth * 0.06,
  },
  shiftItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    width: screenWidth * 0.9,
  },
  shiftText: {
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
  },
  dateHeader: {
    fontSize: screenWidth * 0.07,
    fontFamily: "Saira-Regular",
    marginTop: 10,
    color : "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',

  },
  deleteButtonText: {
    color: 'white',
    fontFamily: 'Saira-Regular',
    fontSize: screenWidth * 0.06,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  closeButton: {
    backgroundColor: 'darkred',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
    borderColor: 'black',
    borderWidth: 2,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    fontFamily: 'Saira-Regular',
    fontSize: screenWidth * 0.06,
  },
  descriptionText: {
    fontSize: 16,
    marginVertical: 5,
  },
  breaksText: {
    fontSize: 16,
    marginVertical: 5,
  },
});

export default DeleteShifts;
