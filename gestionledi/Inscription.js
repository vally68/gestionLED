import React from 'react';
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { validateForm } from './fonction/outils';
import{connect} from "react-redux";
import * as SQLite from 'expo-sqlite';

class Inscription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nom: '',
            email: '',
            password: '',
            nomError: '',
            emailError: '',
            passwordError: ''
        };
    }

    handleSubmit = () => {
        console.log("click")

        const { nomError, emailError, passwordError } = validateForm(this.state.nom, this.state.email, this.state.password);

        if (nomError || emailError || passwordError) {
            this.setState({ nomError, emailError, passwordError });
        } else {
            console.log(this.props)
            const db = SQLite.openDatabase('database.db');
            db.transaction(tx => {
                tx.executeSql(`
                CREATE TABLE IF NOT EXISTS user (
                  id INTEGER PRIMARY KEY AUTOINCREMENT,
                  nom TEXT,
                  email TEXT,
                  password TEXT
                );
            `);

                // Insert user data after creating table
                tx.executeSql("insert into user (nom, email, password) values ( ?, ?, ?)", [this.state.nom, this.state.email, this.state.password]);
            });

            console.log(this.props)
            this.props.navigation.navigate('Connexion');
        }
    }


    render() {
        return (
            <View>
                <Text style={styles.header}>S'inscrire</Text>
                <Text>Inscription</Text>

                <TextInput
                    placeholder="nom"
                    returnKeyType="next"
                    value={this.state.nom}
                    onChangeText={text => this.setState({nom: text})}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10}}
                    autoCompleteType="nom"
                    onBlur={() => {
                        const { nomError } = validateForm(this.state.nom, '', '');
                        this.setState({ nomError });
                    }}
                />
                <Text style={styles.errorText}>{this.state.nomError}</Text>

                <View className={styles.view}></View>
                <TextInput
                    placeholder="Email"
                    returnKeyType="next"
                    value={this.state.email}
                    onChangeText={text => this.setState({email: text})}
                    style={{height: 40, borderColor: 'gray', borderWidth: 1, margin: 10}}
                    autoCompleteType="email"
                    onBlur={() => {
                        const { emailError } = validateForm('', this.state.email, '');
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
                        const { passwordError } = validateForm('', '', this.state.password);
                        this.setState({ passwordError });
                    }}
                />
                <Text style={styles.errorText}>{this.state.passwordError}</Text>
                <View className={styles.view}></View>
                <Button onPress={this.handleSubmit} style={styles.button} title="S'inscrire" />
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
const mapStateToProps = (state) =>{
    return state
}
export default connect(mapStateToProps) (Inscription)

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
});
