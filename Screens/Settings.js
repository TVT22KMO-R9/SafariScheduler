import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const Settings = ({ navigation }) => {
    return (
        <View style={styles.container}>
            {/* Edit Background Button */}
            <TouchableOpacity 
                style={styles.button}
                onPress={() => navigation.navigate('UploadImgScreen')}
            >
                <Text style={styles.buttonText}>Edit Background</Text>
            </TouchableOpacity>

            {/* Placeholder Button */}
            <TouchableOpacity 
                style={styles.button}
                onPress={() => {/* Placeholder action */}}
            >
                <Text style={styles.buttonText}>Placeholder Option</Text>
            </TouchableOpacity>

            {/* Add more buttons as needed */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f5f5f5',
    },
    button: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 5,
        padding: 10,
        marginVertical: 10,
        alignItems: 'center',
        width: screenWidth * 0.9,
        borderColor: 'white',
        borderWidth: 2,
    },
    buttonText: {
        fontSize: screenWidth * 0.09,
        color: 'white',
        fontFamily: 'Saira-Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    }
});

export default Settings;
