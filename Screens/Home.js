import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import MyButton from '../Components/MyButton';
import NetInfo from "@react-native-community/netinfo";
import * as Location from 'expo-location'

export default class Home extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state =
            {
                connectionInfo: null,
            };
    }

    connexionButton = () =>
    {
        this.props.navigation.navigate("Connexion")
    }

    inscriptionButton = () =>
    {
        this.props.navigation.navigate("Inscription")
    }

    wifiButton = async () =>
    {
        // Request location permission
        await Location.requestForegroundPermissionsAsync();

        NetInfo.fetch("wifi").then(state =>
        {
            console.log("SSID", state.details.ssid);
            console.log("Is connected?", state.isConnected);
            this.setState(
                {
                    connectionInfo: state,
                }
            );
        });
    }

    render()
    {
        const { connectionInfo } = this.state;

        return (
            <SafeAreaView style={styles.container}>

            <Image
                source={require('../assets/logo.png')}
                style={styles.image}
            />

                <Text style={styles.title}>
                   
                </Text>


                {connectionInfo && (
                    <>
                        <View style={styles.textposition}>
                            <Text style={styles.textinfo}>Type de connexion : {connectionInfo.type}</Text>
                            <Text style={styles.textinfo}>Connecté : {connectionInfo.isConnected ? 'Oui' : 'Non'}</Text>
                            {
                                connectionInfo.type === 'wifi' &&
                                <Text style={styles.textinfo}>Nom du réseau (SSID) : {connectionInfo.details.ssid}</Text>
                            }
                        </View>

                    </>
                )
                }

                
                <MyButton
                    onPress={this.connexionButton}
                    val="Connexion"
                />
                <MyButton
                    onPress={this.inscriptionButton}
                    val="Inscription"
                />
                <MyButton
                    onPress={this.wifiButton}
                    val="WIFI"
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: 
    {
        flex: 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F1E42',
        marginTop: 35,
    },

    image: {
        width: 180,
        height: 180,
        marginBottom: 20,
    },

    title:
    {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 15,
    },

    textposition:
    {
        marginTop: 20,
        marginBottom: 20,
    },

    textinfo:
    {
        color: '#FFFFFF',
        textAlign: 'center',
    },
});
