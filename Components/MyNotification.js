import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MyNotification = ({ message, onClose }) => (
  <View style={styles.container}>
    <Text style={styles.message}>{message}</Text>
    <TouchableOpacity onPress={onClose} style={styles.closeButton}>
      <Text style={styles.closeText}>Close</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.2)', // Fond légèrement transparent
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    elevation: 3,
    borderRadius: 5,
  },
  message: {
    flex: 1,
    color: '#fff', // Couleur de texte sobre
    fontSize: 16,
  },
  closeButton: {
    backgroundColor: '#fff', // Couleur de bouton sobre
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    right: 15,

  },
  closeText: {
    color: '#000000',
    fontSize: 10,
  },
});

export default MyNotification;

