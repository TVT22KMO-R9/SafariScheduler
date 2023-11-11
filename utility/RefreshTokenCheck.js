import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_BASE_URL, REFRESH_TOKEN, ACCESS_TOKEN } from '@env';


// katsoo löytyykö localstoragesta refresh tokenia
export const RefreshTokenCheck = async () => {
    try { 
        const refreshToken = await AsyncStorage.getItem(REFRESH_TOKEN);  
        if (refreshToken !== null) {
            console.log("Refresh token löytyi, haetaan tuore accesstoken");
                const response = await fetch(SERVER_BASE_URL +"/api/refresh", {
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
                    await AsyncStorage.setItem(ACCESS_TOKEN, accessToken);
                }
                if (response.status === 401) {
                    console.log("Unauthorized, poistetaan refresh token");
                    await AsyncStorage.removeItem(REFRESH_TOKEN);
                }
        } else {
            // ei refresh tokenia, poistetaan nykyinen accesstoken jotta tuore sessio
            console.log("Ei refresh tokenia, poistetaan accesstoken");
            await AsyncStorage.removeItem(ACCESS_TOKEN);
        }
    }
    catch (error) {
        console.log(error);
    }
}

