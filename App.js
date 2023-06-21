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

const AuthTab = createBottomTabNavigator();
const AppTab = createBottomTabNavigator();

import { AuthContext } from './gestionledi/AuthContext';



function AuthNavigator() {
    return (
        <AuthTab.Navigator initialRouteName="Inscription">
            <AuthTab.Screen name="Inscription" component={Inscription} options={{tabBarIcon:
                    () => (<Image source={require('./assets/inscription.png')} style={styles.icon}/>
                    ),
            }} />

            <AuthTab.Screen name="Connexion" component={Connexion} options={{tabBarIcon:
                    () => (<Image source={require('./assets/connexion.png')} style={styles.icon}/>
                    ),
                }}
            />
        </AuthTab.Navigator>
    );
}


function AppNavigator() {
    return (
        <AppTab.Navigator initialRouteName="Dashboard">
            <AppTab.Screen name="Dashboard" component={Dashboard}  options={{tabBarIcon:
                    () => (<Image source={require('./assets/dashboard.png')} style={styles.icon}/>
                    ),
            }}/>
            <AppTab.Screen name="Event" component={Event} options={{tabBarIcon:
                    () => (<Image source={require('./assets/event.png')} style={styles.icon}/>
                    ),
            }}/>
            <AppTab.Screen name="Config" component={Config} options={{tabBarIcon:
                    () => (<Image source={require('./assets/config.png')} style={styles.icon}/>
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
                    {isLoggedin ? <AppNavigator /> : <AuthNavigator />}
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
        backgroundColor: '#ff2',
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        marginBottom: 10,
    },
});
