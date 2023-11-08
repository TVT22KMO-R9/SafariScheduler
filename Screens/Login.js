import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Button,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from "react-native";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigation = useNavigation();

    const navigateToShiftScreen = () => {
        navigation.navigate('ShiftScreen');
      };

  const handleLogin = () => {
    navigation.navigate('ShiftScreen');
    console.log(email, password, rememberMe);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Image
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <Ionicons
            name={rememberMe ? 'checkbox' : 'square-outline'}
            size={30}
            color={rememberMe ? 'rgba(0, 240, 0, 1)' : 'black'}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Remember Me</Text>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleLogin}
        activeOpacity={0.8} // touch feedback
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};



const window = Dimensions.get("window");
const screenWidth = window.width;
const screenHeight = window.height;

const styles = StyleSheet.create({
  buttonContainer: {
    width: screenWidth * 0.6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 205, 0, 0.7)',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: screenWidth * 0.15,
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,

  },
  container: {
    flex: 1,
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
    height: screenWidth * 0.2,
    width: "80%",
    borderRadius: 10,
    borderColor: "black",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    marginBottom: "10%",
    paddingHorizontal: 10,
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 0,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxText: {
    fontSize: screenWidth * 0.1,
  },
  label: {
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default Login;
