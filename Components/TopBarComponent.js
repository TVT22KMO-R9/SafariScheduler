import * as React from 'react';
import Home from './Components/Home';
import Logout from './Components/Logout';
import Menu from './Components/Menu';
import { Modal, TouchableOpacity, View } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';

export default function TopBarComponent({handleLogout, userRole, navigation}){
    const [isMenuVisible, setMenuVisible] = React.useState(false);

    const toggleMenu = () => {
          setMenuVisible(!isMenuVisible);
        console.log("onko menu näkyvissä:" + isMenuVisible)
      };


    return (
        <View style={styles.container}>
           <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={45} color="white" />
            </TouchableOpacity>
            <Modal 
            visible={isMenuVisible} 
            animationType="slide"
            onRequestClose={() => setMenuVisible(false)}
            >
            <TouchableWithoutFeedback onPress={toggleMenu}>
                <View style={styles.overlay} />
            </TouchableWithoutFeedback>
            <View style={styles.menuContainer}>
                <Menu userRole={userRole} navigation={navigation} />
            </View>
            </Modal>
            <Home />
            <Logout logOut={handleLogout}/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
        height: '100%',
        backgroundColor: 'white',
      },
    });