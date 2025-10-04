import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, ScrollView } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import axios from "axios";
import { BarChart, PieChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";

const screenWidth = Dimensions.get("window").width;

const WeeklyStatsScreen = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [stats, setStats] = useState(null);

  const fetchWeeklyStats = async () => {
    if (!startDate || !endDate) {
      Alert.alert("Error", "Please select both start and end dates.");
      return;
    }

    try {
      const response = await axios.post("https://yfcapp.onrender.com/api/progress/stats", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });
      setStats(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data.");
      console.error(error);
    }
  };

  return (
  <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
    <View style={styles.dashboard}>
        <Text style={styles.title}>📊 Weekly Progress Report</Text>

        {/* Date Pickers */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.dateButtonText}>📅 Select Start Date</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{startDate.toDateString()}</Text>
        {showStartDatePicker && (
          <DateTimePicker value={startDate} mode="date" onChange={(e, d) => {
            setShowStartDatePicker(false);
            if (d) setStartDate(d);
          }} />
        )}

        <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.dateButtonText}>📅 Select End Date</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{endDate.toDateString()}</Text>
        {showEndDatePicker && (
          <DateTimePicker value={endDate} mode="date" onChange={(e, d) => {
            setShowEndDatePicker(false);
            if (d) setEndDate(d);
          }} />
        )}

        <TouchableOpacity style={styles.button} onPress={fetchWeeklyStats}>
          <Text style={styles.buttonText}>📈 Get Weekly Stats</Text>
        </TouchableOpacity>

        {stats && (
          <>
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>📌 Total Reports: {stats.totalReports}</Text>
              <Text style={styles.resultText}>📌 Total Devotion Marks: {stats.totalDevotionMarks}/{stats.maxDevotionMarks}</Text>
              <Text style={styles.resultText}>📖 Devotion: {stats.devotionPercentage}%</Text>
              <Text style={styles.resultText}>📚 Bible Study: {stats.bibleStudyPercentage}%</Text>
              <Text style={styles.resultText}>🤝 Discipler Meeting: {stats.disciplerMeetingPercentage}%</Text>
              <Text style={styles.resultText}>🎯 Team Total: {stats.teamTotalPercentage}%</Text>
            </View>

            {/* Bar Chart */}
            <Text style={styles.chartTitle}>📊 Activity Percentages</Text>
            <BarChart
              data={{
                labels: ["Devotion","Bible Study", "Discipler"],
                datasets: [
                  {
                    data: [
                      parseFloat(stats.devotionPercentage),
                      parseFloat(stats.bibleStudyPercentage),
                      parseFloat(stats.disciplerMeetingPercentage),
                    ],
                  },
                ],
              }}
              width={screenWidth - 60}
              height={220}
              yAxisSuffix="%"
              chartConfig={{
                backgroundGradientFrom: "#0288d1",
                backgroundGradientTo: "#f06292",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(255,255,255,${opacity})`,
                labelColor: (opacity = 1) => `rgba(255,255,255,${opacity})`,
              }}
              style={styles.chart}
            />

            {/* Pie Chart */}
            <Text style={styles.chartTitle}>🥧 Team Total Performance</Text>
<PieChart
  data={[
    {
      name: "Performance",
      population: parseFloat(stats.teamTotalPercentage),
      color: "#ff0d4f",
      legendFontColor: "#333",
      legendFontSize: 10,
    },
    {
      name: "Remaining",
      population: 100 - parseFloat(stats.teamTotalPercentage),
      color: "#ccc",
      legendFontColor: "#333",
      legendFontSize: 10,
    },
  ]}
  width={screenWidth - 60}
  height={220}
  accessor="population"
  backgroundColor="transparent"
  paddingLeft="15"
  chartConfig={{
    backgroundColor: "#fff",
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // 👈 Add this
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  }}
/>


            {/* Usernames */}
            {stats.submittedBy?.length > 0 && (
              <>
                <Text style={styles.chartTitle}>🧑‍🤝‍🧑 Submitted By</Text>
                <View style={styles.usernameList}>
                  {stats.submittedBy.map((name, index) => (
                    <Text key={index} style={styles.usernameItem}>🔹 {name}</Text>
                  ))}
                </View>
              </>
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,          // 👈 This allows scrollable content
    padding: 20,
    backgroundColor: "#f9e3b1",
    alignItems: "center", // optional
  },
  dashboard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    width: "100%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    marginTop: 18,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ff0d4f",
  },
  dateButton: {
    backgroundColor: "#ff0d4f",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: 250,
    alignItems: "center",
  },
  dateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#444",
  },
  button: {
    backgroundColor: "#ff0d4f",
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    width: 250,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  resultContainer: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  resultText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#333",
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#444",
  },
  chart: {
    marginVertical: 10,
    borderRadius: 10,
  },
  usernameList: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 8,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  usernameItem: {
    fontSize: 15,
    color: "#555",
    marginBottom: 4,
  },
});

export default WeeklyStatsScreen;
