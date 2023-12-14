import React, { useState } from 'react';
import { Alert, StyleSheet, View, Text, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SERVER_BASE_URL } from '@env';

const UpdatePasswordScreen = ({ navigation }) => {
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
    const response = await fetch(`${SERVER_BASE_URL}/api/user/update/password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        // Include the auth token in the Authorization header
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify({ newPassword }),
    });

    if (response.ok) {
      Alert.alert('Password updated successfully');
      // Navigate to the login screen
      navigation.navigate('LoginScreen');
    } else {
      Alert.alert('Failed to update password');
    }
  };

  return (
    <KeyboardAwareScrollView style={{ flex: 1 }}>
      <View style={styles.container}>
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

const styles = StyleSheet.create({
  // Add your styles here
});

export default UpdatePasswordScreen;