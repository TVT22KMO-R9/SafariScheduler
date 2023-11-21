import React from "react";
import { Modal, View, Text, TouchableWithoutFeedback } from "react-native";

const Description = ({ isVisible, data, onClose }) => {
  if (!isVisible) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ backgroundColor: "white", borderWidth: 2, padding: 20, width: '80%', height: '10%', borderRadius: 5, }}>
            <Text>{data}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default Description;