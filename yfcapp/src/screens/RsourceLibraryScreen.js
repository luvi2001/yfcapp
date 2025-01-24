import React, { useState } from 'react';
import { View, Button, TextInput, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';
import axios from 'axios';

export default function UploadMedia() {
  const [title, setTitle] = useState('');
  const [photo, setPhoto] = useState(null);
  const [videoLink, setVideoLink] = useState('');

  const selectPhoto = () => {
    launchImageLibrary({ mediaType: 'photo' }, (response) => {
      if (response.assets && response.assets.length > 0) {
        const photoAsset = response.assets[0];
        setPhoto(photoAsset);
      }
    });
  };

  const handleUpload = async () => {
    if (!title || !photo || !videoLink) {
      alert('Please enter a title, select a photo, and enter a video link.');
      return;
    }

    try {
      const base64Image = await fetch(photo.uri)
        .then(res => res.blob())
        .then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          });
        });

      const data = {
        title,
        photo: base64Image,
        videoLink,
      };

      const response = await axios.post('https://yfcapp.onrender.com/api/media/upload', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      alert('Upload successful');
    } catch (error) {
      alert('Upload failed');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Media</Text>
      <TextInput
        placeholder="Enter title"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={selectPhoto}>
        <Text style={styles.buttonText}>Select Photo</Text>
      </TouchableOpacity>
      {photo && (
        <Image
          source={{ uri: photo.uri }}
          style={styles.image}
        />
      )}
      <TextInput
        placeholder="Enter video link"
        value={videoLink}
        onChangeText={setVideoLink}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleUpload}>
        <Text style={styles.buttonText}>Upload</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9e3b1', // Soft warm background
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 25,
    textAlign: 'center',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    width: '100%',
    marginBottom: 15,
    borderRadius: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    backgroundColor: '#ff0d4f', // Attractive coral color
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  image: {
    width: 220,
    height: 220,
    marginVertical: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#ff7f50',
  },
});
