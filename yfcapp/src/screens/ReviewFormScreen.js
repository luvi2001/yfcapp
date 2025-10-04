import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { RadioButton } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import Checkbox from "expo-checkbox";

const ReviewFormScreen = () => {
  const [userName, setUserName] = useState("");
  const [devotionDays, setDevotionDays] = useState(0);
  const [planningMeeting, setPlanningMeeting] = useState(null);
  const [bibleStudy, setBibleStudy] = useState(null);
  const [reason, setReason] = useState("");
  const [otherReasonText, setOtherReasonText] = useState("");
  const [otherCompletedName, setOtherCompletedName] = useState("");
  const [disciplerMeeting, setDisciplerMeeting] = useState(null);
  const [contributionPaid, setContributionPaid] = useState(null);
  const [contributionAmount, setContributionAmount] = useState("");

  const [members, setMembers] = useState([]);
  const [memberProgress, setMemberProgress] = useState({});
  const [commonLesson, setCommonLesson] = useState("");
  const [customLesson, setCustomLesson] = useState("");

  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");

  const [topics, setTopics] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch user data and members
  const fetchUserData = async () => {
    try {
      setRefreshing(true);
      const token = await AsyncStorage.getItem("token");
      if (token) {
        const decoded = jwtDecode(token);
        setUserName(decoded.name);

        const res = await axios.get(
          "https://yfcapp.onrender.com/api/bstudy/my-members",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.data?.members) setMembers(res.data.members);

        const topicRes = await axios.get(
          "https://yfcapp.onrender.com/api/topics",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        if (topicRes.data?.topics) setTopics(topicRes.data.topics);

        // Calculate previous week start & end
        const now = new Date();
        const day = now.getDay();
        const diffToMonday = (day + 6) % 7 + 7;
        const prevMonday = new Date(now);
        prevMonday.setDate(now.getDate() - diffToMonday);
        const prevSunday = new Date(prevMonday);
        prevSunday.setDate(prevMonday.getDate() + 6);

        setWeekStart(prevMonday.toDateString());
        setWeekEnd(prevSunday.toDateString());
      }
    } catch (err) {
      console.error("Error fetching data", err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const toggleActivity = (memberId, activity) => {
    setMemberProgress((prev) => {
      const prevActivities = prev[memberId]?.activities || {};
      return {
        ...prev,
        [memberId]: {
          ...prev[memberId],
          activities: {
            ...prevActivities,
            [activity]: !prevActivities[activity],
          },
        },
      };
    });
  };

  const handleSubmit = async () => {
    if (!userName) return Alert.alert("Error", "User not found");
    if (bibleStudy === "no" && !reason)
      return Alert.alert("Error", "Please select a reason for not doing Bible study");
    if (bibleStudy === "no" && reason === "other" && !otherReasonText)
      return Alert.alert("Error", "Please enter the reason");
    if (contributionPaid === "Yes" && !contributionAmount)
      return Alert.alert("Error", "Please enter contribution amount");

    const payload = {
      userName,
      devotionDays,
      planningMeeting,
      bibleStudy,
      reason: bibleStudy === "no" ? reason : "",
      otherReasonText:
        bibleStudy === "no" && reason === "other" ? otherReasonText : "",
      otherCompletedName:
        bibleStudy === "someoneelse" ? otherCompletedName : "",
      disciplerMeeting,
      contributionPaid,
      contributionAmount: contributionPaid === "Yes" ? contributionAmount : null,
      commonLesson: commonLesson === "other" ? customLesson : commonLesson,
      weekStart,
      weekEnd,
      members: Object.keys(memberProgress).map((id) => ({
        memberId: id,
        activities: memberProgress[id].activities || {},
      })),
    };

    try {
      const token = await AsyncStorage.getItem("token");
      const response = await axios.post(
        "https://yfcapp.onrender.com/api/review/submit",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", response.data.message || "Review form submitted!");
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.message || "Submission failed";
      Alert.alert("Error", errorMsg);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={fetchUserData} />
      }
    >
      <Text style={styles.title}>Review Form</Text>
      <Text style={styles.subtitle}>User: {userName}</Text>
      <Text style={styles.weekLabel}>
        Week: {weekStart ? new Date(weekStart).toDateString() : ""} →{" "}
        {weekEnd ? new Date(weekEnd).toDateString() : ""}
      </Text>

      {/* Devotion Days */}
      <Text style={styles.label}>1. Devotion days (0–7)</Text>
      <Picker
        selectedValue={devotionDays}
        onValueChange={(v) => setDevotionDays(Number(v))}
        style={styles.picker}
      >
        {[...Array(8).keys()].map((i) => (
          <Picker.Item key={i} label={`${i} days`} value={i} />
        ))}
      </Picker>

      {/* Planning meeting */}
      <Text style={styles.label}>2. Attended planning meeting?</Text>
      <RadioButton.Group
        onValueChange={setPlanningMeeting}
        value={planningMeeting}
      >
        <View style={styles.radioButton}>
          <RadioButton value="yes" />
          <Text>Yes</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton value="no" />
          <Text>No</Text>
        </View>
      </RadioButton.Group>

      {/* Bible Study */}
      <Text style={styles.label}>3. Did you do your Bible study?</Text>
      <RadioButton.Group onValueChange={setBibleStudy} value={bibleStudy}>
        <View style={styles.radioButton}>
          <RadioButton value="yes" />
          <Text>Yes</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton value="no" />
          <Text>No</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton value="someoneelse" />
          <Text>Someone else completed</Text>
        </View>
      </RadioButton.Group>

      {/* Members + Lessons for Yes/Someone Else */}
      {(bibleStudy === "yes" || bibleStudy === "someoneelse") && (
        <View>
          <Text style={styles.label}>Members under you:</Text>
          {members.map((m) => (
            <View key={m._id} style={styles.memberBox}>
              <Text style={{ fontWeight: "600", marginBottom: 5 }}>
                {m.name}
              </Text>
              {["biblestudy", "discipleship", "visiting"].map((act) => (
                <View key={act} style={styles.checkboxContainer}>
                  <Checkbox
                    value={!!memberProgress[m._id]?.activities?.[act]}
                    onValueChange={() => toggleActivity(m._id, act)}
                  />
                  <Text style={styles.checkboxLabel}>{act}</Text>
                </View>
              ))}
            </View>
          ))}

          {/* Lesson */}
          <Text style={styles.label}>What lesson did you teach?</Text>
          <Picker
            selectedValue={commonLesson}
            onValueChange={(v) => setCommonLesson(v)}
            style={styles.picker}
          >
            <Picker.Item label="Select a lesson" value="" />
            {topics.map((t) => (
              <Picker.Item key={t._id} label={t.title} value={t.title} />
            ))}
            <Picker.Item label="Other" value="other" />
          </Picker>
          {commonLesson === "other" && (
            <TextInput
              placeholder="Enter custom lesson topic"
              value={customLesson}
              onChangeText={setCustomLesson}
              style={styles.input}
            />
          )}
        </View>
      )}

      {/* Extra field for Someone Else */}
      {bibleStudy === "someoneelse" && (
        <View>
          <Text style={styles.label}>Who completed?</Text>
          <TextInput
            placeholder="Enter their name"
            value={otherCompletedName}
            onChangeText={setOtherCompletedName}
            style={styles.input}
          />
        </View>
      )}

      {/* Reason for NO */}
      {bibleStudy === "no" && (
        <View>
          <Text style={styles.label}>Reason for not doing:</Text>
          <Picker
            selectedValue={reason}
            onValueChange={setReason}
            style={styles.picker}
          >
            <Picker.Item label="Select reason" value="" />
            <Picker.Item label="Sick" value="sick" />
            <Picker.Item label="Work" value="work" />
            <Picker.Item label="Personal" value="personal" />
            <Picker.Item label="Members didn’t come" value="membersdidntcome" />
            <Picker.Item label="Other" value="other" />
          </Picker>
          {reason === "other" && (
            <TextInput
              placeholder="Enter your reason"
              value={otherReasonText}
              onChangeText={setOtherReasonText}
              style={styles.input}
            />
          )}
        </View>
      )}

      {/* Discipler Meeting */}
      <Text style={styles.label}>5. Did you meet your discipler?</Text>
      <RadioButton.Group
        onValueChange={setDisciplerMeeting}
        value={disciplerMeeting}
      >
        <View style={styles.radioButton}>
          <RadioButton value="yes" />
          <Text>Yes</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton value="no" />
          <Text>No</Text>
        </View>
      </RadioButton.Group>

      {/* Contribution */}
      <Text style={styles.label}>6. Did you give the contribution?</Text>
      <RadioButton.Group
        onValueChange={setContributionPaid}
        value={contributionPaid}
      >
        <View style={styles.radioButton}>
          <RadioButton value="Yes" />
          <Text>Yes</Text>
        </View>
        <View style={styles.radioButton}>
          <RadioButton value="No" />
          <Text>No</Text>
        </View>
      </RadioButton.Group>
      {contributionPaid === "Yes" && (
        <TextInput
          placeholder="Enter amount"
          keyboardType="numeric"
          value={contributionAmount}
          onChangeText={setContributionAmount}
          style={styles.input}
        />
      )}

      <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
        <Text style={styles.customButtonText}>Submit Review</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f9e3b1" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  subtitle: { fontSize: 18, fontWeight: "600", textAlign: "center",color:'#ff0d4f'},
  weekLabel: { fontSize: 16, fontWeight: "500", marginBottom: 15, textAlign: "center",color:'#ff0d4f' },
  label: { fontSize: 16, fontWeight: "500", marginTop: 10 },
  picker: { backgroundColor: "#fff", borderRadius: 8, marginVertical: 10,height:40 },
  radioButton: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginVertical: 8,
  },
  memberBox: { padding: 10, backgroundColor: "#fff", borderRadius: 8, marginBottom: 15 },
  checkboxContainer: { flexDirection: "row", alignItems: "center", marginBottom: 5 },
  checkboxLabel: { marginLeft: 8, fontSize: 16 },
  customButton: {
    backgroundColor: "#ff0d4f",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
    marginBottom:42
  },
  customButtonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

export default ReviewFormScreen;
