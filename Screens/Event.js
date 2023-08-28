import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';


class Event extends React.Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Événements</Text>

          {/* Section : Allumer ou éteint */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Allumer ou éteindre</Text>
            {/* Contenu pour Allumer ou éteindre */}
          </View>

          {/* Section : Détection de personnes */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Détection de personnes</Text>
            {/* Contenu pour Détection de personnes */}
          </View>

          {/* Section : Température et couleur des LEDs */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>
              Température et couleur des LEDs
            </Text>
            {/* Contenu pour Température et couleur des LEDs */}
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
  videoPlayer: {
    width: 300,
    height: 200,
  },
});

export default Event;
