import React, { useState, useEffect, useContext } from "react";
import { Alert, Button, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from "react-native";
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
            const response = await fetch('http://10.31.201.113/api/recup.php', {
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
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.image}
                />

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
            </ScrollView>
        </SafeAreaView>
    );
}


const styles = StyleSheet.create({
    container:
        {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1F1E42',
            marginTop: 35,
        },

    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingLeft: 80,
        paddingRight: 100,
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

    texttitle:
        {
            color: '#FFFFFF',
            fontWeight: 'bold',
            fontSize: 20,
            marginBottom: 30,
        },

    textinfo:
        {
            height: 40,
            width: 200,
            borderWidth: 1,
            borderColor: '#FFFFFF',
            color: '#FFFFFF',
            padding: 10,
        },

    link:
    {
        color: '#FFFFFF',
    }

});
