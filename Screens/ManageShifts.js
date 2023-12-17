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
import { useNavigation, useFocusEffect, useRoute } from "@react-navigation/native";
import DeleteShifts from './DeleteShifts';
import Home from "../Components/Home";
import Logout from "../Components/Logout";
import Menu from '../Components/Menu';
import BackgroundImage from "../utility/BackGroundImage";

screenWidth = Dimensions.get("window").width;
screenHeight = Dimensions.get("window").height;

const ManageShifts = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [shiftDate, setShiftDate] = useState("");
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
  const navigation = useNavigation();
  const [isMenuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const userRole = route.params?.userRole;

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };

  useFocusEffect(
    React.useCallback(() => {
      setMenuVisible(false);
    }, [])
  );

  const generateNumberArray = (start, end) => {
    let numbers = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i < 10 ? `0${i}` : `${i}`);
    }
    return numbers;
  };

  const generateDaysArray = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, index) => (index + 1).toString());
  };

  const days = generateDaysArray(date.year, date.month);
  const months = generateNumberArray(1, 12);
  const years = generateNumberArray(2020, 2050);

  const toggleDatePicker = () => {
    setDatePickerVisible(!isDatePickerVisible);
  };

  const handleAddDescription = () => {
    setDescriptionVisible(true);
  };

  const formatDate = (date) => {
    if (!date.year || !date.month || !date.day) {
      console.error("Incomplete date object:", date);
      return ""; // Or return a default date string
    }

    const formattedMonth = date.month.toString().padStart(2, "0");
    const formattedDay = date.day.toString().padStart(2, "0");
    return `${date.year}-${formattedMonth}-${formattedDay}`;
  };

  const fetchWorkers = async () => {
    const token = await fetchAuthToken();
    if (!token) return;

    const url = `${SERVER_BASE_URL}${WORKERS}`;

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response Status:", response.status);

      if (response.ok) {
        const data = await response.json();
        setWorkers(data);
        setFilteredWorkers(data);
      } else {
        console.log("Failed to fetch workers:", await response.text());
        Alert.alert("Error", "Failed to fetch workers.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      Alert.alert("Error", "An error occurred while fetching workers.");
    }
  };

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = workers.filter((worker) => {
        const fullName = `${worker.firstName} ${worker.lastName}`.toLowerCase();
        return fullName.includes(text.toLowerCase());
      });
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(workers);
    }
  };

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

  const handleAssignShift = async () => {
    if (!selectedWorker || !shiftDate || !startTime) {
      Alert.alert(
        "Error",
        "Please select a worker and fill in all required shift details."
      );
      console.log("Selected Worker:", selectedWorker);
      console.log("Shift Date:", shiftDate);
      console.log("Start Time:", startTime);
      return;
    }

    const shiftData = {
      id: selectedWorker.id,
      date: shiftDate,
      startTime: formatTime(startTime),
      endTime: endTime ? formatTime(endTime) : undefined,
      description: description,
      breaksTotal: breaksTotal,
    };
    console.log("Shift Data:", shiftData);

    try {
      const token = await fetchAuthToken();
      if (!token) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

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
        DeviceEventEmitter.emit('newShiftAdded');
        Alert.alert("Success", "Shift assigned successfully.");
        // Process responseData if needed
      } else {
        Alert.alert("Error", "Failed to assign the shift.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred while assigning the shift.");
      console.error(error);
    }
  };

  const formatTime = (time) => {
    // Assuming time is an object like { hour: '09', minute: '00' }
    return `${time.hour}:${time.minute}:00`;
  };

  const handleDateChange = () => {
    const formattedDate = formatDate(date);
    setShiftDate(formattedDate);
  };

  const handleDeleteShift = () => {
    navigation.navigate("DeleteShifts");
  };

  const openModal = async () => {
    setModalVisible(true);
    await fetchWorkers();
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectWorker = (worker) => {
    setSelectedWorker(worker);
    closeModal();
  };

  const startMinutesInputRef = useRef(null);
  const endMinutesInputRef = useRef(null);

  return (
    <KeyboardAvoidingView style={{ flex: 1, alignItems: "center" }}>
      <BackgroundImage style={styles.backgroundImage} />
      {/* Piti laittaa padding tähän väliin, muuten en saanut toimimaan: */}
      <View style={{ paddingTop: 80 }}>
      </View>
      <Text style={styles.headlineText}>MANAGE SHIFTS</Text>
      {/* Button to Open Worker Selection Modal */}
      <TouchableOpacity onPress={openModal} style={styles.actionButton}>
        <Text style={styles.buttonText}>
          {selectedWorker
            ? `${selectedWorker.firstName} ${selectedWorker.lastName}`
            : "Select Worker  "}
          <Ionicons name="chevron-down-circle-outline" size={24} color="white" />
        </Text>
      </TouchableOpacity>
      {/* Button päivämäärän avaamiselle */}
      <TouchableOpacity onPress={toggleDatePicker} style={styles.actionButton}>
        <Text style={styles.buttonText}>
          {"Select Date   "}
          <Ionicons name="chevron-down-circle-outline" size={24} color="white" />
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
            <View style={{ textAlign: 'center' }}>
              {/* Otsikko ja picker vuodelle */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
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
                <Text style={styles.buttonText}>{"Confirm   "}
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
                <TouchableOpacity onPress={closeModal} style={{ ...styles.actionButton, borderColor: "grey" }}>
                  <Text style={styles.buttonText}>Close{"   "}
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
        <Text style={styles.buttonText}>Assign Shift{"  "}
          <Ionicons name="checkmark" size={24} color="green" />
        </Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={handleDeleteShift}>
        <Text style={styles.buttonText}>Delete Shifts{"  "}
          <Ionicons name="arrow-forward" size={24} color="green" />
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

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
  actionButton: { //Yleisen napin muotoilu
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    marginVertical: 8,
    alignItems: "center",
    width: screenWidth * 0.8,
    borderColor: "white",
    borderWidth: 2,
    backgroundColor: "black"
  },
  buttonText: { //Yleisen napin teksti
    fontSize: screenWidth * 0.07,
    color: "white",
    ...commonStyles.text,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  dash: { // väliviiva kellonajan boksien välissä
    fontSize: screenWidth * 0.15,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginHorizontal: 5,
    lineHeight: 80,
    ...commonStyles.text,
  },
  timeContainer: {//kellonajan valinta 
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 70,
  },
  timeInputContainer: { //kellonajan valinta syöttöboksi
    width: screenWidth * 0.36,
    justifyContent: "center",
    flexDirection: "row",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  timeInput: { //kellonajan text Input
    width: screenWidth * 0.16,
    marginHorizontal: 2,
    textAlign: "center",
    fontSize: screenWidth * 0.07,
  },
  pickerContainer: { //Päivämäärän valinta-picker
    borderWidth: 2,
    borderRadius: 5,
    height: screenHeight * 0.06,
    justifyContent: "center",
    marginVertical: 8,
  },
  modalView: { // pop up modal 
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    elevation: 5,
    height: screenHeight * 0.7,
  },
  workerSearchBox: {
    height: screenHeight * 0.06,
    borderWidth: 1,
    textAlign: 'center',
    marginBottom: 15,
    borderRadius: 5,
    ...commonStyles.text,
    fontSize: screenWidth * 0.06,
  },
  item: { //Työntekijän search-box 
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
    //alignItems: "center", nimi teksti keskelle mikäli halutaan
  },
  itemText: { //Työntekijän nimien listaus-teksti
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
  },
  textInputBox: { // vuoron kuvaus tekstisyöttö
    height: screenHeight * 0.07,
    width: screenWidth * 0.8,
    borderRadius: 5,
    borderColor: "black",
    textAlign: 'center',
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 2,
    marginBottom: "1%",
    paddingHorizontal: 10,
    fontSize: screenWidth * 0.06,
    ...commonStyles.text,
    marginVertical: 8,
  },
  label: { // Year, month, day tekstit
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
    marginBottom: 5,
  },
  dateContainer: {
    width: "100%",
    alignItems: "center",
  },
  centeredView: { //Pop up ikkunat
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },

});

export default ManageShifts;
