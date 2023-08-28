import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native';
import MyButton from '../Components/MyButton';
import NetInfo from "@react-native-community/netinfo";
import { MaterialIcons } from '@expo/vector-icons'; 
import * as Location from 'expo-location';

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            connectionInfo: null,
        };
    }

    handleConnexionButton = () => {
        this.props.navigation.navigate("Connexion");
    };

    handleInscriptionButton = () => {
        this.props.navigation.navigate("Inscription");
    };

    checkWifiStatus = async () => {
        // Request location permission
        await Location.requestForegroundPermissionsAsync();

        NetInfo.fetch("wifi").then(state => {
            console.log("SSID", state.details.ssid);
            console.log("Is connected?", state.isConnected);
            this.setState({ connectionInfo: state });
        });
    };

    componentDidMount() {
        this.intervalId = setInterval(this.checkWifiStatus, 10000);  // 10000 milliseconds = 10 seconds
    }

    componentWillUnmount() {
        clearInterval(this.intervalId);
    }

    render() {
        const { connectionInfo } = this.state;

        return (
            <SafeAreaView style={styles.container}>
                <Image
                    source={require('../assets/logo.png')}
                    style={styles.image}
                    resizeMode="cover"  // Ajout de cette ligne
                />
                {connectionInfo && (
                    <View style={styles.connectionInfoContainer}>
                        <Text style={styles.connectionInfoText}>
                            <MaterialIcons name="network-wifi" size={24} color="white" /> Nom du réseau (SSID) : {connectionInfo.details.ssid}
                        </Text>
                        <Text style={styles.connectionInfoText}>
                            <MaterialIcons name="network-check" size={24} color="white" /> Type de connexion : {connectionInfo.type}
                        </Text>
                        {connectionInfo.type === 'wifi' && (
                            <Text style={styles.connectionInfoText}>
                                <MaterialIcons name="wifi-tethering" size={24} color={connectionInfo.isConnected ? 'green' : 'red'} /> Connecté : {connectionInfo.isConnected ? 'Oui' : 'Non'}
                            </Text>
                        )}
                    </View>
                )}
            </SafeAreaView>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13043a',
        paddingTop: 35,
        paddingHorizontal: 20, 
        marginTop: 35,
    },
    image: {
        position: 'absolute',
        top: 150,
        right: -10,
        bottom: 0,
        left: 0,
        width: null, // Ajout de cette ligne
        height: null, // Ajout de cette ligne
    },
    connectionInfoContainer: {
        marginTop: -530, 
        marginBottom: 0,
        backgroundColor: 'transparent', // Couleur de fond avec opacité
        padding: 0,  // Réduisez le padding ici
        borderRadius: 15, 
        shadowColor: '#000', 
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.3,
        shadowRadius: 2,
        elevation: 4,
    },
    connectionInfoText: {
        color: '#FFFFFF',
        textAlign: 'center',
        fontSize: 14, 
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10, 
        lineHeight: 25,
    },
});

export default Home;
