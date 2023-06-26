import React, { useState, useEffect, useContext, createContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Provider } from 'react-redux';
import Store from './store/configStore';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './gestionledi/Home';
import Inscription from './gestionledi/Inscription';
import Connexion from './gestionledi/Connexion';
import Dashboard from './gestionledi/Dashboard';
import Event from './gestionledi/Event';
import Config from './gestionledi/Config';
import Ionicons from 'react-native-vector-icons/Ionicons';


const AuthTab = createBottomTabNavigator();
const AppTab = createBottomTabNavigator();

import { AuthContext } from './gestionledi/AuthContext';



function AuthNavigator() {
    return (
        <AuthTab.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
            <AuthTab.Screen name="Inscription" component={Inscription} options={{
            tabBarLabel : 'Inscription',
            tabBarIcon: () => (
              <Ionicons name="create" color={"black"} size={30} />
            )
        }}/>
            <AuthTab.Screen name="Home" component={Home} options={{
            tabBarLabel : 'Home',
            tabBarIcon: () => (
              <Ionicons name="home" color={"black"} size={30} />
            )
        }}
            />

            <AuthTab.Screen name="Connexion" component={Connexion} options={{
            tabBarLabel : 'Connexion',
            tabBarIcon: () => (
              <Ionicons name="log-in" color={"black"} size={30} />
            )
        }} 
            />
        </AuthTab.Navigator>
    );
}


function AppNavigator() {
    return (
        <AppTab.Navigator initialRouteName="Dashboard" screenOptions={{ headerShown: false }}>
            <AppTab.Screen name="Dashboard" component={Dashboard} options={{
            tabBarLabel : 'Dashboard',
            tabBarIcon: () => (
              <Ionicons name="book" color={"black"} size={30} />
            )
        }}/>
            <AppTab.Screen name="Event" component={Event} options={{
            tabBarLabel : 'Event',
            tabBarIcon: () => (
              <Ionicons name="hammer" color={"black"} size={30} />
            )
        }}/>
            <AppTab.Screen name="Config" component={Config} options={{
            tabBarLabel : 'Config',
            tabBarIcon: () => (
                <Ionicons name="settings" color={"black"} size={30} />
            )
        }}/>
        </AppTab.Navigator>
    );
}

export default function App() {
    const [isLoggedin, setIsLoggedin] = useState(false);

    useEffect(() => {
        async function checkToken() {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) {
                setIsLoggedin(true);
            }
        }

        checkToken();
    }, []);

    return (
        <Provider store={Store}>
            <AuthContext.Provider value={{ isLoggedin, setIsLoggedin }}>
                <NavigationContainer  style={styles.container}>
                    {isLoggedin ? <AppNavigator /> : <AuthNavigator />}
                </NavigationContainer>
                <View style={styles.container}>
                    <StatusBar style="auto" />
                </View>
            </AuthContext.Provider>
        </Provider>
    );
}

const styles = StyleSheet.create({
    container: 
    {
        flex: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F1E42',
    },
  });