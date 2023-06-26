import React, { useState, useContext } from 'react';
import { Text, Button, SafeAreaView, StyleSheet, View, Switch } from 'react-native';
import { connect } from 'react-redux';
import { AuthContext } from './AuthContext';
import { logoutSuccess } from '../store/reducer/UserReducer';
import MySlider from '../Components/MySlider';

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
            <Text style={styles.textdashboard}>
                TABLEAU DE BORD
            </Text>
            <Text>
                Statut de l'installation(en cours, terminé, arrêté)
            </Text>
            <View style={styles.colormode}>
                <Text style={styles.textcolormode}>
                    Mode de couleur
                </Text>
                <View style={{flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
                    <Text >
                        Couleur blanche
                    </Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnabledColor ? '#28B463' : '#EAFAF1'}
                        onValueChange={() => setIsEnabledColor(!isEnabledColor)}
                        value={isEnabledColor}
                    />
                    <Text >
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
                    <Text >
                        OFF
                    </Text>
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isEnabledDetection ? '#28B463' : '#EAFAF1'}
                        onValueChange={() => setIsEnabledDetection(!isEnabledDetection)}
                        value={isEnabledDetection}
                    />
                    <Text >
                        ON
                    </Text>
                </View>
            </View>
            <Button title="Déconnexion" onPress={handleLogout} />
            {isLoggedIn && <Button title="Déconnexion" onPress={handleLogout} />}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container:
        {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },

    textdashboard:
        {
            textAlign: 'center',
            fontWeight: 'bold',
            marginBottom: 10,
        },


    colormode:
        {
            marginBottom: 30,
            marginTop: 30,
        },

    textcolormode:
        {
            textAlign: 'center',
            fontWeight: 'bold',
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
        },
});

const mapStateToProps = (state) => ({
    isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(Dashboard);
