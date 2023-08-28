import React, { Component } from 'react';
import { Alert, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, ScrollView } from "react-native";
import { validateLoginForm } from "../fonction/outils";
import { AuthContext } from '../fonction/AuthContext';
import MyButton from "../Components/MyButton";
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';

class Connexion extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            emailError: "",
            passwordError: "",
        };
    }

    handleSubmit = async () => {
        const { email, password } = this.state;
        const { emailError, passwordError } = validateLoginForm(email, password);

        if (emailError || passwordError) {
            this.setState({
                emailError: emailError,
                passwordError: passwordError,
            });
        } else {
            const response = await fetch('https://cramoisy-nature.000webhostapp.com/getusers.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            console.log(data);  // Afficher le contenu de 'data' pour le débogage

            if (response.ok && data.token) {
                await AsyncStorage.setItem('userToken', data.token);
                this.context.setIsLoggedin(true);
            } else {
                Alert.alert('Erreur', data.message);
            }
        }
    };

    render() {
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
                        value={this.state.email}
                        onChangeText={(email) => this.setState({ email })}
                        style={styles.textinfo}
                        autoCompleteType="email"
                        onBlur={() => {
                            const { emailError } = validateLoginForm(this.state.email, '');
                            this.setState({ emailError });
                        }}
                    />
                    <Text style={styles.errorText}>{this.state.emailError}</Text>

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor="#FFFFFF"
                        returnKeyType="done"
                        value={this.state.password}
                        onChangeText={(password) => this.setState({ password })}
                        secureTextEntry
                        style={styles.textinfo}
                        autoCompleteType="password"
                        onBlur={() => {
                            const { passwordError } = validateLoginForm('', this.state.password);
                            this.setState({ passwordError });
                        }}
                    />
                    <Text style={styles.errorText}>{this.state.passwordError}</Text>

                    <MyButton
                        onPress={this.handleSubmit}
                        val="Connexion"
                        icon={<Icon name="log-in-outline" size={20} color="black" />}
                    />
                    <View style={styles.row}>
                        <TouchableOpacity
                            onPress={() =>
                                this.props.navigation.navigate("Dashboard", {
                                    name: this.state.nom,
                                })
                            }
                        ></TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.navigate("Inscription")}
                        >
                            <Text style={styles.link}>Mot de passe oublié?</Text>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }
}

Connexion.contextType = AuthContext;

const styles = StyleSheet.create({
    container:
        {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#13043a',
            marginTop: 35,
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

export default Connexion;

