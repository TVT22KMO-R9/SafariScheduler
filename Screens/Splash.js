import React, { useEffect, useState } from "react";
import { View, Image, StyleSheet, StatusBar, Animated } from "react-native";
import { RefreshTokenCheck } from "../utility/RefreshTokenCheck";

const Splash = ({ navigation }) => {
  const spinValue = new Animated.Value(0);

  // Function to start the spin animation
  const startSpinning =  () => {
    
    
    spinValue.setValue(0);
    Animated.loop(
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
    ).start();
  };

  useEffect(() => {
    startSpinning();
        const checkTokenAndNavigate = async () => // useeffect ei voi olla async, joten tehdään async funktio sen sisällä jota kutsutaan
    {
        await RefreshTokenCheck();  // tarkistaa loppuun ennenkuin antaa timerin alkaa
        // After 3 seconds, redirect to the Welcome screen
        const timer = setTimeout(() => 
      {
        navigation.navigate("Welcome");
      }, 3000);
    }

    checkTokenAndNavigate();  // kutsu

    // Clear the timer when the component is unmounted
    return () => {
      clearTimeout(timer);
      // Stop the animation when the component is unmounted
      Animated.loop().stop(); // This will stop the looped animation
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
    width: 300,
    height: 300,
    resizeMode: "contain",
  },
});

export default Splash;
