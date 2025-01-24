import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';

const NoticeAddScreen = ({ navigation }) => {
    const [heading, setHeading] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAddNotice = async () => {
        if (!heading || !description) {
            Alert.alert('Error', 'Please fill out all fields.');
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post('https://yfcapp.onrender.com/api/notice/add', {
                heading,
                description,
            });

            Alert.alert('Success', 'Notice added successfully.');
            setHeading('');
            setDescription('');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding notice:', error);
            Alert.alert('Error', 'Failed to add notice.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Add a New Notice</Text>

            <TextInput
                style={styles.input}
                placeholder="Notice Heading"
                value={heading}
                onChangeText={setHeading}
            />
            <TextInput
                style={[styles.input, styles.descriptionInput]}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
                multiline
            />

            <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddNotice}
                disabled={loading}
            >
                <Text style={styles.addButtonText}>
                    {loading ? 'Publishing...' : 'Publish Notice'}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9e3b1', // Soft warm background
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
      },
      title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 25,
        textAlign: 'center',
        color: '#333',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        width: '100%',
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      },
      addButton: {
        backgroundColor: '#ff0d4f', // Attractive coral color
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      },
      addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
      },
});

export default NoticeAddScreen;
