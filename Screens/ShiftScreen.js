import React, { useState, useEffect } from "react";
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

export default function ShiftScreen() {
    const [box1Data, setBox1Data] = useState("");
    const [box2Data, setBox2Data] = useState("");
    const [box3Data, setBox3Data] = useState("");
    const [box4Data, setBox4Data] = useState("");

    const navigation = useNavigation();

    const navigateToMenu = () => {
        navigation.navigate('Menu');
      };

      useEffect(() => {
        // Fetch data for box 1
        fetch("YOUR_BACKEND_ENDPOINT_FOR_BOX1")
          .then((response) => response.text())
          .then((data) => setBox1Data(data))
          .catch((error) => console.error("Error fetching data for box 1", error));
      
        // Fetch data for box 2
        fetch("YOUR_BACKEND_ENDPOINT_FOR_BOX2")
          .then((response) => response.text())
          .then((data) => setBox2Data(data))
          .catch((error) => console.error("Error fetching data for box 2", error));

          fetch("YOUR_BACKEND_ENDPOINT_FOR_BOX3")
          .then((response) => response.text())
          .then((data) => setBox3Data(data))
          .catch((error) => console.error("Error fetching data for box 2", error));

          fetch("YOUR_BACKEND_ENDPOINT_FOR_BOX4")
          .then((response) => response.text())
          .then((data) => setBox4Data(data))
          .catch((error) => console.error("Error fetching data for box 2", error));
      }, []);
    

return (
    <KeyboardAvoidingView
      style={styles.container}
    >
    <Image
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
    />
    <TouchableOpacity onPress={navigateToMenu} style={styles.button}>
        <Ionicons name="menu" size={45} color="white" />
    </TouchableOpacity>
    <Image source={require("../assets/logo.png")} style={styles.logo} />
      <Text style={styles.label}>Next shifts</Text>
    <View style={styles.dataBox}>
      <Text style={styles.dataBoxText}>{box1Data}</Text>
    </View>
    <View style={styles.dataBox}>
      <Text style={styles.dataBoxText}>{box2Data}</Text>
    </View>
    <View style={styles.dataBox}>
      <Text style={styles.dataBoxText}>{box3Data}</Text>
    </View>
    <View style={styles.dataBox}>
      <Text style={styles.dataBoxText}>{box4Data}</Text>
    </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    logo: {
        width: 200,
        height: 500,
        position: "absolute",
        top: 0,
        resizeMode: "contain",
      },
    backgroundImage: {
      position: "absolute",
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    label: {
    fontSize: 40,
    paddingTop: 170,
      fontFamily: "Saira-Regular",
      color: "white",
      textShadowColor: "rgba(0, 0, 0, 1)",
      textShadowOffset: { width: 1, height: 1 },
      textShadowRadius: 1,
    },
    button: {
    position: 'absolute',
    top: 20,
    left: 20,
    padding: 10,
    },
    dataBox: {
        backgroundColor: "white",
        width: "80%",
        padding: 10,
        margin: 10,
        borderRadius: 5,
        alignItems: "center",
      },
      dataBoxText: {
        fontSize: 16,
        color: "black",
      },
  });

  