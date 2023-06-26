import React from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { validateForm } from './fonction/outils';
import { connect } from "react-redux";
import * as SQLite from 'expo-sqlite';
import { ADD_USER } from '../store/reducer/UserReducer';
import MyButton from "../Components/MyButton";

const mapStateToProps = (state) => {
    return {
        // Mettez ici les propriétés du state que vous voulez passer en props
    };
};

class Inscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: '',
            prenom:'',
            email: '',
            password: '',
            nomError: '',
            emailError: '',
            passwordError: ''
        };
    }

    handleSubmit = () => {
        const formData = new FormData();
        formData.append("nom", this.state.nom);
        formData.append("prenom", this.state.prenom);
        formData.append("email", this.state.email);
        formData.append("password", this.state.password);

        fetch('https://cramoisy-nature.000webhostapp.com/registeruser.php', {
            method: 'POST',
            body: formData,
            headers: {
                "Content-Type": "multipart/form-data" // Utilisez "Content-Type" au lieu de "content-type"
            }
        })
            .then(response => response.json())
            .then(json => {
                if (json === false) {
                    Alert.alert(
                        'Erreur',
                        'L\'e-mail saisi existe déjà. Veuillez saisir une autre adresse mail ou récupérer votre mdp',
                        [
                            { text: 'OK', onPress: () => console.log('OK Pressed') },
                        ],
                        { cancelable: false }
                    );
                } else {
                    this.props.navigation.navigate('Connexion', { username: this.state.name });
                }
            })
            .catch(error => {
                console.error(error);
            });
    }

    render() {
        return (
            <View>
                <Text style={styles.header}>S'inscrire</Text>

                <TextInput
                    placeholder="nom"
                    returnKeyType="next"
                    value={this.state.nom}
                    onChangeText={text => this.setState({nom: text})}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10}}
                    autoCompleteType="nom"
                    onBlur={() => {
                        const { nomError } = validateForm(this.state.nom, '', '','');
                        this.setState({ nomError });
                    }}
                />
                <Text style={styles.errorText}>{this.state.nomError}</Text>


                <TextInput
                    placeholder="Prénom"
                    returnKeyType="next"
                    value={this.state.prenom}
                    onChangeText={text => this.setState({prenom: text})}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10}}
                    autoCompleteType="prenom"
                    onBlur={() => {
                        const { prenomError } = validateForm('',this.state.prenom, '','',);
                        this.setState({ prenomError });
                    }}
                />
                <Text style={styles.errorText}>{this.state.prenomError}</Text>

                <View className={styles.view}></View>
                <TextInput
                    placeholder="Email"
                    returnKeyType="next"
                    value={this.state.email}
                    onChangeText={text => this.setState({email: text})}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10}}
                    autoCompleteType="email"
                    onBlur={() => {
                        const { emailError } = validateForm('','', this.state.email, '');
                        this.setState({ emailError });
                    }}
                />
                <Text style={styles.errorText}>{this.state.emailError}</Text>

                <View className={styles.view}></View>
                <TextInput
                    placeholder="Password"
                    returnKeyType="done"
                    value={this.state.password}
                    onChangeText={text => this.setState({password: text})}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10}}
                    autoCompleteType="password"
                    secureTextEntry
                    onBlur={() => {
                        const { passwordError } = validateForm('', '', '',this.state.password);
                        this.setState({ passwordError });
                    }}
                />
                <Text style={styles.errorText}>{this.state.passwordError}</Text>

                <View className={styles.view}></View>
                <MyButton onPress={this.handleSubmit}  val="Valider l'inscription" />

                <View style={styles.row}>
                    <View className={styles.view}></View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Connexion')}>
                        <Text style={styles.link}></Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}

const mapDispatchToProps = (dispatch) => ({
    addUser: (user) => dispatch({ type: ADD_USER, value: user }),
});

export default connect(mapStateToProps, mapDispatchToProps)(Inscription);

const styles = StyleSheet.create({
    header: {
        fontSize: 25,
        color: "#337899",
        fontWeight: "bold",
        paddingVertical: 15,
        textAlign: "center",
    },
    errorText: {
        color: 'red',
        marginHorizontal: 10,
    },
    tinyLogo: {
        width: 100,
        height: 150,
        position: "absolute",
        margin: 155,
    },
    background:{},
});
