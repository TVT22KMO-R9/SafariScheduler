// BackgroundImage.js
import React, { useState, useEffect } from 'react';
import { Image, DeviceEventEmitter } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getToken } from './Token';
import { SERVER_BASE_URL, COMPANY_SETTINGS } from '@env';
import { saveBackground, setBackgroundURL , downloadAndSaveBackgroundFromURL} from './BackGroundCheck';

const BackgroundImage = ({ style }) => {
  const [backgroundImage, setBackgroundImage] = useState(null);

  const fetchBackgroundImage = async () => {
    const savedImage = await AsyncStorage.getItem('backgroundImage');
    if (savedImage) {
      setBackgroundImage({ uri: savedImage });
    } else {
      setBackgroundImage(require('../assets/background.png'));
    }
  };

  useEffect(() => {
    fetchBackgroundImage();

    const subscription = DeviceEventEmitter.addListener('backgroundImageChanged', fetchBackgroundImage);

    return () => {
      subscription.remove();
    };
  }, []);

  // kuuntele image upload eventtiä ja lataa uusi taustakuva get pyynnöllä tokenin kanssa
  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('newImageUploaded', async () => {
      const token = await getToken();
      const response = await fetch(SERVER_BASE_URL + COMPANY_SETTINGS, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if(!response.ok) {
        console.error("Error fetching company settings:", data);
        return;
      }
      const url = data.companySettings.backgroundImageURL;
      try {
        const newBackground = await downloadAndSaveBackgroundFromURL(url);
        await saveBackground(newBackground);
        await setBackgroundURL(url);
      } catch (error) {
        console.error('Error updating background image:', error);
        return;
      }
  
      DeviceEventEmitter.emit('backgroundImageChanged');
    });
  
    return () => {
      subscription.remove();
    };
  }, []);


  return <Image source={backgroundImage} style={style} />;
};

export default BackgroundImage;