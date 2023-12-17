import React from "react";
import { View, Image, StyleSheet, Button, Text, Dimensions } from "react-native";
import { TouchableOpacity } from "react-native";
const Welcome = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
      />
      <Image source={require("../assets/logo.png")} style={styles.logo} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("Login")}
        >
          <Text style={styles.buttonText}>LOGIN</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation.navigate("CreateUser")}
        >
          <Text style={styles.buttonText}>REGISTER</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const styles = StyleSheet.create({
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
  logo: {
    width: 250,
    height: 250,
    position: "absolute",
    top: 70,
    resizeMode: "contain",
  },
  buttonContainer: {
    backgroundColor: "transparent",
    marginTop: 150,
  },
  loginButton: {
    marginBottom: 30,
    marginTop: 50,
    width: 200,
    height: 90,
    borderRadius: 5,
    backgroundColor: "rgba(0, 205, 0, 0.7)",
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    marginBottom: 30,
    marginTop: 50,
    width: screenWidth * 0.8,
    height: screenHeight * 0.1,
    borderRadius: 5,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderWidth: 2,
    borderColor: "white",
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontFamily: "Saira-Regular",
    color: "#FFFFFF",
    fontSize: 40,
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
});

export default Welcome;
