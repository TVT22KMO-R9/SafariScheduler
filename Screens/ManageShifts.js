import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Modal } from 'react-native';

const ManageShifts = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
  }, []);

  const handleSearch = (text) => {
    setSearchText(text);
    if (text) {
      const filtered = workers.filter((worker) =>
        worker.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredWorkers(filtered);
    } else {
      setFilteredWorkers(workers);
    }
  };

  const openModal = () => {
    setModalVisible(true);
    setFilteredWorkers(workers);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const selectWorker = (worker) => {
    closeModal();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openModal} style={styles.workerSelectField}>
        <Text>Select Worker</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeModal}
      >
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
              <TouchableOpacity style={styles.item} onPress={() => selectWorker(item)}>
                <Text>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  workerSelectField: {
    padding: 15,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    marginBottom: 20,
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 5,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  searchBox: {
    height: 40,
    borderWidth: 1,
    padding: 10,
    width: '100%',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    width: '100%',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: 'lightgray',
    padding: 10,
    borderRadius: 5,
  },
});

export default ManageShifts;