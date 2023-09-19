import axios from 'axios';

// Définissez l'URL de l'API sur vos microcontrôleurs
const raspberryApiUrl = '10.31.201.113:1883';

// Fonction pour envoyer une commande à un microcontrôleur avec une priorité donnée
const sendCommand = (microcontrollerUrl, commandData, priority) => {
  const command = { ...commandData, priority };

  return axios.post(`${microcontrollerUrl}/command`, command);
};

// Définir les niveaux de priorité
const HIGH_PRIORITY = 'high';
const MEDIUM_PRIORITY = 'medium';
const LOW_PRIORITY = 'low';


// Allumer ou éteindre l'installation avec priorité haute
sendCommand(rasberryApiUrl, { command: 'power', data: 'on' }, HIGH_PRIORITY)
  .then(response => {
    console.log('Réponse de Rasberry Pi (allumer/éteindre) :', response.data);
  })
  .catch(error => {
    console.error('Erreur avec Rasberry Pi (allumer/éteindre) :', error);
  });

// Détecter une ou deux personnes avec priorité moyenne
sendCommand(raspberryApiUrl, { command: 'detect_people', data: 'two' }, MEDIUM_PRIORITY)
  .then(response => {
    console.log('Réponse du Raspberry Pi (détection personnes) :', response.data);
  })
  .catch(error => {
    console.error('Erreur avec le Raspberry Pi (détection personnes) :', error);
  });

// Ajuster la luminosité avec priorité basse
sendCommand(rasberryApiUrl, { command: 'brightness', data: '50' }, LOW_PRIORITY)
  .then(response => {
    console.log('Réponse de Rasberry Pi (ajuster luminosité) :', response.data);
  })
  .catch(error => {
    console.error('Erreur avec Rasberry Pi (ajuster luminosité) :', error);
  });

// Changer les couleurs des LED avec priorité basse
sendCommand(rasberryApiUrl, { command: 'color', data: 'FF0000' }, LOW_PRIORITY) // Exemple : Rouge
  .then(response => {
    console.log('Réponse de Rasberry Pi (changer couleur LED) :', response.data);
  })
  .catch(error => {
    console.error('Erreur avec Rasberry Pi (changer couleur LED) :', error);
  });


