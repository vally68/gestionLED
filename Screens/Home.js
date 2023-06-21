import React from 'react';
import { SafeAreaView, StyleSheet, Text, Alert, FlatList, View } from 'react-native';
import MyButton from '../Components/MyButton';
import WiFiReborn from 'react-native-wifi-reborn';

export default class Home extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            wifiList: [],
            showWifiList: false
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

    loadWifiList = () => 
    {
        WiFiReborn.loadWifiList((wifiStringList) => {
            var wifiArray = JSON.parse(wifiStringList);
            this.setState({
                wifiList: wifiArray,
                showWifiList: true
            });
        }, 
        (error) => {
            console.log(error);
        });
    }

    render() 
    {
        const { showWifiList, wifiList } = this.state;

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
                        onPress={this.loadWifiList} 
                        val="Afficher les réseaux WiFi"
                    />
                </View>
                {showWifiList && (
                    <FlatList
                        data={wifiList}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={({item}) => <Text>{item.SSID}</Text>}
                    />
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
