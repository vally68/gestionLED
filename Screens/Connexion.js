import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Alert } from 'react-native';
import MyButton from '../Components/MyButton';
import { connect } from "react-redux";

class Connexion extends React.Component 
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
        
    }

    validateButton = () =>
    {
       

        if(this.state.email == "" || this.state.password == "")
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
            const {users} = this.props
            var userConnect = this.props.isLoggedIn
            console.log("IsLogd : " + userConnect)
            for(var i=0; i<users.length; i++)
            {
                if(users[i].email == this.state.email && users[i].password == this.state.password)
                {
                    userConnect = true
                    const action = {type:"LOGIN_SUCCESS", value:userConnect}
                    this.props.dispatch(action)
                    console.log("IsLogddd : " + userConnect + " et " + this.props.isLoggedIn)
                    this.props.navigation.navigate("Tableau", {email: this.state.email, password: this.state.password})
                }
            }
            if(userConnect == false)
            {
                Alert.alert(
                    'Erreur',
                    'Logs incorrects !',
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
    }

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>
                <Text>Page Connexion</Text>
                <TextInput value={this.state.email} onChangeText={text=> this.setState({email:text})}  placeholder="E-mail" keyboardType='email-address' />
                <TextInput value={this.state.password} onChangeText={text=> this.setState({password:text})}  placeholder="Mot de passe" secureTextEntry={true} />
                <MyButton 
                    onPress={this.validateButton} 
                    val="Valider la connexion"
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

const mapStateToProps = (state) => 
{
    return state
}

export default connect(mapStateToProps)(Connexion)