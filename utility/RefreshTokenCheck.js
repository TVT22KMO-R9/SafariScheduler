import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_BASE_URL, REFRESH_TOKEN, ACCESS_TOKEN, REFRESH_ENDPOINT } from '@env';
import { saveToken } from './Token';



// katsoo löytyykö localstoragesta refresh tokenia palauta boolean
export const RefreshTokenCheck = async () => {
    const refreshToken = await getRefreshToken();
    if (refreshToken === null) {
        console.log("Refresh tokenia ei löytynyt")
        return false;
    }
    console.log("Refresh token löytyi")
    return true;
}

export const saveRefreshToken = async (refreshToken) => {
    // tarkista ettei refreshtokenia jo ole
    const currentRefreshToken = await getRefreshToken();
    if (currentRefreshToken !== null) {
        console.log("Refresh token löytyi jo, poistetaan");
        await AsyncStorage.removeItem(REFRESH_TOKEN);
    }
    // tallenna token local storageen
    AsyncStorage.setItem(REFRESH_TOKEN, refreshToken);
    console.log("Refresh token tallennettu: " + refreshToken);
}

export const getRefreshToken = async () => {
    // hae token local storagesta
    const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);
    return refreshToken;
}

export const removeRefreshToken = async () => {
    // poista token local storagesta
    await AsyncStorage.removeItem(REFRESH_TOKEN);
}

