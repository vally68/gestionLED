import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';


export default class Inscription extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            name: "test",
            firstname: "test",
            email: "test@test.com",
            password: "1234"
        };
    }


    validateButton = () =>
    {
        this.props.navigation.navigate("Connexion", {name: this.state.name, firstname: this.state.firstname, email: this.state.email, password: this.state.password})
    }

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>
                <Text>INSCRIPTION</Text>
                <TextInput value={this.state.name} onChangeText={text=> this.setState({name:text})}  placeholder="Nom" />
                <TextInput value={this.state.firstname} onChangeText={text=> this.setState({firstname:text})}  placeholder="Prénom" />
                <TextInput value={this.state.email} onChangeText={text=> this.setState({email:text})}  placeholder="E-mail" keyboardType='email-address' />
                <TextInput value={this.state.password} onChangeText={text=> this.setState({password:text})}  placeholder="Mot de passe" secureTextEntry={true} />
                
                <TouchableOpacity onPress={this.validateButton}>
                    <Text>Valider</Text>
                </TouchableOpacity>

                <Text>Votre nom : {this.state.name}</Text>
                <Text>Votre prénom : {this.state.firstname}</Text>
                <Text>Votre mail : {this.state.email}</Text>
                <Text>Votre mot de passe : {this.state.password}</Text>
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
