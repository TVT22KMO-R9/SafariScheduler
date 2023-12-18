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

    const handleEditRoles = () => {
        navigation.navigate('EditRoles');
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
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.welcomeText}>SETTINGS</Text>
        {userRole === 'WORKER' ? ( 
            // WORKER ohjataan suoraan edit own details
            navigation.navigate('EditOwnDetails') // <--
        ) : (
            <>
                <TouchableOpacity onPress={handleEditOwnDetails} style={styles.actionButton}>
                    <Text style={styles.buttonText}>Edit Own Details</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleEditRoles} style={styles.actionButton}>
                    <Text style={styles.buttonText}>Edit Roles</Text>
                </TouchableOpacity>
                {userRole === 'MASTER' && (
                    <>
                        <TouchableOpacity onPress={handleEditOthersDetails} style={styles.actionButton}>
                            <Text style={styles.buttonText}>Edit Others Details</Text>
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
    },logo: {
        width: 200,
        height: 250,
        position: "absolute",
        top: screenHeight * +0.08,
        resizeMode: "contain",
      },
        welcomeText: {
            textAlign: "center",
            color: "white",
            fontSize: 28,
            paddingBottom: 20,
            fontFamily: "Saira-Regular",
            textShadowColor: "rgba(0, 0, 0, 1)",
            textShadowOffset: { width: -1, height: 1 },
            textShadowRadius: 10,
            marginTop: screenHeight * 0.2,
        },

});

export default Settings;