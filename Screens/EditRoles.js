import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Dimensions, Image, TextInput, FlatList, StyleSheet } from 'react-native';
import BackgroundImage from '../utility/BackGroundImage';
import { SERVER_BASE_URL, WORKERS } from '@env';
import { getToken } from '../utility/Token';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { Alert } from 'react-native';

function EditRoles({ route }) {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isRoleModalVisible, setRoleModalVisible] = useState(false);
const { currentUserRole, currentUserId } = route.params;
const [newRole, setNewRole] = useState('WORKER');
const [selectedRole, selectRole] = useState('WORKER');


useEffect(() => {
    console.log("Received userData:", route.params?.userData); 
    console.log("EditRoles component re-rendered with user role:", currentUserRole);
    fetchWorkers();
  }, []);

  const onRoleChange = (selectedRole) => {
    setNewRole(selectedRole);
  };

  const canEditRole = (workerRole) => { // supervisor ei voi muokata masteria
    if (currentUserRole === 'MASTER') {
      return true;
    } else if (currentUserRole === 'SUPERVISOR' && workerRole !== 'MASTER') {
      return true;
    }
    return false;
  };

  const handleSelectRole = (role) => {
    setNewRole(role);
    closeRoleModal();
  }


  

  const fetchWorkers = async () => {
    const token = await getToken();
    const numericCurrentUserId = Number(currentUserId); // varmista että nrona
  
    try {
      const response = await fetch(`${SERVER_BASE_URL}${WORKERS}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log("Fetched workers:", data);
        console.log("Current user ID:", numericCurrentUserId);
        console.log("Current user role:", currentUserRole  );
        console.log("Current user ID before converting:", currentUserId);
        // Filtteröidään pois nykyinen käyttäjä, ei voi muokata itseään
        const filteredData = data.filter(worker => worker.id !== numericCurrentUserId);
        setWorkers(filteredData);
        setFilteredWorkers(filteredData);
      } else {
        
        console.error("Failed to fetch workers");
      }
    } catch (error) {
      console.error("Error fetching workers:", error);
    }
  };

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

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

    const openRoleModal = () => {
    setRoleModalVisible(true);
    }

    const closeRoleModal = () => {
    setRoleModalVisible(false);
    }


  const selectWorker = (worker) => {
    setSelectedWorker(worker);
    closeModal();
  };



  const getDisplayName = (worker) => { // lisäys ilman nimeä mahdollinen, otetaan mailin alku
    if (!worker.firstName && !worker.lastName) {
        let email = worker.email;
        let emailParts = email.split("@");
        return emailParts[0];
    }
    return `${worker.firstName || ''} ${worker.lastName || ''}`.trim();
  };

  const confirmUpdate = async () => {
    if (!selectedWorker || !newRole) {
      Alert.alert("Error", "No worker selected or role chosen");
      return;
    }
  
    Alert.alert(
      "Confirm Role Change",
      `Are you sure you want to change ${getDisplayName(selectedWorker)}'s role from ${selectedWorker.role} to ${newRole}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => console.log("Role change cancelled")
        },
        {
          text: "Confirm",
          onPress: async () => await performRoleUpdate()
        }
      ]
    );
  };

  const performRoleUpdate = async () => {
    const updateURL = `${SERVER_BASE_URL}/api/company/workers/${selectedWorker.id}`;
    const token = await getToken();
  
    try {
      const response = await fetch(updateURL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });
  
      if (response.ok) {
        Alert.alert("Success", "Role updated successfully");
        fetchWorkers(); // Refresh the workers list
      } else {
        throw new Error("Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      Alert.alert("Error", "An error occurred while updating role");
    }
  };
  
  const renderRoleModal = () => {
    let availableRoles = ['WORKER', 'SUPERVISOR'];
    if (currentUserRole === 'MASTER') {
      availableRoles.push('MASTER');
    }

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={isRoleModalVisible}
        onRequestClose={closeRoleModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            {availableRoles.map((role, index) => (
              <TouchableOpacity
                key={index}
                style={styles.item}
                onPress={() => handleSelectRole(role)}
              >
                <Text style={styles.itemText}>{role}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={closeRoleModal} style={styles.buttonClose}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <BackgroundImage style={styles.backgroundImage} />
      {selectedWorker === null ? (
        <Image
          source={require("../assets/logo.png")}
          style={styles.logo}
        />
      ) : null
      }


      <TouchableOpacity onPress={openModal} style={styles.button}>
        <Text style={styles.buttonText}>
          {selectedWorker
            ? `${selectedWorker.firstName} ${selectedWorker.lastName}`
            : "SELECT WORKER"}
        </Text>
      </TouchableOpacity>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
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
                    onPress={() => canEditRole(item.role) ? selectWorker(item) : null}
                  >
                <Text style={styles.itemText}>
                  {getDisplayName(item)}
                   </Text>
                   {canEditRole(item.role) ? (
                  <Ionicons name="checkmark-circle" size={24} color="green" />
                    ) : (
                  <Ionicons name="close-circle" size={24} color="red" />
                    )}
               </TouchableOpacity>
                 )}
             />
            <TouchableOpacity onPress={closeModal} style={styles.buttonClose}>
              <Text style={styles.textStyle}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <View style={{ width: '80%', marginTop: 20, alignItems: 'center' }}>
        {selectedWorker && (
            <>
       
          <Text style={styles.roleInfoHeader}>
            Current Role: {selectedWorker.role}
            </Text>
            <TouchableOpacity onPress={openRoleModal} style={styles.button}>
          <Text style={styles.buttonText}>Select New Role</Text>
        </TouchableOpacity>
        <Text style={styles.roleInfoHeader}>Selected: {newRole}</Text>

            {renderRoleModal()}
            <TouchableOpacity onPress={confirmUpdate} style={styles.button}>
                 <Text style={styles.buttonText}>Confirm Update</Text>
            </TouchableOpacity> 
            </>

        )}


       
      </View>

    </View>

  );
  
}


const screenHeight = Dimensions.get('window').height;
const screenWidth = Dimensions.get('window').width;

const styles=StyleSheet.create({
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
    },  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  workerInfo: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
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
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "black",
    width: "100%",
    alignItems: "center",
  },
  itemText: {
    fontSize: screenWidth * 0.08,
    fontFamily: "Saira-Regular",
    paddingRight: 10,
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
  pickerContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    width: screenWidth * 0.8,
    borderColor: "white",
    borderWidth: 2,
    height: screenHeight * 0.07,
    textAlign: 'center',
  },
  picker: {
    color: 'white',
    height: 40,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
    roleInfoHeader: {
        textAlign: "center",
        color: "white",
        fontSize: 25,
        fontFamily: "Saira-Regular",
        marginTop: 20,
        textShadowColor: "rgba(0, 0, 0, 1)",
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
    },

})

export default EditRoles;
