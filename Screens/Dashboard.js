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

    

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>
                <Text  style={styles.textdashboard}>
                    TABLEAU DE BORD
                </Text>
                <Text style={styles.textdashboards}>
                    Statut de l'installation(en cours, terminé, arrêté)
                </Text>


            <View style={styles.colormode}>
                <Text style={styles.textcolormode}>
                    Mode de couleur
                </Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.textdashboards}>
                        Couleur blanche
                    </Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#FFFFFF'}}
                        thumbColor={this.state.isEnabledColor ? '#28B463' : '#EAFAF1'}
                        onValueChange={() => this.setState({isEnabledColor: !this.state.isEnabledColor})}
                        value={this.state.isEnabledColor}
                    />
                    <Text style={styles.textdashboards}>
                        Température
                    </Text>
                </View>
            </View>


            <View styles = {styles.declanchluminosity}>
                <Text style={styles.textdeclanchlum}>
                    Gestion du seuil de déclenchement de luminosité
                </Text>
                <MySlider />
            </View>

            <View style = {styles.detectgestion}>
                <Text style={styles.textdetectgestion}>
                    Gestion de détection
                </Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text style={styles.textdashboards}>
                        OFF
                    </Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#FFFFFF'}}
                        thumbColor={this.state.isEnabledDetection ? '#28B463' : '#EAFAF1'}
                        onValueChange={() => this.setState({isEnabledDetection: !this.state.isEnabledDetection})}
                        value={this.state.isEnabledDetection}
                    />
                    <Text style={styles.textdashboards}>
                        ON
                    </Text>
                </View>
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
        backgroundColor: '#1F1E42',
    },

    textdashboard:
    {
        textAlign: 'center',
        marginBottom: 10,
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 20,
    },

    textdashboards:
    {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFFFFF',
    },

    colormode:
    {
        marginBottom: 30,
        marginTop: 30,
        fontSize: 15,
    },

    textcolormode:
    {
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#FFFFFF',
        fontSize: 15,
    },

    declanchluminosity:
    {
        marginBottom: 30,
        marginTop: 30,
    },

    textdeclanchlum:
    {
        textAlign: 'center',
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FFFFFF',
        fontSize: 15,
    },

    detectgestion: 
    {
        marginBottom: 30,
        marginTop: 30,
    },

    textdetectgestion:
    {
        textAlign: 'center',
        fontWeight: 'bold',
        color: 'white',
        fontSize: 15,
    },
});

const mapStateToProps = (state) => 
{
    return state
}

export default connect(mapStateToProps)(Dashboard)