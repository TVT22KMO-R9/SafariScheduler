import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKGROUND, BACKGROUND_URL } from "@env";
import * as FileSystem from 'expo-file-system';

// tallenna background kuvan url 
export const setBackgroundURL = async (url) => {
    try {
        await AsyncStorage.setItem(BACKGROUND_URL, url);
    } catch (error) {
        console.error("Error setting background URL:", error);
    }
}

// hae background kuvan url
export const getBackgroundURL = async () => {
    try {
        const url = await AsyncStorage.getItem(BACKGROUND_URL);
        return url;
    } catch (error) {
        console.error("Error getting background URL:", error);
    }
}

export const hasCustomBackground = async () => {
    try {
        const url = await AsyncStorage.getItem(BACKGROUND_URL);
        if (url) {
            return true;
        }
        return false;
    } catch (error) {
        console.error("Error getting background URL:", error);
    }
}

// poista background kuvan url
export const removeBackgroundURL = async () => {
    try {
        await AsyncStorage.removeItem(BACKGROUND_URL);
    } catch (error) {
        console.error("Error removing background URL:", error);
    }
}

// lataa ja tallenna kuva urlista
export const downloadAndSaveBackgroundFromURL = async (url) => {
    try {
        const filename = FileSystem.documentDirectory + BACKGROUND;
        const result = await FileSystem.downloadAsync(url, filename);
        return result.uri;
    } catch (error) {
        console.error("Error downloading image:", error);
    }
}

// poista mahdollinen vanha ja tallenna uusi taustakuva
export const saveBackground = async (uri) => {
    try {
        const oldBackground = await AsyncStorage.getItem(BACKGROUND);
        if (oldBackground !== null) {
            await removeBackground();
            console.log('Old background removed');
        }
        await AsyncStorage.setItem(BACKGROUND, uri);
        console.log('New background stored');
    } catch (error) {
        console.error("Error saving background:", error);
    }
}

// poista vanha taustakuva
export const removeBackground = async () => {
    try {
        await AsyncStorage.removeItem(BACKGROUND);
        console.log('Background removed');
    } catch (error) {
        console.error("Error removing background:", error);
    }
}

// katso onko companysettingsseissä taustakuva
export const settingsHasBackground = (settings) => {
    if (settings && settings.backgroundImageURL && settings.backgroundImageURL.length > 1) {
        return true;
    }
    console.log('Company settings does not have background image');
    return false;
}
