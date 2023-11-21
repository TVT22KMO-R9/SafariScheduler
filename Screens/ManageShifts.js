import React, { useState, useRef } from "react";
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
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Picker } from "@react-native-picker/picker";
import { WORKERS, ADD_SHIFT, SERVER_BASE_URL, DELETE_SHIFT } from "@env";

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
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  const [date, setDate] = useState({ year: "2023", month: "1", day: "1" });
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);

  const generateNumberArray = (start, end) => {
    let numbers = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i < 10 ? `0${i}` : `${i}`);
    }
    return numbers;
  };

  const days = generateNumberArray(1, 31);
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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Alert.alert("Success", "Shift deleted successfully.");
        // Update local state or UI as needed
      } else {
        Alert.alert("Error", "Failed to delete the shift.");
      }
    } catch (error) {
      Alert.alert("Error", "An error occurred.");
    }
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
    <View style={styles.container}>
      <Image
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
      />

      {/* Button to Open Worker Selection Modal */}
      <TouchableOpacity onPress={openModal} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedWorker
            ? `${selectedWorker.firstName} ${selectedWorker.lastName}`
            : "SELECT WORKER"}
        </Text>
      </TouchableOpacity>

      {/* Button to Show Date Picker Modal */}
      <TouchableOpacity onPress={toggleDatePicker} style={styles.dateButton}>
        <Text style={styles.buttonText}>
          {date.year !== "2023" || date.month !== "1" || date.day !== "1"
            ? formatDate(date) // Correct usage of formatDate
            : "SELECT DATE"}
        </Text>
      </TouchableOpacity>
      {/* Date Picker Modal */}
      <Modal
        visible={isDatePickerVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.datecenteredView}>
          <View style={styles.datemodalView}>
            <View style={styles.dateContainer}>
              {/* Label and Picker for Year */}
              <Text style={styles.label}>Year</Text>
              <View style={styles.datepickerContainer}>
                <Picker
                  selectedValue={date.year}
                  onValueChange={(itemValue) =>
                    setDate({ ...date, year: itemValue })
                  }
                  style={styles.picker}
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

              {/* Label and Picker for Month */}
              <Text style={styles.label}>Month</Text>
              <View style={styles.datepickerContainer}>
                <Picker
                  selectedValue={date.month}
                  onValueChange={(itemValue) =>
                    setDate({ ...date, month: itemValue })
                  }
                  style={styles.picker}
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

              {/* Label and Picker for Day */}
              <Text style={styles.label}>Day</Text>
              <View style={styles.datepickerContainer}>
                <Picker
                  selectedValue={date.day}
                  onValueChange={(itemValue) =>
                    setDate({ ...date, day: itemValue })
                  }
                  style={styles.picker}
                >
                  {days.map((day) => (
                    <Picker.Item key={day} label={day.toString()} value={day} />
                  ))}
                </Picker>
              </View>
            </View>
            <TouchableOpacity
              style={styles.buttonConfirm}
              onPress={() => {
                toggleDatePicker(); // This will hide the date picker modal
                handleDateChange(); // This will update shiftDate based on the selected date
              }}
            >
              <Text>CONFIRM</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={styles.timeContainer}>
        <View style={styles.timeContainer}>
          {/* Start Time Input */}
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
              placeholder="HH"
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

          {/* End Time Input */}
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
              placeholder="HH"
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
        {/* Modal for Selecting Worker */}
        <Modal
          animationType="slide"
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
                    onPress={() => selectWorker(item)}
                  >
                    <Text
                      style={styles.itemText}
                    >{`${item.firstName} ${item.lastName}`}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity onPress={closeModal} style={styles.buttonClose}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
      {!isDescriptionVisible && (
        <TouchableOpacity
          onPress={handleAddDescription}
          style={styles.addButton}
        >
          <Text style={styles.buttonText}>ADD DESCRIPTION</Text>
        </TouchableOpacity>
      )}
      {isDescriptionVisible && (
        <TextInput
          style={styles.descriptionInput}
          placeholder="Comments about the shift"
          value={description}
          onChangeText={setDescription}
          multiline
        />
      )}
      {/* Button to Assign Shift */}
      <TouchableOpacity style={styles.assignButton} onPress={handleAssignShift}>
        <Text style={styles.buttonText}>ASSIGN SHIFT</Text>
      </TouchableOpacity>
    </View>
  );
};

screenWidth = Dimensions.get("window").width;
screenHeight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  addButton: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    padding: 5,
    marginVertical: 10,
    alignItems: "center",
    width: screenWidth * 0.9,
    borderColor: "black",
    borderWidth: 2,
  },
  dash: {
    fontSize: screenWidth * 0.15,
    fontFamily: "Saira-Regular",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  timeInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
    width: screenWidth * 0.4,
  },
  timeInput: {
    width: screenWidth * 0.15,
    marginHorizontal: 2,
    textAlign: "center",
    fontFamily: "Saira-Regular",
    fontSize: screenWidth * 0.1,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth * 0.9,
    alignItems: "center",
  },
  buttonConfirm: {
    backgroundColor: "rgba(0, 237, 0, 0.8)",
    borderRadius: 5,
    padding: 15,
    marginVertical: 10,
    alignItems: "center",
    width: "100%",
    borderColor: "black",
    borderWidth: 2,
  },
  picker: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.2,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  },
  datepickerContainer: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    width: screenWidth * 0.8,
    height: screenHeight * 0.07,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: "10%",
  },
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
    paddingTop: 0,
  },
  button: {
    backgroundColor: "rgba(83, 237, 255, 0.8)",
    borderRadius: 5,
    padding: 5,
    marginVertical: 10,
    alignItems: "center",
    width: "90%",
    borderColor: "black",
    borderWidth: 2,
  },
  assignButton: {
    backgroundColor: "rgba(0, 205, 0, 0.7)",
    borderRadius: 5,
    padding: 5,
    marginVertical: 10,
    alignItems: "center",
    width: screenWidth * 0.9,
    borderColor: "black",
    borderWidth: 2,
  },
  dateButton: {
    backgroundColor: "rgba(144, 11, 144, 0.8)",
    borderRadius: 5,
    padding: 5,
    marginVertical: 10,
    alignItems: "center",
    width: "90%",
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
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
    alignItems: "center",
  },
  itemText: {
    fontSize: 18,
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
  descriptionInput: {
    height: screenHeight * 0.12,
    width: "90%",
    borderRadius: 5,
    borderColor: "black",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 2,
    marginBottom: "10%",
    paddingHorizontal: 10,
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
    alignContent: "center",
    textAlignVertical: "top",
  },
  label: {
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
    marginBottom: 5,
  },
  dateContainer: {
    width: "100%",
    alignItems: "center",
  },
  datecenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  datemodalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    width: "90%",
  },
});

export default ManageShifts;
