import React from "react";
import { View, Image, StyleSheet, Button, Text } from "react-native";
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
          style={styles.loginButton}
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
    width: 300,
    height: 300,
    position: "absolute",
    top: 0,
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
    borderRadius: 15,
    backgroundColor: "rgba(0, 205, 0, 0.7)",
    borderWidth: 2,
    borderColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  registerButton: {
    marginBottom: 30,
    marginTop: 50,
    width: 200,
    height: 90,
    borderRadius: 20,
    backgroundColor: "rgba(0, 130, 255, 0.7)",
    borderWidth: 2,
    borderColor: "black",
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
