import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Alert, Dimensions, TouchableOpacity, Modal, FlatList, ScrollView } from 'react-native';
import axios from 'axios';
import { PieChart } from 'react-native-chart-kit';
import { useNavigation } from '@react-navigation/native';

const AdminHomeScreen = () => {
  const [submissionData, setSubmissionData] = useState([]);
  const [liveStudies, setLiveStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const screenWidth = Dimensions.get('window').width;

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

  useEffect(() => {
    const initializeScreen = async () => {
      setLoading(true);
      await fetchSubmissionData();
      await fetchLiveStudies();
      setLoading(false);
    };
    initializeScreen();
  }, []);

  const handleLiveStudiesClick = () => setModalVisible(true);
  const navigateToKPI = () => navigation.navigate('Stats');

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
          <Text style={styles.welcomeText}>Welcome Admin!</Text>
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

        <TouchableOpacity style={styles.kpiButton} onPress={navigateToKPI}>
          <Text style={styles.kpiButtonText}>Show KPI</Text>
        </TouchableOpacity>

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
    marginTop: 80,
  },
  liveStudiesContainer: {
    backgroundColor: '#4CAF50',
    padding: 8,
    borderRadius: 5,
    marginTop: 80,
  },
  liveStudiesText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
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
  kpiButton: {
    backgroundColor: '#ff0d4f',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
    marginTop:30,
  },
  kpiButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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

export default AdminHomeScreen;
