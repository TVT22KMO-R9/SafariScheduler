import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { IMGUPLOAD, SERVER_BASE_URL } from '@env';
import { getToken } from "../utility/Token";    


const UploadImgScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation();

    function fetchWithTimeout(url, options, timeout = 7000) {
        return Promise.race([
          fetch(url, options),
          new Promise((_, reject) =>
            setTimeout(() => reject(new Error('timeout')), timeout)
          ),
        ]);
      }

    const pickAndUploadImage = async () => {
        try {
            const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (permissionResult.granted === false) {
                Alert.alert("Permission to access camera roll is required!");
                return;
            }

            const pickerResult = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (pickerResult.cancelled === true) {
                return;
            }

            setSelectedImage({ localUri: pickerResult.uri });
            await uploadImage(pickerResult.uri);
        } catch (error) {
            console.error(error);
            Alert.alert("An error occurred while picking the image.");
        }
    };

    const uploadImage = async (uri) => {
        const token = await getToken();
        let formData = new FormData();
        formData.append('image', {
          uri: uri,
          type: 'image/jpeg',
          name: 'image.jpg'
        });
      
        try {
          const response = await fetchWithTimeout(SERVER_BASE_URL+IMGUPLOAD,  {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + token
            },
            body: formData
          }, 7000);
      
          if (!response.ok) {
            throw new Error('Upload failed');
          }
      
          const json = await response.json();
          Alert.alert("Image uploaded successfully!");
          navigation.navigate('ShiftScreen');
        } catch (error) {
          console.error(error);
          Alert.alert("Upload failed", error.toString());
        }
      };
      




    return (
        <View style={styles.container}>
            {selectedImage?.localUri && <Image source={{ uri: selectedImage.localUri }} style={styles.image} />}
            <TouchableOpacity style={styles.buttonContainer} onPress={pickAndUploadImage}>
                <Text style={styles.buttonText}>Select and Upload Image</Text>
            </TouchableOpacity>
        </View>
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
        resizeMode: "contain",
    },
    buttonContainer: {
        width: window.width * 0.6,
        paddingVertical: 10,
        paddingHorizontal: 15,
        backgroundColor: 'rgba(0, 205, 0, 0.7)',
        borderRadius: 5,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
        borderColor: "black",
        borderWidth: 2,
    },
    buttonText: {
        color: "white",
        fontSize: window.width * 0.05,
        fontFamily: "Saira-Regular",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
});

export default UploadImgScreen;
