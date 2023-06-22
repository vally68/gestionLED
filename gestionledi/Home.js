import React from 'react';
import { SafeAreaView, StyleSheet, Text, Alert, View } from 'react-native';
import MyButton from '../Components/MyButton';
import NetInfo from "@react-native-community/netinfo";

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

    loadConnectionInfo = () =>
    {
        NetInfo.fetch().then(state => {
            this.setState({
                connectionInfo: state,


            });

        });

    }

    render()
    {
        const { connectionInfo, ssidString, isConnected } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <Text>
                    ACCUEIL
                </Text>
                <View style={styles.buttonContainer}>
                    <MyButton
                        onPress={this.connexionButton}
                        val="Connexion"
                    />
                    <MyButton
                        onPress={this.inscriptionButton}
                        val="Inscription"
                    />
                    <MyButton
                        onPress={this.loadConnectionInfo}
                        val="Afficher les informations de connexion"
                    />
                </View>
                {connectionInfo && (
                    <>
                        <View>
                            <Text>Type de connexion : {connectionInfo.type}</Text>
                            <Text>Connecté : {connectionInfo.isConnected ? 'Oui' : 'Non'}</Text>
                            {connectionInfo.type === 'wifi' && <Text>Nom du réseau (SSID) : {connectionInfo.details.ssid}</Text>}
                        </View>

                    </>
                )}
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
        },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    }
});