import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Alert} from 'react-native';
import MyButton from '../Components/MyButton';
import { connect } from "react-redux";
class Inscription extends React.Component 
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
        console.log("Props : " + this.props)
        if(this.state.name == "" || this.state.firstname == "" || this.state.email == "" || this.state.password == "")
        {
            Alert.alert(
                'Erreur',
                'Veuillez remplir les champs !',
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
            const action = 
            { 
                type: "ADD_USER", value: {name: this.state.name, firstname: this.state.firstname, email: this.state.email, password: this.state.password} 
            }
            this.props.dispatch(action)
            console.log(this.props)
            this.props.navigation.navigate("Connexion", {name: this.state.name, firstname: this.state.firstname, email: this.state.email, password: this.state.password, login: true})
        }
        
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
                
                <MyButton 
                    onPress={this.validateButton} 
                    val="Valider l'inscription"
                />

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

const mapStateToProps = (state) => 
{
    return state
}

export default connect(mapStateToProps)(Inscription)