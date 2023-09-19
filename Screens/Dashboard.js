import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  SafeAreaView,
  StyleSheet,
  View,
  Switch,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
  Alert,
  Button,
} from "react-native";
import { connect } from "react-redux";
import { AuthContext } from "../fonction/AuthContext";
import { logoutSuccess } from "../reducer/UserReducer";
import MyButton from "../Components/MyButton";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import init from "react_native_mqtt";
import Logo from "../assets/logo.svg";
import ColorPicker from "react-native-wheel-color-picker";
import Paho from "paho-mqtt";
//import { WebView } from "react-native-webview";

const { width } = Dimensions.get("window");
const { height } = Dimensions.get("window");

function Dashboard({ dispatch, isLoggedIn }) {
  const { setIsLoggedin } = useContext(AuthContext);
  const [isEnabledColor, setIsEnabledColor] = useState(false);
  const [isEnabledDetection, setIsEnabledDetection] = useState(false);
  const [isInstallationOn, setIsInstallationOn] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#FFFFFF");
  const [peopleCount, setPeopleCount] = useState("1");
  const [temperature, setTemperature] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [primaryColor, setPrimaryColor] = useState("white");
  const [presence, setPresence] = useState(0);
  const [buttonState, setButtonState] = useState(0);
  const [luminosityLevel, setLuminosityLevel] = useState("éteint");
  const [selectedThreshold, setSelectedThreshold] = useState("éteint");
  const [mqttClient, setMqttClient] = useState(null);
  const [webcamState, setWebcamState] = useState(false);
  const [ledTemperature, setLedTemperature] = useState(0);
  const [pictureMessage, setPictureMessage] = useState('');
  const [pictureState, setPictureState] = useState(false);
  //const [picturesPermission, setPicturesPermission] = useState(null);


  const initializeMQTTClient = () => {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });
    const client = new Paho.Client(
      "ws://10.31.251.58:9003/mqtt",
      "Mobile Client"

    );

    client.onMessageArrived = onMessageArrived;

    return client;
  };

