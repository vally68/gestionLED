import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { validateLoginForm } from "../fonction/outils";
import { useDispatch } from 'react-redux';
import { AuthContext } from '../fonction/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../assets/logo.svg';
import Biometrics from 'react-native-biometrics';
import init from 'react_native_mqtt';

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


export default function Connexion({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nom, setNom] = useState("");
    const [availableSensor, setAvailableSensor] = useState(false);
    const [primaryColor, setPrimaryColor] = useState('red');


    const dispatch = useDispatch();
    const { setIsLoggedin } = useContext(AuthContext);

    const handleSubmit = async () => {
        const { emailError, passwordError } = validateLoginForm(email, password);
        if (emailError || passwordError) {
            setEmailError(emailError);
            setPasswordError(passwordError);
        } else {
            // ... Your login logic ...

            if (response.ok && data.token) {
                await AsyncStorage.setItem('userToken', data.token);
                setIsLoggedin(true);
                navigation.navigate("Dashboard", {
                    name: nom,
                });
            } else {
                Alert.alert('Erreur', data.message);
            }
        }
    };

    const handleBiometricLogin = async () => {
    try {
        const { available, biometryType } = await Biometrics.isSensorAvailable();

        setAvailableSensor(available);

        if (available && biometryType === Biometrics.TouchID) {
            const { success } = await Biometrics.simplePrompt('Connectez-vous avec votre empreinte digitale');
            if (success) {
                // Authentification réussie avec empreinte digitale
                console.log('Authentification par empreinte digitale réussie');
                
                // Rediriger vers le tableau de bord après la connexion réussie
                navigation.navigate("Dashboard", {
                    name: nom,
                });
            } else {
                console.log("L'authentification par empreinte digitale a échoué");
            }
        } else {
            console.log("L'empreinte digitale n'est pas disponible sur cet appareil");
        }
    } catch (error) {
        console.error("Erreur lors de la vérification de l'empreinte digitale", error);
    }
    };

     function onMessageArrived(message) 
  {
    switch(message.topic) 
    {
      case 'TEMP/value':
        setTemperature(message.payloadString);
        if(temperature >= 10 && temperature <= 20)
        {
          setPrimaryColor('yellow');
        }
        else
        {
          if(temperature < 10)
          {
            setPrimaryColor('blue');
          }
          else
          {
            setPrimaryColor('red');
          }
        }
        
        break;
      case 'LUM/threshold':
        setBrightness(message.payloadString);
        break;
      case 'PIR1/presence':
        setPresence(message.payloadString);
        break;
      case 'BOUTON/on_off':
        setButtonState(message.payloadString);
        break;
    }
  }

        useEffect(() => 
      {
        init({
          size: 10000,
          storageBackend: AsyncStorage,
          defaultExpires: 1000 * 3600 * 24,
          enableCache: true,
          reconnect: true,
          sync : {}
        });

        const client = new Paho.MQTT.Client('10.31.251.144', 9002, 'username');
        client.connect({ onSuccess: () => onConnect(client) });
        client.onMessageArrived = onMessageArrived;

      }, [])


    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                
                <Logo width={"100%"} height={"30%"} right={20} fill={primaryColor} viewBox= {`0 0 ${width} ${height}`} />
              

                <Text style={styles.texttitle}>CONNEXION</Text>

                <TextInput
                    placeholder="Email"
                    placeholderTextColor="#FFFFFF"
                    returnKeyType="next"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.textinfo}
                    autoCompleteType="email"
                    onBlur={() => {
                        const { emailError } = validateLoginForm(email, '');
                        setEmailError(emailError);
                    }}
                />
                <Text style={styles.errorText}>{emailError}</Text>

                <TextInput
                    placeholder="Password"
                    placeholderTextColor="#FFFFFF"
                    returnKeyType="done"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={styles.textinfo}
                    autoCompleteType="password"
                    onBlur={() => {
                        const { passwordError } = validateLoginForm('', password);
                        setPasswordError(passwordError);
                    }}
                />
                <Text style={styles.errorText}>{passwordError}</Text>

                <TouchableOpacity style={styles.loginButton} onPress={handleSubmit}>
                    <Text style={styles.loginButtonText}>Connexion</Text>
                </TouchableOpacity>

                <View style={styles.row}>
                    <TouchableOpacity onPress={() => navigation.navigate("AppNavigator", { screen: "Dashboard", params: { name: nom } })} />

                   <TouchableOpacity onPress={handleBiometricLogin}>
                        {availableSensor ? (
                            <Text style={styles.biometricText}>Se connecter avec l'empreinte digitale</Text>
                        ) : null}
                    </TouchableOpacity>


                    <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
                        <Text style={styles.link}>Mot de passe oublié?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13043a',
        marginTop: 35,
    },

    biometricText: {
        color: '#FFFFFF',
        marginTop: 10,
        textDecorationLine: 'underline',
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    errorText: {
        color: "red",
        marginHorizontal: 10,
    },

    image: {
        width: 180,
        height: 180,
        marginBottom: 30,
    },

    texttitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 30,
    },

    textinfo: {
        height: 40,
        width: 200,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        color: '#FFFFFF',
        padding: 10,
    },

    loginButton: {
        backgroundColor: 'black',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },

    loginButtonText: {
        color: 'white',
        textAlign: 'center',
    },

    link: {
        color: 'red',
        left: 0,
    },
});
