import React from "react";
import { Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import {validateForm, validateLoginForm} from './fonction/outils';
import {connect} from "react-redux";
import * as SQLite from 'expo-sqlite';




class Connexion extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: "",
            emailError: "",
            passwordError: "",
            nom:"",
            name:"",
            current_user:""
        };
    }


    handleSubmit = () => {
        const { emailError, passwordError } = validateLoginForm(this.state.email, this.state.password);

        if (emailError || passwordError) {
            this.setState({ emailError, passwordError });

        } else {
            const db = SQLite.openDatabase('database.db');
            console.log('je suis là')
            db.transaction(tx => {
                    tx.executeSql("select * from user where email = ? and password = ?",[this.state.email, this.state.password],
                        (_, { rows }) =>
                        {console.log(rows)
                            console.log('ici aussi')
                            this.props.navigation.navigate('Espacemembre')
                            this.setState({ emailError: "Email ou mot de passe incorrect", passwordError: "Email ou mot de passe incorrect" });
                        }


                    );
                }
            );

        }
    }


    render() {
        const db = SQLite.openDatabase('database.db');
        db.transaction(
            tx => {
                tx.executeSql("select* from user", [], (_, { rows: {_array } }) =>
                    console.log(_array)
                )
            }
        )
        return (
            <View>
                <Text style={styles.header}>Se connecter</Text>
                <Text>Connect</Text>
                <TextInput
                    placeholder="Email"
                    returnKeyType="next"
                    value={this.state.email}
                    onChangeText={text => this.setState({ email: text })}
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10 }}
                    autoCompleteType="email"
                    onBlur={() => {
                        const { emailError } = validateForm('', this.state.email, '');
                        this.setState({ emailError });
                    }}
                />
                <Text style={styles.errorText}>{this.state.emailError}</Text>
                <View class={styles.view}></View>
                <TextInput
                    placeholder="Password"
                    returnKeyType="done"
                    value={this.state.password}
                    onChangeText={text => this.setState({ password: text })}
                    secureTextEntry
                    style={{ height: 40, borderColor: 'gray', borderWidth: 1, margin: 10 }}
                    autoCompleteType="password"
                    nBlur={() => {
                        const { passwordError } = validateForm(  this.state.password);
                        this.setState({ passwordError });
                    }}
                />
                <Text style={styles.errorText}>{this.state.passwordError}</Text>
                <View class={styles.view}></View>
                <Button onPress={this.handleSubmit} style={styles.button} title="Connexion" />
                <View style={styles.row}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Espacemembre', {name: this.state.nom})}>

                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Accueil')}>
                        <Text style={styles.link}>mot de passe oublié?</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
};

const mapStateToProps = (state) => {
    return state
}
export default connect(mapStateToProps) (Connexion)

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
        color: 'red',
        marginHorizontal: 10,
    },
});
