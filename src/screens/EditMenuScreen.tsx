import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { AppDispatch, RootState } from '../store';
import { fetchHostMenu, updateHostMenu } from '../services/hostService';
import { MenuItem } from '../types/hostTypes';

const EditMenuScreen: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');

  useEffect(() => {
    if (currentUser) {
      dispatch(fetchHostMenu(currentUser.id))
        .then((items) => setMenuItems(items))
        .catch((error) => console.error('Error fetching menu:', error));
    }
  }, [dispatch, currentUser]);

  const handleAddMenuItem = () => {
    if (newItemName && newItemPrice) {
      const newItem: MenuItem = {
        id: Date.now().toString(),
        name: newItemName,
        price: parseFloat(newItemPrice),
      };
      setMenuItems([...menuItems, newItem]);
      setNewItemName('');
      setNewItemPrice('');
    }
  };

  const handleRemoveMenuItem = (id: string) => {
    setMenuItems(menuItems.filter(item => item.id !== id));
  };

  const handleSaveMenu = () => {
    if (currentUser) {
      dispatch(updateHostMenu(currentUser.id, menuItems))
        .then(() => Alert.alert('Success', 'Menu updated successfully'))
        .catch(() => Alert.alert('Error', 'Failed to update menu'));
    }
  };

  const renderMenuItem = ({ item }: { item: MenuItem }) => (
    <View style={styles.menuItem}>
      <Text style={styles.menuItemName}>{item.name}</Text>
      <Text style={styles.menuItemPrice}>${item.price.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => handleRemoveMenuItem(item.id)} style={styles.removeButton}>
        <Icon name="remove-circle" size={24} color="#F44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Menu</Text>
      <View style={styles.addItemContainer}>
        <TextInput
          style={styles.input}
          placeholder="Item name"
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={newItemPrice}
          onChangeText={setNewItemPrice}
          keyboardType="numeric"
        />
        <TouchableOpacity onPress={handleAddMenuItem} style={styles.addButton}>
          <Icon name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={menuItems}
        renderItem={renderMenuItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={<Text>No menu items. Add some above.</Text>}
      />
      <TouchableOpacity onPress={handleSaveMenu} style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Menu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  addItemContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#4CAF50',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    marginBottom: 10,
    borderRadius: 5,
  },
  menuItemName: {
    flex: 2,
    fontSize: 16,
  },
  menuItemPrice: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
  },
  removeButton: {
    marginLeft: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default EditMenuScreen;
