import React, { useEffect, useRef } from 'react';
import { Animated, Image, StyleSheet, View } from 'react-native';


// Yksinkertaistettu versio Splash.js -screenistä. Tarkoitettu täytekomponentiksi api-kutsujen latausnäytölle.
const ApiLoadingAnimation = ({ source, logoStyle }) => {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
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
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const scale = spinValue.interpolate({
    inputRange: [0, 0.8, 1],
    outputRange: [1, 0.8, 1],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={source}
        style={[
          logoStyle,
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
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ApiLoadingAnimation;
