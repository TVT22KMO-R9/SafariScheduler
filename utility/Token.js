import AsyncStorage from '@react-native-async-storage/async-storage';
import { ACCESS_TOKEN } from '@env';

// export functiot access token tallennukseen ja hakuun

export const saveToken = async (accessToken) => {
    // tallenna token local storageen
    AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
}

export const hasToken = async () => {  // tarkistaa true / false
    // tarkista onko token local storagesta
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return token !== null;
}

export const getToken = async () => {
    // hae token local storagesta
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    return token;
}

export const removeToken = async () => {
    // poista token local storagesta
    await AsyncStorage.removeItem(ACCESS_TOKEN);
}

// boolean palauttaa true jos token löytyy, false jos ei löydy
export const checkToken = async () => {
    const token = await AsyncStorage.getItem(ACCESS_TOKEN);
    if (token === null) {
        return false;
    }
    return true;
}