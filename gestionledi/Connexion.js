import React, { useState, useEffect, useContext } from "react";
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { validateForm, validateLoginForm } from "./fonction/outils";
import { LOGIN_SUCCESS } from '../store/reducer/UserReducer';
import { useDispatch } from 'react-redux';
import MyButton from "../Components/MyButton";
import { AuthContext } from './AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Connexion({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nom, setNom] = useState("");
    const [name, setName] = useState("");
    const [current_user, setCurrentUser] = useState("");

    const dispatch = useDispatch();

    const { setIsLoggedin } = useContext(AuthContext);


    const handleSubmit = async () => {

        const { emailError, passwordError } = validateLoginForm(email, password);
        if (emailError || passwordError) {
            setEmailError(emailError);
            setPasswordError(passwordError);
        } else {
            const response = await fetch('https://cramoisy-nature.000webhostapp.com/getusers.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({email, password}),
            });

            const data = await response.json();

            console.log(data);  // Afficher le contenu de 'data' pour le débogage

            if (response.ok && data.token) {
                await AsyncStorage.setItem('userToken', data.token);
                setIsLoggedin(true);
            } else {
                Alert.alert('Erreur', data.message);
            }
        }
    };


    return (
        <SafeAreaView style={styles.container}>
            <Image
                source={require('../assets/logo.png')}
                style={styles.image}
            />
            <Text style={styles.texttitle}>Page Connexion</Text>
            <TextInput
                placeholder="Email"
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
            <MyButton
                onPress={handleSubmit}
                val="Connexion"
            />
            <View style={styles.row}>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate("Dashboard", {
                            name: nom,
                        })
                    }
                ></TouchableOpacity>
                <TouchableOpacity
                    onPress={() => navigation.navigate("Inscription")}
                >
                    <Text style={styles.link}>Mot de passe oublié?</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        color: "#337899",
        fontWeight: "bold",
        paddingVertical: 15,
        textAlign: "center",
    },
    tinyLogo: {
        width: 100,
        height: 150,
        position: "absolute",
        margin: 155,
    },
    errorText: {
        color: "red",
        marginHorizontal: 10,
    },
    container:
        {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1F1E42',
        },

    texttitle:
        {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 20,
            marginBottom: 10,
        },

    textinfo:
        {
            height: 40,
            width: 200,
            margin: 12,
            borderWidth: 1,
            borderColor: '#FFFFFF',
            color: '#FFFFFF',
            padding: 10,
        },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20,
    },

});
