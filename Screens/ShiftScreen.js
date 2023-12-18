import React, { useState, useEffect } from "react";

import {
  useNavigation,
  useRoute,
  useFocusEffect,
} from "@react-navigation/native";
import { UPCOMING_SHIFTS, SERVER_BASE_URL } from "@env";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Description from "../Components/Description";

import { Alert, DeviceEventEmitter } from "react-native";
import BackgroundImage from "../utility/BackGroundImage";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Modal,
} from "react-native";

export default function ShiftScreen({ screenProps }) {
  // State hooks to manage data for three different boxes on the screen.
  const [box1Data, setBox1Data] = useState([]);
  const [box2Data, setBox2Data] = useState([]);
  const [box3Data, setBox3Data] = useState([]);

  // State hook for managing the visibility of the description modal/pop-up.
  const [isDescriptionVisible, setDescriptionVisible] = useState(false);

  // State hook to store data of the selected box, particularly for displaying descriptions.
  const [selectedBoxData, setSelectedBoxData] = useState("");

  // State hook for storing an array of shifts.
  const [shifts, setShifts] = useState([]);

  // Using the navigation hook from React Navigation to navigate between screens.
  const navigation = useNavigation();

  // Function to handle the press event on a data box. It toggles the visibility
  // of the description and sets the selected box data.
  const handleDataBoxPress = (data) => {
    // Set the description of the pressed data box.
    setSelectedBoxData(data.description);
    // Toggle the visibility of the description modal/pop-up.
    setDescriptionVisible(!isDescriptionVisible);
  };

  // Function to navigate to the 'ReportHours' screen.
  const navigateToReportHours = () => {
    // Use the navigation object to change the screen.
    navigation.navigate("ReportHours");
  };

  // Function to format shift data into a more readable form.
  const formatShiftData = (shift) => {
    // Convert the date string into a Date object.
    const date = new Date(shift.date);
    // Extract and format the day, month, and year from the date.
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const formattedDate = `${day}.${month}.${year}`;

    // Extract and format the start and end times of the shift.
    const startTime = shift.startTime ? shift.startTime.substring(0, 5) : "";
    const endTime = shift.endTime ? shift.endTime.substring(0, 5) : "";

    // Get the description of the shift, defaulting to an empty string if none.
    const description = shift.description || "";

    // Create a string for display on the front page combining the date and times.
    const frontPageDisplay = `${formattedDate} , ${startTime} - ${endTime}`;

    // Return an object containing the formatted data for use in the UI.
    return { frontPageDisplay, description };
  };

  // useEffect hook to initialize data when the component mounts.
  useEffect(() => {
    // Set default data for all boxes, used when no shifts are assigned.
    const defaultShiftData = {
      description: "No assigned shift",
      frontPageDisplay: "No assigned shift",
    };
    // Initialize the state of each box with the default data.
    setBox1Data(defaultShiftData);
    setBox2Data(defaultShiftData);
    setBox3Data(defaultShiftData);
  }, []); // Empty dependency array ensures this runs only once, when the component mounts.

  // useEffect hook for fetching box data (shifts).
  useEffect(() => {
    // Define an asynchronous function to fetch data.
    const fetchBoxData = async () => {
      try {
        // Retrieve the user's authentication token from storage.
        const authToken = await AsyncStorage.getItem("userToken");
        // Fetching shift data from the server using the authentication token.
        const response = await fetch(`${SERVER_BASE_URL}${UPCOMING_SHIFTS}`, {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });
        // Parsing the JSON response to get shifts data.
        const shifts = await response.json();

        // Update the state of each box with the fetched shift data, if available.
        if (shifts.length > 0) setBox1Data(formatShiftData(shifts[0]));
        if (shifts.length > 1) setBox2Data(formatShiftData(shifts[1]));
        if (shifts.length > 2) setBox3Data(formatShiftData(shifts[2]));
      } catch (error) {
        // Logging an error in case the fetch operation fails.
        console.error("Error fetching shifts:", error);
      }
    };

    // Call the fetchBoxData function to execute the data fetching.
    fetchBoxData();
  }, []); // Empty dependency array ensures this runs only once, when the component mounts.

  // useEffect hook to handle new shift additions and update the view.
  useEffect(() => {
    // Initially fetch shifts and refresh box data when the component mounts.
    fetchShifts();
    refreshBoxData();

    // Function to handle the event when a new shift is added.
    const handleNewShiftAdded = () => {
      // Fetch new shifts and refresh box data upon the addition of a new shift.
      fetchShifts();
      refreshBoxData();
    };

    // Subscribe to the 'newShiftAdded' event using DeviceEventEmitter.
    // This sets up a listener that will call handleNewShiftAdded when the event is emitted.
    const subscription = DeviceEventEmitter.addListener(
      "newShiftAdded",
      handleNewShiftAdded
    );

    // Cleanup function to remove the event listener when the component unmounts.
    return () => {
      subscription.remove();
    };
  }, []); // Empty dependency array to ensure this runs only once, when the component mounts.

  // Function to refresh box data by fetching new shifts.
  const refreshBoxData = async () => {
    try {
      // Retrieve the user's authentication token from storage.
      const authToken = await AsyncStorage.getItem("userToken");
      // Fetching shift data from the server using the authentication token.
      const response = await fetch(`${SERVER_BASE_URL}${UPCOMING_SHIFTS}`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      // Parsing the JSON response to get shifts data.
      const shifts = await response.json();
      // Update the state of each box with the fetched shift data, if available.
      if (shifts.length > 0) setBox1Data(formatShiftData(shifts[0]));
      if (shifts.length > 1) setBox2Data(formatShiftData(shifts[1]));
      if (shifts.length > 2) setBox3Data(formatShiftData(shifts[2]));
    } catch (error) {
      // Logging an error in case the fetch operation fails.
      console.error("Error fetching shifts:", error);
    }
  };

  // Function to group shifts by month and year.
  const groupShiftsByMonth = (shifts) => {
    const grouped = {}; // Initialize an empty object for grouped shifts.
    shifts.forEach((shift) => {
      // Extract month and year from each shift's date.
      const month = new Date(shift.date).getMonth();
      const year = new Date(shift.date).getFullYear();
      // Create a combined key for month and year.
      const monthYear = `${month}-${year}`;

      // Initialize the array for this month-year key if it doesn't exist yet.
      if (!grouped[monthYear]) {
        grouped[monthYear] = [];
      }
      // Add the shift to the array for the corresponding month-year.
      grouped[monthYear].push(shift);
    });
    // Return the object with shifts grouped by month and year.
    return grouped;
  };

  // Asynchronous function to fetch shifts data.
  const fetchShifts = async () => {
    try {
      // Retrieve the user's authentication token from storage.
      const authToken = await AsyncStorage.getItem("userToken");
      // Check if the authentication token is available.
      if (!authToken) {
        Alert.alert("Error", "Authentication token not found");
        return;
      }

      // Fetch shift data from the server using the authentication token.
      const response = await fetch(`${SERVER_BASE_URL}${UPCOMING_SHIFTS}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      // Check if the response is successful.
      if (response.ok) {
        // Parse the response JSON to get shift data.
        const data = await response.json();
        // Group shifts by month using the groupShiftsByMonth function.
        const groupedShifts = groupShiftsByMonth(data);
        // Update the state with the grouped shifts.
        setShifts(groupedShifts);
      } else {
        // Alert the user if fetching shifts fails.
        Alert.alert("Error", "Failed to fetch shifts");
      }
    } catch (error) {
      // Log and alert the user in case of an error during fetching.
      console.error("Error fetching shifts:", error);
      Alert.alert("Error", "An error occurred while fetching shifts");
    }
  };

  // useEffect hook for fetching shifts when the component mounts.
  useEffect(() => {
    // Call the fetchShifts function to load shift data.
    fetchShifts();
  }, []); // The empty dependency array ensures this effect runs only once, on component mount.

  // useFocusEffect is used in React Navigation to run side effects in response to a screen coming into focus.
  useFocusEffect(
    // useCallback hook returns a memoized callback.
    React.useCallback(() => {
      // Call fetchShifts each time the screen comes into focus.
      fetchShifts();
    }, []) // An empty dependency array means the callback doesn't depend on any values from the component scope and will never change.
  );

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: "transparent" }]}
    >
      <BackgroundImage style={styles.backgroundImage} />

      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.label}>NEXT SHIFTS</Text>
      <TouchableOpacity
        style={styles.dataBox}
        onPress={() => handleDataBoxPress(box1Data)}
      >
        <Text style={styles.dataBoxText}>{box1Data.frontPageDisplay}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dataBox}
        onPress={() => handleDataBoxPress(box2Data)}
      >
        <Text style={styles.dataBoxText}>{box2Data.frontPageDisplay}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.dataBox}
        onPress={() => handleDataBoxPress(box3Data)}
      >
        <Text style={styles.dataBoxText}>{box3Data.frontPageDisplay}</Text>
      </TouchableOpacity>
      <TouchableWithoutFeedback onPress={() => setDescriptionVisible(false)}>
        <Description
          isVisible={isDescriptionVisible}
          data={selectedBoxData}
          onClose={() => setDescriptionVisible(false)}
        />
      </TouchableWithoutFeedback>
      <TouchableOpacity
        style={styles.reportHoursButton}
        onPress={navigateToReportHours}
      >
        <Text style={styles.reportHoursButtonText}>REPORT HOURS</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}
const window = Dimensions.get("window");
const screenWidth = window.width;
const screenHeight = window.height;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  logo: {
    width: 200,
    height: 250,
    position: "absolute",
    top: screenHeight * +0.08,
    resizeMode: "contain",
  },
  label: {
    fontSize: screenHeight * 0.05,
    fontWeight: "bold",
    paddingTop: 100,
    fontFamily: "Saira-Regular",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  button: {
    position: "absolute",
    top: 20,
    left: 20,
    padding: 10,
  },
  dataBox: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: screenWidth * 0.8,
    padding: 10,
    margin: 10,
    borderRadius: 5,
    alignItems: "center",
    borderColor: "white",
    borderWidth: 2,
  },
  dataBoxText: {
    fontSize: 16,
    color: "white",
    fontFamily: "Saira-Regular",
    fontWeight: "bold",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  menuContainer: {
    position: "absolute",
    left: 0,
    top: 0,
    width: Dimensions.get("window").width * 0.75,
    height: "100%",
    backgroundColor: "white",
  },
  reportHoursButton: {
    width: "80%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 13,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    bottom: screenHeight * 0.1,
    borderColor: "white",
    borderWidth: 2,
  },
  reportHoursButtonText: {
    color: "white",
    fontSize: screenWidth * 0.08,
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  logoutbutton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 10,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    backgroundColor: "transparent",
  },
});
