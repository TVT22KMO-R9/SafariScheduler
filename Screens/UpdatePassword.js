import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity, Dimensions, DeviceEventEmitter } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SERVER_BASE_URL } from '@env';
import BackgroundImage from '../utility/BackGroundImage';
import { getToken } from '../utility/Token';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const UpdatePasswordScreen = ({ screenProps}) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');


  const handleUpdatePassword = async () => {
    if (newPassword.length < 8) {
      Alert.alert('Password needs to be at least 8 characters long');
      return;
    } else if (newPassword !== confirmNewPassword) {
      Alert.alert('Password Mismatch');
      return;
    }

  
    

    // Put requesti serverille 
    const response = await fetch(SERVER_BASE_URL+"/api/user/update/password", {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': "Bearer " + await getToken(),
      },
      body: JSON.stringify({ newPassword: newPassword }),
    });

    if (response.ok) {
      Alert.alert('Password updated successfully');
      // vaadi uudelleenkirjautuminen
      // emit logout signaali
      DeviceEventEmitter.emit('logout');
    } else {
      Alert.alert('Failed to update password');
      console.log(response.status);
    }
  };

  return (
    <KeyboardAwareScrollView
    style={{ flex: 1 }}
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
  >
      <View style={styles.container}>
      <BackgroundImage style={styles.backgroundImage} />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmNewPassword}
          onChangeText={setConfirmNewPassword}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
          <Text style={styles.buttonText}>Update Password</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAwareScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;
const screenHeight  = Dimensions.get('window').height;
const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  input: {
    height: screenHeight * 0.07,
    width: screenWidth * 0.8,
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: screenWidth * 0.06,
    fontFamily: 'Saira-Regular',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',

  },
  buttonText: {
    color: 'white',
    fontSize: screenWidth * 0.07,
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    marginVertical: 6,
    alignItems: "center",
    width: screenWidth * 0.8,
    borderColor: "white",
    borderWidth: 2,
},
});

export default UpdatePasswordScreen;