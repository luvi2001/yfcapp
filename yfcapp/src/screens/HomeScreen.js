import React, { useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions, TouchableOpacity, Modal, FlatList } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';

const HomeScreen = ({ navigation }) => {
    const [userName, setUserName] = useState('');
    const [submissionData, setSubmissionData] = useState([]);
    const [liveStudies, setLiveStudies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // Fetch user name from the token stored in AsyncStorage
    const fetchUserNameFromToken = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const decoded = jwtDecode(token);
            setUserName(decoded.name || decoded.userName || 'Unknown User');
        } catch (error) {
            console.error('Error decoding token:', error);
            Alert.alert('Error', 'Failed to decode token.');
        }
    };

    // Fetch devotion submission stats
    const fetchSubmissionData = async () => {
        try {
            const response = await axios.get('http://192.168.8.169:5000/api/devotion/stats');
            const { totalUsers, submittedToday } = response.data;

            const submittedPercentage = ((submittedToday / totalUsers) * 100).toFixed(2);
            const notSubmittedPercentage = (100 - submittedPercentage).toFixed(2);

            const data = [
                {
                    name: `Submitted (${submittedPercentage}%)`,
                    count: submittedToday,
                    color: '#4CAF50',
                    legendFontColor: '#333',
                    legendFontSize: 10,
                },
                {
                    name: `Not Submitted (${notSubmittedPercentage}%)`,
                    count: totalUsers - submittedToday,
                    color: '#FF5722',
                    legendFontColor: '#333',
                    legendFontSize: 10,
                },
            ];
            setSubmissionData(data);
        } catch (error) {
            console.error('Error fetching submission data:', error);
            Alert.alert('Error', 'Failed to fetch submission data.');
        }
    };

    // Fetch live Bible study data
    const fetchLiveStudies = async () => {
        try {
            const response = await axios.get('http://192.168.8.169:5000/api/bstudy/ongoing');
            console.log('Fetched live studies:', response.data); // Log the response to check the data format
            setLiveStudies(response.data.data); // Ensure this is an array of live studies
        } catch (error) {
            console.error('Error fetching live studies:', error);
            Alert.alert('Error', 'Failed to fetch live Bible studies.');
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            const initializeScreen = async () => {
                try {
                    setLoading(true);
                    await fetchUserNameFromToken();
                    await fetchSubmissionData();
                    await fetchLiveStudies();
                    setLoading(false);
                } catch (error) {
                    console.error('Error initializing screen:', error);
                }
            };
            initializeScreen();
        }, [])
    );

    // Handle the click event for the live studies button
    const handleLiveStudiesClick = () => {
        console.log("Live Studies button clicked"); // Debugging
        setModalVisible(true);
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    const screenWidth = Dimensions.get('window').width;

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.welcomeText}>Welcome {userName}!</Text>
                <TouchableOpacity onPress={handleLiveStudiesClick} style={styles.liveStudiesContainer}>
                    <Text style={styles.liveStudiesText}>
                        {liveStudies.length} {liveStudies.length === 1 ? 'Live Study' : 'Live Studies'}
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.dashboard}>
                <Text style={styles.dashboardText}>Devotion Submission Stats</Text>
                {submissionData.length > 0 ? (
                    <PieChart
                        data={submissionData}
                        width={screenWidth - 40}
                        height={230}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
                            backgroundGradientFrom: '#1E2923',
                            backgroundGradientTo: '#08130D',
                        }}
                        accessor="count"
                        backgroundColor="transparent"
                        paddingLeft="0"
                        absolute
                    />
                ) : (
                    <Text>No submission data available.</Text>
                )}
            </View>



            <Modal
  visible={modalVisible}
  animationType="slide"
  onRequestClose={() => setModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <Text style={styles.modalTitle}>Live Bible Studies</Text>

    {/* Debugging log to check if liveStudies is correctly set */}
    {console.log('Live studies data:', liveStudies)}

    {/* Check if liveStudies contains data */}
    {liveStudies.length === 0 ? (
      <Text>No live studies available</Text>
    ) : (
      <FlatList
        data={liveStudies}
        keyExtractor={(item) => item._id} // Ensure key is unique (using _id)
        renderItem={({ item }) => {
          // Debugging individual item to ensure data is correct
          console.log('Rendering study:', item);
          return (
            <View style={styles.studyItem}>
              <Text style={styles.studyText}>Conductor: {item.conductor}</Text>
              <Text style={styles.studyText}>Location: {item.location}</Text>
              <Text style={styles.studyText}>
                Start Time: {new Date(item.startTime).toLocaleString()}
              </Text>
              <Text style={styles.studyText}>Status: {item.status}</Text>
            </View>
          );
        }}
      />
    )}

    <TouchableOpacity
      style={[styles.customButton, { marginTop: 20 }]}
      onPress={() => setModalVisible(false)}
    >
      <Text style={styles.customButtonText}>Close</Text>
    </TouchableOpacity>
  </View>
</Modal>


        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#f9e3b1',
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    liveStudiesContainer: {
        backgroundColor: '#4CAF50',
        padding: 8,
        borderRadius: 5,
    },
    liveStudiesText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    dashboard: {
        backgroundColor: '#f9f9f9',
        padding: 16,
        borderRadius: 10,
        marginBottom: 20,
        alignItems: 'center',
        width: '100%',
        height:'40%',
        elevation: 1,
    },
    dashboardText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    buttonContainer: {
        marginTop: 20,
        width: '80%',
    },
    customButton: {
        backgroundColor: '#ff0d4f',
        padding: 12,
        borderRadius: 5,
        alignItems: 'center',
    },
    customButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: '#f9e3b1',
        padding: 16,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    studyItem: {
        backgroundColor: '#f1f1f1',
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
    },
    studyText: {
        fontSize: 16,
        color: '#333',
    },
});

export default HomeScreen;
