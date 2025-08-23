import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Linking, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Icon package
import { launchImageLibrary } from 'react-native-image-picker'; // Import image picker

const AdminRetrieveMediaScreen = () => {
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); // To toggle edit mode
  const [editData, setEditData] = useState({}); // Data for the media to be edited
  const [newImage, setNewImage] = useState(null); // State for new image

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const response = await axios.get('https://yfcapp.onrender.com/api/media/getmedia');
      setMediaData(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
      Alert.alert('Error', 'Failed to fetch media.');
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedia();
    }, [])
  );

  const openLink = (url) => {
    if (url) {
      Linking.openURL(url).catch((err) => console.error('Failed to open link:', err));
    }
  };

  const deleteMedia = async (id) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this media?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await axios.delete(`https://yfcapp.onrender.com/api/media/delete/${id}`);
              fetchMedia();
              Alert.alert("Success", "Media deleted successfully!");
            } catch (error) {
              console.error("Error deleting media:", error);
              Alert.alert("Error", "Failed to delete media.");
            }
          },
        },
      ]
    );
  };

  const startEdit = (item) => {
    setEditMode(true);
    setEditData({ ...item });
    setNewImage(null); // Reset image when starting to edit
  };

  const handleUpdate = async () => {
    const { _id, title, photo, videoLink } = editData;
    const imageToUpdate = newImage || photo; // Use new image if selected, otherwise use the existing one
    try {
      const response = await axios.put(`https://yfcapp.onrender.com/api/media/update/${_id}`, { title, photo: imageToUpdate, videoLink });
      fetchMedia();
      setEditMode(false);
      Alert.alert("Success", "Media updated successfully!");
    } catch (error) {
      console.error("Error updating media:", error);
      Alert.alert("Error", "Failed to update media.");
    }
  };

  const handleImagePicker = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 1,
        includeBase64: false,
      },
      (response) => {
        if (response.didCancel) {
          console.log('User cancelled image picker');
        } else if (response.errorCode) {
          console.error('Image picker error: ', response.errorMessage);
        } else {
          setNewImage(response.assets[0].uri); // Set the picked image URI
        }
      }
    );
  };

  const renderItem = ({ item }) => (
    <View style={styles.mediaCard}>
      <Text style={styles.mediaHeading}>{item.title}</Text>
      <Image source={{ uri: item.photo }} style={styles.image} />
      <Text style={styles.mediaLink} onPress={() => openLink(item.videoLink)}>
        Watch Video
      </Text>
      <TouchableOpacity onPress={() => deleteMedia(item._id)} style={styles.deleteButton}>
        <Ionicons name="trash-outline" size={24} color="white" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => startEdit(item)} style={styles.editButton}>
        <Ionicons name="pencil-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Admin Media Management</Text>
        {mediaData.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No media available.</Text>
          </View>
        ) : (
          <FlatList
            data={mediaData}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderItem}
            numColumns={2}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />
        )}

        {editMode && (
          <View style={styles.editContainer}>
            <Text style={styles.editTitle}>Edit Media</Text>
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={editData.title}
              onChangeText={(text) => setEditData({ ...editData, title: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Video Link"
              value={editData.videoLink}
              onChangeText={(text) => setEditData({ ...editData, videoLink: text })}
            />
            {/* Image Picker */}
            <TouchableOpacity onPress={handleImagePicker} style={styles.imagePickerButton}>
              <Text style={styles.imagePickerButtonText}>Pick a New Image</Text>
            </TouchableOpacity>
            {newImage && (
              <Image source={{ uri: newImage }} style={styles.imagePreview} />
            )}
            <TouchableOpacity onPress={handleUpdate} style={styles.updateButton}>
              <Text style={styles.updateButtonText}>Update Media</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#f9e3b1',
    paddingBottom: 16,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9e3b1',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
    marginTop: 50,
  },
  listContent: {
    paddingBottom: 16,
  },
  mediaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    margin: 8,
    flex: 1,
    maxWidth: '48%',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    alignItems: 'center',
  },
  mediaHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    textAlign: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
    marginBottom: 8,
  },
  mediaLink: {
    fontSize: 14,
    color: 'blue',
    textDecorationLine: 'underline',
  },
  deleteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'red',
    borderRadius: 20,
    padding: 6,
  },
  editButton: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'orange',
    borderRadius: 20,
    padding: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#555',
  },
  editContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    marginTop: 20,
  },
  editTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
  },
  updateButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  imagePickerButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  imagePickerButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imagePreview: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 10,
  },
});

export default AdminRetrieveMediaScreen;
