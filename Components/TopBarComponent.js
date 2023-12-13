import * as React from 'react';
import Home from './Home';
import Logout from './Logout';
import Menu from './Menu';
import { Modal, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TopBarComponent({handleLogout, userRole}){
    const [isMenuVisible, setMenuVisible] = React.useState(false);

    const toggleMenu = () => {
          setMenuVisible(!isMenuVisible);
        console.log("onko menu näkyvissä:" + isMenuVisible)
      };

      const navigation = useNavigation();
 // Nappien paikat säädetty nappien omassa stylessä
    return (
        <View style={styles.container}>
           <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
            <Ionicons name="menu" size={45} color="white" />
            </TouchableOpacity>
            <Modal
            animationType="slide"
            transparent={true}
            visible={isMenuVisible}
            onRequestClose={() => {
            setMenuVisible(false);
             }}
            >
            <TouchableWithoutFeedback onPress={toggleMenu}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
                <Menu userRole={userRole}/>
            </View>
            </Modal>
            <Home />
            <Logout logOut={handleLogout}/>
        </View>
    )
}

const window = Dimensions.get('window');
const screenWidth = window.width;
const screenHeight = window.height;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flex: 1,
        width: screenWidth,
        height: 100,
        position: 'absolute',
        top: 0,
        zIndex: 1,
        backgroundColor: 'black',
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
      
    },
    menuContainer: {
        position: 'absolute',
        left: 0,
        top: 0,
        width: Dimensions.get('window').width * 0.75,
        height: screenHeight,
        backgroundColor: 'white',
      },
      menu:{
        position: 'absolute',
        top: 20,
        left: 20,
        paddingTop: 14,

      }
    });