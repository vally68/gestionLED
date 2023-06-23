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
            email:"nom.prenom@mail.com",
            password:"1234"   
        };
    }


    componentDidMount()
    {
        
    }

    validateConnexionButton()
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
                    this.props.navigation.navigate("Tableau", {name: users[i].name, firstname: users[i].firstname, email: users[i].email, password: users[i].password})
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
                <Text style={styles.texttitle}>Page Connexion</Text>
                <TextInput value={this.state.email} style={styles.textinfo} onChangeText={text=> this.setState({email:text})} keyboardType='email-address' placeholder='E-mail'/>
                <TextInput value={this.state.password} style={styles.textinfo} onChangeText={text=> this.setState({password:text})} secureTextEntry={true} placeholder="Mot de passe"/>
                <MyButton 
                    onPress={() => this.validateConnexionButton()} 
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
        backgroundColor: '#1F1E42',
    },

    texttitle:
    {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
    },

    textinfo:
    {
        height: 40,
        width: 200,
        margin: 12,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        color: '#FFFFFF',
        padding: 10,
    },
});

const mapStateToProps = (state) => 
{
    return state
}

export default connect(mapStateToProps)(Connexion)