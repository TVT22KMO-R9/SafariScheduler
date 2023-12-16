import React, { useState, useEffect } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Modal, TouchableWithoutFeedback, Image,
    TextInput, Alert, ScrollView,
    KeyboardAvoidingView, FlatList,
} from 'react-native';
import { useFocusEffect,} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Menu from '../Components/Menu';
import Logout from '../Components/Logout';
import Home from '../Components/Home';
import { WORKERS, SERVER_BASE_URL, EDIT_OWN } from '@env'
import BackgroundImage from '../utility/BackGroundImage';



const EditOwnDetails = ({route}) => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isNewEmailVisible, setIsNewEmailVisible] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [isNewFirstNameVisible, setIsNewFirstNameVisible] = useState(false);
    const [newFirstName, setNewFirstName] = useState('');

    const { userData, setUserData } = route.params;


    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };
    
    //Muuttaa add email-napin TextInsertiksi
    const handleNewEmailButton = () => {
        setIsNewEmailVisible(true);
    };

    const validateEmailFormat = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email); //palauttaa false jos ei täsmää
    }
 

    //Edit email
    const EditInfo = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }
            const emailData = {
                email: newEmail.toLowerCase(),
            };
            if (!validateEmailFormat(emailData.email)) {
                Alert.alert("Error", "Invalid email format");
                return;
            }
            
            try {
                const response = await fetch(`${SERVER_BASE_URL}${EDIT_OWN}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify(emailData),
                });
                console.log(emailData)
                if (response.ok) {
                    Alert.alert("Email edited succesfully")
                } else {
                    const errorText = await response.text();
                    Alert.alert("Error", errorText || "Failed to edit email");
                }
            } catch (error) {
                Alert.alert("Error adding email", error.message || "Unknown error");
            }
            setIsNewEmailVisible(false);
            setNewEmail('') //nollaa tekstikentät napin painalluksen jälkeen
        } catch (error) {
            console.error('Async function error:', error.message || "Unknown error");
        }
    };

    //Aktivoituu kun screen tulee näkyviin. Muuten tekstikentät jää auki, ja data näkyviin yms.
    useFocusEffect(
        React.useCallback(() => {
            setMenuVisible(false)
            setIsNewEmailVisible(false)
            setNewEmail('')
        }, [])
    );

    return (
        <View style={styles.container}>
              <BackgroundImage style={styles.backgroundImage}/>
              <Text style={styles.confirmText}>YOUR INFO</Text>
              <ScrollView style={styles.scrollView}>
              {userData && (
                    <View style={styles.userDataContainer}>
                        <Text style={styles.userDataText}>Role: {userData.role}</Text>
                        <Text style={styles.userDataText}>Email: {userData.email}</Text>
                        <Text style={styles.userDataText}>First name: {userData.firstName}</Text>
                        <Text style={styles.userDataText}>Last name: {userData.lastName}</Text> 
                        <Text style={styles.userDataText}>Phone number: {userData.phoneNumber}</Text>
                    </View>
            )}
        </ScrollView>
            <View>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>Click to edit email</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder={userData.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                    </>
                )}  
            </View>
            <View style={{ paddingTop: 10 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>Click to edit first name</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder={userData.firstName}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                    </>
                )}  
            </View> 
            <View style={{ paddingTop: 10 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>Click to edit last name</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder={userData.lastName}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                    </>
                )}  
            </View> 
            <View style={{ paddingTop: 10 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>Click to edit phone number</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder={userData.phoneNumber}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                    </>
                )}  
            </View>
            <TouchableOpacity style={{ ...styles.actionButton, backgroundColor: 'green',  }} onPress={EditInfo}>
                <Text style={styles.confirmText}>CONFIRM</Text>
            </TouchableOpacity>
             
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
    actionButton: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 5,
        marginVertical: 6,
        alignItems: "center",
        width: screenWidth * 0.8,
        borderColor: "white",
        borderWidth: 2,
    },
    buttonText: {
        fontSize: screenWidth * 0.04,
        color: "white",
        fontFamily: "Saira-Regular",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        paddingTop:12,
        paddingBottom:12,
    },
    emailInput: {
        height: screenHeight * 0.07,
        width: screenWidth * 0.9,
        borderRadius: 5,
        borderColor: "black",
        textAlign: 'center',
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderWidth: 2,
        marginBottom: "1%",
        paddingHorizontal: 10,
        fontSize: screenWidth * 0.06,
        fontFamily: "Saira-Regular",
    },
    scrollView: { //User Data
        maxHeight: 220, // Set a maximum height for the scrollable box
        marginVertical: 10,
        paddingHorizontal: 20,
    },
    userDataContainer: {
        paddingTop: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingBottom: 10,
        marginBottom: 10,
    },
    userDataText: {
        color: 'white',
        fontFamily: "Saira-Regular",
        fontSize: screenWidth * 0.06,
    },
    confirmText: {
        fontSize: screenWidth * 0.07,
        color: "white",
        fontFamily: "Saira-Regular",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        paddingTop:12,
        paddingBottom:12,
    },
});

export default EditOwnDetails;
