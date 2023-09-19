
import React, { useEffect, useState } from 'react'; // Import des fonctionnalités de React et du hook useState
import { SafeAreaView, StyleSheet, Text, View, Image } from 'react-native'; // Import des composants de React Native
import MyButton from '../Components/MyButton'; // Import d'un composant personnalisé
import NetInfo from "@react-native-community/netinfo"; // Import du module NetInfo pour la gestion de la connectivité réseau
import { MaterialIcons } from '@expo/vector-icons'; // Import des icônes MaterialIcons depuis Expo
import * as Location from 'expo-location'; // Import du module Location depuis Expo pour la gestion de la localisation




const Home = ({ navigation }) => {
    const [connectionInfo, setConnectionInfo] = useState(null);

    // Fonction pour gérer le bouton de connexion
    const handleConnexionButton = () => {
        navigation.navigate("Connexion");
    };

    // Fonction pour gérer le bouton d'inscription
    const handleInscriptionButton = () => {
        navigation.navigate("Inscription");
    };

    // Fonction pour vérifier l'état du réseau Wi-Fi
    const checkWifiStatus = async () => {
        // Demande de la permission de localisation
        await Location.requestForegroundPermissionsAsync();

        NetInfo.fetch("wifi").then(state => {
            console.log("SSID", state.details.ssid);
            console.log("Is connected?", state.isConnected);
            setConnectionInfo(state);
        });
    };

    useEffect(() => {
    // Crée un intervalle qui appelle la fonction checkWifiStatus toutes les 10 secondes (10000 millisecondes)
    const intervalId = setInterval(checkWifiStatus, 10000);  // 10000 millisecondes = 10 secondes

    // La fonction de retour sera exécutée lorsque le composant sera démonté
    return () => {
        // Nettoie l'intervalle en le supprimant pour éviter les fuites de mémoire
        clearInterval(intervalId);
    };
}, []);


// Rendu du composant
return (
    <SafeAreaView style={styles.container}>
    {/* Affiche l'image du logo avec une couverture */}
    <Image
    source={require('../assets/logo.png')}
    style={styles.image}
    resizeMode="cover"  // Ajout de cette ligne
    />
    {/* Vérifie si des informations de connexion sont disponibles */}
    {connectionInfo && (
    <View style={styles.connectionInfoContainer}>
    {/* Affiche le nom du réseau (SSID) */}
    <Text style={styles.connectionInfoText}>
        <MaterialIcons name="network-wifi" size={24} color="white" /> Nom du réseau (SSID) : {connectionInfo.details.ssid}
    </Text>
    {/* Affiche le type de connexion */}
    <Text style={styles.connectionInfoText}>
        <MaterialIcons name="network-check" size={24} color="white" /> Type de connexion : {connectionInfo.type}
    </Text>
    {/* Si la connexion est de type Wi-Fi, affiche les état de connexion */}
    {connectionInfo.type === 'wifi' && (
    <Text style={styles.connectionInfoText}>
        <MaterialIcons name="wifi-tethering" size={24} color={connectionInfo.isConnected ? 'green' : 'red'} /> Connecté : {connectionInfo.isConnected ? 'Oui' : 'Non'}
    </Text>
    )}
    </View>
    )}
    </SafeAreaView>
    );
}

// Définition des styles en tant que objets
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#13043a',
        paddingTop: 35,                 // Ajout de marge en haut de 35 pixels
        paddingHorizontal: 20,          // Ajout de rembourrage horizontal de 20 pixels
        marginTop: 30,                 // Ajout de marge supplémentaire en haut de 35 pixels
    },
    image: {
        position: 'absolute',
        top: 150,                       // Positionnement en haut de 150 pixels
        right: -10,                     // Positionnement à droite de -10 pixels
        bottom: 0,
        left: 0,
        width: null,                    // La largeur s'adapte automatiquement à la taille de l'écran
        height: null,                   // La hauteur s'adapte automatiquement à la taille de l'écran
    },
    connectionInfoContainer: {
        marginTop: -530,                // Marge supérieure de -530 pixels (peut nécessiter un ajustement)
        marginBottom: 0,
        backgroundColor: 'transparent', // Arrière-plan transparent
        padding: 0,                     // Aucun rembourrage
        borderRadius: 15,               // Bordure arrondie avec un rayon de 15 pixels
        shadowColor: '#000',            // Couleur de l'ombre
        shadowOffset: { width: 0, height: 1 }, // Décalage de l'ombre
        shadowOpacity: 0.3,            // Opacité de l'ombre
        shadowRadius: 2,               // Rayon de l'ombre
        elevation: 4,                  // Élévation pour l'ombre (pour les appareils Android)
    },
    connectionInfoText: {
        color: '#FFFFFF',               // Couleur du texte en blanc
        textAlign: 'center',           // Texte centré horizontalement
        fontSize: 14,                  // Taille de la police de 14 pixels
        flexDirection: 'row',          // Disposition en ligne des éléments
        alignItems: 'center',          // Alignement vertical au centre
        marginBottom: 10,              // Marge inférieure de 10 pixels
        lineHeight: 25,                // Hauteur de ligne de 25 pixels
    },
});


export default Home;
