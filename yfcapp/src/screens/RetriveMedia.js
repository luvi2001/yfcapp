import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, Image, Linking, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const RetrieveMedia = () => {
  const [mediaData, setMediaData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMedia = async () => {
    try {
      setLoading(true); // Show loading indicator while fetching
      const response = await axios.get('http://192.168.8.169:5000/api/media/getmedia');
      setMediaData(response.data);
    } catch (error) {
      console.error('Error fetching media:', error);
      Alert.alert('Error', 'Failed to fetch media.');
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchMedia();
    }, [])
  );

  const openLink = (url) => {
    if (url) {
      Linking.openURL(url).catch(err => console.error('Failed to open link:', err));
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.mediaCard}>
      <Text style={styles.mediaHeading}>{item.title}</Text>
      <Image source={{ uri: item.photo }} style={styles.image} />
      <Text style={styles.mediaLink} onPress={() => openLink(item.videoLink)}>
        Watch Video
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (mediaData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No media available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Uploaded Media</Text>
      <FlatList
        data={mediaData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        numColumns={2} // Display media in two columns
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
    marginTop:50,
  },
  listContent: {
    paddingBottom: 16,
  },
  mediaCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    margin: 8,
    flex: 1, // To ensure items are evenly distributed
    maxWidth: '48%', // To allow spacing between columns
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
});

export default RetrieveMedia;
