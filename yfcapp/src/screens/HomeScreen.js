import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Dimensions,
  TouchableOpacity,
  Modal,
  FlatList,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';
import Svg, { LinearGradient, Stop } from 'react-native-svg';

// Import images from assets
import image1 from '../assets/image1.jpg';
import image2 from '../assets/image2.jpg';
import image3 from '../assets/image3.jpg';

const HomeScreen = ({ navigation }) => {
  const [userName, setUserName] = useState('');
  const [submissionData, setSubmissionData] = useState([]);
  const [liveStudies, setLiveStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width - 40);
  const [refreshing, setRefreshing] = useState(false);

  const images = [image1, image2, image3];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onChange = () => {
      setScreenWidth(Dimensions.get('window').width - 40);
    };
    const subscription = Dimensions.addEventListener('change', onChange);
    return () => subscription.remove();
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
        {
          name: 'Submitted',
          count: submittedToday,
          percentage: submittedPercentage,
          color: '#4CAF50',
        },
        {
          name: 'NotSubmitted',
          count: totalUsers - submittedToday,
          percentage: notSubmittedPercentage,
          color: '#FF5722',
        },
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

  const fetchAllData = async () => {
    await fetchUserNameFromToken();
    await fetchSubmissionData();
    await fetchLiveStudies();
  };

  useFocusEffect(
    React.useCallback(() => {
      const initializeScreen = async () => {
        setLoading(true);
        await fetchAllData();
        setLoading(false);
      };
      initializeScreen();
    }, [])
  );

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllData();
    setRefreshing(false);
  };

  const handleLiveStudiesClick = () => setModalVisible(true);

  const handleLogout = async () => {
    Alert.alert('Confirm Logout', 'Are you sure you want to log out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        onPress: async () => {
          await AsyncStorage.removeItem('token');
          navigation.replace('Login');
        },
        style: 'destructive',
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContainer}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
    >
      <View style={styles.container}>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>

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
            <>
              <Svg height="90" width={screenWidth}>
                <LinearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <Stop offset="0%" stopColor="#FF5722" stopOpacity="1" />
                  <Stop offset="100%" stopColor="#4CAF50" stopOpacity="1" />
                </LinearGradient>
              </Svg>
              <PieChart
                data={submissionData}
                width={screenWidth}
                height={200}
                chartConfig={chartConfig}
                accessor="count"
                backgroundColor="transparent"
                paddingLeft="10"
                absolute
              />
              <View style={styles.statsContainer}>
                {submissionData.map((item, index) => (
                  <Text key={index} style={[styles.statsText, { color: item.color }]}>
                    {item.name}: {item.percentage}%
                  </Text>
                ))}
              </View>
            </>
          ) : (
            <Text>No submission data available.</Text>
          )}
        </View>

        <View style={styles.imageSlideshowContainer}>
          <Image source={images[currentImageIndex]} style={[styles.imageSlideshow, { width: screenWidth }]} />
        </View>

        <View style={styles.visionMissionContainer}>
          <Text style={styles.sectionTitle}>2025 Goals</Text>
          <Text style={styles.sectionText}>
            • 23 Bible Study Leaders{'\n'}
            • 2 New Areas{'\n'}
            • 300+ Community Members{'\n'}
            • 20+ Members in 2nd level{'\n'}
            • 2 New Tuition Areas
          </Text>
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
  backgroundGradientFrom: '#ffffff',
  backgroundGradientTo: '#ffffff',
  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  strokeWidth: 0,
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
  logoutButton: {
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  logoutButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 50,
  },
  liveStudiesContainer: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginTop: 50,
  },
  liveStudiesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  dashboard: {
    padding: 16,
    borderRadius: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
    alignItems: 'center',
  },
  dashboardText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  statsContainer: {
    marginTop: 10,
  },
  statsText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
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
  imageSlideshowContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageSlideshow: {
    height: 200,
    borderRadius: 10,
  },
  visionMissionContainer: {
    marginTop: 20,
    padding: 20,
    backgroundColor: '#e0f7fa',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00796b',
    textAlign: 'center',
  },
  sectionText: {
    fontSize: 18,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 24,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  studyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  studyText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default HomeScreen;
