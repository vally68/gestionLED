import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';


export default class Connexion extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            email:"",
            password:""   
        };
    }


    componentDidMount()
    {
        console.log("Params : " + this.props.route.params.name)
        this.setState({email: this.props.route.params.email})
        this.setState({password: this.props.route.params.password})
    }

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>
                <Text>Page Connexion</Text>
                <Text>
                    Nom : {this.props.route.params.name}
                </Text>
                <Text>
                    Prénom : {this.props.route.params.firstname}
                </Text>
                <Text>
                    Email : {this.props.route.params.email}
                </Text>
                <Text>
                    Email par State: {this.state.email}
                </Text>
                <TextInput value={this.state.email} onChangeText={text=> this.setState({email:text})}  placeholder="E-mail" keyboardType='email-address' />
                <TextInput value={this.state.password} onChangeText={text=> this.setState({password:text})}  placeholder="Mot de passe" secureTextEntry={true} />
                <TouchableOpacity onPress={this.validateButton}>
                    <Text>Valider</Text>
                </TouchableOpacity>
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
