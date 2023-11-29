import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  Button,
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import { SERVER_BASE_URL, ADD_AND_UPDATE_SHIFT_ENDPOINT } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const ReportHours = () => {
  const navigation = useNavigation();
  const [date, setDate] = useState({ year: "2023", month: "1", day: "1" });
  const [startTime, setStartTime] = useState({ hour: "", minute: "" });
  const [endTime, setEndTime] = useState({ hour: "", minute: "" });
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [details, setDetails] = useState("");

  // Generate number arrays for Picker
  const generateNumberArray = (start, end) => {
    let numbers = [];
    for (let i = start; i <= end; i++) {
      numbers.push(i < 10 ? `0${i}` : `${i}`);
    }
    return numbers;
  };

  // Arrays for days, months, years, hours, and minutes
  const days = generateNumberArray(1, 31);
  const months = generateNumberArray(1, 12);
  const years = generateNumberArray(2020, 2050); // Adjust the range as needed

  // Function to handle break time adjustment
  const handleBreakChange = (increment) => {
    setBreakMinutes((prevBreakMinutes) =>
      Math.max(0, prevBreakMinutes + increment)
    );
  };

  // Function to submit shift data to the server
  const submitShift = async () => {
    const formattedDate = `${date.year}-${date.month.padStart(
      2,
      "0"
    )}-${date.day.padStart(2, "0")}`;
    const formattedStartTime = `${startTime.hour.padStart(
      2,
      "0"
    )}:${startTime.minute.padStart(2, "0")}`;
    const formattedEndTime = `${endTime.hour.padStart(
      2,
      "0"
    )}:${endTime.minute.padStart(2, "0")}`;

    const shiftData = {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
      breaksTotal: breakMinutes,
      description: details,
    };

    // Log the data you're about to send
    console.log("Submitting shift data:", shiftData);

    const getTokenAndMakeRequest = async (shiftData) => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) throw new Error("Token not found");

        const url = `${SERVER_BASE_URL}${ADD_AND_UPDATE_SHIFT_ENDPOINT}`;
        const response = await fetch(url, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(shiftData),
        });

        console.log("Response Status:", response.status); // Testiominaisuus, voi poistaa joskus

        const responseData = await response.json();
        console.log("Response Data:", responseData); // Testiominaisuus, voi poistaa joskus

        if (response.ok) {
          Alert.alert("Shift reported successfully", "", [
            {
              text: "OK",
              onPress: () => navigation.navigate("History"), // Navigate to History screen
            },
          ]);
        } else {
          Alert.alert("Failed to report shift", responseData.message);
        }
      } catch (error) {
        console.error("Fetch error:", error);
        Alert.alert("An error occurred while reporting the shift");
      }
    };
    await getTokenAndMakeRequest(shiftData);
  };

  const togglePicker = () => {
    setPickerVisible(!isPickerVisible);
  };
  const formatDate = (date) => {
    return `${date.day.padStart(2, "0")}.${date.month.padStart(2, "0")}.${
      date.year
    }`;
  };
  const startMinutesInputRef = useRef(null);
  const endMinutesInputRef = useRef(null);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
      />

      {/* Button to Show Date Picker Modal */}
      <TouchableOpacity onPress={togglePicker} style={styles.dateButton}>
        <Text style={styles.buttonText}>
          {date.year !== "2023" || date.month !== "1" || date.day !== "1"
            ? formatDate(date)
            : "SELECT DATE"}
        </Text>
      </TouchableOpacity>

      <View style={styles.timeContainer}>
        {/* Start Time Input*/}
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

      {/* Break Time Adjustment */}
      <View style={styles.breakContainer}>
        <Text style={styles.breakButtonText}>BREAKS</Text>
        <View style={styles.breakAdjustContainer}>
          <TouchableOpacity
            onPress={() => handleBreakChange(-15)}
            style={styles.breakButton}
          >
            <Text style={styles.breakButtonMinus}>-</Text>
          </TouchableOpacity>
          <Text style={styles.breakText}>{`${breakMinutes} min`}</Text>
          <TouchableOpacity
            onPress={() => handleBreakChange(15)}
            style={styles.breakButton}
          >
            <Text style={styles.breakButtonPlus}>+</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Details Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter work description"
        value={details}
        onChangeText={setDetails}
      />

      {/* Confirm Button */}
      <TouchableOpacity style={styles.confirmButton} onPress={submitShift}>
        <Text style={styles.confirmButtonText}>CONFIRM</Text>
      </TouchableOpacity>
      {/* Pickeri päivämäärälle */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isPickerVisible}
        onRequestClose={() => {
          setPickerVisible(!isPickerVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <View style={styles.container}>
              {/* Label and Picker for Year */}
              <Text style={styles.label}>Year</Text>
              <View style={styles.pickerContainer}>
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
              <View style={styles.pickerContainer}>
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
              <View style={styles.pickerContainer}>
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

            {/* Sulje Modal (päivämäärä valikko) */}
            <TouchableOpacity
              style={styles.buttonClose}
              onPress={() => setPickerVisible(!isPickerVisible)}
            >
              <Text style={styles.textStyle}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  pickerContainer: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 5,
    width: screenWidth * 0.7,
    height: screenHeight * 0.05,
    justifyContent: "center",
    marginBottom: "10%",
  },
  label: {
    fontSize: screenWidth * 0.1,
    color: "black",
    fontFamily: "Saira-Regular",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 0,
  },
  dateButton: {
    marginVertical: 10,
    padding: 2,
    backgroundColor: "rgba(83, 237, 255, 0.8)",
    borderRadius: 5,
    width: screenWidth * 0.9,
    alignItems: "center",
    borderColor: "black",
    borderWidth: 2,
  },
  dash: {
    fontSize: screenWidth * 0.15,
    color: "white",
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: screenWidth * 0.1,
    color: "white",
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    alignItems: "center",
    textAlign: "center",
  },
  breakButtonMinus: {
    fontSize: screenWidth * 0.2,
    color: "black",
  },
  breakButtonPlus: {
    fontSize: screenWidth * 0.2,
    color: "black",
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: screenWidth * 0.9,
    alignItems: "center",
  },
  breakContainer: {
    alignItems: "center",
    marginVertical: 5,
    borderRadius: 5,
    width: screenWidth * 0.9,
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  breakAdjustContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  breakButton: {
    padding: 0,
    backgroundColor: "rgba(255, 255, 255, 1)",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
    flex: 0.5,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: screenWidth * 0.03,
  },
  breakButtonText: {
    fontSize: screenWidth * 0.1,
    color: "white",
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    alignItems: "center",
  },
  breakText: {
    marginHorizontal: 10,
    fontSize: screenWidth * 0.08,
    color: "white",
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    borderColor: "black",
    borderWidth: 2,
    flex: 1,
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "rgba(15, 15, 15, 0.8)",
    borderRadius: 5,
  },
  input: {
    margin: 12,
    borderWidth: 2,
    padding: 10,
    width: screenWidth * 0.9,
    height: screenHeight * 0.1,
    textAlignVertical: "top",
    borderRadius: 5,
    fontFamily: "Saira-Regular",
    backgroundColor: "rgba(255, 255, 255, 1)",
    marginBottom: screenHeight * 0.2,
    fontSize: screenWidth * 0.05,
  },
  confirmButton: {
    backgroundColor: "rgba(0, 205, 0, 0.8)", // Confirm button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginHorizontal: 10,
    borderColor: "black",
    borderWidth: 2,
  },
  confirmButtonText: {
    color: "white",
    textAlign: "center",
    fontSize: screenWidth * 0.07,
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
    height: screenHeight * 0.7,
  },
  buttonClose: {
    backgroundColor: "rgba(0, 205, 0, 1)",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    borderColor: "black",
    borderWidth: 2,
    textAlign: "center",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Saira-Regular",
    fontSize: screenWidth * 0.08,
  },
  modalText: {
    textAlign: "center",
    fontFamily: "Saira-Regular",
    fontSize: screenWidth * 0.1,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
    color: "black",
  },
  picker: {
    width: screenWidth * 0.7,
    height: screenHeight * 0.2,
    borderColor: "black",
    borderWidth: 2,
    borderRadius: 5,
  },
  timeInputContainer: {
    flexDirection: "row",
    borderRadius: 5,
    borderColor: "black",
    borderWidth: 2,
    padding: 10,
    backgroundColor: "rgba(255, 255, 255, 1)",
  },
  timeInput: {
    width: screenWidth * 0.16,
    marginHorizontal: 2,
    textAlign: "center",
    fontSize: screenWidth * 0.08,
  },
});

export default ReportHours;
