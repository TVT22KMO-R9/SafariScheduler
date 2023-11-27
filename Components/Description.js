import React, { useRef, useEffect } from "react";
import { Modal, View, Text, TouchableWithoutFeedback, Animated } from "react-native";

const Description = ({ isVisible, data, onClose }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(
      fadeAnim,
      {
        toValue: isVisible ? 1 : 0,
        duration: 80,
        useNativeDriver: true,
      }
    ).start();
  }, [isVisible, fadeAnim]);

  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      animationType="none"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            opacity: fadeAnim,
          }}
        >
          <View style={{ backgroundColor: "white", borderWidth: 2, padding: 30, width: '80%', borderRadius: 5, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 20, fontFamily: "Saira-Regular", }}>{data}</Text>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Description;
