import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const DevotionSearchScreen = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);
    const [devotions, setDevotions] = useState([]);
    const [totalHours, setTotalHours] = useState(0);
    const [weeklyHours, setWeeklyHours] = useState(0);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`http://192.168.8.169:5000/api/auth/users`);
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };
        fetchUsers();
    }, []);

    const fetchDevotions = async () => {
        try {
            const response = await axios.get(`http://192.168.8.169:5000/api/devotion/search`, {
                params: { 
                    name: selectedUser, 
                    startDate: startDate.toISOString().split('T')[0], 
                    endDate: endDate.toISOString().split('T')[0] 
                }
            });
            setDevotions(response.data.devotions);
            setTotalHours(response.data.totalHours);
            setWeeklyHours(response.data.weeklyHours);
        } catch (error) {
            console.error('Error fetching devotions:', error);
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                ListHeaderComponent={
                    <View style={styles.innerContainer}>
                        <Text style={styles.title}>Search Devotions</Text>

                        {/* User Picker */}
                        <Text style={styles.label}>Select User:</Text>
                        <View style={styles.pickerContainer}>
                            <Picker
                                selectedValue={selectedUser}
                                onValueChange={(itemValue) => setSelectedUser(itemValue)}
                                style={styles.picker}
                            >
                                <Picker.Item label="Select a user" value="" />
                                {users.map((user) => (
                                    <Picker.Item key={user._id} label={user.name} value={user.name} />
                                ))}
                            </Picker>
                        </View>

                        {/* Start Date Picker */}
                        <Text style={styles.label}>Start Date:</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartPicker(true)}>
                            <Text>{startDate.toISOString().split('T')[0]}</Text>
                        </TouchableOpacity>
                        {showStartPicker && (
                            <DateTimePicker
                                value={startDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowStartPicker(false);
                                    if (selectedDate) setStartDate(selectedDate);
                                }}
                            />
                        )}

                        {/* End Date Picker */}
                        <Text style={styles.label}>End Date:</Text>
                        <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndPicker(true)}>
                            <Text>{endDate.toISOString().split('T')[0]}</Text>
                        </TouchableOpacity>
                        {showEndPicker && (
                            <DateTimePicker
                                value={endDate}
                                mode="date"
                                display={Platform.OS === 'ios' ? 'inline' : 'default'}
                                onChange={(event, selectedDate) => {
                                    setShowEndPicker(false);
                                    if (selectedDate) setEndDate(selectedDate);
                                }}
                            />
                        )}

                        {/* Search Button */}
                        <TouchableOpacity style={styles.button} onPress={fetchDevotions}>
                            <Text style={styles.buttonText}>Search</Text>
                        </TouchableOpacity>

                        {/* Summary Results */}
                        <Text style={styles.resultText}>Total Devotion Minutes: {totalHours}</Text>
                        <Text style={styles.resultText}>Weekly Devotion Minutes: {weeklyHours}</Text>
                    </View>
                }
                data={devotions}
                keyExtractor={(item) => item._id}
                nestedScrollEnabled={true}  // Allow nested scrolling
                renderItem={({ item }) => (
                    <View style={styles.listItem}>
                        <Text style={styles.listText}>{item.date}: {item.passage} - {item.duration} mins</Text>
                    </View>
                )}
            />
        </View>
    );
};

export default DevotionSearchScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9e3b1',
        padding: 20,
    },
    innerContainer: {
        alignItems: 'center',
        paddingBottom: 20,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
        marginTop: 40,
    },
    label: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: '#333',
        alignSelf: 'flex-start',
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        width: '100%',
        marginBottom: 15,
        backgroundColor: '#fff',
        elevation: 2,
    },
    picker: {
        height: 50,
        width: '100%',
    },
    dateInput: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 12,
        width: '100%',
        marginBottom: 15,
        borderRadius: 8,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#ff0d4f',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    resultText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 5,
        color: '#333',
    },
    listItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    listText: {
        fontSize: 16,
        color: '#444',
    },
});
