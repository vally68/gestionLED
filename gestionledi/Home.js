import React from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
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
                <Text>
                    ACCUEIL
                </Text>
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
                {connectionInfo && (
                    <>
                        <View>
                            <Text>Type de connexion : {connectionInfo.type}</Text>
                            <Text>Connecté : {connectionInfo.isConnected ? 'Oui' : 'Non'}</Text>
                            {
                                connectionInfo.type === 'wifi' &&
                                <Text>Nom du réseau (SSID) : {connectionInfo.details.ssid}</Text>
                            }
                        </View>

                    </>
                )
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container:
        {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        }
});