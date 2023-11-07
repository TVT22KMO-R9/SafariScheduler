import React, { useState } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';

const CreateUser = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleCreateUser = () => {
    if (password === confirmPassword) {
    // Implement your user creation logic here
    console.log(email, password, firstName, lastName, phoneNumber);
  } else {
    alert("Passwords don't match!");
  }
};

  return (
    <KeyboardAwareScrollView
  style={{ flex: 1 }}
  contentContainerStyle={styles.container}
  keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require('../assets/background.png')}
        style={styles.backgroundImage}
      />
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Confirm Password"
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        value={firstName}
        onChangeText={setFirstName}
        placeholder="First Name"
      />
      <TextInput
        style={styles.input}
        value={lastName}
        onChangeText={setLastName}
        placeholder="Last Name"
      />
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        placeholder="Phone Number"
        keyboardType="phone-pad"
      />
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleCreateUser}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>REGISTER</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};

const window = Dimensions.get("window");
const screenWidth = window.width;
const screenHeight = window.height;

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
    height: screenWidth * 0.15,
    width: '80%',
    borderRadius: 10,
    borderColor: 'black',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    fontSize: screenWidth * 0.08,
    fontFamily: 'Saira-Regular',
  },
  buttonContainer: {
    width: screenWidth * 0.8,
    paddingVertical: 5,
    paddingHorizontal: 5,
    backgroundColor: 'rgba(0, 130, 255, 0.7)',
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    color: 'white',
    fontSize: screenWidth * 0.15,
    fontFamily: 'Saira-Regular',
    textShadowColor: 'rgba(0, 0, 0, 1)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default CreateUser;