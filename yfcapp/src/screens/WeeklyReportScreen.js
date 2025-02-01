import React, { useState, useEffect } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { RadioButton } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import moment from 'moment';

const WeeklyProgressScreen = () => {
  const [devotionDays, setDevotionDays] = useState(0);
  const [metDisciple, setMetDisciple] = useState(null);
  const [wentToChurch, setWentToChurch] = useState(null);
  const [attendedBibleStudies, setAttendedBibleStudies] = useState(null);
  const [userName, setUserName] = useState('');
  const [isMonday, setIsMonday] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          const decoded = jwtDecode(token);
          setUserName(decoded.name); // Assuming 'name' is in the token
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };

    const checkSubmissionDay = async () => {
      const today = moment().isoWeekday(); // 1 (Monday) to 7 (Sunday)
      setIsMonday(today === 1);

      if (today === 1) {
        // Fetch previous week's progress
        try {
          const response = await axios.get(`http://localhost:5000/api/devotion/weeklyProgress/${userName}`);
          if (response.data) {
            setHasSubmitted(true);
          }
        } catch (error) {
          console.error('Error fetching progress:', error);
        }
      }
    };

    fetchUserData();
    checkSubmissionDay();
  }, [userName]);

  const calculateMarks = () => {
    let totalMarks = Number(devotionDays);
    if (metDisciple === 'yes') totalMarks += 1;
    if (wentToChurch === 'yes') totalMarks += 1;
    if (attendedBibleStudies === 'yes') totalMarks += 1;
    return totalMarks;
  };

  const submitProgress = async () => {
    if (!isMonday) {
      Alert.alert('Error', 'You can only submit progress on Mondays.');
      return;
    }

    if (hasSubmitted) {
      Alert.alert('Error', 'You have already submitted progress for last week.');
      return;
    }

    const lastWeekStart = moment().subtract(1, 'weeks').startOf('isoWeek').format('YYYY-MM-DD');
    const lastWeekEnd = moment().subtract(1, 'weeks').endOf('isoWeek').format('YYYY-MM-DD');

    const marks = calculateMarks();
    const data = {
      userName,
      devotionDays,
      metDisciple,
      wentToChurch,
      attendedBibleStudies,
      marks,
      weekStart: lastWeekStart,
      weekEnd: lastWeekEnd,
    };

    try {
      await axios.post('http://localhost:5000/api/devotion/weeklyProgress', data);
      setHasSubmitted(true);
      Alert.alert('Success', 'Progress Submitted Successfully!');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to submit progress');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Weekly Progress</Text>
      <Text style={styles.subtitle}>User: {userName}</Text>

      {!isMonday ? (
        <Text style={styles.warning}>You can submit your progress only on Mondays.</Text>
      ) : hasSubmitted ? (
        <Text style={styles.warning}>You have already submitted your progress for last week.</Text>
      ) : (
        <>
          <Text style={styles.label}>Number of days devotion done:</Text>
          <Picker
            selectedValue={devotionDays}
            onValueChange={(itemValue) => setDevotionDays(Number(itemValue))}
            style={styles.picker}
          >
            {[...Array(8).keys()].map(i => (
              <Picker.Item key={i} label={`${i} days`} value={i} />
            ))}
          </Picker>

          <Text style={styles.label}>Did you meet your disciple?</Text>
          <RadioButton.Group onValueChange={value => setMetDisciple(value)} value={metDisciple}>
            <View style={styles.radioButton}>
              <RadioButton value="yes" /><Text>Yes</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="no" /><Text>No</Text>
            </View>
          </RadioButton.Group>

          <Text style={styles.label}>Did you go to church?</Text>
          <RadioButton.Group onValueChange={value => setWentToChurch(value)} value={wentToChurch}>
            <View style={styles.radioButton}>
              <RadioButton value="yes" /><Text>Yes</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="no" /><Text>No</Text>
            </View>
          </RadioButton.Group>

          <Text style={styles.label}>Did you attend Bible studies?</Text>
          <RadioButton.Group onValueChange={value => setAttendedBibleStudies(value)} value={attendedBibleStudies}>
            <View style={styles.radioButton}>
              <RadioButton value="yes" /><Text>Yes</Text>
            </View>
            <View style={styles.radioButton}>
              <RadioButton value="no" /><Text>No</Text>
            </View>
          </RadioButton.Group>

          <TouchableOpacity style={styles.customButton} onPress={submitProgress}>
            <Text style={styles.customButtonText}>Submit</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#f9e3b1',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 10,
  },
  picker: {
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  radioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  warning: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  customButton: {
    backgroundColor: '#ff0d4f',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
  },
  customButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default WeeklyProgressScreen;
