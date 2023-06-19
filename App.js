import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { Provider } from 'react-redux';
import Store from './store/configStore';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Inscription from './gestionledi/Inscription';
import Connexion from './gestionledi/Connexion';
import Dashboard from './gestionledi/Dashboard';
import Event from './gestionledi/Event';
import Config from './gestionledi/Config';
import {Image} from "react-native";

const Tab = createBottomTabNavigator();

function MyStack() {
  return (
      <Tab.Navigator initialRouteName="Inscription" >
        <Tab.Screen name="Inscription" component={Inscription} />
        <Tab.Screen name="Connexion" component={Connexion} />
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="Event" component={Event} />
        <Tab.Screen name="Config" component={Config} />
      </Tab.Navigator>
  );
}

export default function App() {
  return (
      <Provider store={Store}>
        <NavigationContainer>
          <MyStack />
        </NavigationContainer>
        <View style={styles.container}>
            <Image source={require('./assets/mei.png')} />
          <Text>Val, c'est quand la suite de l'histoire ?</Text>
          <StatusBar style="auto" />
        </View>
      </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 0.25,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
