import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import AdminHomeScreen from '../screens/AdminHomeScreen';
import NoticeAddScreen from '../screens/NoticeAddScreen';
import RsourceLibraryScreen from '../screens/RsourceLibraryScreen';
import AdminRetreiveMediScreen from '../screens/AdminRetreiveMediaScreen';
import DevotionSearchScreen from '../screens/DevotionDetails';
//import AdminDashboard from '../screens/ProgressScree';
import BibleStudyScreen from '../screens/GetBibleStudyDetails';

const Tab = createBottomTabNavigator();

const BottomTabNavigatorAdmin = ({ route }) => {
  

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5, // Adds a shadow effect
          height: 60, // Adjusts the height of the tab bar
        },
        tabBarActiveTintColor: '#ff0d4f', // Active tab color
        tabBarInactiveTintColor: '#7a7a7a', // Inactive tab color
        tabBarLabelStyle: {
          fontSize: 14,
          marginBottom: 5,
        },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          switch (route.name) {
            case 'AdminHome':
              iconName = focused ? 'home' : 'home-outline'; 
              break;
            case 'Devotion':
              iconName = focused ? 'hourglass' : 'hourglass-outline'; 
              break;
              
            case 'AddMedia':
              iconName = focused ? 'add-circle' : 'add-circle-outline'; 
              break;

            case 'Medias':
                iconName = focused ? 'library' : 'library-outline';
                break;

            case 'Addnotice':
                iconName = focused ? 'notifications' : 'notifications-sharp'; 
                break;

            case 'BStudy':
                iconName = focused ? 'book' : 'book-sharp'; 
                break;
  

          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="AdminHome" 
        component={AdminHomeScreen}
        options={{ headerShown: false }} 
      
      />
      <Tab.Screen 
        name="Addnotice" 
        component={NoticeAddScreen}
        options={{ headerShown: false }} 
      
      />

     <Tab.Screen 
        name="AddMedia" 
        component={RsourceLibraryScreen}
        options={{ headerShown: false }} 
      
      />

      <Tab.Screen 
        name="Medias" 
        component={AdminRetreiveMediScreen}
        options={{ headerShown: false }} 
      
      />

      <Tab.Screen 
        name="Devotion" 
        component={DevotionSearchScreen}
        options={{ headerShown: false }} 
      
      />
      
      <Tab.Screen 
        name="BStudy" 
        component={BibleStudyScreen}
        options={{ headerShown: false }} 
      
      />

    </Tab.Navigator>
  );
};

export default BottomTabNavigatorAdmin;
