import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Image, ImageBackground } from 'react-native';
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
            <ImageBackground source={require('../assets/led.png')} style={styles.container}>

                <View style={styles.wifiButtonContainer}>
                    <MyButton 
                        onPress={this.wifiButton} 
                        val="WIFI"
                        style={styles.buttonTopCenter}
                    />
                </View>

                <View style={styles.buttonContainer}>
                    <MyButton 
                        onPress={this.connexionButton} 
                        val="Connexion"
                        style={styles.buttonBottom}
                    />
                    <MyButton 
                        onPress={this.inscriptionButton} 
                        val="Inscription"
                        style={styles.buttonBottom}
                    />
                </View>
            </ImageBackground>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: '#1F1E42',
        width: '100%',
        height: '100%',
    },
    wifiButtonContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        marginBottom: 20,
    },
    buttonBottom: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // 50% transparency
        borderRadius: 10,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    buttonTopCenter: {
        backgroundColor: 'rgba(255, 255, 255, 0.5)', // 50% transparency
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: 80, // made the button smaller
    }
});
