import React, { useEffect, useState } from 'react';
import { View, Text, Pressable, Alert, KeyboardAvoidingView, TextInput, FlatList, TouchableOpacity, Modal, Dimensions, Image } from 'react-native';
import { StyleSheet } from 'react-native';
import BackgroundImage from '../utility/BackGroundImage';
import { SERVER_BASE_URL, WORKERS } from '@env';
import { getToken } from '../utility/Token';
import { useNavigation } from '@react-navigation/native';

function EditOthersDetails() {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isModalInfoVisible, setModalInfoVisible] = useState(false);
  const [isModalPassVisible, setModalPassVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchWorkers();
  }, []);


  const handleResetOthersPassword = () => {
    navigation.navigate('ResetOthersPassword');
    };
 
    const fetchWorkers = async () => {
        const token = await getToken();

        try {
            const response = await fetch(SERVER_BASE_URL+WORKERS, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + token,
                },
            });
            if(response.ok) {
                const data = await response.json();
                setWorkers(data);
                setFilteredWorkers(data);
            } else {
                throw new Error("Failed to fetch workers");
                Alert.alert("Error", "Failed to fetch workers");
            }
        } catch (error) {
            console.error("Error fetching workers:", error);
            Alert.alert("Error", "An error occurred while fetching workers");
        }
    }

    const handleSearch = (text) => {
        setSearchText(text);
        if (text) {
          const filtered = workers.filter(worker =>
            `${worker.firstName} ${worker.lastName}`.toLowerCase().includes(text.toLowerCase())
          );
          setFilteredWorkers(filtered);
        } else {
          setFilteredWorkers(workers);
        }
      };

      const openModalInfo = () => {
        setModalInfoVisible(true);
      };

        const openModalPass = () => {
            setModalPassVisible(true);
          };

          const closeModalInfo = () => {
            setSelectedWorker(null);
            setModalInfoVisible(false);
          };

        const closeModalPass = () => {
            setSelectedWorker(null);
            setModalPassVisible(false);
          };

        const selectWorker = (worker) => {
        setSelectedWorker(worker);
        closeModal();
        };


        const resetPassword = async (userId) => {
            try {
                const response = await fetch(`${SERVER_BASE_URL}/api/user/update/password/${userId}`, {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': "Bearer " + await getToken(),
                    },
                    body: JSON.stringify({ newPassword: "testpassword" }),
                });
        
                if(response.ok) {
                    Alert.alert("Success! Password is now 'testpassword'");
                }
                else {
                    throw new Error("Failed to reset password");
                }
            }
            catch (error) {
                console.error("Error resetting password:", error);
                Alert.alert("Error", "An error occurred while resetting password");
            }
          };
 
  const handlePress = (worker) => {
    const workerName = worker.firstName || worker.lastName 
      ? `${worker.firstName || ''} ${worker.lastName || ''}`.trim() 
      : 'Anonymous';
  
    Alert.alert(
      "Edit employee details",
      `Do you want to edit ${workerName}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            // Pass the selected worker's data to the EditOwnDetails screen
            navigation.navigate('EditOwnDetails', { workerData: worker });
            closeModalInfo();
          } 
        }
      ]
    );
  };

  const handlePressPass = (worker) => {
    const workerName = worker.firstName || worker.lastName 
      ? `${worker.firstName || ''} ${worker.lastName || ''}`.trim() 
      : 'Anonymous';
  
    Alert.alert(
      "Reset Password",
      `Are you sure you want to reset the password for ${workerName}?`,
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "OK", 
          onPress: async () => {
            await resetPassword(worker.id);
            closeModalPass();
          } 
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
        <BackgroundImage style={styles.backgroundImage} />
        <Image source={require("../assets/logo.png")} style={styles.logo} />
        <TouchableOpacity onPress={openModalInfo} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedWorker
            ? `${selectedWorker.firstName} ${selectedWorker.lastName}`
            : "Edit employee info"}
        </Text>
      </TouchableOpacity>
      <Modal
          animationType="fade"
          transparent={true}
          visible={isModalInfoVisible}
          onRequestClose={closeModalInfo}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.searchBox}
                placeholder="Search by name"
                value={searchText}
                onChangeText={handleSearch}
              />
              <FlatList
                data={filteredWorkers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => handlePress(item)}
                    >
                      <Text style={styles.itemText}>
                        {item.firstName || item.lastName 
                          ? `${item.firstName || ''} ${item.lastName || ''}`.trim() 
                          : 'Anonymous'}
                        {item.role === 'WORKER' && ' (W)'}
                        {item.role === 'SUPERVISOR' && ' (S)'}
                        {item.role === 'MASTER' && ' (M)'}
                      </Text>
                    </TouchableOpacity>
                  )}
              />
              <TouchableOpacity onPress={closeModalInfo} style={styles.buttonClose}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <TouchableOpacity onPress={openModalPass} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedWorker
            ? `${selectedWorker.firstName} ${selectedWorker.lastName}`
            : "Reset employee password"}
        </Text>
      </TouchableOpacity>
      <Modal
          animationType="fade"
          transparent={true}
          visible={isModalPassVisible}
          onRequestClose={closeModalPass}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <TextInput
                style={styles.searchBox}
                placeholder="Search by name"
                value={searchText}
                onChangeText={handleSearch}
              />
              <FlatList
                data={filteredWorkers}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.item}
                      onPress={() => handlePressPass(item)}
                    >
                      <Text style={styles.itemText}>
                        {item.firstName || item.lastName 
                          ? `${item.firstName || ''} ${item.lastName || ''}`.trim() 
                          : 'Anonymous'}
                        {item.role === 'WORKER' && ' (W)'}
                        {item.role === 'SUPERVISOR' && ' (S)'}
                        {item.role === 'MASTER' && ' (M)'}
                      </Text>
                    </TouchableOpacity>
                  )}
              />
              <TouchableOpacity onPress={closeModalPass} style={styles.buttonClose}>
                <Text style={styles.textStyle}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </KeyboardAvoidingView>
  );
}

export default EditOthersDetails;

const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backgroundImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
      },
      logo: {
        width: 200,
        height: 250,
        position: "absolute",
        top: screenHeight * +0.08,
        resizeMode: "contain",
      },
      buttonText: {
        color: 'white',
        fontSize: screenWidth * 0.06,
        fontFamily: 'Saira-Regular',
        textShadowColor: 'rgba(0, 0, 0, 1)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        alignItems: 'center',
        
      },
      button: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        borderRadius: 5,
        alignItems: "center",
        justifyContent: "center",
        width: screenWidth * 0.8,
        borderColor: "white",
        borderWidth: 2,
        height: screenHeight * 0.07,
        marginTop: 30,
    },  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  modalView: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "90%",
  },
  searchBox: {
    height: screenHeight * 0.07,
    borderWidth: 1,
    padding: 10,
    width: "100%",
    marginBottom: 20,
    borderRadius: 5,
    fontFamily: "Saira-Regular",
    fontSize: screenWidth * 0.06,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
    alignItems: "center",
  },
  itemText: {
    fontSize: screenWidth * 0.08,
    fontFamily: "Saira-Regular",
  },
  buttonClose: {
    backgroundColor: "rgba(205, 0, 0, 1)",
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    borderColor: "black",
    borderWidth: 2,
    marginTop: 20,
    width: "80%",
    alignItems: "center",
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontFamily: "Saira-Regular",
    fontSize: 18,
  },
    });