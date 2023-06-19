import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';


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
