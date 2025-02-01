import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet, Platform, ScrollView } from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const BibleStudyScreen = () => {
    const [conductors, setConductors] = useState([]);
    const [selectedConductor, setSelectedConductor] = useState('');
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartDatePicker, setShowStartDatePicker] = useState(false);
    const [showEndDatePicker, setShowEndDatePicker] = useState(false);
    const [bibleStudies, setBibleStudies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch conductors when component mounts
        axios
            .get('http://192.168.8.169:5000/api/bstudy/conductors') // Replace with your backend URL
            .then((response) => {
                setConductors(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching conductors:', error);
                setLoading(false);
            });
    }, []);

    const handleStartDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || startDate;
        setShowStartDatePicker(false);
        setStartDate(currentDate);
    };

    const handleEndDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || endDate;
        setShowEndDatePicker(false);
        setEndDate(currentDate);
    };

    const handleSearch = () => {
        const filterParams = {
            conductor: selectedConductor,
            startDate,
            endDate,
        };

        axios
            .get('http://192.168.8.169:5000/api/bstudy/fetch', { params: filterParams })  // API to fetch studies based on filters
            .then((response) => {
                setBibleStudies(response.data);
            })
            .catch((error) => {
                console.error('Error fetching Bible studies:', error);
            });
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#00BFAE" />
            ) : (
                <ScrollView style={styles.scrollContainer}>
                    <Text style={styles.title}>Search Bible Studies</Text>

                    {/* Conductor Picker */}
                    <Text style={styles.label}>Select a Conductor:</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={selectedConductor}
                            onValueChange={(itemValue) => setSelectedConductor(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Select a Conductor" value="" />
                            <Picker.Item label="All" value="all" />
                            {conductors.map((conductor, index) => (
                                <Picker.Item key={index} label={conductor} value={conductor} />
                            ))}
                        </Picker>
                    </View>

                    {/* Start Date Picker */}
                    <Text style={styles.label}>Start Date:</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowStartDatePicker(true)}>
                        <Text>{startDate.toISOString().split('T')[0]}</Text>
                    </TouchableOpacity>
                    {showStartDatePicker && (
                        <DateTimePicker
                            value={startDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={handleStartDateChange}
                        />
                    )}

                    {/* End Date Picker */}
                    <Text style={styles.label}>End Date:</Text>
                    <TouchableOpacity style={styles.dateInput} onPress={() => setShowEndDatePicker(true)}>
                        <Text>{endDate.toISOString().split('T')[0]}</Text>
                    </TouchableOpacity>
                    {showEndDatePicker && (
                        <DateTimePicker
                            value={endDate}
                            mode="date"
                            display={Platform.OS === 'ios' ? 'inline' : 'default'}
                            onChange={handleEndDateChange}
                        />
                    )}

                    {/* Search Button */}
                    <TouchableOpacity style={styles.button} onPress={handleSearch}>
                        <Text style={styles.buttonText}>Search</Text>
                    </TouchableOpacity>

                    {/* Bible Study Results */}
                    <View style={styles.resultsContainer}>
                        {bibleStudies.length > 0 ? (
                            <FlatList
                                data={bibleStudies}
                                keyExtractor={(item) => item._id}
                                renderItem={({ item }) => (
                                    <View style={styles.studyItem}>
                                        <Text style={styles.studyText}>
                                            {item.conductor} - {item.location}
                                        </Text>
                                        <Text style={styles.studyText}>
                                            {new Date(item.startTime).toLocaleString()} - {new Date(item.endTime).toLocaleString()}
                                        </Text>
                                        <Text style={styles.studyStatus}>Status: {item.status}</Text>
                                    </View>
                                )}
                            />
                        ) : (
                            <Text style={styles.noResultsText}>No studies found for the selected criteria.</Text>
                        )}
                    </View>
                </ScrollView>
            )}
        </View>
    );
};

export default BibleStudyScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9e3b1',
        padding: 20,
    },
    scrollContainer: {
        flex: 1,
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
        borderColor: '#00BFAE',
        borderRadius: 10,
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
    resultsContainer: {
        marginTop: 20,
        paddingBottom: 20,
    },
    studyItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '100%',
    },
    studyText: {
        fontSize: 16,
        color: '#444',
    },
    studyStatus: {
        fontSize: 14,
        color: '#888',
        fontStyle: 'italic',
    },
    noResultsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#999',
        marginTop: 20,
    },
});
