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
  Modal,
  Platform,
  ImageBackground,
  TouchableWithoutFeedback,
} from "react-native";

export default function Menu() {

    return (
        <KeyboardAvoidingView
          style={styles.container}
        >
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <View style={styles.labelsContainer}>
        <View style={styles.menuItem}>
        <Ionicons name="ios-radio-button-on" size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>Report hours</Text>
        </View>
        <View style={styles.menuItem}>
        <Ionicons name="ios-radio-button-on" size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>My shifts</Text>
        </View><View style={styles.menuItem}>
        <Ionicons name="ios-radio-button-on" size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>History</Text>
        </View><View style={styles.menuItem}>
        <Ionicons name="ios-radio-button-on" size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>Others shifts</Text>
        </View><View style={styles.menuItem}>
        <Ionicons name="ios-radio-button-on" size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>Edit shifts</Text>
        </View><View style={styles.menuItem}>
        <Ionicons name="ios-radio-button-on" size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>Others history</Text>
        </View>
        <View style={styles.menuItem}>
        <Ionicons name="ios-radio-button-on" size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>Edit emails</Text>
        </View>
        <View style={styles.menuItem}>
        <Ionicons name="ios-radio-button-on" size={20} color="white" style={styles.icon} />
        <Text style={styles.label}>Settings</Text>
        </View>
      </View>
        </KeyboardAvoidingView>
        )

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: '#002233',
    },
    logo: {
        width: 150,
        height: 500,
        position: "absolute",
        top: -160,
        resizeMode: "contain",
      },
      labelsContainer: {
        paddingTop: 90,
        flex: 1,
        justifyContent: "center",
        alignItems: "flex-start",
      },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        },
      label: {
        fontSize: 35,
        fontFamily: "Saira-Regular",
        color: "white",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: 1, height: 1 },
        textShadowRadius: 1,
        marginVertical: 0,
        paddingTop: 12,
      },
    })