import React, { useState, useContext } from 'react';
import { Text, Button, SafeAreaView, StyleSheet, View, Switch, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { AuthContext } from './AuthContext';
import { logoutSuccess } from '../store/reducer/UserReducer';
import MySlider from '../Components/MySlider';
import MyButton from "../Components/MyButton";


function Dashboard({ dispatch, isLoggedIn }) {
    const { setIsLoggedin } = useContext(AuthContext);
    const [isEnabledColor, setIsEnabledColor] = useState(false);
    const [isEnabledDetection, setIsEnabledDetection] = useState(false);

    const handleLogout = () => {
        setIsLoggedin(false);
        dispatch(logoutSuccess(false));
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.textdashboard}>
                    TABLEAU DE BORD
                </Text>
                <Text style={styles.textdashboards}>
                    Statut de l'installation (en cours, terminé, arrêté)
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
                            thumbColor={isEnabledColor ? '#28B463' : '#EAFAF1'}
                            onValueChange={() => setIsEnabledColor(!isEnabledColor)}
                            value={isEnabledColor}
                        />
                        <Text style={styles.textdashboards}>
                            Température
                        </Text>
                    </View>
                </View>
                <View style={styles.declanchluminosity}>
                    <Text style={styles.textdeclanchlum}>
                        Gestion du seuil de déclenchement de la luminosité
                    </Text>
                    <MySlider />
                </View>
                <View style={styles.detectgestion}>
                    <Text style={styles.textdetectgestion}>
                        Gestion de détection
                    </Text>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                        <Text style={styles.textdashboards}>
                            OFF
                        </Text>
                        <Switch
                            trackColor={{false: '#767577', true: '#81b0ff'}}
                            thumbColor={isEnabledDetection ? '#28B463' : '#EAFAF1'}
                            onValueChange={() => setIsEnabledDetection(!isEnabledDetection)}
                            value={isEnabledDetection}
                        />
                        <Text style={styles.textdashboards}>
                            ON
                        </Text>
                    </View>
                </View>
                <MyButton val="Déconnexion" onPress={handleLogout} />
                {isLoggedIn && <Button title="Déconnexion" onPress={handleLogout} />}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: 
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1F1E42',
        marginTop: 35,
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
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

const mapStateToProps = (state) => ({
    isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(Dashboard);
