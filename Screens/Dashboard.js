import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity } from 'react-native';
import MyButton from '../Components/MyButton';

export default class Dashboard extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            
        };
    }


    componentDidMount()
    {
        
    }

    disconnectButton = () =>
    {
        this.props.navigation.navigate("Accueil", {login: true})
    }

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>
                <Text>
                    TABLEAU DE BORD
                </Text>
                <Text>
                    Statut de l'installation
                </Text>
                <Text>
                    Gestion de couleur
                </Text>
                <Text>
                    Gestion du seuil de déclenchement de la luminosité
                </Text>
                <Text>
                    Gestion de détection
                </Text>
                <MyButton 
                    onPress={this.disconnectButton} 
                    val="Déconnexion"
                />
                
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
