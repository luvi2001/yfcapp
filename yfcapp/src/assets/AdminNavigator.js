import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Make sure to install expo/vector-icons
import HomeScreen from '../screens/HomeScreen';
import NoticeAddScreen from '../screens/NoticeAddScreen';
import RsourceLibraryScreen from '../screens/RsourceLibraryScreen';


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
            case 'Home':
              iconName = focused ? 'home' : 'home-outline'; // Home tab
              break;
            case 'AddDevotion':
              iconName = focused ? 'add-circle' : 'add-circle-outline'; // Add Food tab
              break;
              
            case 'AddBibleStudy':
              iconName = focused ? 'book' : 'book-outline'; // Add Food tab
              break;

            case 'Media':
                iconName = focused ? 'library' : 'library-outline'; // Add Food tab
                break;

            case 'Getnotices':
                iconName = focused ? 'notifications' : 'notifications-sharp'; // Add Food tab
                break;
  

          }

          // Return the icon component
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ headerShown: false }} 
      
      />
      <Tab.Screen 
        name="Addnotice" 
        component={NoticeAddScreen}
        options={{ headerShown: false }} 
      
      />

     <Tab.Screen 
        name="Library" 
        component={RsourceLibraryScreen}
        options={{ headerShown: false }} 
      
      />
    </Tab.Navigator>
  );
};

export default BottomTabNavigatorAdmin;