const onConnect = (client) => 
  {
    console.log('Connected to MQTT broker');
   

    client.subscribe('TEMP/value');
    client.subscribe('LUM/threshold');
    client.subscribe('PIR1/presence');
    
    client.subscribe('BOUTON/on_off');
    client.subscribe('ETATS/BoutonApp');
    
    //client.subscribe('BOUTON/TakePicturesAck');
    client.subscribe('BOUTON/TakePictureApp');
    client.subscribe('ETATS/PictureApp');

    client.subscribe('BOUTON/PresenceApp')
    client.subscribe('ETATS/BoutonPresenceApp');

    client.subscribe('ETATS/ConnectionStatus');
  }

  useEffect(() => {
    const client = initializeMQTTClient();
    client.connect({ onSuccess: () => onConnect(client) });
    setMqttClient(client);
  }, []);

  const publishMessage = (messageText, topic) => {
    if (!mqttClient) {
      console.error("MQTT client not initialized");
      return;
    }

    console.log("Envoi message");
    mqttClient.subscribe(topic);
    const message = new Paho.Message(messageText);
    message.destinationName = topic;

    mqttClient.send(message);
  };

  const handleLogout = async () => {
    publishMessage("client deconnecter", "ETATS/ConnectionStatus");
    await AsyncStorage.removeItem("userToken"); // Supprime le token
    setIsLoggedin(false); // Met à jour l'état local
    dispatch(logoutSuccess(false)); // Met à jour l'état dans le store Redux
  };

  const handleResetColor = () => {
    setSelectedColor("#FFFFFF");
  };

  const handleResetAll = () => {
    setIsEnabledColor(false);
    setIsEnabledDetection(false);
    setIsInstallationOn(false);
    handleResetColor();
    setSelectedThreshold("éteint"); // Réinitialise le seuil de luminosité
  };

  const handleInstallationToggle = async () => {
    if (!mqttClient) {
      console.error("MQTT client not initialized");
      return;
    }
    // Vérifier l'état actuel de l'installation
    if (!isInstallationOn) {
      // Afficher une boîte de dialogue de confirmation
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir démarrer l'installation ?",
        [
          {
            text: "Annuler",
            onPress: () => {
              // L'utilisateur a annulé, ne rien faire
              setIsInstallationOn(false); // Rétablir l'état local à OFF
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: async () => {
              // Mettre à jour l'état local
              setIsInstallationOn(true); // Passer l'état à ON

              // Définir la nouvelle valeur à envoyer à la base de données
              //const newValue = '1'; // Toujours démarrer l'installation
              const formData = new FormData();
              formData.append("test", "1");
              try {
                // Envoyer la requête de mise à jour à la base de données
                return fetch("http://10.31.251.58/api/alimentationUpdate.php", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((json) => {
                    if (json != false) {
                      console.log(
                        "Mise à jour réussie dans la base de données"
                      );
                      publishMessage(
                        "DÉMARRAGE DES MICROCONTROLLEURS PAR LE CLIENT !",
                        "ETATS/BoutonApp"
                      );
                    } else {
                      console.error(
                        "Échec de la mise à jour dans la base de données"
                      );
                      // Rétablir l'état local en cas d'échec
                      setIsInstallationOn(false); // Passer l'état à OFF
                    }
                  });
              } catch (error) {
                console.error(
                  "Erreur lors de la requête vers la base de données:",
                  error
                );
                // Rétablir l'état local en cas d'erreur
                setIsInstallationOn(false); // Passer l'état à OFF
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      // Afficher une boîte de dialogue de confirmation
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir arrêter l'installation ?",
        [
          {
            text: "Annuler",
            onPress: () => {
              // L'utilisateur a annulé, ne rien faire
              setIsInstallationOn(true); // Rétablir l'état local à ON
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: async () => {
              // Mettre à jour l'état local
              setIsInstallationOn(false); // Passer l'état à OFF

              // Définir la nouvelle valeur à envoyer à la base de données
              //const newValue2 = '0';
              const formData = new FormData();
              formData.append("test", "0");
              try {
                // Envoyer la requête de mise à jour à la base de données
                return fetch("http://10.31.251.58/api/alimentationUpdate.php", {
                  method: "POST",

                  body: formData,
                })
                  .then((response) => response.json())
                  .then((json) => {
                    if (json != false) {
                      console.log(
                        "Mise à jour réussie dans la base de données"
                      );
                      publishMessage(
                        "ARRÊT DES MICROCONTROLLEURS PAR LE CLIENT!",
                        "ETATS/BoutonApp"
                      );
                    } else {
                      console.error(
                        "Échec de la mise à jour dans la base de données"
                      );
                      // Rétablir l'état local en cas d'échec
                      setIsInstallationOn(true); // Passer l'état à ON
                    }
                  });
              } catch (error) {
                console.error(
                  "Erreur lors de la requête vers la base de données:",
                  error
                );
                // Rétablir l'état local en cas d'erreur
                setIsInstallationOn(false); // Passer l'état à OFF
              }
            },
          },
        ],
        { cancelable: false }
      );

      // Si l'installation est déjà en cours, permettez simplement de basculer l'interrupteur
      //setIsInstallationOn(!isInstallationOn);
    }
  };

  const handleMotionToggle = async () => {
    if (!mqttClient) {
      console.error("MQTT client not initialized");
      return;
    }
    if (!isEnabledDetection) {
      // Afficher une boîte de dialogue de confirmation
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir démarrer la détection ?",
        [
          {
            text: "Annuler",
            onPress: () => {
              setIsEnabledDetection(false);
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: async () => {
              setIsEnabledDetection(true);

              const formData = new FormData();
              formData.append("test", "1");
              try {
                // Envoyer la requête de mise à jour à la base de données
                return fetch("http://10.31.251.58/api/testPresenceUpdate.php", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((json) => {
                    if (json != false) {
                      console.log(
                        "Mise à jour réussie dans la base de données"
                      );
                      publishMessage(
                        "ACTIVATION DE LA DÉTECTION DE PRÉSENCE PAR LE CLIENT !",
                        "ETATS/BoutonPresenceApp"
                      );
                    } else {
                      console.error(
                        "Échec de la mise à jour dans la base de données"
                      );
                      // Rétablir l'état local en cas d'échec
                      setIsEnabledDetection(false); // Passer l'état à OFF
                    }
                  });
              } catch (error) {
                console.error(
                  "Erreur lors de la requête vers la base de données:",
                  error
                );
                // Rétablir l'état local en cas d'erreur
                setIsEnabledDetection(false); // Passer l'état à OFF
              }
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      // Afficher une boîte de dialogue de confirmation
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir arrêter la détection ?",
        [
          {
            text: "Annuler",
            onPress: () => {
              // L'utilisateur a annulé, ne rien faire
              setIsEnabledDetection(true); // Rétablir l'état local à ON
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: async () => {
              // Mettre à jour l'état local
              setIsEnabledDetection(false); // Passer l'état à OFF

              // Définir la nouvelle valeur à envoyer à la base de données
              //const newValue2 = '0';
              const formData = new FormData();
              formData.append("test", "0");
              try {
                // Envoyer la requête de mise à jour à la base de données
                return fetch("http://10.31.251.58/api/testPresenceUpdate.php", {
                  method: "POST",

                  body: formData,
                })
                  .then((response) => response.json())
                  .then((json) => {
                    if (json != false) {
                      console.log(
                        "Mise à jour réussie dans la base de données"
                      );
                      publishMessage(
                        "DÉSACTIVATION DE LA DÉTECTION DE PRÉSENCE PAR LE CLIENT !",
                        "ETATS/BoutonPresenceApp"
                      );
                    } else {
                      console.error(
                        "Échec de la mise à jour dans la base de données"
                      );
                      // Rétablir l'état local en cas d'échec
                      setIsEnabledDetection(true); // Passer l'état à ON
                    }
                  });
              } catch (error) {
                console.error(
                  "Erreur lors de la requête vers la base de données:",
                  error
                );
                // Rétablir l'état local en cas d'erreur
                setIsEnabledDetection(false); // Passer l'état à OFF
              }
            },
          },
        ],
        { cancelable: false }
      );

      
    }
  };

  const onMessageArrived = (message) => {
    switch (message.topic) {
      case "TEMP/value":
        setTemperature(message.payloadString);
        if (temperature >= 10 && temperature <= 20) {
          setPrimaryColor("yellow");
        } else {
          if (temperature < 10) {
            setPrimaryColor("blue");
          } else {
            setPrimaryColor("red");
          }
        }
        break;
      case "LUM/threshold":
        setBrightness(message.payloadString);
        break;
      case "PIR1/presence":
        setPresence(message.payloadString);
        break;
      case "BOUTON/on_off":
        setButtonState(message.payloadString);
        break;
    }
  };

  useEffect(() => {
    fetch("http://10.31.251.58/api/testPermission.php", {
      method: "POST",
      headers: {
        "Content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("Réponse Permission : " + data);

          if (data == "1") {
            Alert.alert(
              "Permission accordée",
              "Vous avez accès à toutes les fonctionnalités !",
              [
                {
                  text: "OK",
                  onPress: () => console.log("Oui pressé"),
                },
              ]
            );
          } else {
            Alert.alert(
              "Permission non accordée",
              "Vous n'avez pas accès à toutes les fonctionnalités ! Déconnexion",
              [
                {
                  text: "OK",
                  onPress: handleLogout,
                },
              ]
            );
          }
        } else {
          console.error(
            "Échec de la récupération de l'état de l'installation depuis la base de données"
          );
        }
      });

    // Ajouter la récupération de l'état de l'installation ici
    const fetchInstallationStatus = async () => {
      try {
        // Envoyer une requête GET pour récupérer l'état de l'installation depuis la base de données
        const response = await fetch(
          "http://10.31.251.58/api/alimentation.php",
          {
            method: "POST",
            headers: {
              "Content-type": "multipart/form-data",
            },
          }
        );

        if (response.ok) {
          // Analyser la réponse JSON

          const data = await response.json();
          console.log(data);

          if (data == "1") {
            setIsInstallationOn(true);
            Alert.alert("Les microcontrôleurs sont allumés");
          } else {
            setIsInstallationOn(false);
            Alert.alert("Les microcontrôleurs sont éteints");
          }

          // Mettre à jour l'état local en fonction de la valeur récupérée depuis la base de données
          // setIsInstallationOn(data.installationStatus === data[0]);
          console.log(isInstallationOn);
        } else {
          console.error(
            "Échec de la récupération de l'état de l'installation depuis la base de données"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'état de l'installation depuis la base de données:",
          error
        );
      }
    };

    // Ajouter la récupération de l'état de la détection ici
    const fetchDetectionStatus = async () => {
      try {
        // Envoyer une requête GET pour récupérer l'état de la détection depuis la base de données
        const response = await fetch(
          "http://10.31.251.58/api/testPresence.php",
          {
            method: "POST", // Utilisez la méthode GET pour obtenir l'état actuel
          }
        );

        if (response.ok) {
          // Analyser la réponse JSON
          const data = await response.json();
          console.log(data);

          // Assurez-vous que "value" est une propriété de l'objet JSON
          if (data === "1") {
            // La valeur est "1", mettez à jour le bouton sur "ON"
            setIsEnabledDetection(true);
          } else {
            // La valeur n'est pas "1", mettez à jour le bouton sur "OFF"
            setIsEnabledDetection(false);
          }
        } else {
          console.error(
            "Échec de la récupération de l'état de la détection depuis la base de données"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de l'état de la détection depuis la base de données:",
          error
        );
      }
    };

    const fetchLuminosityThreshold = async () => {
      try {
        // Envoyer une requête GET pour récupérer la valeur de luminosité depuis la base de données
        const response = await fetch("http://10.31.251.58/api/luminosity.php", {
          method: "POST", // Utilisez la méthode GET pour obtenir la valeur actuelle
        });

        if (response.ok) {
          // Analyser la réponse JSON
          const data = await response.json();
          console.log("testL" + data);

          // Assurez-vous que "LuminosityValue" est une propriété de l'objet JSON
          if (data !== undefined) {
            // Déterminez le seuil en fonction de la valeur reçue
            const luminosityValue = parseInt(data);

            if (luminosityValue <= 1024) {
              setSelectedThreshold("éteint");
            } else if (luminosityValue <= 2048) {
              setSelectedThreshold("faible");
            } else if (luminosityValue <= 3072) {
              setSelectedThreshold("moyen");
            } else {
              setSelectedThreshold("élevé");
            }
          } else {
            console.error(
              'La propriété "LuminosityValue" est manquante dans la réponse JSON'
            );
          }
        } else {
          console.error(
            "Échec de la récupération de la valeur de luminosité depuis la base de données"
          );
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération de la valeur de luminosité depuis la base de données:",
          error
        );
      }
    };

    // Appeler la fonction pour récupérer l'état de l'installation lors du montage du composant
    fetchInstallationStatus();

    // Appeler la fonction pour récupérer l'état de la détection lors du montage du composant
    fetchDetectionStatus();

    // Appeler la fonction pour récupérer la valeur de luminosité lors du montage du composant
    fetchLuminosityThreshold();

    fetch("http://10.31.251.58/api/testPicture.php", {
      method: "POST",
      headers: {
        "Content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data) {
          console.log("Réponse État Picture: " + data);
          
          if (data == "1") {
            Alert.alert(
              "État activé",
              "Prise de photo activée !",
              [
                {
                  text: "OK",
                  onPress: () => 
                  {
                    console.log("Oui pressé")
                    setPictureState(true)
                  }
                },
              ]
            );
          } else {
            Alert.alert(
              "État désactivée",
              "Prise de photo désactivée !",
              [
                {
                  text: "OK",
                  onPress: () =>
                  {
                    console.log("OK")
                    setPictureState(false)
                  }
                },
              ]
            );
          }
        } else {
          console.error(
            "Échec de la récupération de l'état de l'installation depuis la base de données"
          );
        }
      });

  }, []);

  const handleTemperatureMeasurement = async () => {
    try {
      // Effectuer une requête pour obtenir la température des LED depuis une source externe
      const response = await fetch("http://10.31.251.58/api/temperature.php", {
        method: "POST", // Utilisez la méthode appropriée pour récupérer la température
      });

      if (response.ok) {
        // Analyser la réponse JSON ou extraire la température à partir de la réponse
        const temperatureData = await response.json(); // Supposons que la réponse soit au format JSON
        const ledTemperature = temperatureData; // Remplacez "temperature" par la clé appropriée dans votre réponse JSON

        // Mettre à jour la variable d'état ledTemperature
        setLedTemperature(ledTemperature);

        // Vous pouvez également effectuer d'autres actions en fonction de la température récupérée ici
      } else {
        console.error(
          "Échec de la récupération de la température des LED depuis la source externe"
        );
      }
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la température des LED:",
        error
      );
    }
  };

/*}  const MyWebComponent = () => {
    return (
      <WebView source={{ uri: "http://10.31.251.58:8080/?action=stream" }} />
    );
  };

  const handleWebcamToggle = async () => {
    if (!webcamState) {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir démarrer la caméra ?",
        [
          {
            text: "Annuler",
            onPress: () => {
              setWebcamState(false);
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: async () => {
              setWebcamState(true);

              console.log("Caméra activée");
            },
          },
        ],
        { cancelable: false }
      );
    } else {
      // Afficher une boîte de dialogue de confirmation
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir arrêter la caméra ?",
        [
          {
            text: "Annuler",
            onPress: () => {
              // L'utilisateur a annulé, ne rien faire
              setWebcamState(true); // Rétablir l'état local à ON
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: async () => {
              setWebcamState(false); // Passer l'état à OFF
              console.log("Caméra arrêtée");
            },
          },
        ],
        { cancelable: false }
      );
    }
  }; */

  const handleTakePhotosButton = async () =>
{
  if (!mqttClient) 
  {
    console.error('MQTT client not initialized');
    return;
  }
   if (!pictureState) 
    {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir démarrer la prise de photo ?',
      [
        {
          text: 'Annuler',
          onPress: () => {
            setPictureState(false);
          },
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: () => {
            const formData = new FormData();
            formData.append('test', '1')
            try 
            {
              return fetch('http://10.31.251.58/api/testPictureUpdate.php', {
                method: 'POST',                 
                body: formData,
              })
              .then(response => response.json())
              .then(json => {
              if (json != false) 
              {
                console.log('Mise à jour réussie dans la base de données');
                publishMessage("1", "BOUTON/TakePicturesApp")
                publishMessage("ACTIVATION DE LA PRISE DE PHOTOS PAR LE CLIENT !", 'ETATS/PictureApp')
                //const message1 = new Paho.Message("1");
                //message1.destinationName = "BOUTON/TakePicturesApp";
                //mqttClient.send(message1);
                //const message2 = new Paho.Message("ACTIVATION DE LA PRISE DE PHOTOS PAR LE CLIENT !");
                //message2.destinationName = "ETATS/PictureApp";
                //mqttClient.send(message2);
                setPictureState(true);
              } else 
              {
                console.error('Échec de la mise à jour dans la base de données');
                setPictureState(false);
              }})
            } 
            catch (error) 
            {
              console.error('Erreur lors de la requête vers la base de données:', error);
              setPictureState(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
    } 
    else 
    {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir arrêter la prise de photo ?',
      [
        {
          text: 'Annuler',
          onPress: () => {
            setPictureState(true);
          },
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () => 
          {
            setPictureState(false);

            const formData = new FormData();
            formData.append('test', '0')
            try {
              // Envoyer la requête de mise à jour à la base de données
              return fetch('http://10.31.251.58/api/testPictureUpdate.php', {
                method: 'POST',   
                body: formData,
              })
              .then(response => response.json())
              .then(json => {
              if (json != false) 
              {
                console.log('Mise à jour réussie dans la base de données');
                publishMessage("0", "BOUTON/TakePicturesApp")
                publishMessage("DÉSACTIVATION DE LA PRISE DE PHOTO PAR LE CLIENT !", 'ETATS/PictureApp')
                //const message1 = new Paho.Message("0");
                //message1.destinationName = "BOUTON/TakePicturesApp";
                //mqttClient.send(message1);
                //const message2 = new Paho.Message("DÉSACTIVATION DE LA PRISE DE PHOTOS PAR LE CLIENT !");
                //message2.destinationName = "ETATS/PictureApp";
                //mqttClient.send(message2);
              } 
              else 
              {
                console.error('Échec de la mise à jour dans la base de données');
                setPictureState(true);
              }})
            } 
            catch (error) 
            {
              console.error('Erreur lors de la requête vers la base de données:', error);
              setPictureState(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
    }
}

  return (
    <>
      {webcamState ? <MyWebComponent /> : null}
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
       {/*   <Text style={styles.heading}> Gestion Système</Text>
          <View style={styles.section}>
            <Text style={styles.sectionHeading}> Caméra </Text>

            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}> OFF </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={webcamState ? "#28B463" : "#EAFAF1"}
                onValueChange={() => {
                  //setWebcamState(!webcamState)
                  handleWebcamToggle();
                }}
                value={webcamState}
              />
              <Text style={styles.toggleLabel}> ON </Text>
            </View>
          </View>  */}

          <View style={styles.section1}>
            <Text style={styles.sectionHeading}> Installation </Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}> OFF </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isInstallationOn ? "#28B463" : "#EAFAF1"}
                onValueChange={() => {
                  setIsInstallationOn(!isInstallationOn);
                  handleInstallationToggle();
                }}
                value={isInstallationOn}
              />
              <Text style={styles.toggleLabel}> ON </Text>
            </View>
            <Text style={styles.toggleStatus}>
              {isInstallationOn ? "Démarrer" : "Arrêter"}
            </Text>
          </View>

        {/*  <View style={styles.cover}>
            <Logo
              width={"100%"}
              height={height * 0.5}
              right={30}
              fill={primaryColor}
              viewBox={`0 0 ${width} ${height}`}
            />
          </View> */}

          <View style={styles.section2}>
            <Text style={styles.sectionHeading}>LED</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>OFF</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#FFFFFF" }}
                thumbColor={isEnabledColor ? "#28B463" : "#EAFAF1"}
                onValueChange={() => setIsEnabledColor(!isEnabledColor)}
                value={isEnabledColor}
              />
              <Text style={styles.toggleLabel}>ON</Text>
            </View>
            {isEnabledColor && (
              <ColorPicker
                onColorChange={(color) => setPrimaryColor(color)}
                onColorChangeComplete={(color) =>
                  console.log(`ColorP selected: ${color}`)
                }
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={true}
                swatches={false}
              />
            )}
          </View>

          <View style={styles.section5}>
            <Text style={styles.sectionHeading}>Température</Text>
            <Text style={styles.temperatureText}>{ledTemperature} °C</Text>
             <TouchableOpacity
                onPress={() => handleTemperatureMeasurement()}
                style={{
                  backgroundColor: '#321289',
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center', 
                }}
              >
            <Text style={{ color: '#FFFFFF' }}>Mesurer la Température</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.section3}>
            <View style={styles.luminosityLevels}>
              <Text style={styles.sectionHeading}>Seuil de luminosité</Text>

              <View style={styles.luminosityButtonsContainer}>
                <TouchableOpacity
                  style={[
                    styles.luminosityButton,
                    selectedThreshold === "éteint" &&
                      styles.selectedLuminosityButton,
                  ]}
                  onPress={() => setSelectedThreshold("éteint")}
                >
                  <Text style={styles.luminosityButtonText}>Éteint</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.luminosityButton,
                    selectedThreshold === "faible" &&
                      styles.selectedLuminosityButton,
                  ]}
                  onPress={() => setSelectedThreshold("faible")}
                >
                  <Text style={styles.luminosityButtonText}>Faible</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.luminosityButton,
                    selectedThreshold === "moyen" &&
                      styles.selectedLuminosityButton,
                  ]}
                  onPress={() => setSelectedThreshold("moyen")}
                >
                  <Text style={styles.luminosityButtonText}>Moyen</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.luminosityButton,
                    selectedThreshold === "élevé" &&
                      styles.selectedLuminosityButton,
                  ]}
                  onPress={() => setSelectedThreshold("élevé")}
                >
                  <Text style={styles.luminosityButtonText}>Élevé</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View style={styles.section4}>
            <View style={styles.detectgestion}>
              <Text style={styles.sectionHeading}>Détection</Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.textdashboards}>OFF</Text>
                <Switch
                  trackColor={{ false: "#767577", true: "#FFFFFF" }}
                  thumbColor={isEnabledDetection ? "#28B463" : "#EAFAF1"}
                  onValueChange={() => {
                    setIsEnabledDetection(!isEnabledDetection);
                    handleMotionToggle();
                  }}
                  value={isEnabledDetection}
                />
                <Text style={styles.textdashboards}>ON</Text>
              </View>
              {isEnabledDetection && (
                <View style={styles.peopleSelectionContainer}>
                  <Icon
                    name="person-outline"
                    size={30}
                    color={peopleCount === "1" ? "purple" : "grey"}
                    onPress={() => setPeopleCount("1")}
                  />
                  <Icon
                    name="people-outline"
                    size={30}
                    color={peopleCount === "2" ? "purple" : "grey"}
                    onPress={() => setPeopleCount("2")}
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.section6}>
            <Text style={styles.sectionHeading}> Prise de photos </Text>
            <View style={styles.toggleContainer}>
              <Text style={{ ...styles.toggleLabel, color: "#FFFFFF" }}> ON </Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={pictureState ? "#28B463" : "#EAFAF1"}
                onValueChange={() => {
                  setPictureState(!pictureState);
                  handleTakePhotosButton();
                }}
                value={pictureState}
              />
              <Text style={{ ...styles.toggleLabel, color: "#FFFFFF" }}> OFF </Text>
            </View>
          </View>


          <View style={styles.resetallButton}>
            <MyButton
              val="Réinitialiser"
              onPress={handleResetAll}
              icon={<Icon name="refresh-outline" size={20} color="white" />}
            />
          </View>

          <View style={styles.logoutButton}>
            <MyButton
              val="Déconnexion"
              onPress={handleLogout}
              icon={<Icon name="log-out-outline" size={20} color="white" />}
            />
          </View>


        </ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#13043a",
    paddingHorizontal: 0,
    marginTop: 30,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  heading: {
    color: "#FFFFFF",
    marginVertical: 10,
  },
  section: {
    marginBottom: 20,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 30,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: 20,
  },
  section1: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: -20,
  },
  section2: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: -26,
  },
  section3: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: -35,
  },
  section4: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: -40,
  },
  section5: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: -30,
  },
   section6: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: -45,
  },
  sectionHeading: {
    textAlign: "center",
    fontWeight: "bold",
    color: "#FFFFFF",
    fontSize: 18,
    marginBottom: 10,
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  toggleLabel: {
    flex: 1,
    color: "#FFFFFF",
    textAlign: "center",
  },
  toggleStatus: {
    textAlign: "center",
    color: "#FFFFFF",
    marginTop: 10,
  },
  textdashboards: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 10,
    color: "#FFFFFF",
  },
  colormode: {
    marginBottom: 20,
    fontSize: 15,
  },
  temperatureText: {
    color: "white",
  },
  luminosityLevels: {
    marginBottom: 20,
  },
  luminosityButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 10,
  },
  luminosityButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#321289",
  },
  selectedLuminosityButton: {
    backgroundColor: "purple",
    borderColor: "purple",
  },
  luminosityButtonText: {
    color: "white",
    textAlign: "center",
  },
  textdeclanchlum: {
    textAlign: "center",
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFFFFF",
    fontSize: 15,
  },
  detectgestion: {
    marginBottom: 20, // Espacement réduit
  },
  textdetectgestion: {
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
    fontSize: 15,
  },
  colorSelectionContainer: {
    alignItems: "center",
    marginTop: -20,
  },
  colorButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  colorButton: {
    width: width * 0.2,
    margin: width * 0.01,
  },
  peopleSelectionContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  selectedColorIndicator: {
    width: 60,
    height: 20,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
  resetallButton: {
    marginBottom: 40,
    paddingBottom: 40,
    left: 20,
    top: -50,
    width: "100%",
  },
  logoutButton: {
    marginBottom: 40,
    paddingBottom: 40, 
    left: 170,
    top: -190,
    width: "100%",
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(Dashboard);
