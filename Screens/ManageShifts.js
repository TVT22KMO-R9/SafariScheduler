import React, { useState, useRef, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Modal,
  Alert,
  Image,
  Dimensions,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  DeviceEventEmitter,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { WORKERS, ADD_SHIFT, SERVER_BASE_URL, DELETE_SHIFT } from "@env";
import {
  useNavigation,
  useFocusEffect,
  useRoute,
} from "@react-navigation/native";
import DeleteShifts from "./DeleteShifts";
import Home from "../Components/Home";
import Logout from "../Components/Logout";
import Menu from "../Components/Menu";
import BackgroundImage from "../utility/BackGroundImage";
import { getToken } from "../utility/Token";

screenWidth = Dimensions.get("window").width;
screenHeight = Dimensions.get("window").height;

// ManageShifts functional component
const ManageShifts = () => {
  // State for managing various aspects of shift management
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [shiftDate, setShiftDate] = useState("");
  const [shiftPutDate, setShiftPutDate] = useState(""); // For PUT
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");
  const [breaksTotal, setBreaksTotal] = useState("");
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState({
    year: new Date().getFullYear().toString(),
    month: (new Date().getMonth() + 1).toString(),
    day: new Date().getDate().toString(),
  });
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);

  // Navigation hook
  const navigation = useNavigation();
  // State for menu visibility
  const [isMenuVisible, setMenuVisible] = useState(false);
  // Route hook to access route parameters
  const route = useRoute();
  // Extracting user role from route parameters
  const userRole = route.params?.userRole;

  // Function to toggle menu visibility
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  // Effect hook to reset menu visibility when the screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(false);
    }, [])
  );

  // Function to generate an array of numbers (for days, months, or years)
  const generateNumberArray = (start, end) => {
    let numbers = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i < 10 ? `0${i}` : `${i}`);
    }
    return numbers;
  };

  // Function to generate an array of days for a given month and year
  const generateDaysArray = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) =>
      (index + 1).toString()
    );
  };

  // Generating arrays for days, months, and years
  const days = generateDaysArray(date.year, date.month);
  const months = generateNumberArray(1, 12);
  const years = generateNumberArray(2020, 2050);

  // Function to toggle date picker visibility
  const toggleDatePicker = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };

  // Function to handle adding a description
  const handleAddDescription = () => {
    setDescriptionVisible(true);
  };

  // Function to format a date object into a string
  const formatDate = (date) => {
    if (!date.year || !date.month || !date.day) {
      console.error("Incomplete date object:", date);
      return ""; // Returning an empty string for incomplete date
    }
    const formattedMonth = date.month.padStart(2, "0");
    const formattedDay = date.day.padStart(2, "0");
    return `${formattedDay}.${formattedMonth}.${date.year}`;
  };

    // Function to format a date YYYY-MM-DD
    const formatDateForPut = (date) => {
      if (!date.year || !date.month || !date.day) {
        console.error("Incomplete date object:", date);
        return ""; // Returning an empty string for incomplete date
      }
      const formattedMonth = date.month.padStart(2, "0");
      const formattedDay = date.day.padStart(2, "0");
      return `${date.year}-${formattedMonth}-${formattedDay}`;
    };

  // Function to fetch workers from the server
  const fetchWorkers = async () => {
    const token = await getToken();
    if (!token) return;

    const url = `${SERVER_BASE_URL}${WORKERS}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setWorkers(data); // Updating the workers state with fetched data
        setFilteredWorkers(data); // Updating the filtered workers state
      } else {
        console.error("Failed to fetch workers:", await response);
        Alert.alert("Error", "Failed to fetch workers.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "An error occurred while fetching workers.");
    }
  };

  // Function to handle search functionality
  const handleSearch = (text) => {
    setSearchText(text); // Updating the search text state
    if (text) {
      // Filtering workers based on the search text
      const filtered = workers.filter((worker) => {
        const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
        return fullName.includes(text.toLowerCase());
      });
      setFilteredWorkers(filtered); // Updating the state with filtered workers
    } else {
      setFilteredWorkers(workers); // Resetting to the original list of workers when search text is empty
    }
  };

  // Function to fetch the authentication token
  const fetchAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken"); // Retrieving the token from storage
      if (!token) {
        Alert.alert("Error", "Authentication token not found"); // Alert if token is not found
        return null;
      }
      return token; // Returning the token
    } catch (error) {
      Alert.alert("Error", "Failed to retrieve authentication token"); // Alert on error
      return null;
    }
  };

  // Function to handle shift assignment
  const handleAssignShift = async () => {
    if (!selectedWorker || !shiftDate || !startTime) {
      // Validating if the necessary details are provided
      Alert.alert(
        "Error",
        "Please select a worker and fill in all required shift details."
      );
      return;
    }

    // Preparing shift data for the request
    const shiftData = {
      id: selectedWorker.id,
      date: shiftPutDate,
      startTime: formatTime(startTime),
      endTime: endTime ? formatTime(endTime) : undefined,
      description: description,
     breaksTotal: breaksTotal,
    };

    console.log("shiftDate ", shiftDate);

    try {
      const token = await fetchAuthToken(); // Fetching auth token
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }
       console.log("shiftData", shiftData);
      // Sending a request to assign the shift
      const response = await fetch(`${SERVER_BASE_URL}${ADD_SHIFT}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(shiftData),
      });

      if (response.ok) {
        const responseData = await response.json();
        DeviceEventEmitter.emit("newShiftAdded"); // Emitting an event after successful shift addition
        Alert.alert("Success", "Shift assigned successfully.");
      } else {
        Alert.alert("Error", "Failed to assign the shift.");
        console.log("Failed to assign the shift:", await response.text());
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while assigning the shift.");
    }
  };

  // Function to format time
  const formatTime = (time) => {
    // Formatting time in HH:mm:ss format
    return `${time.hour}:${time.minute}:00`;
  };

 


  // Function to handle date change
  const handleDateChange = () => {
    const formattedDate = formatDate(date); // Formatting the date
    const formattedPutDate = formatDateForPut(date); // Formatting the date for PUT
    setShiftDate(formattedDate); // Updating the shift date state
    setShiftPutDate(formattedPutDate); // Updating the shift date state for PUT
    toggleDatePicker(); // Closing the date picker
  };

  // Function to handle the deletion of a shift
  const handleDeleteShift = () => {
    navigation.navigate("DeleteShifts"); // Navigating to the DeleteShifts screen
  };

  // Function to open a modal
  const openModal = async () => {
    setModalVisible(true); // Setting modal visibility to true
    await fetchWorkers(); // Fetching workers data
  };

  // Function to close the modal
  const closeModal = () => {
    setModalVisible(false); // Setting modal visibility to false
  };

  // Function to select a worker
  const selectWorker = (worker) => {
    setSelectedWorker(worker); // Setting the selected worker
    closeModal(); // Closing the modal after selection
  };

  // Refs for minute input fields
  const startMinutesInputRef = useRef(null);
  const endMinutesInputRef = useRef(null);

  return (
    <KeyboardAvoidingView style={{ flex: 1, alignItems: "center" }}>
      <BackgroundImage style={styles.backgroundImage} />
      {/* Piti laittaa padding tähän väliin, muuten en saanut toimimaan: */}
      <View style={{ paddingTop: 80 }}></View>
      <Text style={styles.headlineText}>MANAGE SHIFTS</Text>
      {/* Button to Open Worker Selection Modal */}
      <TouchableOpacity onPress={openModal} style={styles.actionButton}>
        <Text style={styles.buttonText}>
          {selectedWorker
            ? `${selectedWorker.firstName} ${selectedWorker.lastName}`
            : "Select Worker  "}
          <Ionicons
            name="chevron-down-circle-outline"
            size={24}
            color="white"
          />
        </Text>
      </TouchableOpacity>
      {/* Button päivämäärän avaamiselle */}
      <TouchableOpacity onPress={toggleDatePicker} style={styles.actionButton}>
        <Text style={styles.buttonText}>
          {shiftDate || "Select Date   "}
          <Ionicons
            name="chevron-down-circle-outline"
            size={24}
            color="white"
          />
        </Text>
      </TouchableOpacity>

      {/* Päivämäärän valinta: */}
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={{ textAlign: "center" }}>
              {/* Otsikko ja picker vuodelle */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.label}>Year</Text>
                <TouchableOpacity onPress={toggleDatePicker}>
                  <Ionicons name="close" size={32} color="red" />
                </TouchableOpacity>
              </View>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={date.year}
                  onValueChange={(itemValue) =>
                    setDate({ ...date, year: itemValue })
                  }
                >
                  {years.map((year) => (
                    <Picker.Item
                      key={year}
                      label={year.toString()}
                      value={year}
                    />
                  ))}
                </Picker>
              </View>
              {/* Otsikko ja picker kuukaudelle */}
              <Text style={styles.label}>Month</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={date.month}
                  onValueChange={(itemValue) =>
                    setDate({ ...date, month: itemValue })
                  }
                >
                  {months.map((month) => (
                    <Picker.Item
                      key={month}
                      label={month.toString()}
                      value={month}
                    />
                  ))}
                </Picker>
              </View>
              {/* Otsikko ja picker päivälle */}
              <Text style={styles.label}>Day</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={date.day}
                  onValueChange={(itemValue) =>
                    setDate({ ...date, day: itemValue })
                  }
                >
                  {days.map((day) => (
                    <Picker.Item key={day} label={day.toString()} value={day} />
                  ))}
                </Picker>
              </View>
            </View>
            {/* Nappi päivämäärän kuittaamiseen: */}
            <View style={{ marginTop: 40 }}>
              <TouchableOpacity
                style={{ ...styles.actionButton, borderColor: "grey" }}
                onPress={() => {
                  toggleDatePicker(); // This will hide the date picker modal
                  handleDateChange(); // This will update shiftDate based on the selected date
                }}
              >
                <Text style={styles.buttonText}>
                  {"Confirm   "}
                  <Ionicons name="checkmark" size={24} color="green" />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <View style={styles.timeContainer}>
        <View style={styles.timeContainer}>
          {/* Kellonajan valinta: */}
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.timeInput}
              value={startTime.hour}
              onChangeText={(text) => {
                setStartTime({ ...startTime, hour: text });
                if (text.length === 2) {
                  startMinutesInputRef.current.focus();
                }
              }}
              keyboardType="numeric"
              maxLength={2}
              placeholder="HH :"
            />
            <TextInput
              style={styles.timeInput}
              value={startTime.minute}
              onChangeText={(text) =>
                setStartTime({ ...startTime, minute: text })
              }
              keyboardType="numeric"
              maxLength={2}
              placeholder="MM"
              ref={startMinutesInputRef}
            />
          </View>
          <Text style={styles.dash}>-</Text>
          <View style={styles.timeInputContainer}>
            <TextInput
              style={styles.timeInput}
              value={endTime.hour}
              onChangeText={(text) => {
                setEndTime({ ...endTime, hour: text });
                if (text.length === 2) {
                  endMinutesInputRef.current.focus();
                }
              }}
              keyboardType="numeric"
              maxLength={2}
              placeholder="HH :"
            />
            <TextInput
              style={styles.timeInput}
              value={endTime.minute}
              onChangeText={(text) => setEndTime({ ...endTime, minute: text })}
              keyboardType="numeric"
              maxLength={2}
              placeholder="MM"
              ref={endMinutesInputRef}
            />
          </View>
        </View>
        {/* Työntekijän valinta: */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={closeModal}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.workerSearchBox}
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
                    onPress={() => selectWorker(item)}
                  >
                    <Text
                      style={styles.itemText}
                    >{`${item.firstName} ${item.lastName}`}</Text>
                  </TouchableOpacity>
                )}
              />
              {/* Select worker Close-nappula: */}
              <View style={{ marginTop: 40 }}>
                <TouchableOpacity
                  onPress={closeModal}
                  style={{ ...styles.actionButton, borderColor: "grey" }}
                >
                  <Text style={styles.buttonText}>
                    Close{"   "}
                    <Ionicons name="close" size={24} color="red" />
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
      {!isDescriptionVisible && (
        <TouchableOpacity
          onPress={handleAddDescription}
          style={styles.actionButton}
        >
          <Text style={styles.buttonText}>Add Description</Text>
        </TouchableOpacity>
      )}
      {isDescriptionVisible && (
        <TextInput
          style={styles.textInputBox}
          placeholder="Comments about the shift"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      )}
      {/* Button to Assign Shift */}
      <TouchableOpacity style={styles.actionButton} onPress={handleAssignShift}>
        <Text style={styles.buttonText}>
          Assign Shift{"  "}
          <Ionicons name="checkmark" size={24} color="green" />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={handleDeleteShift}>
        <Text style={styles.buttonText}>
          Delete Shifts{"  "}
          <Ionicons name="arrow-forward" size={24} color="red" />
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const commonStyles = {
  //Useasti käytetyt tänne
  text: {
    fontFamily: "Saira-Regular",
  },
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  headlineText: {
    //Otsikko
    marginVertical: 8,
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  actionButton: {
    //Yleisen napin muotoilu
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    marginVertical: 8,
    alignItems: "center",
    width: screenWidth * 0.8,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "black",
  },
  buttonText: {
    //Yleisen napin teksti
    fontSize: screenWidth * 0.07,
    color: "white",
    ...commonStyles.text,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  dash: {
    // väliviiva kellonajan boksien välissä
    fontSize: screenWidth * 0.15,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginHorizontal: 5,
    lineHeight: 80,
    ...commonStyles.text,
  },
  timeContainer: {
    //kellonajan valinta
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
  },
  timeInputContainer: {
    //kellonajan valinta syöttöboksi
    width: screenWidth * 0.36,
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  timeInput: {
    //kellonajan text Input
    width: screenWidth * 0.16,
    marginHorizontal: 2,
    textAlign: "center",
    fontSize: screenWidth * 0.07,
  },
  pickerContainer: {
    //Päivämäärän valinta-picker
    borderWidth: 2,
    borderRadius: 5,
    height: screenHeight * 0.06,
    justifyContent: "center",
    marginVertical: 8,
  },
  modalView: {
    // pop up modal
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    elevation: 5,
    height: screenHeight * 0.7,
  },
  workerSearchBox: {
    height: screenHeight * 0.06,
    borderWidth: 1,
    textAlign: "center",
    marginBottom: 15,
    borderRadius: 5,
    ...commonStyles.text,
    fontSize: screenWidth * 0.06,
  },
  item: {
    //Työntekijän search-box
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
    //alignItems: "center", nimi teksti keskelle mikäli halutaan
  },
  itemText: {
    //Työntekijän nimien listaus-teksti
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
  },
  textInputBox: {
    // vuoron kuvaus tekstisyöttö
    height: screenHeight * 0.07,
    width: screenWidth * 0.8,
    borderRadius: 5,
    borderColor: "black",
    textAlign: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 2,
    marginBottom: "1%",
    paddingHorizontal: 10,
    fontSize: screenWidth * 0.06,
    ...commonStyles.text,
    marginVertical: 8,
  },
  label: {
    // Year, month, day tekstit
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
    marginBottom: 5,
  },
  dateContainer: {
    width: "100%",
    alignItems: "center",
  },
  centeredView: {
    //Pop up ikkunat
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
});

export default ManageShifts;
