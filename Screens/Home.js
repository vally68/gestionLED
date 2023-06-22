import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert, PermissionsAndroid } from 'react-native';
import MyButton from '../Components/MyButton';
import NetInfo from "@react-native-community/netinfo";
import * as Location from 'expo-location'
import { express } from 'express';
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

    componentDidMount()
    {
        this.useEffect()
    }


    async useEffect()
    {
        const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      console.log('Location permission granted', location);

      const connection = mysql.createPool({
        host     : '10.31.201.113:3306', // Your connection adress (localhost).
        user     : 'serfa_etudiants',     // Your database's username.
        password : '0123456789',        // Your database's password.
        database : 'Projet_Led'   // Your database's name.
      });
      
      // Starting our app.
      const app = express();
      
      // Creating a GET route that returns data from the 'users' table.
      app.get('/users', function (req, res) {
          // Connecting to the database.
          connection.getConnection(function (err, connection) {
      
          // Executing the MySQL query (select all data from the 'users' table).
          connection.query('SELECT * FROM users', function (error, results, fields) {
            // If some error occurs, we throw an error.
            if (error) throw error;
      
            // Getting the 'response' from the database and sending it to our route. This is were the data is.
            res.send(results)
          });
        });
      });
      
      // Starting our server.
      app.listen(3000, () => {
       console.log('Go to http://l10.31.201.113:3306/users so you can see the data.');
      });

      fetch('http://l10.31.201.113:3306/users').then(response => response.json()).then(data => console.log(data))
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
        /*
        NetInfo.fetch().then(state => 
            {
                this.setState(
                    {
                    connectionInfo: state, 
                    }
                );
        });
        */
       const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Permission',
                message:'Permission',
                buttonNeutral: 'Après',
                buttonNegative: 'Annuler',
                buttonPositive: 'OK',
            }
            )
        //await Location.requestForegroundPermissionsAsync();
        if(granted === PermissionsAndroid.RESULTS.GRANTED)
        {
            NetInfo.fetch("wifi").then(state => 
            {
            console.log("SSID : ", state.details.ssid);
            console.log("Is connected? : ", state.isConnected);
            this.setState(
                {
                    connectionInfo: state, 
                }
            );
            if(state != null)
            {
                Alert.alert(
                    'Succès',
                    `Info SSID : ${state.details.ssid}`,
                    [
                        {
                            text: 'OK',
                            onPress:() => console.log('Bouton OK pressé !')
                        }
                    ],
                    {cancelable: false}
                )
            }
            else
            {
                Alert.alert(
                    'Erreur',
                    'Pas de WIFI !',
                    [
                        {
                            text: 'OK',
                            onPress:() => console.log('Bouton OK pressé !')
                        }
                    ],
                    {cancelable: false}
                )
            }
            });
        }
        else
        {
            Alert.alert(
                    'Erreur',
                    'PERMISSION ANNULÉE !',
                    [
                        {
                            text: 'OK',
                            onPress:() => console.log('Bouton OK pressé !')
                        }
                    ],
                    {cancelable: false}
                )
            
        }
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
