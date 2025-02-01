import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddBibleStudyScreen = () => {
  const [conductor, setConductor] = useState('');
  const [location, setLocation] = useState('');
  const [studyId, setStudyId] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const loadStudySession = async () => {
      const storedStudyId = await AsyncStorage.getItem('studyId');
      const storedIsLive = await AsyncStorage.getItem('isLive');
      if (storedStudyId && storedIsLive === 'true') {
        setStudyId(storedStudyId);
        setIsLive(true);
        setMessage('Going live...');
      }
    };
    loadStudySession();
  }, []);

  const startMeeting = async () => {
    if (isLive) {
      Alert.alert('Error', 'A Bible study is already live. End the current study first.');
      return;
    }
    if (!conductor || !location) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      const response = await axios.post(
        'https://yfcapp.onrender.com/api/bstudy/bible-study/start',
        { conductor, location }
      );
      const newStudyId = response.data.id;
      setStudyId(newStudyId);
      setIsLive(true);
      setMessage('Going live...');
      await AsyncStorage.setItem('studyId', newStudyId);
      await AsyncStorage.setItem('isLive', 'true');
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
      await axios.post(`https://yfcapp.onrender.com/api/bstudy/bible-study/end/${studyId}`);
      setIsLive(false);
      setStudyId(null);
      setMessage('');
      setConductor('');
      setLocation('');
      await AsyncStorage.removeItem('studyId');
      await AsyncStorage.removeItem('isLive');
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
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9e3b1',
    padding: 20,
  },
  form: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
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
    backgroundColor: '#ff0d4f',
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
