import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddDevotionScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [date, setDate] = useState('');
    const [passage, setPassage] = useState('');
    const [duration, setDuration] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [loading, setLoading] = useState(true);  // Loading state

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const response = await axios.get('http://192.168.8.169:5000/api/devotion/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(response.data.name); // Fetch user's name
                const currentDate = new Date().toISOString().split('T')[0];
                setDate(currentDate); // Set current date

                // Check if the user has already submitted devotion for today
                const devotionResponse = await axios.get(`http://192.168.8.169:5000/api/devotion/check?userId=${response.data._id}&date=${currentDate}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // If the devotion has already been submitted for today, set isSubmitted to true
                if (devotionResponse.data.isSubmitted) {
                    setIsSubmitted(true);
                }
            } catch (error) {
                console.error('Error fetching user details:', error);
                Alert.alert('Error', 'Failed to fetch user details.');
            } finally {
                setLoading(false);  // Set loading to false after fetching data
            }
        };

        fetchUserDetails();
    }, []);

    const handleSubmit = async () => {
        if (!passage || !duration) {
            Alert.alert('Error', 'All fields are required.');
            return;
        }

        try {
            const token = await AsyncStorage.getItem('token');
            const response = await axios.post(
                'http://192.168.8.169:5000/api/devotion/add',
                {
                    name,
                    date,
                    passage,
                    duration: parseInt(duration), // Ensure duration is a number
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            Alert.alert('Success', 'Devotion updated successfully!');
            setPassage('');
            setDuration('');
            setIsSubmitted(true); // Mark as submitted
        } catch (error) {
            console.error('Error updating devotion:', error);
            Alert.alert('Error', 'Failed to update devotion.');
        }
    };

    // If loading, show loading indicator
    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    // If the user has already submitted the devotion today, show the message
    if (isSubmitted) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>You have already submitted your devotion for today!</Text>
                <TouchableOpacity style={styles.customButton} onPress={() => navigation.navigate('Home')}>
                    <Text style={styles.customButtonText}>Back to Home</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // If not submitted, show the devotion submission form
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Update Devotion</Text>

            <TextInput
                style={styles.input}
                value={name}
                editable={false}
                placeholder="Name"
            />
            <TextInput
                style={styles.input}
                value={date}
                editable={false}
                placeholder="Date"
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Devotion Passage (e.g., John 3:16)"
                value={passage}
                onChangeText={setPassage}
            />
            <TextInput
                style={styles.input}
                placeholder="Enter Duration (in minutes)"
                value={duration}
                onChangeText={setDuration}
                keyboardType="numeric"
            />

            {/* Custom button */}
            <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
                <Text style={styles.customButtonText}>Submit</Text>
            </TouchableOpacity>
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
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 20,
        borderRadius: 8,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
    },
    customButton: {
        backgroundColor: '#ff0d4f', // Button background color
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    customButtonText: {
        color: '#fff', // Button text color
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AddDevotionScreen;
