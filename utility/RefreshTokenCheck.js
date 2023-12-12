import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_BASE_URL, REFRESH_TOKEN, ACCESS_TOKEN, REFRESH_ENDPOINT } from '@env';
import { saveToken } from './Token';



// katsoo löytyykö localstoragesta refresh tokenia
export const RefreshTokenCheck = async () => {
    try { 
        const refreshToken = await getRefreshToken(); 
        if (refreshToken !== null) {
            console.log("Refresh token löytyi, haetaan tuore accesstoken");
                const response = await fetch(SERVER_BASE_URL + REFRESH_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + refreshToken
                    },   
                });
                const data = await response.json();
                if (response.ok) {
                    const accessToken = data.accessToken;
                    console.log("Tuore access token haettu");       
                    await saveToken(accessToken);
                    return true;
                }
                if (response.status === 401) {
                    console.log("Unauthorized, poistetaan refresh token");
                    await AsyncStorage.removeItem(REFRESH_TOKEN);
                    return false;
                }
        } else {
            // ei refresh tokenia, poistetaan nykyinen accesstoken jotta tuore sessio
            console.log("Ei refresh tokenia, poistetaan accesstoken");
            await AsyncStorage.removeItem(ACCESS_TOKEN);
            return false;
        }
    }
    catch (error) {
        console.log(error);
    }
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

