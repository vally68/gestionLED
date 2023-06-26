import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Image } from 'react-native';
import { Provider } from 'react-redux';
import Store from './store/ConfigStore';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Home from './gestionledi/Home';
import Inscription from './gestionledi/Inscription';
import Connexion from './gestionledi/Connexion';
import Dashboard from './gestionledi/Dashboard';
import Event from './gestionledi/Event';
import Config from './gestionledi/Config';

const AuthTab = createBottomTabNavigator();
const AppTab = createBottomTabNavigator();

import { AuthContext } from './gestionledi/AuthContext';



function AuthNavigator() 
{
    return (
        <AuthTab.Navigator initialRouteName="Home">
            <AuthTab.Screen 
                name="Inscription" 
                component={Inscription} 
                options={
                    {
                    tabBarIcon:() => (
                        <Image 
                            source={require('./assets/inscription.png')} 
                            style={styles.icon}
                        />
                        ),
                    }
                } 
            />
            <AuthTab.Screen 
                name="Home" 
                component={Home} 
                options={
                    {
                        tabBarIcon:() => (
                            <Image 
                                source={require('./assets/connexion.png')} 
                                style={styles.icon}
                            />
                        ),
                    }
                }
            />

            <AuthTab.Screen 
                name="Connexion" 
                component={Connexion} 
                options={
                    {
                        tabBarIcon:() => (
                            <Image 
                                source={require('./assets/connexion.png')} 
                                style={styles.icon}
                            />
                        ),
                    }
                }
            />
        </AuthTab.Navigator>
    );
}


function AppNavigator() 
{
    return (
        <AppTab.Navigator initialRouteName="Dashboard">
            <AppTab.Screen
                name="Dashboard" 
                component={Dashboard}  
                options={
                    {
                        tabBarIcon:() => (
                        <Image 
                            source={require('./assets/dashboard.png')} 
                            style={styles.icon}
                        />
                        ),
                    }
                }
            />
            <AppTab.Screen 
                name="Event" 
                component={Event} 
                options={
                    {
                        tabBarIcon:() => (
                        <Image 
                            source={require('./assets/event.png')} 
                            style={styles.icon}
                        />
                        ),
                    }
                }
            />
            <AppTab.Screen 
                name="Config" 
                component={Config} 
                options={
                    {
                        tabBarIcon:() => (
                            <Image 
                                source={require('./assets/config.png')} 
                                style={styles.icon}/>
                            ),
                     }
                 }
            />
        </AppTab.Navigator>
    );
}


export default function App() 
{
    const [isLoggedin, setIsLoggedin] = useState(false);

    useEffect(() => 
    {
        async function checkToken() 
        {
            const userToken = await AsyncStorage.getItem('userToken');
            if (userToken) 
            {
                setIsLoggedin(true);
            }
        }
        checkToken();
    }, []);

    return (
        <Provider store={Store}>
            <AuthContext.Provider value={{ isLoggedin, setIsLoggedin }}>
                <NavigationContainer>
                    {isLoggedin ? <AppNavigator /> : <AuthNavigator />}
                </NavigationContainer>
                <View style={styles.container}>
                    <StatusBar style="auto" />
                </View>
            </AuthContext.Provider>
        </Provider>
    );
}

const styles = StyleSheet.create(
{
    container: 
    {
        flex: 0.05,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 40  ,
        height: 40,
        marginBottom: 1,
    },
});