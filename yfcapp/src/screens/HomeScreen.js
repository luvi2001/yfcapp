import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions, TouchableOpacity, Modal, FlatList, ScrollView, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [submissionData, setSubmissionData] = useState([]);
  const [liveStudies, setLiveStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const screenWidth = Dimensions.get('window').width;  // Define it here at the top of the function.

  const slides = [
    { image: require('../assets/image1.jpg'), text: 'Building a strong family.' },
    { image: require('../assets/image2.jpg'), text: 'Teamwork.' },
    { image: require('../assets/image3.jpg'), text: 'youth for christ' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlideIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const fetchUserNameFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) throw new Error('No token found');
      const decoded = jwtDecode(token);
      setUserName(decoded.name || decoded.userName || 'Unknown User');
    } catch (error) {
      console.error('Error decoding token:', error);
      Alert.alert('Error', 'Failed to decode token.');
    }
  };

  const fetchSubmissionData = async () => {
    try {
      const response = await axios.get('https://yfcapp.onrender.com/api/devotion/stats');
      const { totalUsers, submittedToday } = response.data;
      const submittedPercentage = ((submittedToday / totalUsers) * 100).toFixed(2);
      const notSubmittedPercentage = (100 - submittedPercentage).toFixed(2);

      setSubmissionData([ 
        { name: `Submitted (${submittedPercentage}%)`, count: submittedToday, color: '#4CAF50', legendFontColor: '#333', legendFontSize: 10 },
        { name: `Not Submitted (${notSubmittedPercentage}%)`, count: totalUsers - submittedToday, color: '#FF5722', legendFontColor: '#333', legendFontSize: 10 },
      ]);
    } catch (error) {
      console.error('Error fetching submission data:', error);
      Alert.alert('Error', 'Failed to fetch submission data.');
    }
  };

  const fetchLiveStudies = async () => {
    try {
      const response = await axios.get('https://yfcapp.onrender.com/api/bstudy/ongoing');
      setLiveStudies(response.data.data);
    } catch (error) {
      console.error('Error fetching live studies:', error);
      Alert.alert('Error', 'Failed to fetch live Bible studies.');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      const initializeScreen = async () => {
        setLoading(true);
        await fetchUserNameFromToken();
        await fetchSubmissionData();
        await fetchLiveStudies();
        setLoading(false);
      };
      initializeScreen();
    }, [])
  );

  const handleLiveStudiesClick = () => setModalVisible(true);

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
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
              width={screenWidth - 60}
              height={230}
              chartConfig={chartConfig}
              accessor="count"
              backgroundColor="transparent"
              paddingLeft="0"
              absolute
            />
          ) : (
            <Text>No submission data available.</Text>
          )}
        </View>

        <View style={styles.slideshowContainer}>
          <Image source={slides[currentSlideIndex].image} style={[styles.slideImage, { width: screenWidth - 40 }]} />
          <Text style={styles.slideText}>{slides[currentSlideIndex].text}</Text>
        </View>

        <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Live Bible Studies</Text>
            {liveStudies.length === 0 ? (
              <Text>No live studies available</Text>
            ) : (
              <FlatList
                data={liveStudies}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => (
                  <View style={styles.studyItem}>
                    <Text style={styles.studyText}>Conductor: {item.conductor}</Text>
                    <Text style={styles.studyText}>Location: {item.location}</Text>
                    <Text style={styles.studyText}>Start Time: {new Date(item.startTime).toLocaleString()}</Text>
                    <Text style={styles.studyText}>Status: {item.status}</Text>
                  </View>
                )}
              />
            )}
            <TouchableOpacity style={[styles.customButton, { marginTop: 20 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.customButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const chartConfig = {
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  backgroundGradientFrom: '#1E2923',
  backgroundGradientTo: '#08130D',
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f9e3b1',
   
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop:50,
  },
  liveStudiesContainer: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginTop:50,
  },
  liveStudiesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  slideshowContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  slideImage: {
    height: 200,
    borderRadius: 10,
  },
  slideText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  dashboard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    marginBottom: 20,
    alignItems: 'center',
  },
  dashboardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
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
