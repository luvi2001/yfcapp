import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';

const AddBibleStudyScreen = () => {
  const [conductor, setConductor] = useState('');
  const [location, setLocation] = useState('');
  const [studyId, setStudyId] = useState(null); // For tracking ongoing study
  const [isLive, setIsLive] = useState(false);
  const [message, setMessage] = useState(''); // For live status messages

  const startMeeting = async () => {
    if (!conductor || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post(
        'http://192.168.8.169:5000/api/bstudy/bible-study/start',
        { conductor, location }
      );
      setStudyId(response.data.id);
      setIsLive(true);
      setMessage('Going live...');
      Alert.alert('Success', 'Bible study started!');
    } catch (error) {
      Alert.alert('Error', 'Could not start the Bible study');
    }
  };

  const endMeeting = async () => {
    if (!studyId) {
      Alert.alert('Error', 'No active study to end');
      return;
    }
    try {
      await axios.post(`http://192.168.8.169:5000/api/bstudy/bible-study/end/${studyId}`);
      setIsLive(false);
      setStudyId(null);
      setMessage('');
      setConductor('');
      setLocation('');
      Alert.alert('Success', 'Bible study ended!');
    } catch (error) {
      Alert.alert('Error', 'Could not end the Bible study');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        {message ? <Text style={styles.message}>{message}</Text> : null}
        <Text style={styles.label}>Conductor Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter conductor's name"
          value={conductor}
          onChangeText={setConductor}
          editable={!isLive}
        />
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter location"
          value={location}
          onChangeText={setLocation}
          editable={!isLive}
        />
        {!isLive ? (
          <TouchableOpacity style={styles.button} onPress={startMeeting}>
            <Text style={styles.buttonText}>Start Meeting</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.button} onPress={endMeeting}>
            <Text style={styles.buttonText}>End Meeting</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // Center the content vertically
    alignItems: 'center', // Center the content horizontally
    backgroundColor: '#f9e3b1', // Light background for better aesthetics
    padding: 20,
  },
  form: {
    width: '90%',
    backgroundColor: '#fff', // White background for the form
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5, // Adds shadow for Android
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333', // Darker text color for better readability
    fontWeight: 'bold',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#f8f8f8',
  },
  message: {
    fontSize: 18,
    color: 'green',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: '#ff0d4f', // Bright red button color
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddBibleStudyScreen;
