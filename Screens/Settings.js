import React, { useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Modal, TouchableWithoutFeedback, Image,
    TextInput, Alert, ScrollView,
    KeyboardAvoidingView, FlatList
} from 'react-native';
import { useFocusEffect, useRoute } from '@react-navigation/native';
import BackgroundImage from '../utility/BackGroundImage';
import { useNavigation } from '@react-navigation/native';

const Settings = () => {
    const route = useRoute();
    const userRole = route.params?.userRole;

    const navigation = useNavigation();

    const handleEditOwnDetails = () => {
      navigation.navigate('EditOwnDetails');
    };

    const handleEditOthersDetails = () => {
      navigation.navigate('EditOthersDetails');
    };

    const handleResetOwnPassword = () => {
         navigation.navigate('UpdatePassword');
        };

    const handleEditRoles = () => {
        //  navigation.navigate('EditRoles');
        };
    
    const handleResetOthersPassword = () => {
        navigation.navigate('ResetOthersPassword');
        };

    const handleEditAppearance = () => {
        navigation.navigate('UploadImgScreen');
        }

    // Jos worker tulee näkymään, niin ohjataan suoraan EditOwnDetails näkymään

    // superilla rajattu toimintoja

    // masterilla kaikki toiminnot

    return (
    <View style={styles.container}>
        <BackgroundImage style={styles.backgroundImage} />
        <Text style={styles.buttonText}>SETTINGS</Text>
        {userRole === 'WORKER' ? ( 
            // WORKER ohjataan suoraan edit own details
            navigation.navigate('ShiftScreen') // <---- TÄMÄN PITÄISI OLLA EditOwnDetails (vai mikä nimeksi tuleekaan)
        ) : (
            <>
                <TouchableOpacity onPress={handleEditOwnDetails} style={styles.actionButton}>
                    <Text style={styles.buttonText}>Edit Own Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEditRoles} style={styles.actionButton}>
                    <Text style={styles.buttonText}>Edit Roles</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleResetOwnPassword} style={styles.actionButton}>
                    <Text style={styles.buttonText}>Reset Own Password</Text>
                </TouchableOpacity>
                {userRole === 'MASTER' && (
                    <>
                        <TouchableOpacity onPress={handleEditOthersDetails} style={styles.actionButton}>
                            <Text style={styles.buttonText}>Edit Others Details</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleResetOthersPassword} style={styles.actionButton}>
                            <Text style={styles.buttonText}>Reset Others Password</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleEditAppearance} style={styles.actionButton}>
                            <Text style={styles.buttonText}>Edit Appearance</Text>
                        </TouchableOpacity>
                    </>
                )}
            </>
        )}
    </View>
);
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
    },actionButton: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 5,
        marginVertical: 6,
        alignItems: "center",
        width: screenWidth * 0.8,
        borderColor: "white",
        borderWidth: 2,
    }, buttonText: {
        fontSize: screenWidth * 0.07,
        color: "white",
        fontFamily: "Saira-Regular",
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    }, backgroundImage: {
        position: "absolute",
        width: "100%",
        height: "100%",
        resizeMode: "cover",
    },

});

export default Settings;