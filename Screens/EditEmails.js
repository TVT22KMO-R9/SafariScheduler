import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Modal, TouchableWithoutFeedback, Image,
    TextInput, Alert, ScrollView,
    KeyboardAvoidingView,
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import Menu from '../Components/Menu';
import Logout from '../Components/Logout';
import Home from '../Components/Home';
import { WORKERS, SERVER_BASE_URL } from '@env'

const EditEmails = () => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isNewEmailVisible, setIsNewEmailVisible] = useState(false);
    const [isDeleteEmailVisible, setIsDeleteEmailVisible] = useState(false);
    const [roleWithEmail, setRoleWithEmail] = useState('');
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

    const validateEmailFormat = (email) => {
        const emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email); //palauttaa false jos ei täsmää
    }
    const isValidRole = (role) => {
        return role === "WORKER" || role === "MASTER" || role === "SUPERVISOR";
    };

    //Esimies voi lisätä sähköpostin (ja roolin) hyväksytylle listalle, jotta käyttäjän voi luoda
    const AddNewEmail = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }
            const emailData = {
                email: newEmail.toLowerCase(),
                role: roleWithEmail.toUpperCase()
            };
            if (!validateEmailFormat(emailData.email)) {
                Alert.alert("Error", "Invalid email format");
                return;
            }
            if (!isValidRole(emailData.role)) {
                Alert.alert("Role has to be worker, supervisor, or admin");
                return;
            }
            try {
                const response = await fetch(`${SERVER_BASE_URL}${WORKERS}/add`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify(emailData),
                });

                if (response.ok) {
                    Alert.alert("Email added succesfully")
                } else {
                    const errorText = await response.text();
                    Alert.alert("Error", errorText || "Failed to add email");
                }
            } catch (error) {
                Alert.alert("Error adding email", error.message || "Unknown error");
            }
            setIsNewEmailVisible(false);
            setNewEmail('') //nollaa tekstikentät napin painalluksen jälkeen
            setRoleWithEmail('')
        } catch (error) {
            console.error('Async function error:', error.message || "Unknown error");
        }
    };

    //Esimies voi poistaa hyväksytyn sähköpostin ja käyttäjän (jos luotu)
    const handleDeleteEmail = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }
            if (!validateEmailFormat(deleteEmail)) {
                Alert.alert("Error", "Invalid email format");
                return;
            }
            try {
                const response = await fetch(`${SERVER_BASE_URL}${WORKERS}/email/${deleteEmail}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                });
                if (response.ok) {
                    const data = await response.text();
                    Alert.alert("User deleted:", data)

                } else {
                    const errorText = await response.text();
                    Alert.alert("Failed to delete email", errorText || "Unknown error");
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

    //Esimies voi katsoa mitkä sähköpostit on hyväksytty, ja onko käyttäjä luotu. Näkyy rullattavana listana.
    const handleSeeUsersInfo = async () => {
        try {
            const authToken = await AsyncStorage.getItem("userToken");
            if (!authToken) {
                Alert.alert("Error", "Authentication token not found");
                return;
            }
            try {
                const response = await fetch(`${SERVER_BASE_URL}${WORKERS}/email`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    setUserData(data); // Set fetched data to state
                } else {
                    throw new Error('Failed to get users data');
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        } catch (error) {
            console.error('Async function error:', error);
        }
    }

    //Aktivoituu kun screen tulee näkyviin. Muuten tekstikentät jää auki, ja data näkyviin yms.
    useFocusEffect(
        React.useCallback(() => {
            setMenuVisible(false)
            setIsNewEmailVisible(false)
            setIsDeleteEmailVisible(false)
            setNewEmail('')
            setDeleteEmail('')
            setUserData([])
            setRoleWithEmail('')
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
            <Home />
            <View style={{ paddingTop: 100 }}>
                {/* Add new email-toiminta */}
                {!isNewEmailVisible && (
                    <TouchableOpacity
                        onPress={handleNewEmailButton}
                        style={styles.actionButton}
                    >
                        <Text style={styles.buttonText}>ADD NEW EMAIL</Text>
                    </TouchableOpacity>
                )}
                {isNewEmailVisible && (
                    <>
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Add new approved email"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                        <TextInput
                            style={styles.emailInput}
                            placeholder="Enter user role"
                            value={roleWithEmail}
                            onChangeText={setRoleWithEmail}
                        />
                        <TouchableOpacity style={{ ...styles.actionButton, backgroundColor: 'green' }} onPress={AddNewEmail}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </>
                )}
                {/* Remove email-toiminta */}
                {!isDeleteEmailVisible && (
                    <TouchableOpacity style={styles.actionButton} onPress={handleDeleteEmailButton}>
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
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={deleteEmail.toLowerCase()}
                            onChangeText={setDeleteEmail}
                        />
                        <TouchableOpacity style={{ ...styles.actionButton, backgroundColor: 'green' }} onPress={handleDeleteEmail}>
                            <Text style={styles.buttonText}>CONFIRM</Text>
                        </TouchableOpacity>
                    </KeyboardAvoidingView>
                )}

                {/* Approved emailit näkyviin listana:*/}
                <TouchableOpacity style={styles.actionButton} onPress={handleSeeUsersInfo}>
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
    actionButton: {
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
        color: 'white',
        fontFamily: "Saira-Regular"

    },
});

export default EditEmails;
