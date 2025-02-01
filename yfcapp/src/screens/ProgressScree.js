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
      const response = await axios.post("http://192.168.8.169:5000/api/progress/stats", {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
      });

      setStats(response.data);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch data. Please try again.");
      console.error(error);
    }
  };

  const onStartDateChange = (event, selectedDate) => {
    setShowStartDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event, selectedDate) => {
    setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.dashboard}>
        <Text style={styles.title}>📊 Weekly Progress Report</Text>

        {/* Start Date Picker */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowStartDatePicker(true)}>
          <Text style={styles.dateButtonText}>📅 Select Start Date</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{startDate.toDateString()}</Text>

        {showStartDatePicker && (
          <DateTimePicker value={startDate} mode="date" display="default" onChange={onStartDateChange} />
        )}

        {/* End Date Picker */}
        <TouchableOpacity style={styles.dateButton} onPress={() => setShowEndDatePicker(true)}>
          <Text style={styles.dateButtonText}>📅 Select End Date</Text>
        </TouchableOpacity>
        <Text style={styles.dateText}>{endDate.toDateString()}</Text>

        {showEndDatePicker && (
          <DateTimePicker value={endDate} mode="date" display="default" onChange={onEndDateChange} />
        )}

        {/* Fetch Stats Button */}
        <TouchableOpacity style={styles.button} onPress={fetchWeeklyStats}>
          <Text style={styles.buttonText}>📈 Get Weekly Stats</Text>
        </TouchableOpacity>

        {stats && (
          <>
            {/* Display Stats Text */}
            <View style={styles.resultContainer}>
              <Text style={styles.resultText}>📌 Total Uploaded Reports: {stats.totalReports}</Text>
              <Text style={styles.resultText}>📌 Total Devotion Marks: {stats.maxDevotionMarks}</Text>
              <Text style={styles.resultText}>🎯 Achieved Devotion Marks: {stats.totalDevotionMarks}</Text>
              <Text style={styles.resultText}>📖 Devotion: {stats.devotionPercentage}%</Text>
              <Text style={styles.resultText}>🤝 Met Disciple: {stats.metDisciplePercentage}%</Text>
              <Text style={styles.resultText}>⛪ Church Attendance: {stats.wentToChurchPercentage}%</Text>
              <Text style={styles.resultText}>📚 Bible Study: {stats.attendedBibleStudiesPercentage}%</Text>
              <Text style={styles.resultText}>🎯 Team Total: {stats.teamTotalPercentage}%</Text>
            </View>

            {/* Bar Chart - Activity Percentages */}
            <Text style={styles.chartTitle}>📊 Activity Percentages</Text>
            <BarChart
              data={{
                labels: ["Devotion", "Disciple", "Church", "Bible Study"],
                datasets: [
                  {
                    data: [
                      parseFloat(stats.devotionPercentage),
                      parseFloat(stats.metDisciplePercentage),
                      parseFloat(stats.wentToChurchPercentage),
                      parseFloat(stats.attendedBibleStudiesPercentage),
                    ],
                  },
                ],
              }}
              width={screenWidth - 60} 
              height={220}
              yAxisSuffix="%"
              chartConfig={{
                backgroundColor: "#fff",
                backgroundGradientFrom: "#0288d1",
                backgroundGradientTo: "pink",
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(251, 245, 2, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              }}
              style={styles.chart}
            />

            {/* Pie Chart - Team Total Percentage */}
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
              chartConfig={{
                backgroundColor: "#fff",
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
            />
          </>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9e3b1",
   
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
    marginTop:18
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
});

export default WeeklyStatsScreen;
