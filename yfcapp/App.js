import React from 'react';
import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import AddDevotionScreen from './src/screens/AddDevotionScreen';
import BottomTabNavigator from './src/assets/BottomNavigator';
import AddBibleStudyScreen from './src/screens/AddBibleStudyScreen';
import NoticeAddScreen from './src/screens/NoticeAddScreen';
import NoticeListScreen from './src/screens/NoticeListScreen';
import RsourceLibraryScreen from './src/screens/RsourceLibraryScreen';
import RetrieveMedia from './src/screens/RetriveMedia';
import AdminLoginScreen from './src/screens/AdminLoginScreen';
import BottomTabNavigatorAdmin from './src/assets/AdminNavigator';
import AdminHomeScreen from './src/screens/AdminHomeScreen';
import AdminRetreiveMediScreen from './src/screens/AdminRetreiveMediaScreen';
import DevotionSearchScreen from './src/screens/DevotionDetails';
import WeeklyProgressScreen from './src/screens/WeeklyReportScreen';
import AdminDashboard from './src/screens/ProgressScree';
import BibleStudyScreen from './src/screens/GetBibleStudyDetails';

// Create the stack navigator
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        {/* Define screens as part of the stack */}
        <Stack.Screen 
          name="Login" 
          component={LoginScreen} 
          options={{ headerShown: false }} // Hides the header bar
        />
        <Stack.Screen name="Signup" component={SignUpScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="AddDevotion" component={AddDevotionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} options={{ headerShown: false }}/>
        <Stack.Screen name="AddBibleStudy" component={AddBibleStudyScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Addnotice" component={NoticeAddScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Getnotice" component={NoticeListScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AddMedia" component={RsourceLibraryScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Media" component={RetrieveMedia} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminLogin" component={AdminLoginScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminNav" component={BottomTabNavigatorAdmin} options={{ headerShown: false }}/>
        <Stack.Screen name="AdminHome" component={AdminHomeScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Medias" component={AdminRetreiveMediScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Devotion" component={DevotionSearchScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Progress" component={WeeklyProgressScreen} options={{ headerShown: false }}/>
        <Stack.Screen name="Stats" component={AdminDashboard} options={{ headerShown: false }}/>
        <Stack.Screen name="BStudy" component={BibleStudyScreen} options={{ headerShown: false }}/>

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
