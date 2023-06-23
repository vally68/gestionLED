import React from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, Alert, View} from 'react-native';
import MyButton from '../Components/MyButton';
import { connect } from "react-redux";
class Inscription extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            name: "nom",
            firstname: "prenom",
            email: "nom.prenom@mail.com",
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
            const action2 =
            {
                type: "ADD_ID"
            }
            this.props.dispatch(action2)
            console.log(this.props)
            this.props.navigation.navigate("Connexion", {name: this.state.name, firstname: this.state.firstname, email: this.state.email, password: this.state.password, login: true})
        }
        
    }

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>
            <View style={styles.bloctext}>
                <Text style={styles.texttitle}>INSCRIPTION</Text>
                <TextInput value={this.state.name} style={styles.textenter} onChangeText={text=> this.setState({name:text})}  placeholder="Nom" />
                <TextInput value={this.state.firstname} style={styles.textenter} onChangeText={text=> this.setState({firstname:text})}  placeholder="Prénom" />
                <TextInput value={this.state.email} style={styles.textenter} onChangeText={text=> this.setState({email:text})}  placeholder="E-mail" keyboardType='email-address' />
                <TextInput value={this.state.password} style={styles.textenter} onChangeText={text=> this.setState({password:text})}  placeholder="Mot de passe" secureTextEntry={true} />
            </View>


                <MyButton 
                    onPress={this.validateButton} 
                    val="Valider l'inscription"
                />
            <View style={styles.blocinfo}>
                <Text style={styles.textinfo}>Votre nom : {this.state.name}</Text>
                <Text style={styles.textinfo}>Votre prénom : {this.state.firstname}</Text>
                <Text style={styles.textinfo}>Votre mail : {this.state.email}</Text>
                <Text style={styles.textinfo}>Votre mot de passe : {this.state.password}</Text>
            </View>
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
        color: "#FFFFFF",
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 10,
        textAlign: 'center',
    },

    bloctext:
    {
        marginBottom: 20,
    },

    textenter:
    {
        color: '#FFFFFF',
        height: 40,
        width: 200,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#FFFFFF',
        textAlign :'justify',
    },

    textinfo:
    {
        color: '#FFFFFF',
        marginBottom: 10,
    },

    blocinfo:
    {
        marginTop: 20,
    },
});

const mapStateToProps = (state) => 
{
    return state
}

export default connect(mapStateToProps)(Inscription)