import * as React from 'react';
import Home from './Home';
import Logout from './Logout';
import Menu from './Menu';
import { Modal, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
import { Dimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function TopBarComponent({handleLogout, userRole, companyName}){
    const [isMenuVisible, setMenuVisible] = React.useState(false);

    const toggleMenu = () => {
          setMenuVisible(!isMenuVisible);
      };

    const outSideMenuPress = () => {
        setMenuVisible(false);
    }

      const navigation = useNavigation();
 // Nappien paikat säädetty nappien omassa stylessä
    return (
        <View style={styles.container}>
           <TouchableOpacity onPress={toggleMenu} style={styles.menu}>
            <Ionicons name="menu" size={45} color="rgba(143,138,134,255)" />
            </TouchableOpacity>
                <Modal
                animationType="slide"
                transparent={true}
                visible={isMenuVisible}
                onRequestClose={toggleMenu}
                >
                <View style={styles.modalContainer}>
                    <View style={styles.menuContainer}>
                    <Menu userRole={userRole} toggleMenu={toggleMenu} companyName={companyName}/>
                    </View>
                    <TouchableWithoutFeedback onPress={toggleMenu}>
                    <View style={styles.overlay} />
                    </TouchableWithoutFeedback>
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
const containerH = Dimensions.get('window').height * 0.1;
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flex: 1,
        width: screenWidth,
        height: screenHeight * 0.1,
        position: 'absolute',
        top: 0,
        zIndex: 10,
        backgroundColor: 'rgba(31,27,24,255)',
        borderBottomColor: 'rgba(143,138,134,255)',
        borderBottomWidth: 2,
        padding: 0,
        margin: 0,
    },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
      
    },
    modalContainer: {
        flexDirection: 'row',
        flex: 1,
      },
      menuContainer: {
        width: Dimensions.get('window').width * 0.75,
        height: screenHeight,
        backgroundColor: 'white',
      },
      overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        },
      menu:{
        position: 'absolute',
        left: 20,
        paddingTop: containerH * 0.35,

      }
    });