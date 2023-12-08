import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet, TouchableOpacity, Modal, TouchableWithoutFeedback, Image, TextInput, Alert } from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import Menu from '../Components/Menu';
import Logout from '../Components/Logout';
import Home from '../Components/Home';

const EditEmails = () => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isNewEmailVisible, setIsNewEmailVisible] = useState(false);
    const route = useRoute();
    const userRole = route.params?.userRole;

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    //Napin ja tekstiboksin näyttäminen
    const handleAddNewEmail = () => {
        setIsNewEmailVisible(true);
    };

    const handleDeleteEmail = () => {
        // TODO : api-kutsu delete approved email. Esimerkki -> navigation.navigate("DeleteShifts");
        Alert.alert("Testing email removal") //testaukseen
    };

    const AddNewEmail = (text) => {
        // TODO : Api-kutsu, add email to approved list

        Alert.alert("Testing add email", text) 
        setIsNewEmailVisible(false); // muutetaan tekstikenttä takaisin napiksi
    };

    //triggers when the screen comes into focus, ensures menu is visible
    useFocusEffect(
        React.useCallback(() => {
            setMenuVisible(false);
            setIsNewEmailVisible(false);
        }, [])
    );

    return (
        <View style={styles.container}>

            <Image
                source={require("../assets/background.png")}
                style={styles.backgroundImage}
            />
            <TouchableOpacity onPress={toggleMenu} style={styles.button}>
                <Ionicons name="menu" size={45} color="white" />
            </TouchableOpacity>
            <Home/>


            {!isNewEmailVisible && (
                <TouchableOpacity
                    onPress={handleAddNewEmail}
                    style={styles.addButton}
                >
                    <Text style={styles.buttonText}>ADD NEW EMAIL</Text>
                </TouchableOpacity>
            )}
            {isNewEmailVisible && (
                <TextInput
                    style={styles.descriptionInput}
                    placeholder="Add new approved email"
                    returnKeyType="done"
                    onSubmitEditing={(event) => AddNewEmail(event.nativeEvent.text)}

                />
            )}

            <TouchableOpacity style={styles.addButton} onPress={handleDeleteEmail}>
                <Text style={styles.buttonText}>REMOVE EMAIL</Text>
            </TouchableOpacity>

            <Modal
                animationType="slide"
                transparent={true}
                visible={isMenuVisible}
                onRequestClose={() => {
                    setMenuVisible(false);
                }}
            >
                <TouchableWithoutFeedback onPress={toggleMenu}>
                    <View style={styles.overlay} />
                </TouchableWithoutFeedback>
                <View style={styles.menuContainer}>
                    <Menu userRole={userRole} />
                </View>
            </Modal>
            <Logout />
        </View>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    button: {
        position: 'absolute',
        top: 20,
        left: 20,
        padding: 10,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    menuContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: '75%',
        height: '100%',
        backgroundColor: 'white',
    },
    addButton: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 5,
        padding: 5,
        marginVertical: 10,
        alignItems: "center",
        width: screenWidth * 0.9,
        borderColor: "white",
        borderWidth: 2,
    },
    buttonText: {
        fontSize: screenWidth * 0.1,
        color: "white",
        fontFamily: "Saira-Regular",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    descriptionInput: {
        height: screenHeight * 0.08,
        width: "90%",
        borderRadius: 5,
        borderColor: "black",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderWidth: 2,
        marginBottom: "10%",
        paddingHorizontal: 10,
        fontSize: screenWidth * 0.06,
        alignContent: "center",
    },
});

export default EditEmails;
