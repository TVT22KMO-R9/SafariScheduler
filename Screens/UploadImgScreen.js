import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Alert, KeyboardAvoidingView } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { IMGUPLOAD, SERVER_BASE_URL, COMPANY_SETTINGS } from '@env';
import { getToken } from "../utility/Token";  
import  { removeBackground, removeBackgroundURL, setBackgroundURL, saveBackground } from "../utility/BackGroundCheck";
import {  DeviceEventEmitter } from 'react-native';
import BackgroundImage from "../utility/BackGroundImage";


const UploadImgScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation();

    const handleUpload = async () => {
      if (!selectedImage || !selectedImage.localUri) {
          Alert.alert('No image selected!');
          return;
      }
  
      const uri = selectedImage.localUri;
      const token = await getToken(); 
      const formData = new FormData();
  
      const uriParts = uri.split('.');
      const fileType = uriParts[uriParts.length - 1];
      const fileName = uri.split('/').pop();
  
      formData.append('image', {
          uri,
          name: fileName,
          type: `image/${fileType}`,
      });
  
      const xhr = new XMLHttpRequest();
      xhr.open('POST', SERVER_BASE_URL + IMGUPLOAD, true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + token);
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.onload = () => {
          if (xhr.status === 200) {
                try { Alert.alert('Success! Log out and back in to see the changes!');}
                finally {
                  DeviceEventEmitter.emit('newImageUploaded');
                }
         } else {
              Alert.alert('Something went wrong!');
          }
      };
      xhr.onerror = (e) => {
          console.error('XHR Error', e);
          console.log(xhr.responseText);
          Alert.alert('Upload failed');
      };
  
      xhr.send(formData);
  }

  const handleDelete = async () => {
    const token = await getToken();
    const xhr = new XMLHttpRequest();
    xhr.open('DELETE', SERVER_BASE_URL + IMGUPLOAD, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.onload = () => {
        if (xhr.status === 200) {
            
            Alert.alert('Image deleted successfully!');
            DeviceEventEmitter.emit('backgroundImageChanged');
            // + navigation
        } else {
            Alert.alert('Something went wrong!');
        }
    };
    xhr.onerror = (e) => {
        console.error('XHR Error', e);
        console.log(xhr.responseText);
        Alert.alert('Delete failed');
    };

    xhr.send();

    await removeBackground();
    await removeBackgroundURL();
    }

   

  


  const pickImage = async () => {
    let permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
        alert('Permission to access camera roll is required!');
        return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
      });
    if (pickerResult.canceled) {
        alert('Image picker cancelled');
        return;
    }

    if (!pickerResult.assets || pickerResult.assets.length === 0) {
        alert('Could not get picked image');
        return;
    }

    setSelectedImage({ localUri: pickerResult.assets[0].uri });
    };






    return (
        <KeyboardAvoidingView style={styles.container}>
          <BackgroundImage style={styles.backgroundImage} />
          {selectedImage && (
            <>
              <Image source={{ uri: selectedImage.localUri }} style={styles.image} />
              <TouchableOpacity style={styles.buttonContainer} onPress={handleUpload}>
                <Text style={styles.buttonText}>Upload Image</Text>
              </TouchableOpacity>
            </>
          )}<TouchableOpacity style={styles.buttonContainer} onPress={pickImage}>
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
    },backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
      }
});

export default UploadImgScreen;
