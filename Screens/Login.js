import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import {LOGIN_ENDPOINT, LOGIN_SHORT, SERVER_BASE_URL} from '@env'
import { encode as base64Encode } from 'base-64';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { saveRefreshToken } from "../utility/RefreshTokenCheck";
import { saveToken } from "../utility/Token";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigation = useNavigation();

  const apiLogin = async (email, password) => {
    try {
      const base64Credentials = base64Encode(`${email}:${password}`);
      let response;
      if(rememberMe) {  // ohjataan eri endpointiin riippuen onko remember me valittu
        response = await fetch(`${SERVER_BASE_URL}${LOGIN_ENDPOINT}`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
            'Content-Type': 'application/json'
          },
        });
      } else {
        response = await fetch(`${SERVER_BASE_URL}${LOGIN_SHORT}`, {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${base64Credentials}`,
            'Content-Type': 'application/json'
          },
        });
      }
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Login failed: ${response.statusText} - ${errorText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
  const handleLogin = async () => {   // muutettu async token ja refreshtoken settejä varten ja try catch blokit - tero
    try {
      const response = await apiLogin(email, password);
      const token = response.token;
      const refreshToken = response.refreshToken;
  
      if(refreshToken.length > 1) {
        saveRefreshToken(refreshToken);
      }
  
      await AsyncStorage.setItem('userToken', token);
      console.log('Token stored successfully');
      console.log(`User's Role: ${response.role}`);
      console.log(`User token: ${token}`);
      navigation.navigate('ShiftScreen', { userRole: response.role });
    } catch (error) {
      console.error('Login Failed: ', error.message);
      Alert.alert('Login Failed', error.message);
    }
  };
  

  

  return (
    <KeyboardAwareScrollView
    style={{ flex: 1 }}
    contentContainerStyle={styles.container}
    keyboardShouldPersistTaps="handled"
    >
      <Image
        source={require("../assets/background.png")}
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
      <View style={styles.checkboxContainer}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => setRememberMe(!rememberMe)}
        >
          <Ionicons
            name={rememberMe ? 'checkbox-outline' : 'square-outline'}
            size={30}
            color={rememberMe ? 'rgba(0, 0, 0, 1)' : 'black'}
          />
        </TouchableOpacity>
        <Text style={styles.label}>Remember Me</Text>
      </View>
      <TouchableOpacity
        style={styles.buttonContainer}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>LOGIN</Text>
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  );
};



const window = Dimensions.get("window");
const screenWidth = window.width;
const screenHeight = window.height;

const styles = StyleSheet.create({
  buttonContainer: {
    width: screenWidth * 0.6,
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(0, 205, 0, 0.7)',
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    borderColor: "black",
    borderWidth: 2,
  },
  buttonText: {
    color: "white",
    fontSize: screenWidth * 0.15,
    fontFamily: "Saira-Regular",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,

  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  backgroundImage: {
    position: "absolute",
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  input: {
    height: screenWidth * 0.2,
    width: "80%",
    borderRadius: 5,
    borderColor: "black",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderWidth: 1,
    marginBottom: "10%",
    paddingHorizontal: 10,
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    marginTop: 0,
  },
  checkbox: {
    marginRight: 8,
  },
  checkboxText: {
    fontSize: screenWidth * 0.1,
  },
  label: {
    fontSize: screenWidth * 0.06,
    fontFamily: "Saira-Regular",
    color: "white",
    textShadowColor: "rgba(0, 0, 0, 1)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
  },
});

export default Login;
