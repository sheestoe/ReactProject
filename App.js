import * as React from 'react';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Stepper from './stepper'
import {
  SafeAreaView,
  FlatList,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Badge } from '@rneui/themed';

function Gerador() {
  return (
    <Stepper />
  );
}

function SettingsScreen() {
  const settingsStyles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: StatusBar.currentHeight || 0,
    },
    item: {
      backgroundColor: '#b0ffba',
      padding: 20,
      marginVertical: 8,
      marginHorizontal: 16,
    },
    title: {
      fontSize: 24,
    },
  });

  const Item = ({ id, title }) => (
    <View style={settingsStyles.item}>
      <Text>{id}</Text>
      <Text style={settingsStyles.title}>{title}</Text>
    </View>
  );
  const [arr, setArr] = React.useState([])
  async function _retrieveData() {
    try {
      const value = await AsyncStorage.getItem('lastResult');
      if (value !== null) {
        setArr(JSON.parse(value).map((item, index) => ({ id: `${index}`, title: item.join(' - ') })));
      }
    } catch (error) {
      alert(error);
    }
  };

  useEffect(() => {
    setTimeout(function () {
      _retrieveData()
    }, 1000);
  }, [_retrieveData, arr]);
  return (
    <SafeAreaView style={settingsStyles.container}>
      <FlatList
        data={arr}
        renderItem={({ item }) => <Item id={item.id} title={item.title} />}
        keyExtractor={item => item.id}
      />
    </SafeAreaView>
  );
}
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Gerador') {
              iconName = focused
                ? 'cash-outline'
                : 'cash';
            } else if (route.name === 'Histórico') {
              iconName = focused
                ? 'receipt-outline'
                : 'receipt';
            }

            // You can return any component that you like here!
            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'green',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name="Gerador" component={Gerador} />
        <Tab.Screen name="Histórico" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
