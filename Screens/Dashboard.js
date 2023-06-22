import React from 'react';
import { SafeAreaView, StyleSheet, Text, View, Switch } from 'react-native';
import MyButton from '../Components/MyButton';
import { connect } from "react-redux";
import MySlider from '../Components/MySlider';
class Dashboard extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            name:"",
            firstname:"",
            email:"",
            password:"",
            isEnabledColor: false,
            isEnabledDetection: false,
            value: "test"     
        };
    }


    componentDidMount()
    {
        
    }

    disconnectButton = () =>
    {
        const action = {type:"LOGOUT_SUCCESS", value:false}
        this.props.dispatch(action)
        console.log("IsLogddd : " + this.props.isLoggedIn)
        this.props.navigation.navigate("Accueil")
    }

    configPlageButton = () =>
    {
        this.props.navigation.navigate("PlageFonction")
    }

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>
                <Text>
                    TABLEAU DE BORD
                </Text>
                <Text>
                    Statut de l'installation(en cours, terminé, arrêté)
                </Text>
                <Text >
                    Gestion de couleur
                </Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text >
                        Fixée à la couleur blanche
                    </Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={this.state.isEnabledColor ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={() => this.setState({isEnabledColor: !this.state.isEnabledColor})}
                        value={this.state.isEnabledColor}
                    />
                    <Text >
                        Par la température
                    </Text>
                </View>
                <Text>
                    Gestion du seuil de déclenchement de la luminosité
                </Text>
                <MySlider />

                <Text>
                    Gestion de détection
                </Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text >
                        OFF
                    </Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={this.state.isEnabledDetection ? '#f5dd4b' : '#f4f3f4'}
                        onValueChange={() => this.setState({isEnabledDetection: !this.state.isEnabledDetection})}
                        value={this.state.isEnabledDetection}
                    />
                    <Text >
                        ON
                    </Text>
                </View>
                <MyButton 
                    onPress={this.disconnectButton} 
                    val="Déconnexion"
                />
                <MyButton 
                    onPress={this.configPlageButton} 
                    val="Config Plage"
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

export default connect(mapStateToProps)(Dashboard)