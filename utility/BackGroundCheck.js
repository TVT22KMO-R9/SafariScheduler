import AsyncStorage from "@react-native-async-storage/async-storage";
import { BACKGROUND } from "@env";
import RNFetchBlob from "rn-fetch-blob";


export const hasBackground = async () => {
    try {
        const background = await AsyncStorage.getItem(BACKGROUND);
        return background !== null;
    } catch (error) {
        console.error("Error checking background existence:", error);
        return false;
    }
}

export const getBackground = async () => {
    try {
        return await AsyncStorage.getItem(BACKGROUND);
    } catch (error) {
        console.error("Error getting background:", error);
        return null;
    }
}

export const saveBackground = async (background) => {
    try {
        // jos uusi background, poista vanha
        if (oldBackground !== null) {
            await removeBackground();
        }
        await AsyncStorage.setItem(BACKGROUND, background);
    } catch (error) {
        console.error("Error saving background:", error);
    }
}

export const removeBackground = async () => {
    try {
        await AsyncStorage.removeItem(BACKGROUND);
    } catch (error) {
        console.error("Error removing background:", error);
    }
}

export const downloadAndSaveBackgroundFromURL = async (url) => {
    try {
        const imageData = await downloadImage(url); 
        await saveBackground(imageData);
    } catch (error) {
        console.error("Error downloading and saving background:", error);
    }
}

const downloadImage = async (url) => {
    try {
        const response = await RNFetchBlob.config({
            fileCache: true
        }).fetch('GET', url);

        const imagePath = response.path();
        let base64Data = '';
        await RNFetchBlob.fs.readFile(imagePath, 'base64')
            .then((data) => {
                base64Data = data;
            });

        await RNFetchBlob.fs.unlink(imagePath);

        return base64Data;
    }
    catch (error) {
        console.error("Error downloading image:", error);
        return null;
    }
}

export const settingsHasBackground = async () => {




    
}