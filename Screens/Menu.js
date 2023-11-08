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

export default function Menu() {

    return (
        <KeyboardAvoidingView
          style={styles.container}
        >
        <Image
            source={require("../assets/background.png")}
            style={styles.backgroundImage}
        />
        </KeyboardAvoidingView>
        )

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
    })