import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  StyleSheet
} from "react-native";
import axios from "axios";
import Icon from "react-native-vector-icons/MaterialIcons"; // trash/delete icon

const AssignedMembersScreen = () => {
  const [assigned, setAssigned] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignedMembers = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://yfcapp.onrender.com/api/assigned");
      setAssigned(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching assigned members:", err);
      setLoading(false);
    }
  };

const handleDeleteMember = async (assignedId, memberId) => {
  Alert.alert("Confirm Delete", "Delete this member?", [
    { text: "Cancel", style: "cancel" },
    {
      text: "Delete",
      onPress: async () => {
        try {
          const res = await axios.delete(
            `https://yfcapp.onrender.com/api/assigned/${assignedId}/member/${memberId}`
          );
          setAssigned((prev) =>
            prev.map((a) => (a._id === assignedId ? res.data : a))
          );
        } catch (err) {
          console.error("Error deleting member:", err);
        }
      },
      style: "destructive",
    },
  ]);
};


  useEffect(() => {
    fetchAssignedMembers();
  }, []);

  if (loading) return <ActivityIndicator size="large" color="#00BFAE" />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assigned Members</Text>
      {assigned.length === 0 ? (
        <Text style={styles.noData}>No assigned members found.</Text>
      ) : (
<FlatList
  data={assigned}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.userText}>
          <Text style={{ fontWeight: "bold" }}>User:</Text>{" "}
          {item.username || item.userId?.name}
        </Text>
        <Text style={styles.userText}>
          <Text style={{ fontWeight: "bold" }}>Members:</Text>
        </Text>

        {item.members.map((m) => (
          <View key={m._id} style={styles.memberRow}>
            <Text style={styles.memberText}>{m.name}</Text>
            <TouchableOpacity
              onPress={() => handleDeleteMember(item._id, m._id)}
            >
              <Icon name="delete" size={22} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  )}
/>

      )}
    </View>
  );
};

export default AssignedMembersScreen;

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9e3b1" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 10, textAlign: "center" },
  noData: { textAlign: "center", color: "#555", marginTop: 20 },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
  },
  userText: { fontSize: 16, marginBottom: 5, color: "#333" },
  memberRow: {
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  marginVertical: 5,
  padding: 8,
  backgroundColor: "#f2f2f2",
  borderRadius: 8,
},
memberText: { fontSize: 15, color: "#333" },

});
