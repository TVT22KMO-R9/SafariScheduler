import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useNavigation } from "@react-navigation/native";
import { IMGUPLOAD, SERVER_BASE_URL, COMPANY_SETTINGS } from "@env";
import { getToken } from "../utility/Token";
import {
  removeBackground,
  removeBackgroundURL,
  setBackgroundURL,
  saveBackground,
} from "../utility/BackGroundCheck";
import { DeviceEventEmitter } from "react-native";
import BackgroundImage from "../utility/BackGroundImage";

const UploadImgScreen = () => {
  // State to hold the selected image
  const [selectedImage, setSelectedImage] = useState(null);

  // Hook for navigation
  const navigation = useNavigation();

  // Function to handle the upload process
  const handleUpload = async () => {
    // Check if an image is selected
    if (!selectedImage || !selectedImage.localUri) {
      Alert.alert("No image selected!"); // Show an alert if no image is selected
      return; // Exit the function if no image
    }

    // Extracting URI from the selected image
    const uri = selectedImage.localUri;
    // Retrieve token (assuming getToken is a function that retrieves a stored token)
    const token = await getToken();
    // Creating a new FormData object
    const formData = new FormData();

    // Getting the file extension from the URI
    const uriParts = uri.split(".");
    const fileType = uriParts[uriParts.length - 1];
    // Extracting file name from URI
    const fileName = uri.split("/").pop();

    // Appending the image to formData
    formData.append("image", {
      uri,
      name: fileName,
      type: `image/${fileType}`, // Constructing the MIME type
    });

    // Creating an XMLHttpRequest to handle the upload
    const xhr = new XMLHttpRequest();
    // Configuring the request
    xhr.open("POST", SERVER_BASE_URL + IMGUPLOAD, true);
    xhr.setRequestHeader("Authorization", "Bearer " + token);
    xhr.setRequestHeader("Content-Type", "multipart/form-data");

    // Define what happens on successful data submission
    xhr.onload = () => {
      if (xhr.status === 200) {
        try {
          Alert.alert("Success!"); // Alert on successful upload
        } finally {
          // Emit an event after successful upload
          DeviceEventEmitter.emit("newImageUploaded");
        }
      } else {
        Alert.alert("Something went wrong!"); // Alert if something goes wrong
      }
    };

    // Define what happens in case of an error
    xhr.onerror = (e) => {
      console.error("XHR Error", e); // Log error to console
      console.log(xhr.responseText); // Log server response
      Alert.alert("Upload failed"); // Alert the user
    };

    // Sending the formData with the request
    xhr.send(formData);
  };

  const handleDelete = async () => {
    // Retrieve the authentication token
    const token = await getToken();

    // Creating an XMLHttpRequest for the delete request
    const xhr = new XMLHttpRequest();
    // Configuring the DELETE request to the server
    xhr.open("DELETE", SERVER_BASE_URL + IMGUPLOAD, true);
    // Setting the Authorization header with the Bearer token
    xhr.setRequestHeader("Authorization", "Bearer " + token);

    // Define what happens on successful response
    xhr.onload = () => {
      if (xhr.status === 200) {
        // Alert the user on successful deletion
        Alert.alert("Image deleted successfully!");
        // Emit an event to indicate that the background image has changed
        DeviceEventEmitter.emit("backgroundImageChanged");
        // Additional navigation logic can be added here if required
      } else {
        // Alert the user if something goes wrong with the request
        Alert.alert("Something went wrong!");
      }
    };

    // Define what happens in case of an error with the request
    xhr.onerror = (e) => {
      console.error("XHR Error", e); // Log error details to console
      console.log(xhr.responseText); // Log the server response
      Alert.alert("Delete failed"); // Alert the user that delete operation failed
    };

    // Sending the DELETE request
    xhr.send();

    // Additional logic to remove background image from local state or storage
    await removeBackground();
    await removeBackgroundURL();
  };

  // Function to handle image selection
  const pickImage = async () => {
    // Requesting permission to access the media library
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    // Checking if permission was granted
    if (!permission.granted) {
      alert("Permission to access camera roll is required!");
      return;
    }

    // Launching the image picker
    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, // Only images can be picked
      allowsEditing: true, // Allow editing of the image before selection
    });

    // Checking if the picker operation was cancelled
    if (pickerResult.canceled) {
      alert("Image picker cancelled");
      return;
    }

    // Checking if any image was selected
    if (!pickerResult.assets || pickerResult.assets.length === 0) {
      alert("Could not get picked image");
      return;
    }

    // Updating the state with the selected image
    setSelectedImage({ localUri: pickerResult.assets[0].uri });
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <BackgroundImage style={styles.backgroundImage} />
      {selectedImage && (
        <>
          <Image
            source={{ uri: selectedImage.localUri }}
            style={styles.image}
          />
          <TouchableOpacity
            style={styles.buttonContainer}
            onPress={handleUpload}
          >
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </>
      )}
      <TouchableOpacity style={styles.buttonContainer} onPress={pickImage}>
        <Text style={styles.buttonText}>Select Image</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonContainer} onPress={handleDelete}>
        <Text style={styles.buttonText}>Reset to default</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const window = Dimensions.get("window");
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: window.width * 0.6,
    height: window.width * 0.6,
    marginBottom: 20,
    borderRadius: 5,
    resizeMode: "cover",
    borderColor: "white",
    borderWidth: 2,
  },
  buttonContainer: {
    width: window.width * 0.9,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: window.width * 0.07,
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
});

export default UploadImgScreen;
