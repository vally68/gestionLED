import React, { useState, useEffect, useContext, createContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Provider } from 'react-redux';
import Store from './reducer/configStore';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './Screens/Home';
import Inscription from './Screens/Inscription';
import Connexion from './Screens/Connexion';
import Dashboard from './Screens/Dashboard';
import Event from './Screens/Event';
import Config from './Screens/Config';
import Ionicons from 'react-native-vector-icons/Ionicons';
import firebase from '@react-native-firebase/app';
import { AuthContext } from './fonction/AuthContext';
import registerNNPushToken from 'native-notify';

const AuthTab = createBottomTabNavigator();
const AppTab = createBottomTabNavigator();

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
        <AppTab.Navigator screenOptions={{ headerShown: false }}>
         <AppTab.Screen name="Config" component={Config} options={{
            tabBarLabel : 'Plages',
            tabBarIcon: () => (
                <Ionicons name="alarm-outline" color={"black"} size={30} />
            ),
        }}/>
        <AppTab.Screen name="Dashboard" component={Dashboard} options={{
            tabBarLabel : 'Gestion',
            tabBarIcon: () => (
                <Ionicons name="build-outline" color={"black"} size={30} />
            ),
        }}/>
        <AppTab.Screen name="Event" component={Event} options={{
            tabBarLabel : 'Evenement',
            tabBarIcon: () => (
                <Ionicons name="eye-outline" color={"black"} size={30} />
            ),
        }}/>
        </AppTab.Navigator>
    );
}

export default function App() {
    const [isLoggedin, setIsLoggedin] = useState(false);

    useEffect(() => {
        async function checkToken() {
            const userToken = await AsyncStorage.getItem('userToken');
            console.log("User Token:", userToken); // Ajout du log
            if (userToken) {
                console.log("User is logged in"); // Ajout du log
                setIsLoggedin(true);
            } else {
                console.log("User is not logged in"); // Ajout du log
            }
        }

        checkToken();
    }, []);

    console.log("isLoggedin:", isLoggedin); // Ajout du log

    return (
        <Provider store={Store}>
            <AuthContext.Provider value={{ isLoggedin, setIsLoggedin }}>
                <NavigationContainer style={styles.container}>
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