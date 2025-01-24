import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { useFocusEffect } from '@react-navigation/native';

const NoticeListScreen = () => {
    const [notices, setNotices] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchNotices = async () => {
        try {
            setLoading(true); // Show loading indicator while fetching
            const response = await axios.get('https://yfcapp.onrender.com/api/notice/get');
            setNotices(response.data);
        } catch (error) {
            console.error('Error fetching notices:', error);
            Alert.alert('Error', 'Failed to fetch notices.');
        } finally {
            setLoading(false); // Hide loading indicator
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchNotices();
        }, [])
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (notices.length === 0) {
        return (
            <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No notices available.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Published Notices</Text>
            <FlatList
                data={notices}
                keyExtractor={(item) => item._id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.noticeCard}>
                        <Text style={styles.noticeHeading}>{item.heading}</Text>
                        <Text style={styles.noticeDescription}>{item.description}</Text>
                        <Text style={styles.noticeDate}>
                            Published on: {new Date(item.date).toLocaleDateString()}
                        </Text>
                    </View>
                )}
                numColumns={2} // Display notices in two columns
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
        marginTop:30,
    },
    listContent: {
        paddingBottom: 16,
    },
    noticeCard: {
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
    },
    noticeHeading: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    noticeDescription: {
        fontSize: 14,
        marginBottom: 8,
        color: '#555',
    },
    noticeDate: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
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

export default NoticeListScreen;
