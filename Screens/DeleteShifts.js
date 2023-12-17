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
  ScrollView,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { DELETE_SHIFT, WORKERS, SERVER_BASE_URL, SHIFTS_EVERYONE } from "@env";
import BackgroundImage from "../utility/BackGroundImage";

const formatDate = (dateString) => {
  // Create a new Date object from the provided date string.
  const date = new Date(dateString);

  // Define the formatting options for the date.
  const options = {
    weekday: "short", // Short name of the day.
    month: "2-digit", // Numeric month.
    day: "2-digit",   // Numeric day of the month.
  };

  // Format the date using a localized string.
  let formattedDate = date.toLocaleString("default", options);

  // Split the formatted date string at spaces.
  const parts = formattedDate.split(' ');
  if (parts.length > 1) {
    // Change the letters of the weekday abbreviation to uppercase.
    parts[0] = parts[0].toUpperCase();
    // Reassemble the parts back into a single string.
    formattedDate = parts.join(' ');
  }

  // Remove the last dot from the string, if present.
  formattedDate = formattedDate.replace(/\.$/, '');

  // Return the formatted date.
  return formattedDate;
};


const DeleteShifts = () => {
  // Initialize state variables for storing workers, shifts, modal visibility,
  // selected worker IDs, and the selected shift.
  const [workers, setWorkers] = useState([]); // State for workers.
  const [allShifts, setAllShifts] = useState([]); // State for all shifts.
  const [isModalVisible, setModalVisible] = useState(false); // Visibility state for the worker selection modal.
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([]); // State for IDs of selected workers.
  const [isShiftDetailsVisible, setShiftDetailsVisible] = useState(false); // Visibility state for the shift details modal.
  const [selectedShift, setSelectedShift] = useState(null); // State for the selected shift.
  const [searchTerm, setSearchTerm] = useState(""); // State for the search term.

  // Use useEffect hook to fetch shifts and workers on the first render of the component.
  useEffect(() => {
    fetchAllShifts(); // Fetch all shifts.
    fetchWorkers(); // Fetch workers.
  }, []);

  const fetchAuthToken = async () => {
    try {
      // Attempt to retrieve the user's token from AsyncStorage.
      const token = await AsyncStorage.getItem("userToken");

      // Check if the token exists.
      if (!token) {
        // If no token is found, show an error message.
        Alert.alert("Error", "Authentication token not found");
        return null;
      }

      // Return the token if it is found.
      return token;
    } catch (error) {
      // If an error occurs while retrieving the token, show an error message.
      Alert.alert("Error", "Failed to retrieve authentication token");
      return null;
    }
  };

  // Handles the selection of a worker.
  const handleWorkerSelect = (workerId) => {
    setSelectedWorkerIds((prevIds) => {
      // Check if the worker is already selected. If so, remove them from the list; otherwise, add them.
      const newIds = prevIds.includes(workerId)
        ? prevIds.filter((id) => id !== workerId)
        : [...prevIds, workerId];
      console.log("Updated Selected Worker IDs:", newIds);
      return newIds;
    });
  };

  // Computes filtered shifts, either all or just those of selected workers.
  const filteredShifts = useMemo(() => {
    return allShifts.filter(
      (shift) =>
        selectedWorkerIds.length === 0 ||
        selectedWorkerIds.includes(shift.userId)
    );
  }, [allShifts, selectedWorkerIds]);

  // Filters workers based on the search term.
  const filteredWorkers = useMemo(() => {
    return workers.filter((worker) =>
      `${worker.firstName} ${worker.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );
  }, [workers, searchTerm]);

  // Sorts the filtered shifts by date.
  const sortedShifts = useMemo(() => {
    if (!filteredShifts) {
      return [];
    }

    return filteredShifts.sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [filteredShifts]);

  // Fetches workers from the server.
  const fetchWorkers = async () => {
    const token = await fetchAuthToken();
    if (!token) return;

    try {
      const response = await fetch(`${SERVER_BASE_URL}${WORKERS}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If the request is successful, save the workers in the state.
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

  // Fetches all shifts from the server.
  const fetchAllShifts = async () => {
    // Retrieve the authentication token.
    const token = await fetchAuthToken();
    // If no token is retrieved, exit the function.
    if (!token) return;

    try {
      // Make a request to the server to get all shifts.
      const response = await fetch(`${SERVER_BASE_URL}${SHIFTS_EVERYONE}`, {
        headers: { Authorization: `Bearer ${token}` }, // Set the authorization header.
      });

      // If the response is successful, process the data.
      if (response.ok) {
        const data = await response.json();
        setAllShifts(data); // Update the state with the fetched shifts.
        console.log("Fetched Shifts:", data);
      } else {
        // If the response is not successful, show an error alert.
        Alert.alert("Error", "Failed to fetch shifts.");
      }
    } catch (error) {
      // If there is an error during the fetch, show an error alert.
      Alert.alert("Error", "An error occurred while fetching shifts.");
    }
  };

  // Groups shifts by their date.
  const groupShiftsByDate = (shifts) => {
    // Reduce the array of shifts into a grouped object.
    return shifts.reduce((groups, shift) => {
      const date = shift.date; // Get the date of the shift.
      if (!groups[date]) {
        groups[date] = []; // If this date hasn't been added to groups, add it.
      }
      groups[date].push(shift); // Add the shift to the appropriate date group.
      return groups; // Return the accumulating groups object.
    }, {}); // Start with an empty object.
  };

  // useMemo to create a memoized array of shifts grouped by date.
  const groupedShifts = useMemo(() => {
    // Return an empty array if filteredShifts is not available.
    if (!filteredShifts) {
      return [];
    }

    // Group shifts by date using the groupShiftsByDate function.
    const grouped = groupShiftsByDate(filteredShifts);

    // Map over the keys of the grouped object to create an array of date and shifts.
    return Object.keys(grouped).map((date) => ({
      date,
      shifts: grouped[date],
    }));
  }, [filteredShifts]);

  // Function to handle the action when a shift is selected for more details.
  const openShiftDetails = (shift) => {
    setSelectedShift(shift); // Set the selected shift in the state.
    setShiftDetailsVisible(true); // Make the shift details modal visible.
  };

  // Function to close the shift details modal.
  const closeShiftDetails = () => {
    setSelectedShift(null); // Clear the selected shift.
    setShiftDetailsVisible(false); // Hide the shift details modal.
  };

  // Function to handle the deletion of a shift.
  const handleDeleteShift = async (shiftId) => {
    // Retrieve the authentication token.
    const token = await fetchAuthToken();
    if (!token) return;

    try {
      // Construct the endpoint URL for deleting a shift.
      const deleteEndpoint = `${SERVER_BASE_URL}${DELETE_SHIFT.replace(
        "{shiftId}",
        shiftId
      )}`;

      // Make a DELETE request to the server.
      const response = await fetch(deleteEndpoint, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      // If the delete request is successful, show a success message.
      if (response.ok) {
        
        Alert.alert("Success", "Shift deleted successfully.");
        console.log(response)
        // Update the state to remove the deleted shift.
        // setWorkerShifts(workerShifts.filter((shift) => shift.id !== shiftId)); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        // Close the shift details modal.
        closeShiftDetails(); // teron fix
        fetchAllShifts(); // Fetch all shifts again to update the list. // teron fix
        fetchAllWorkers(); // Fetch all workers again to update the list. // teron fixi
      } else {
        // If the delete request is not successful, show an error message.
        Alert.alert("Error", "Failed to delete the shift.");
        console.log(response);
      }
    } catch (error) {
      // If an error occurs during the delete request, show an error message.
      //Alert.alert("Error", "An error occurred.");
      console.log(error);
    }
  };


  return (
    <View style={styles.container}>
      <BackgroundImage style={styles.backgroundImage} />
      <Text style={styles.headlineText}>DELETE SHIFTS</Text>
      {/* Button to open the modal for selecting workers */}
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.actionButton}
      >
        <Text style={styles.buttonText}>
          <Ionicons name="chevron-down-circle-outline" size={24} color="white" />
          {"Select Worker"}</Text>
      </TouchableOpacity>

      {/* FlatList to display grouped shifts */}
      <FlatList
        data={groupedShifts}
        keyExtractor={(item) => item.date}
        renderItem={({ item }) => (
          <View>
            {/* Header for each group of shifts (date) */}
            <Text style={styles.dateHeader}>{formatDate(item.date)}</Text>
            {/* List each shift under the respective date */}
            {item.shifts.map((shift) => (
              <TouchableOpacity
                key={shift.id}
                style={styles.shiftItem}
                onPress={() => openShiftDetails(shift)}
              >
                <Text style={styles.shiftText}>
                  {/* Display shift details */}
                  {`${shift.firstName} ${shift.lastName
                    } ${shift.startTime.slice(0, -3)} - ${shift.endTime ? shift.endTime.slice(0, -3) : ""
                    }`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      />

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search by name"
              value={searchTerm}
              onChangeText={setSearchTerm}
            />
            <FlatList
              data={filteredWorkers}
              keyExtractor={(worker) => worker.id.toString()}
              renderItem={({ item: worker }) => (
                <TouchableOpacity
                  style={
                    selectedWorkerIds.includes(worker.id)
                      ? styles.selectedWorkerItem
                      : styles.workerItem
                  }
                  onPress={() => handleWorkerSelect(worker.id)}
                >
                  <Text
                    style={
                      selectedWorkerIds.includes(worker.id)
                        ? styles.selectedWorkerText
                        : styles.workerText
                    }
                  >
                    {`${worker.firstName || "First"} ${worker.lastName || "Last"}`}
                  </Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity
              style={{ ...styles.actionButton, borderColor: "grey" }}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>{"Close   "}
              <Ionicons name="close" size={24} color="red" />
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>


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
                <Text style={styles.dateHeader2}>
                  {formatDate(selectedShift.date)}
                </Text>
                <Text style={styles.shiftText}>
                  {`${selectedShift.firstName} ${selectedShift.lastName
                    } ${selectedShift.startTime.slice(0, -3)} - ${selectedShift.endTime
                      ? selectedShift.endTime.slice(0, -3)
                      : ""
                    }`}
                </Text>
                {selectedShift.description ? (
                  <View style={styles.descriptionBox}>
                    <ScrollView>
                      <Text style={styles.descriptionText}>
                        {selectedShift.description}
                      </Text>
                    </ScrollView>
                  </View>
                ) : null}
                {selectedShift.breaksTotal ? (
                  <Text style={styles.breaksText}>
                    Breaks: {selectedShift.breaksTotal}
                  </Text>
                ) : null}
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={{...styles.actionButton, width: screenWidth * 0.35}}
                    onPress={() => handleDeleteShift(selectedShift.id)}
                  >
                    <Text style={styles.buttonText}>Delete Shift</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{...styles.actionButton, width:  screenWidth * 0.35}}
                    onPress={closeShiftDetails}
                  >
                    <Text style={styles.buttonText}>Close</Text>
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

const commonStyles = { //Useasti käytetyt tänne
  text: {
    fontFamily: "Saira-Regular"
  },
}

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headlineText: { //Otsikko
    marginVertical: 8,
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    marginVertical: 8,
    alignItems: "center",
    width: screenWidth * 0.8,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "black"
  },
  buttonText: {
    fontSize: screenWidth * 0.055,
    color: "white",
    ...commonStyles.text,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    elevation: 5,
    height: screenHeight * 0.7,
    width: screenWidth * 0.8,
  },
  buttonClose: {
    backgroundColor: "rgba(255, 0, 0, 0.9)",
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    width: screenWidth * 0.75,
    borderColor: "black",
    borderWidth: 2,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    ...commonStyles.text,
    fontSize: screenWidth * 0.06,
  },
  shiftItem: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    width: screenWidth * 0.8,
  },
  shiftText: {
    fontSize: screenWidth * 0.045,
    ...commonStyles.text,
  },
  dateHeader: {
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
    marginTop: 10,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 6,
  },
  dateHeader2: {
    fontSize: screenWidth * 0.1,
    ...commonStyles.text,
    marginTop: 0,
    color: "black",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 0,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "white",
    ...commonStyles.text,
    fontSize: screenWidth * 0.06,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
  },
  closeButton: {
    backgroundColor: "darkred",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
    marginLeft: 10,
    alignItems: "center",
    flex: 1,
  },
  closeButtonText: {
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 4,
    ...commonStyles.text,
    fontSize: screenWidth * 0.06,
  },
  descriptionText: {
    fontSize: screenHeight * 0.02,
    marginVertical: 5,
    
  },
  descriptionBox: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    width: screenWidth * 0.7,
    maxHeight: screenHeight * 0.3,
  },
  breaksText: {
    fontSize: 16,
    marginVertical: 5,
  },
  searchInput: { // työntekijän search teksiboksi  
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "black",
    width: screenWidth * 0.8,
    fontSize: screenWidth * 0.06,
    ...commonStyles.text,
  },
  workerItem: { //työntekijälista
    padding: 5,
    borderRadius: 5,
    marginVertical: 5,
    borderColor: "black",
    borderWidth: 1,
    width: screenWidth * 0.8,
    //alignItems: "center", jos halutaan nimet keskelle
  },
  selectedWorkerItem: {
    backgroundColor: "rgba(rgba(211, 211, 211, 1)",
    borderRadius: 5,
    padding: 5,
    marginVertical: 5,
    borderColor: "black",
    borderWidth: 1,
    width: screenWidth * 0.8,
    //alignItems: "center",
  },
  workerText: { //Työntekijälistan teksti
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
  },
  selectedWorkerText: { //Työntekijälistan teksti valituille työntekijöille
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
    color: "rgba(0,0,0,1)",
  },
  
});

export default DeleteShifts;
