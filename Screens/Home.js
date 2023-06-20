import React from 'react';
import { SafeAreaView, StyleSheet, Text, Alert} from 'react-native';
import MyButton from '../Components/MyButton';

export default class Home extends React.Component 
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

    connexionButton = () =>
    {
        this.props.navigation.navigate("Connexion")
    }

    inscriptionButton = () =>
    {
        this.props.navigation.navigate("Inscription")
    }

    render() 
    {
        
       

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
