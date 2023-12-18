import React, { useState,} from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, Alert, DeviceEventEmitter,
} from 'react-native';
import { useFocusEffect,} from '@react-navigation/native';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { WORKERS, SERVER_BASE_URL, EDIT_OWN } from '@env'
import BackgroundImage from '../utility/BackGroundImage';
import { useNavigation } from '@react-navigation/native';


const EditOwnDetails = ({route}) => {
    const [isMenuVisible, setMenuVisible] = useState(false);
    const [isEditOpen, setisEditOpen] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newFirstName, setNewFirstName] = useState('');
    const [newLastName, setNewLastName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const { userData, handleLogout } = route.params;
    const navigation = useNavigation();
    const { workerData } = route.params;

    // Use the selected worker's data if available, otherwise use userData
    const userDataToUse = workerData || route.params.userData;


    const handleResetOwnPassword = () => {
        navigation.navigate('UpdatePassword');
       };

    const toggleMenu = () => {
        setMenuVisible(!isMenuVisible);
    };
    
    //Muuttaa add email-napin TextInsertiksi
    const handleNewInfoButton = () => {
        setisEditOpen(true);
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
            const updatedData = {};

            if (newEmail && newEmail !== userData.email) {
                if (!validateEmailFormat(newEmail)) {
                    Alert.alert("Error", "Invalid email format");
                    return;
                }
                updatedData.email = newEmail.toLowerCase();
            }
    
            if (newFirstName && newFirstName !== userData.firstName) {
                updatedData.firstName = newFirstName;
            }
    
            if (newLastName && newLastName !== userData.lastName) {
                updatedData.lastName = newLastName;
            }
    
            if (newNumber && newNumber !== userData.phoneNumber) {
                updatedData.phoneNumber = newNumber;
            }
            if (Object.keys(updatedData).length === 0) {
                Alert.alert("Info not modified", "No changes detected");
                setisEditOpen(false);
                return;
            }

            try {
                const response = await fetch(`${SERVER_BASE_URL}${EDIT_OWN}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`,
                    },
                    body: JSON.stringify(updatedData),
                });

                if (response.ok && !workerData) {
                    Alert.alert(
                        "Info edited successfully",
                        "You have to logout because of reasons",
                        [
                            {
                                text: "I submit to my faith",
                                onPress:  () => {
                                  DeviceEventEmitter.emit('logout'); // Call handleLogout when OK is pressed
                                },
                            },
                        ],
                        { cancelable: false }
                    );
                } else if (workerData) {
                    Alert.alert(
                        "Info edited successfully",
                    );
                }
                else {
                    const errorText = await response.text();
                    Alert.alert("Error", errorText || "Failed to edit info");
                }
            } catch (error) {
                Alert.alert("Error editing info", error.message || "Unknown error");
            }

            setisEditOpen(false);
            setNewEmail('');
            setNewFirstName('');
            setNewLastName('');
            setNewNumber('');
        } catch (error) {
            console.error('Async function error:', error.message || "Unknown error");
        }
    };

    //Aktivoituu kun screen tulee näkyviin. Muuten tekstikentät jää auki, ja data näkyviin yms.
    useFocusEffect(
        React.useCallback(() => {
            setMenuVisible(false)
            setisEditOpen(false)
            setNewEmail('')
        }, [])
    );

    return (
        <View style={styles.container}>
              <BackgroundImage style={styles.backgroundImage}/>
              <Text style={styles.infoText}>
                {userDataToUse ? (workerData ? 'EMPLOYEE INFO' : 'YOUR INFO') : ''}
                </Text>
              <View style={styles.scrollView}>
              {userDataToUse && (
                    <View style={styles.userDataContainer}>
                        <Text style={styles.userDataText}>Role: {userDataToUse.role}</Text>
                        <Text style={styles.userDataText}>Email: {userDataToUse.email}</Text>
                        <Text style={styles.userDataText}>First name: {userDataToUse.firstName}</Text>
                        <Text style={styles.userDataText}>Last name: {userDataToUse.lastName}</Text> 
                        <Text style={styles.userDataText}>Phone number: {userDataToUse.phoneNumber}</Text>
                    </View>
            )}
                </View>
                        {!isEditOpen && (
                        <TouchableOpacity onPress={handleNewInfoButton} style={styles.actionButton}>
                        <Text style={styles.buttonText}>Edit Info</Text>
                        </TouchableOpacity>
                    )}
                    {isEditOpen && (
                        <>
                    <View>
                        <TextInput
                            style={styles.emailInput}
                            placeholder={userDataToUse.email}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            value={newEmail}
                            onChangeText={setNewEmail}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.emailInput}
                            placeholder={userDataToUse.firstName}
                            value={newFirstName}
                            onChangeText={setNewFirstName}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.emailInput}
                            placeholder={userDataToUse.lastName}
                            value={newLastName}
                            onChangeText={setNewLastName}
                        />
                    </View>
                    <View>
                        <TextInput
                            style={styles.emailInput}
                            placeholder={userDataToUse.phoneNumber}
                            keyboardType="phone-pad"
                            value={newNumber}
                            onChangeText={setNewNumber}
                        />
                    </View>
                    </>
            )}
            {isEditOpen && (
                <TouchableOpacity
                style={{ ...styles.actionButton }}
                onPress={EditInfo}
                >
                <Text style={styles.confirmText}>CONFIRM</Text>
                </TouchableOpacity>
            )}
            {userDataToUse && !workerData && ( // Condition to hide the button if userDataToUse comes from workerData
                <TouchableOpacity onPress={handleResetOwnPassword} style={styles.actionButton}>
                    <Text style={styles.buttonText}>Reset password</Text>
                </TouchableOpacity>
                )}
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
        fontSize: screenWidth * 0.05,
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
        paddingBottom:10,
        paddingTop:10,
    },
    infoText: {
        fontSize: screenWidth * 0.10,
        color: "white",
        fontFamily: "Saira-Regular",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },
});

export default EditOwnDetails;
