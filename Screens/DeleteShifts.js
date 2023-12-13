import React, { useState, useEffect, useRef } from "react";
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

const DeleteShifts = () => {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [workerShifts, setWorkerShifts] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
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
      } else {
        Alert.alert("Error", "Failed to fetch workers.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while fetching workers.");
    }
  };

  const fetchWorkerShifts = async (workerId) => {
    const token = await fetchAuthToken();
    if (!token) {
      console.log("No auth token found");
      return;
    }

    try {
      console.log(`Fetching shifts for worker ID: ${workerId}`);
      const response = await fetch(`${SERVER_BASE_URL}${SHIFTS_EVERYONE}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log(`Response status: ${response.status}`);
      if (response.ok) {
        const allShifts = await response.json();
        console.log(`All shifts: ${JSON.stringify(allShifts)}`);
        const shifts = allShifts.filter((shift) => shift.workerId === workerId);
        console.log(`Filtered shifts for worker: ${JSON.stringify(shifts)}`);
        setWorkerShifts(shifts);
      } else {
        console.log("Failed to fetch shifts:", await response.text());
        Alert.alert("Error", "Failed to fetch shifts.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "An error occurred while fetching shifts.");
    }
  };

  const handleWorkerSelect = (worker) => {
    setSelectedWorker(worker);
    fetchWorkerShifts(worker.id);
    setModalVisible(false);
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
        <Text style={styles.buttonText}>
          {selectedWorker
            ? `${selectedWorker.firstName} ${selectedWorker.lastName}`
            : "SELECT WORKER"}
        </Text>
      </TouchableOpacity>

      <FlatList
        data={workerShifts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.shiftItem}
            onPress={() => handleDeleteShift(item.id)}
          >
            <Text
              style={styles.shiftText}
            >{`Date: ${item.date}, Start: ${item.startTime}, End: ${item.endTime}`}</Text>
          </TouchableOpacity>
        )}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <FlatList
              data={workers}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.item}
                  onPress={() => handleWorkerSelect(item)}
                >
                  <Text
                    style={styles.itemText}
                  >{`${item.firstName} ${item.lastName}`}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.buttonClose}
            >
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
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
    width: screenWidth * 0.9,
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
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Saira-Regular",
    fontSize: 18,
  },
  shiftItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    width: screenWidth * 0.8,
  },
  shiftText: {
    fontSize: 16,
    fontFamily: "Saira-Regular",
  },
});

export default DeleteShifts;
