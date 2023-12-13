import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, StatusBar, Animated } from "react-native";
import { RefreshTokenCheck } from "../utility/RefreshToken";

const Splash = ({ navigation }) => {
  const spinValue = new Animated.Value(0);

  // Function to start the spin animation
  const startSpinning = () => {
    spinValue.setValue(0);
    spinAnimation = Animated.loop(
      Animated.sequence([
        Animated.delay(300),
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(spinValue, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    spinAnimation.start();
  };
  

  useEffect(() => {
    startSpinning();
    let timer;
        const checkTokenAndNavigate = async () => // useeffect ei voi olla async, joten tehdään async funktio sen sisällä jota kutsutaan
    {
        let hasRefreshtoken = await RefreshTokenCheck();  // tarkistaa loppuun ennenkuin antaa timerin alkaa
        // After 3 seconds, redirect to the Welcome screen
        timer = setTimeout(() => 
        {
        if (hasRefreshtoken) {
          navigation.navigate("Login");
        } else {
          console.log("Ei refresh tokenia");
        navigation.navigate("Welcome");
        }
      }, 3000);
    }

    checkTokenAndNavigate();  // kutsu

    // Clear the timer when the component is unmounted
    return () => {
      clearTimeout(timer);
      if (spinAnimation) {
        spinAnimation.stop();
      }
    };
  }, [navigation]);

  // Interpolate the spinValue for spinning
  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"], // Spin in degrees
  });

  // Interpolate the spinValue for scaling
  const scale = spinValue.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 0.8, 1], // Scale down to half size and back to full size
  });

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <Image
        source={require("../assets/background.png")}
        style={styles.backgroundImage}
      />
      <Animated.Image
        source={require("../assets/logo.png")}
        style={[
          styles.logo,
          {
            transform: [{ rotate: spin }, { scale: scale }],
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
    resizeMode: "contain",
    marginTop: -370,
  },
});

export default Splash;
