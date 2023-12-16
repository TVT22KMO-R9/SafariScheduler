import React, { useState, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
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
  KeyboardAvoidingView,
  Image,
  TouchableWithoutFeedback,
  Button,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SERVER_BASE_URL, ADD_AND_UPDATE_SHIFT_ENDPOINT } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../Components/Home";
import Logout from "../Components/Logout";
import Menu from '../Components/Menu';
import BackgroundImage from "../utility/BackGroundImage";

const screenHeight = Dimensions.get("window").height;
const screenWidth = Dimensions.get("window").width;

const ReportHours = () => {
  const navigation = useNavigation();
  const currentDate = new Date();
  const [date, setDate] = useState({
    year: currentDate.getFullYear().toString(),
    month: (currentDate.getMonth() + 1).toString(),
    day: currentDate.getDate().toString(),
  });
  const [startTime, setStartTime] = useState({ hour: "", minute: "" });
  const [endTime, setEndTime] = useState({ hour: "", minute: "" });
  const [breakMinutes, setBreakMinutes] = useState(0);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [details, setDetails] = useState("");
  const [isMenuVisible, setMenuVisible] = useState(false);
  const route = useRoute();
  const userRole = route.params?.userRole;

  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
  };


  // Generate number arrays for Picker
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
              onPress: () => navigation.navigate("History", { userRole }), // Navigate to History screen
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
    return `${date.day.padStart(2, "0")}.${date.month.padStart(2, "0")}.${date.year
      }`;
  };
  const startMinutesInputRef = useRef(null);
  const endMinutesInputRef = useRef(null);

  return (
    <View style={styles.container}>
      <BackgroundImage style={styles.backgroundImage} />
      <View style={{ paddingTop: 50 }}>

      </View>
      <Text style={styles.headlineText}>REPORT HOURS</Text>

      {/* Nappi päivämäärän valinnalle */}
      <TouchableOpacity onPress={togglePicker} style={styles.actionButton}>
        <Text style={styles.buttonText}>
          <Ionicons name="chevron-down-circle-outline" size={24} color="white" />
          {"Select date"}
        </Text>
      </TouchableOpacity>
      {/* Työvuoron kellonajan lisäys*/}
      <View style={styles.timeContainer}>
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

      {/* Tauon pituuden lisäys */}
      <View style={styles.breakContainer}>
        <Text style={styles.buttonText}>BREAKS</Text>
        <View style={styles.breakAdjustContainer}>
          <TouchableOpacity
            onPress={() => handleBreakChange(-15)}
            style={styles.breakButton}
          >
            <Text style={styles.breakButtonMinus}>-</Text>
          </TouchableOpacity>
          <Text style={styles.buttonText}>{`${breakMinutes} min`}</Text>
          <TouchableOpacity
            onPress={() => handleBreakChange(15)}
            style={styles.breakButton}
          >
            <Text style={styles.breakButtonPlus}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Työn kuvaus input */}
      <TextInput
        style={styles.textInputBox}
        placeholder="Enter work description"
        value={details}
        onChangeText={setDetails}
      />
      {/* Työvuoron lisäyksen kuittaus-nappi */}
      <TouchableOpacity style={styles.actionButton} onPress={submitShift}>
        <Text style={styles.buttonText}>
          <Ionicons name="checkmark" size={24} color="green" />
          {"Confirm"}
        </Text>
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
            <View style={{ textAlign: 'center' }}>
              {/* Otsikko ja picker vuodelle */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={[styles.buttonText, { color: 'black' }]}>YEAR</Text>
                <TouchableOpacity onPress={togglePicker}>
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
              <Text style={[styles.buttonText, { color: 'black' }]}>MONTH</Text>
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
              <Text style={[styles.buttonText, { color: 'black'  }]}>DAY</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={date.day}
                  onValueChange={(itemValue) =>
                    setDate({ ...date, day: itemValue })
                  }
                >
                  {days.map((day) => (
                    <Picker.Item
                      key={day}
                      label={day.toString()}
                      value={day}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            {/* Nappi päivämäärän kuittaamiseen */}
            <View style={{  marginTop: 40 }}>
            <TouchableOpacity
              style={{...styles.actionButton, borderColor: "grey"}}
              onPress={() => setPickerVisible(!isPickerVisible)}
            >
              <Text style={styles.buttonText}><Ionicons name="checkmark" size={24} color="green" />
                {"Confirm"}
              </Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const commonStyles = { //Useasti käytetyt tänne
  text: {
    fontFamily: "Saira-Regular"
  },
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    paddingTop: 0,
  },
  headlineText: {
    marginVertical: 8,
    fontSize: screenWidth * 0.07,
    ...commonStyles.text,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  pickerContainer: {
    borderWidth: 2,
    borderRadius: 5,
    width: screenWidth * 0.8,
    height: screenHeight * 0.06,
    justifyContent: "center",
    marginVertical: 8,
  },
  label: {
    fontSize: screenWidth * 0.1,
    color: "black",
    ...commonStyles.text,

  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  dash: {
    fontSize: screenWidth * 0.15,
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    marginHorizontal: 5,
    lineHeight: 80,
    ...commonStyles.text,
  },
  breakContainer: {
    alignItems: "center",
    marginVertical: 8,
    borderRadius: 5,
    width: screenWidth * 0.8,
    borderColor: "black",
    borderWidth: 2,
    backgroundColor: "rgba(244, 244, 244, 0.2)",
  },
  breakAdjustContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  breakButtonMinus: {
    fontSize: screenWidth * 0.1,
    color: "black",
    height: screenHeight * 0.07,
  },
  breakButtonPlus: {
    fontSize: screenWidth * 0.1,
    color: "black",
    height: screenHeight * 0.07,
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
  centeredView: { //Päivämäärän valinta pop up View
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  modalView: { //päivämäärän valinta pop up modal
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    elevation: 5,
    height: screenHeight * 0.7,
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
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  menuContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '75%',
    height: '100%',
    backgroundColor: 'white',
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
    fontSize: screenWidth * 0.07,
    color: "white",
    ...commonStyles.text,
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  }, 
  textInputBox: {
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
});

export default ReportHours;
