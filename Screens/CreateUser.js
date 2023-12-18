import React, { useState } from "react";
import { Alert } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { REGISTER_ENDPOINT, SERVER_BASE_URL } from "@env";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from "react-native";

// Define a functional component named CreateUser which accepts a navigation prop.
const CreateUser = ({ navigation }) => {
  // State hooks to store user input for email, password, confirm password, first name, last name, and phone number.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  // Function to handle the user creation process.
  const handleCreateUser = async () => {
    // Check if the password length is less than 8 characters and show an alert if true.
    if (password.length < 8) {
      Alert.alert("Password needs to be at least 8 characters long");
      return;
    }
    // Check if the password and confirm password do not match and show an alert if true.
    else if (password !== confirmPassword) {
      Alert.alert("Password Mismatch");
      return; // Exit the function early if there's a password mismatch.
    }

    // Prepare user data for sending to the server.
    const userData = {
      email: email,
      password: password,
      firstName: firstName,
      lastName: lastName,
      phoneNumber: phoneNumber,
    };

    // Try-catch block to handle the network request.
    try {
      console.log(userData); // Log the user data for debugging.
      // Make a POST request to the server to register the user.
      const response = await fetch(`${SERVER_BASE_URL}${REGISTER_ENDPOINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      // Check if the response is OK and handle the successful registration.
      if (response.ok) {
        const data = await response.text();
        console.log("User registration successful:", data);
        Alert.alert("User created successfully", data);
        navigation.navigate("Login"); // Navigate to the Login screen.
      }
      // Handle specific error responses from the server.
      else if (response.status === 400) {
        const errorData = await response.text();
        console.log("User registration failed:", errorData);
        Alert.alert("User Registration Failed", errorData);
      } else if (response.status === 500) {
        const errorData = await response.text();
        console.log("Internal Server Error:", errorData);
        Alert.alert("Internal Server Error", errorData);
      }
    } catch (error) {
      // Handle any other errors in the request.
      console.error("User registration error:", error);
    }
  };

  return (
    // KeyboardAwareScrollView adjusts the view when the keyboard is open
    <KeyboardAwareScrollView
      style={{ flex: 1 }} // Makes the ScrollView flexibly fill the parent
      contentContainerStyle={styles.container} // Style for the container of the ScrollView
      keyboardShouldPersistTaps="handled" // Defines the behavior when the keyboard is open and the user taps
    >
      {/* Background image for the form */}
      <Image
        source={require("../assets/background.png")} // Specifies the image source
        style={styles.backgroundImage} // Styling for the background image
      />

      {/* Input field for email */}
      <TextInput
        style={styles.input} // Styling for the input field
        value={email} // Controlled input for email
        onChangeText={setEmail} // Function to update the email state
        placeholder="Email" // Placeholder text
        keyboardType="email-address" // Keyboard type optimized for emails
        autoCapitalize="none" // Prevents auto capitalization
      />

      {/* Input field for password */}
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry // Hides the password text for security
      />

      {/* Input field for confirming password */}
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry // Also hides this text
      />

      {/* Input field for first name */}
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />

      {/* Input field for last name */}
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />

      {/* Input field for phone number */}
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad" // Keyboard type optimized for phone numbers
      />

      {/* Button for submitting the form */}
      <TouchableOpacity
        style={styles.buttonContainer} // Styling for the button
        onPress={handleCreateUser} // Function to call when the button is pressed
        activeOpacity={0.8} // Changes opacity on press for visual feedback
      >
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const window = Dimensions.get("window");
const screenWidth = window.width;
const screenHeight = window.height;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  input: {
    height: screenHeight * 0.08,
    width: screenWidth * 0.8,
    borderRadius: 5,
    borderColor: "black",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: screenWidth * 0.07,
    fontFamily: "Saira-Regular",
  },
  buttonContainer: {
    width: screenWidth * 0.8,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderColor: "white",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: screenWidth * 0.15,
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CreateUser;
