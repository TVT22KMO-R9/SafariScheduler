import React, { useRef, useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";

export default function Menu({ userRole, toggleMenu, companyName}) {

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigation = useNavigation();


  // useEffect to handle re-rendering when the Menu becomes visible
  useEffect(() => {
    console.log("Menu component re-rendered with user role:", userRole);
  }, [userRole]);

  // Function to handle navigation
  const handlePress = (label) => {
    if(label === "CLOSE"){
      toggleMenu();
      return;
    }
    // Convert label to screen component name
    const screens = {
      "REPORT HOURS": "ReportHours",
      "MY SHIFTS": "MyShifts",
      "MY HISTORY": "History",
      "SETTINGS": "Settings",
      "EMPLOYEE SHIFTS": "OtherShifts",
      "MANAGE SHIFTS": "ManageShifts",
      "EMPLOYEE HISTORY": "OthersHistory",
      "EDIT EMAILS": "EditEmails",
    };
    const screenName = screens[label];
    if (screenName) {
      navigation.navigate(screenName, { userRole });
      //close menu component before navigating to next screen
      setIsMenuOpen(false);
    } else {
      console.warn(`No screen found for label: ${label}`);
    }
  };
  

  // Define menu items based on user roles
  let menuItems = [];
  if (userRole === "WORKER") {
    menuItems = [
      
      { label: "REPORT HOURS", icon: "time" },
      { label: "MY SHIFTS", icon: "calendar" },
      { label: "MY HISTORY", icon: "refresh" },
      { label: "SETTINGS", icon: "settings" },
      { label: "CLOSE", icon: "close"},
    ];
  } else if (userRole === "SUPERVISOR") {
    menuItems = [
     
      { label: "REPORT HOURS", icon: "time" },
      { label: "MY SHIFTS", icon: "calendar" },
      { label: "MY HISTORY", icon: "refresh" },
      { label: "EMPLOYEE SHIFTS", icon: "clipboard" },
      { label: "EMPLOYEE HISTORY", icon: "folder" },
      { label: "MANAGE SHIFTS", icon: "build" },
      { label: "SETTINGS", icon: "settings" },
      { label: "CLOSE", icon: "close"},
    ];
  } else if (userRole === "MASTER") {
    menuItems = [
      { label: companyName, isCompanyName: true, icon: "business" },
    
      { label: "REPORT HOURS", icon: "time" },
      { label: "MY SHIFTS", icon: "calendar" },
      { label: "MY HISTORY", icon: "refresh" },
      { label: "EMPLOYEE SHIFTS", icon: "clipboard" },
      { label: "MANAGE SHIFTS", icon: "build" },
      { label: "EMPLOYEE HISTORY", icon: "folder" },
      { label: "EDIT EMAILS", icon: "mail" },
      { label: "SETTINGS", icon: "settings" },
      { label: "CLOSE", icon: "close"},
     
    ];
  }

  return (
    <KeyboardAvoidingView style={styles.container}>
      <View style={styles.labelsContainer}>
      {menuItems.map((menuItem, index) => (
  <TouchableOpacity
    style={styles.menuItem}
    key={index}
    onPress={() => {
      if (!menuItem.isCompanyName) {
        handlePress(menuItem.label);
        toggleMenu();
      }
    }}
  >
    <Ionicons
      name={menuItem.icon}
      color={menuItem.label === "CLOSE" ? "red" : "white"}
      style={[
        styles.icon,
        menuItem.icon === "refresh" ? styles.flipIcon : null,
      ]}
    />
    <Text style={[styles.label, menuItem.isCompanyName ? styles.companyName : null]}>
      {menuItem.label}
    </Text>
  </TouchableOpacity>
))}
      </View>
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

    backgroundColor: "rgba(31,27,24,255)",
    borderRightColor: "rgba(143,138,134,255)",
    borderRightWidth: 2,

  }, companyName: {
    fontWeight: "bold",
  },
  labelsContainer: {
    paddingTop: 0,
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    width: "90%",
    height: screenHeight,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: screenHeight * 0.03,
  },
  icon: {
    fontSize: screenWidth * 0.09,
    //color: "white",
    marginRight: 2,
    position: "relative",
    top: "2.3%",
  },
  flipIcon: {
    transform: [{ rotateY: "180deg" }],
  },
  label: {
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
    color: "rgba(143,138,134,255)",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    marginVertical: 0,
    paddingTop: 12,
  },
});