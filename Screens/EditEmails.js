import React, { useState } from 'react';
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect, useRoute } from '@react-navigation/native';
import Menu from '../Components/Menu';
import Logout from '../Components/Logout';
import Home from '../Components/Home';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    View, Text, StyleSheet,
    TouchableOpacity, Modal, TouchableWithoutFeedback,
    Image, TextInput, Alert, ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { REGISTER_ENDPOINT, SERVER_BASE_URL } from '@env' //Laita toimimaan

const EditEmails = () => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isNewEmailVisible, setIsNewEmailVisible] = useState(false);
    const [isDeleteEmailVisible, setIsDeleteEmailVisible] = useState(false);
    const [role, setRole] = useState('');
    const [newEmail, setNewEmail] = useState('');
    const [deleteEmail, setDeleteEmail] = useState('');
    const route = useRoute();
    const userRole = route.params?.userRole;
    const [userData, setUserData] = useState([]);

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };

    //Muuttaa add email-napin TextInsertiksi
    const handleNewEmailButton = () => {
        setIsNewEmailVisible(true);
    };

    //Muuttaa delete email-napin TextInsertiksi
    const handleDeleteEmailButton = () => {
        setIsDeleteEmailVisible(true)
    }

    const handleDeleteEmail = async () => {
        // TODO : api-kutsu delete approved email. Poistaa sähköpostin ja käyttäjän. Esimerkki -> navigation.navigate("DeleteShifts");
        try {
            const authToken = await AsyncStorage.getItem("userToken"); //laita funktioon
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }
            try {
                const response = await fetch(`https://workhoursapp-9a5bdf993d73.herokuapp.com/api/company/workers/email/${deleteEmail}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                });
                if (response.ok) {
                    const data = await response.text();
                    setUserData(data); // Set fetched data to state
                    console.log('User deleted:', data)
                    Alert.alert("User deleted:", data)

                } else {
                    Alert.alert("Failed to delete email")
                    throw new Error('Failed to delete email');
                }
            } catch (error) {
                console.error('Error deleting email:', error);
            }
        } catch (error) {
            console.error('Async function error:', error);
        }
        setIsDeleteEmailVisible(false)
        setDeleteEmail('')
    };

    const handleSeeUsersInfo = async () => {
        //käyttäjä voi katsoa mitkä sähköpostit on hyväksytty, ja onko käyttäjä luotu---------------------------------------------------------------
        try {
            const authToken = await AsyncStorage.getItem("userToken"); //laita funktioon
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }
            try {
                const response = await fetch(`https://workhoursapp-9a5bdf993d73.herokuapp.com/api/company/workers/email`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); // Set fetched data to state
                    console.log('Users data retrieved:', data)
                } else {
                    throw new Error('Failed to get users data email');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } catch (error) {
            console.error('Async function error:', error);
        }
    }
    /* Add new approved email toiminnot*/
    const AddNewEmail = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }

            const emailData = {
                email: newEmail,
                role: role
            };

            try {
                const response = await fetch(`https://workhoursapp-9a5bdf993d73.herokuapp.com/api/company/workers/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify(emailData),
                });

                if (response.ok) {
                    const data = await response.text();
                    console.log('Email added success', data)
                    Alert.alert("Email added with data:", JSON.stringify(emailData))
                } else {
                    throw new Error('Failed to add email');
                }
            } catch (error) {
                console.error('Error entering email:', error);
                Alert.alert('Error', 'Failed to add email');
            }
            setIsNewEmailVisible(false);
            setNewEmail('')
            setRole('')
        } catch (error) {
            console.error('Async function error:', error);
        }
    };

    //triggers when the screen comes into focus, can be used to format states
    useFocusEffect(
        React.useCallback(() => {
            setMenuVisible(false)
            setIsNewEmailVisible(false)
            setIsDeleteEmailVisible(false)
            setUserData([])
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
            <View style={{ paddingTop: 100 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.addButton}
                    >
                        <Text style={styles.buttonText}>ADD NEW EMAIL</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                   <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Add new approved email"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Enter user role"
                            value={role}
                            onChangeText={setRole}
                        />
                        <TouchableOpacity style={{ ...styles.addButton, backgroundColor: 'green' }} onPress={AddNewEmail}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </>
                )}
                {/* Remove email-toiminta */}
                {!isDeleteEmailVisible && (
                    <TouchableOpacity style={styles.addButton} onPress={handleDeleteEmailButton}>
                        <Text style={styles.buttonText}>REMOVE EMAIL</Text>
                    </TouchableOpacity>
                )}
                {isDeleteEmailVisible && (
                    <KeyboardAvoidingView
                        enabled={false}
                    >
                        <TextInput
                            style={styles.emailInput}
                            placeholder='Enter e-mail to be deleted'
                            value={deleteEmail}
                            onChangeText={setDeleteEmail}
                        />
                        <TouchableOpacity style={{ ...styles.addButton, backgroundColor: 'green' }} onPress={handleDeleteEmail}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                )}

                {/* Käyttäjien sähköpostit:*/}
                <TouchableOpacity style={styles.addButton} onPress={handleSeeUsersInfo}>
                    <Text style={styles.buttonText}>VIEW USERS INFO</Text>
                </TouchableOpacity>

                <ScrollView style={styles.scrollView}>
                    {userData.map((user, index) => (
                        <View style={styles.userDataContainer} key={index}>
                            {/* <Text style={styles.userDataText}>ID: {user.id}</Text> */}
                            <Text style={styles.userDataText}>Email: {user.email}</Text>
                            <Text style={styles.userDataText}>Role: {user.role}</Text>
                            <Text style={styles.userDataText}>Registered: {user.registered ? 'Yes' : 'No'}</Text>
                        </View>
                    ))}
                </ScrollView>
            </View>
            {/* Menuvalikko */}
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
            <TouchableOpacity onPress={toggleMenu} style={styles.button}>
                <Ionicons name="menu" size={45} color="white" />
            </TouchableOpacity>
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
        marginVertical: 6,
        alignItems: "center",
        width: screenWidth * 0.9,
        borderColor: "white",
        borderWidth: 2,
    },
    buttonText: {
        fontSize: screenWidth * 0.07,
        color: "white",
        fontFamily: "Saira-Regular",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
    emailInput: {
        height: screenHeight * 0.07,
        width: "90%",
        borderRadius: 5,
        borderColor: "black",
        backgroundColor: "rgba(255, 255, 255, 0.9)",
        borderWidth: 2,
        marginBottom: "1%",
        paddingHorizontal: 10,
        fontSize: screenWidth * 0.06,
        alignContent: "center",
    },
    scrollView: { //User Data
        maxHeight: 300, // Set a maximum height for the scrollable box
        marginVertical: 10,
        paddingHorizontal: 20,

    },
    userDataContainer: {
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
        paddingBottom: 10,
        marginBottom: 10,
    },
    userDataText: {
        color: 'white'
    },
    emailInputContainer: { //prevents movement of the screen on textInput
        paddingTop: 100
    },
});

export default EditEmails;
