import React, { useState, useEffect, useContext, createContext } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';
import { Provider } from 'react-redux';
import Store from './store/configStore';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';

import Inscription from './gestionledi/Inscription';
import Connexion from './gestionledi/Connexion';
import Dashboard from './gestionledi/Dashboard';
import Event from './gestionledi/Event';
import Config from './gestionledi/Config';

const Tab = createBottomTabNavigator();
const AuthContext = createContext();

function MyStack() {
    const { isLoggedin } = useContext(AuthContext);

    return (
        <Tab.Navigator initialRouteName="Inscription" >
            {!isLoggedin ? (
                <>
                    <Tab.Screen name="Inscription" component={Inscription} />
                    <Tab.Screen name="Connexion" component={Connexion} />
                </>
            ) : (
                <>
                    <Tab.Screen name="Dashboard" component={Dashboard} />
                    <Tab.Screen name="Event" component={Event} />
                    <Tab.Screen name="Config" component={Config} />
                </>
            )}
        </Tab.Navigator>
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
                <NavigationContainer>
                    <MyStack />
                </NavigationContainer>
                <View style={styles.container}>
                    <Image source={require('./assets/mei.png')} />
                    <Text>Val, c'est quand la suite de l'histoire ?</Text>
                    <StatusBar style="auto" />
                </View>
            </AuthContext.Provider>
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