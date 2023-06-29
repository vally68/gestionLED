import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from 'react-native';

class Event extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Événements</Text>

          {/* Affichage des images/vidéos de la caméra */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Images/Vidéos</Text>
            {/* Afficher les images/vidéos ici */}
          </View>

          {/* Affichage des températures des LEDs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Températures des LEDs</Text>
            {/* Afficher les températures des LEDs ici */}
          </View>

          {/* Affichage des informations sur la luminosité */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Luminosité</Text>
            {/* Afficher les informations sur la luminosité ici */}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13043a',
    marginTop: 35,
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 10,
  },
});

export default Event;
