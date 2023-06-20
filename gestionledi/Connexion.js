import React, {useState, useEffect, useContext} from "react";
import { Button,  StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { validateForm, validateLoginForm } from "./fonction/outils";
import { LOGIN_SUCCESS } from '../store/reducer/UserReducer';
import * as SQLite from "expo-sqlite";
import { useDispatch } from 'react-redux';

import { AuthContext } from './AuthContext';



export default function Connexion({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [nom, setNom] = useState("");
    const [name, setName] = useState("");
    const [current_user, setCurrentUser] = useState("");

    const dispatch = useDispatch();

    const { setIsLoggedin } = useContext(AuthContext); // Déplacer le hook useContext ici

    const handleSubmit = () => {
        const { emailError, passwordError } = validateLoginForm(email, password);
        if (emailError || passwordError) {
            setEmailError(emailError);
            setPasswordError(passwordError);
        } else {
            const db = SQLite.openDatabase("database.db");
            console.log("je suis là");
            db.transaction((tx) => {
                tx.executeSql(
                    "select * from user where email = ? and password = ?",
                    [email, password],
                    (_, { rows: { _array } }) => {
                        console.log(_array);  // <-- Correction ici
                        console.log("ici aussi");
                        if (_array.length > 0) {
                            setIsLoggedin(true); // Utiliser le setIsLoggedin ici
                        } else {
                            setEmailError("Email incorrect");
                            setPasswordError("Mot de passe incorrect");
                        }
                    },
                    (_, err) => {
                        console.error(err);
                    }
                );
            });
        }
    };

    useEffect(() => {
        const db = SQLite.openDatabase("database.db");
        db.transaction((tx) => {
            tx.executeSql("select * from user", [], (_, { rows: { _array } }) =>
                console.log(_array)
            );
        });
    }, []);

    return (
        <View>
            <Text style={styles.header}>Se connecter</Text>
            <TextInput
                placeholder="Email"
                returnKeyType="next"
                value={email}
                onChangeText={setEmail}
                style={{ height: 40, borderColor: "gray", borderWidth: 1, margin: 10 }}
                autoCompleteType="email"
                onBlur={() => {
                    const { emailError } = validateForm("", email, "");
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
                style={{ height: 40, borderColor: "gray", borderWidth: 1, margin: 10 }}
                autoCompleteType="password"
                onBlur={() => {
                    const { passwordError } = validateForm("", "", password);
                    setPasswordError(passwordError);
                }}
            />
            <Text style={styles.errorText}>{passwordError}</Text>
            <Button
                onPress={handleSubmit} // Retirer navigation
                style={styles.button}
                title="Connexion"
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
        </View>
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
});
