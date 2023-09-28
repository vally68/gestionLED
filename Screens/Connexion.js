import React, { useState, useEffect, useContext } from 'react';
import { Dimensions, Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { validateLoginForm } from "../fonction/outils";
import { useDispatch } from 'react-redux';
import { AuthContext } from '../fonction/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import Logo from '../assets/logo.svg';
//import Biometrics from 'react-native-biometrics';
import init from 'react_native_mqtt';
import Paho from 'paho-mqtt'; 

const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


const Connexion = ({ navigation, route }) => {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nom, setNom] = useState("");
    const [availableSensor, setAvailableSensor] = useState(false);
    const [primaryColor, setPrimaryColor] = useState('red');
    const [mqttClient, setMqttClient] = useState(null);
    const dispatch = useDispatch();
    const { setIsLoggedin } = useContext(AuthContext);
/////////
    // MQTT

/////////

    useEffect(() => {
        if (route.params && route.params.email) {
            setEmail(route.params.email);
        }
    }, [route.params]);

    const initializeMQTTClient = () => 
  {
    const client = new Paho.Client('ws://10.31.251.58:9003/mqtt', 'Mobile Client');
    return client;
  };

  const onConnect = (client) => 
  {
    console.log('Connected to MQTT broker');

    // température

    client.subscribe('TEMP/value');
    client.subscribe('LUM/threshold');
    client.subscribe('PIR1/presence');
    client.subscribe('BOUTON/on_off');
    client.subscribe('ETATS/BoutonApp');
    client.subscribe('ETATS/BoutonPresenceApp');
    client.subscribe('ETATS/ConnectionStatus');
  }

     useEffect(() => 
      {
        const client = initializeMQTTClient()
        client.connect({ onSuccess: () => onConnect(client) });
        setMqttClient(client)
      }, [])

     const publishMessage = (messageText, topic) =>
  {

    if (!mqttClient) 
    {
      console.error('MQTT client not initialized');
      return;
    }

    console.log('Envoi message');
    mqttClient.subscribe(topic);
    const message = new Paho.Message(messageText);
    message.destinationName = topic;
    mqttClient.send(message);
  };


///////
  ///////// CONNEXION

/////////

    const handleSubmit = async () => {
        const { emailError, passwordError } = validateLoginForm(email, password);
        if (emailError || passwordError) {
            setEmailError(emailError);
            setPasswordError(passwordError);
        } else {
            const response = await fetch('http://10.31.251.58/api/recup.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });
            const data = await response.json();
            if (response.ok && data.token) {
                await AsyncStorage.setItem('userToken', data.token);
                setIsLoggedin(true);
                console.log("bouton connection appui")
                publishMessage("client connecter","ETATS/ConnectionStatus")
                navigation.navigate("Dashboard", {
                    name: nom,
                });
            } else {
                Alert.alert('Erreur', data.message);
            }
        }
    };

  /*  const handleBiometricLogin = async () => {
       try {
        const { available, biometryType } = await Biometrics.isSensorAvailable();
        setAvailableSensor(available);
        if (available && biometryType === Biometrics.TouchID) {
            const { success } = await Biometrics.simplePrompt('Connectez-vous avec votre empreinte digitale');
            if (success) {
                // Authentification réussie avec empreinte digitale
                console.log('Authentification par empreinte digitale réussie');
                publishMessage("client connecter","ETATS/ConnectionStatus")
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
    
    };*/

 
////////
 //////////  RENDER

//////////// 

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
             <Image
                    source={require('../assets/logo.png')}
                    style={styles.image}
                  />        
              { /* <Logo width={"100%"} height={"30%"} right={20} fill={primaryColor} viewBox= {`0 0 ${width} ${height}`} />*/}

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
                   {/*<TouchableOpacity onPress={handleBiometricLogin}>
                        {availableSensor ? (
                            <Text style={styles.biometricText}>Se connecter avec l'empreinte digitale</Text>
                        ) : null}
                    </TouchableOpacity>   */}

                    <TouchableOpacity onPress={() => navigation.navigate("Inscription")}>
                        <Text style={styles.link}>Mot de passe oublié?</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

////////  STYLESHEET   //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13043a',
        marginTop: 30,
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
    marginBottom: 20,
    marginTop: 30,
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
        borderColor: 'purple',
        color: '#FFFFFF',
        padding: 10,
    },
    loginButton: {
        backgroundColor: 'purple',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        borderWidth: 1,
        borderColor: "gray"
    },
    loginButtonText: {
        color: 'white',
        textAlign: 'center',
    },
    link: {
        color: 'red',
        left: 0,
        top: 20,
    },

});

export default Connexion;