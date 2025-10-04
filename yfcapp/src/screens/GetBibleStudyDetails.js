import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';

const BibleStudyScreen = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  // Fetch all users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('https://yfcapp.onrender.com/api/auth/users');
        setUsers(res.data);
      } catch (err) {
        console.error('Error fetching users:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch Bible Study reviews
  const fetchReviews = async () => {
    if (!selectedUser || !selectedMonth) return;
    setLoading(true);
    setSearched(true);
    try {
      const year = new Date().getFullYear();
      const res = await axios.get(
        'https://yfcapp.onrender.com/api/areview/by-month',
        { params: { userName: selectedUser, month: selectedMonth, year } }
      );
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View style={styles.innerContainer}>
            <Text style={styles.title}>Bible Study Reviews</Text>

            {/* User Picker */}
            <Text style={styles.label}>Select User:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedUser}
                onValueChange={(val) => setSelectedUser(val)}
                style={styles.picker}
              >
                <Picker.Item label="Select a user" value="" />
                {users.map((user) => (
                  <Picker.Item key={user._id} label={user.name} value={user.name} />
                ))}
              </Picker>
            </View>

            {/* Month Picker */}
            <Text style={styles.label}>Select Month:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={selectedMonth}
                onValueChange={(val) => setSelectedMonth(val)}
                style={styles.picker}
              >
                <Picker.Item label="Select a month" value="" />
                {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                  <Picker.Item key={m} label={`Month ${m}`} value={m} />
                ))}
              </Picker>
            </View>

            {/* Search Button */}
            <TouchableOpacity
              style={[
                styles.button,
                (!selectedUser || !selectedMonth) && styles.buttonDisabled,
              ]}
              onPress={fetchReviews}
              disabled={!selectedUser || !selectedMonth}
            >
              <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            {loading && <ActivityIndicator size="large" color="#00BFAE" style={{ marginTop: 20 }} />}
          </View>
        }
        data={reviews}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.reviewItem}>
            <Text style={styles.reviewWeek}>
              Week: {new Date(item.weekStart).toDateString()} → {new Date(item.weekEnd).toDateString()}
            </Text>
            <Text>Devotion Days: {item.devotionDays}</Text>
            <Text>Planning Meeting: {item.planningMeeting}</Text>
            <Text>Bible Study: {item.bibleStudy}</Text>
            {item.bibleStudy === 'no' && (
              <Text>Reason: {item.reason || item.otherReasonText}</Text>
            )}
            {item.bibleStudy === 'someoneelse' && (
              <Text>Completed by: {item.otherCompletedName}</Text>
            )}
            <Text>Discipler Meeting: {item.disciplerMeeting}</Text>
            <Text>
              Contribution: {item.contributionPaid}{' '}
              {item.contributionPaid === 'Yes'
                ? `(${item.contributionAmount})`
                : ''}
            </Text>
            <Text>Lesson: {item.commonLesson}</Text>
            <Text>Points: {item.points}/{item.maxPoints}</Text>

            {/* Member Activities */}
            {item.members?.length > 0 && (
              <View style={{ marginTop: 5 }}>
                <Text style={{ fontWeight: 'bold' }}>Members Activities:</Text>
                {item.members.map((m, index) => (
                  <Text key={index}>
                    Member: {m.memberId ? m.memberId.name : 'N/A'} | Bible Study: {m.activities.biblestudy ? '✔' : '✖'},
                    Discipleship: {m.activities.discipleship ? '✔' : '✖'},
                    Visiting: {m.activities.visiting ? '✔' : '✖'}
                  </Text>
                ))}
              </View>
            )}
          </View>
        )}
        ListEmptyComponent={
          searched && !loading && (
            <Text style={styles.noResultsText}>No reviews found for this month.</Text>
          )
        }
      />
    </View>
  );
};

export default BibleStudyScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9e3b1', padding: 20 },
  innerContainer: { alignItems: 'center', paddingBottom: 20 },
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
  picker: { height: 50, width: '100%' },
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
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  reviewItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  reviewWeek: { fontWeight: 'bold', marginBottom: 5 },
  noResultsText: { textAlign: 'center', fontSize: 16, color: '#999', marginTop: 20 },
});
