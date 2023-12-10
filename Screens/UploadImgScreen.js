import React, { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions, Alert } from "react-native";
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';
import { IMGUPLOAD, SERVER_BASE_URL } from '@env';
import { getToken } from "../utility/Token";    

const UploadImgScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const navigation = useNavigation();

    const pickAndUploadImage = async () => {
        try {
            const image = await ImagePicker.openPicker({
                width: 600,
                height: 800,
                cropping: true,
            });

            setSelectedImage(image);
            const token = await getToken();
            const formData = new FormData();
            formData.append('image', {
                uri: image.path,
                name: 'image.jpg',
                type: 'image/jpeg',
            });

            const response = await fetch(SERVER_BASE_URL + IMGUPLOAD, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed: ${response.statusText}`);
            }

            Alert.alert('Success', 'Image uploaded successfully');
            navigation.navigate('Settings');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Image upload failed');
        }
    };

    return (
        <View style={styles.container}>
            {selectedImage && <Image source={{ uri: selectedImage.path }} style={styles.image} />}
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
