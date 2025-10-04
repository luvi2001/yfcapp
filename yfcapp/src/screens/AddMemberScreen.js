import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons"; // back icon

const AddMemberScreen = () => {
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [userName, setUserName] = useState("");

  // refs for inputs (to blur after submit)
  const nameRef = useRef(null);
  const ageRef = useRef(null);
  const mobileRef = useRef(null);

  // Fetch user from token
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (token) {
          const decoded = jwtDecode(token);
          setUserName(decoded.name); // assuming token has name
        }
      } catch (err) {
        console.error("Error decoding token", err);
      }
    };
    fetchUser();
  }, []);

  const resetForm = () => {
    setName("");
    setAge("");
    setMobile("");

    // blur inputs so keyboard goes away
    nameRef.current?.blur();
    ageRef.current?.blur();
    mobileRef.current?.blur();
  };

  const handleSubmit = async () => {
    if (!name || !age || !mobile) {
      return Alert.alert("Validation", "All fields are required");
    }

    try {
      const token = await AsyncStorage.getItem("token");

      const res = await axios.post(
        "https://yfcapp.onrender.com/api/bstudy/add-member",
        { name, age, mobile },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Alert.alert("Success", res.data.message);
      resetForm(); // ✅ fully reset form
    } catch (err) {
      console.error(err);
      Alert.alert("Error", err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={28} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Add Bible Study Member</Text>
      <Text style={styles.subtitle}>User: {userName}</Text>

      <Text style={styles.label}>Member Name</Text>
      <TextInput
        ref={nameRef}
        placeholder="Enter member name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>Age</Text>
      <TextInput
        ref={ageRef}
        placeholder="Enter member age"
        style={styles.input}
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
      />

      <Text style={styles.label}>Mobile</Text>
      <TextInput
        ref={mobileRef}
        placeholder="Enter mobile number"
        style={styles.input}
        keyboardType="phone-pad"
        value={mobile}
        onChangeText={setMobile}
      />

      <TouchableOpacity style={styles.customButton} onPress={handleSubmit}>
        <Text style={styles.customButtonText}>Add Member</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9e3b1",
  },
  backButton: {
    position: "absolute",
    top: 40, // adjust for safe area
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 60,
    marginBottom: 20,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
  },
  customButton: {
    backgroundColor: "#ff0d4f",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
    alignItems: "center",
  },
  customButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default AddMemberScreen;
