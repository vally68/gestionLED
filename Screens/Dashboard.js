import React, { useState, useEffect, useContext } from "react";
import {Text, SafeAreaView, StyleSheet, View, Switch, ScrollView, Dimensions, TouchableOpacity, Alert} from "react-native";
import { connect } from "react-redux";
import { AuthContext } from "../fonction/AuthContext";
import { logoutSuccess } from "../reducer/UserReducer";
import MyButton from "../Components/MyButton";
import Icon from "react-native-vector-icons/Ionicons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import init from "react_native_mqtt";
//import Logo from "../assets/logo.svg";
import ColorPicker from "react-native-wheel-color-picker";
import Paho from "paho-mqtt";
import  Slider  from '@react-native-community/slider';
//import { WebView } from "react-native-webview";
const { width } = Dimensions.get("window");
//const { height } = Dimensions.get("window");
function Dashboard({ dispatch, isLoggedIn }) 
{
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
  const [alimentationButtonState, setAlimentationButtonState] = useState(0);
  //const [luminosityLevel, setLuminosityLevel] = useState("sombre");
  const [selectedThreshold, setSelectedThreshold] = useState("sombre");
  const [mqttClient, setMqttClient] = useState(null);
  const [webcamState, setWebcamState] = useState(false);
  const [ledTemperature, setLedTemperature] = useState(0);
  const [pictureMessage, setPictureMessage] = useState("");
  const [pictureState, setPictureState] = useState(false);
  const [luminosityValue, setLuminosityValue] = useState(4000);
  const [seuilInferieur, setSeuilInferieur] = useState(512);
  const [seuilSuperieur, setSeuilSuperieur] = useState(1024);
  const [sliderBrightness, setSliderBrightness] = useState(0);
  const [mAlimentation, setMAlimentation] = useState(0);
  const [rColor, setRColor] = useState(null);
  const [gColor, setGColor] = useState(null);
  const [bColor, setBColor] = useState(null);
  ////////////////////////////////////////////////////////////////////////////////////////////
  // MQTT
  ///////////////////////////////////////////////////////////////////////////////////////////
  const initializeMQTTClient = () => 
  {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync: {},
    });
    const client = new Paho.Client("ws://10.31.251.58:9003/mqtt", "Mobile Client");
    client.onMessageArrived = onMessageArrived;
    return client;
  };
const onConnect = (client) => 
{
  console.log('Connected to MQTT broker');
  // température
  client.subscribe('TEMP/value');
  // luminosité
  client.subscribe('LUM/threshold');
  client.subscribe('BOUTON/AppBrightness');
  // Détection de mouvement
  client.subscribe('PIR1/presence');
  client.subscribe('BOUTON/appPresence');
  client.subscribe('ETATS/BoutonPresenceApp');
  // Alimentation  
  //client.subscribe('BOUTON/on_off');
  //client.subscribe('ETATS/BoutonApp');
  client.subscribe('BOUTON/AppAlimentation');
  client.subscribe('MC/alimentation');
  // Prise de photos
  //client.subscribe('BOUTON/TakePicturesAck');
  client.subscribe('BOUTON/TakePictureApp');
  client.subscribe('ETATS/PictureApp');
  client.subscribe('ETATS/ConnectionStatus');
  // Permissions
  client.subscribe('ETATS/PictureApp');
  // Couleurs des led
  client.subscribe('BOUTON/AppColors');
  client.subscribe('BOUTON/AppLEDMode');
}
useEffect(() => 
{
  const client = initializeMQTTClient();
  client.connect({ onSuccess: () => onConnect(client) });
  setMqttClient(client);
}, []);
const publishMessage = (messageText, topic) => 
{
    if (!mqttClient) 
    {
      console.error("MQTT client not initialized in publishMessage function !");
      return;
    }
    console.log("Envoi message");
    mqttClient.subscribe(topic);
    const message = new Paho.Message(messageText);
    message.destinationName = topic;
    mqttClient.send(message);
  };
  const onMessageArrived = (message) => 
  {
    switch (message.topic) 
    {
      case "TEMP/value":
        setTemperature(message.payloadString);
        if (temperature >= 10 && temperature <= 20) 
        {
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
      case "MC/alimentation": 
        
          setMAlimentation(message.payloadString);
        
      break;
      case "BOUTONPictureController": 
        setPictureMessage(message.payloadString);
        break;  
    }
  };
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  //// DECONNEXION
  ////////////////////////////////////////////////////////////////////////////////////////////////////
  const handleLogout = async () => 
  {
    publishMessage("client déconnecté", "ETATS/ConnectionStatus");
    await AsyncStorage.removeItem("userToken"); // Supprime le token
    setIsLoggedin(false); // Met à jour l'état local
    dispatch(logoutSuccess(false)); // Met à jour l'état dans le store Redux
  };
  const handleResetColor = () => 
  {
    setSelectedColor("#FFFFFF");
  };
  const handleResetAll = () => 
  {
    setIsEnabledColor(false);
    setIsEnabledDetection(false);
    //setIsInstallationOn(false);
    handleResetColor();
    setSelectedThreshold("éteint"); // Réinitialise le seuil de luminosité
  };
  //////////////////////////////////////////////////////////////////////////////////////////
  //// USE EFFECT AU DÉMARRAGE
  /////////////////////////////////////////////////////////////////////////////////////////
  useEffect(() => 
  {
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
  // Permissions
  ////////////////////////////////////////////////////////////////////////////////////////////////////////
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
/*
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
*/
          } else {
/*
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
*/
          }
        } else {
          console.error(
            "Échec de la récupération de l'état de l'installation depuis la base de données"
          );
        }
      });
      ////////////////////////////////////////////////////////////////////////
    // Alimentation
    /////////////////////////////
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
            //setMAlimentation(1)
            //Alert.alert("Les microcontrôleurs sont allumés");
          } else {
            //setMAlimentation(0)
            setIsInstallationOn(false);
           // Alert.alert("Les microcontrôleurs sont éteints");
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
    // Appeler la fonction pour récupérer l'état de l'installation lors du montage du composant
    fetchInstallationStatus();
    
////////////////////////////////////////////////////////////////////////////////////////////////////////////
    // Détection 
    ///////////////////////////////////////////////////////////////////////////////////////////////
    const fetchDetectionStatus = async () => {
      try {
        // Envoyer une requête GET pour récupérer l'état de la détection depuis la base de données
        const response = await fetch(
          "http://10.31.251.58/api/testPresence.php",
          {
            method: "POST", // Utilisez la méthode GET pour obtenir l'état actuel
          }
        );
        if (response.ok) 
        {
          // Analyser la réponse JSON
          const data = await response.json();
          console.log(data);
          // Assurez-vous que "value" est une propriété de l'objet JSON
          if (data === "1") 
          {
            // La valeur est "1", mettez à jour le bouton sur "ON"
            setPresence(true);
          } else {
            // La valeur n'est pas "1", mettez à jour le bouton sur "OFF"
            setPresence(false);
          }
        } else {
          console.error(
            "Échec de la récupération de l'état de la détection depuis la base de données"
          );
        }
      } catch (error) 
      {
        console.error(
          "Erreur lors de la récupération de l'état de la détection depuis la base de données:",
          error
        );
      }
    };
        // Appeler la fonction pour récupérer l'état de la détection lors du montage du composant
        fetchDetectionStatus();
        fetch("http://10.31.251.58/api/testAppMotion.php", 
        {
          method: "POST",
          headers: {
            "Content-type": "multipart/form-data",
          },
        })
          .then((response) => response.json())
          .then((data) => 
          {
            if (data) 
            {
              console.log("Réponse État App Motion: " + data);
              
              if (data == "1") {
                Alert.alert(
                  "État activé",
                  "Bouton de détection activé !",
                  [
                    {
                      text: "OK",
                      onPress: () => 
                      {
                        console.log("Oui pressé")
                        setIsEnabledDetection(true)
                        
                      }
                    },
                  ]
                );
              } else {
                Alert.alert(
                  "État désactivée",
                  "Bouton de détection désactivé !",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                      {
                        console.log("OK")
                        setIsEnabledDetection(false)
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
    ///////////////////////////////////////////////////////////////////////////////////////////////////////////      
    // Récupération de la luminosité
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
  const fetchLuminosityThreshold = async () => 
  {
  try {
    // Envoyer une requête GET pour récupérer la valeur de luminosité depuis la base de données
    const response = await fetch("http://10.31.251.58/api/luminosity.php", {
      method: "POST", // Utilisez la méthode GET pour obtenir la valeur actuelle
    });
    if (response.ok) {
      // Analyser la réponse JSON
      const data = await response.json();
      console.log("testL", data);
      // Assurez-vous que "LuminosityValue" est une propriété de l'objet JSON
      if (data) {
        // Obtenez la valeur de luminosité depuis la réponse JSON
        const luminosityValue = parseInt(data);
        // Mettez à jour la valeur du slider ici
        setSelectedThreshold(luminosityValue);
        // Simplifiez la logique pour déterminer le seuil en fonction de la valeur
        if (luminosityValue <= seuilInferieur) {
          setSelectedThreshold("sombre");
        } else {
          setSelectedThreshold("éclairé");
        }
      } else {
        console.error('La propriété "LuminosityValue" est manquante dans la réponse JSON');
      }
    } else {
      console.error("Échec de la récupération de la valeur de luminosité depuis la base de données");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la valeur de luminosité depuis la base de données:", error);
  }
};
    // Appeler la fonction pour récupérer la valeur de luminosité lors du montage du composant
    fetchLuminosityThreshold();
/////////////////////////////////////////////////////////////////////////////////////////////////////
    // temperature
    ///////////////////////////////////////////////////////////////////////////////////
    const fetchTemperature = async () => 
  {
    try 
    {
    // Envoyer une requête GET pour récupérer la valeur de luminosité depuis la base de données
    const response = await fetch("http://10.31.251.58/api/temperature.php", 
    {
      method: "POST", // Utilisez la méthode GET pour obtenir la valeur actuelle
    });
    if (response.ok) 
    {
      // Analyser la réponse JSON
      const data = await response.json();
      console.log("testT", data);
      // Assurez-vous que "LuminosityValue" est une propriété de l'objet JSON
      if (data) 
      {
        // Obtenez la valeur de luminosité depuis la réponse JSON
        const temperatureValue = parseInt(data);
        // Mettez à jour la valeur du slider ici
        setTemperature(temperatureValue);
      } else {
        console.error('La propriété "temperatureValue" est manquante dans la réponse JSON');
      }
    } else {
      console.error("Échec de la récupération de la valeur de luminosité depuis la base de données");
    }
  } catch (error) {
    console.error("Erreur lors de la récupération de la valeur de luminosité depuis la base de données:", error);
  }
};
    // Appeler la fonction pour récupérer la valeur de luminosité lors du montage du composant
    fetchTemperature();
//////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //PRISE DE PHOTOS
    //////////////////////////////////////////////////////////////////////////////////////////
    fetch("http://10.31.251.58/api/testPicture.php", 
    {
      method: "POST",
      headers: {
        "Content-type": "multipart/form-data",
      },
    })
      .then((response) => response.json())
      .then((data) => 
      {
        if (data) 
        {
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
      ////////////////////////////////////////////////////////////////////////////////////////////
      // ETAT MODE LED
      ///////////////////////////////////////////////////////////////////////////////////
      fetch("http://10.31.251.58/api/testLEDMode.php", 
      {
        method: "POST",
        headers: 
        {
        "Content-type": "multipart/form-data",
        }
      })
      .then((response) => response.json())
      .then((data) => 
      {
        if (data) 
        {
          console.log("Réponse État LED MODE: " + data);
          if (data == "1") 
          {
            Alert.alert(
              "État activé",
              "LED MODE activée !",
              [
                {
                  text: "OK",
                  onPress: () => 
                  {
                    console.log("Oui pressé")
                    setIsEnabledColor(true)
                  }
                },
              ]
            );
          } else {
            Alert.alert(
              "État désactivée",
              "LED MODE désactivée !",
              [
                {
                  text: "OK",
                  onPress: () =>
                  {
                    console.log("OK")
                    setIsEnabledColor(false)
                  }
                },
              ]
            );
          }
        } else {
          console.error("Échec de la récupération de l'état de l'installation depuis la base de données");
        }
      });
    
  }, []);
//////////////////////////////////////////////
/// MAJ DES COMPOSANTS
////////////////////////////////////////////////
useEffect(() => 
{
  if(mAlimentation == 0)
  {
    
    const formData = new FormData();
    formData.append("test", "0");
    try 
    {
      fetch("http://10.31.251.58/api/alimentationUpdate.php", 
      {
        method: "POST",
        body: formData,
      })
      .then((response) => response.json())
      .then((json) => 
      {
      if (json != false) 
      {
        setIsInstallationOn(false)
        console.log("Mise à jour réussie dans la base de données");
        publishMessage("ARRÊT DES MC PAR L'EXTERIEUR !","ETATS/BoutonApp");
        publishMessage("0", "BOUTON/AppAlimentation");
      } 
      else 
      {
        console.error("Échec de la mise à jour dans la base de données");
        // Rétablir l'état local en cas d'échec
        setIsInstallationOn(true); // Passer l'état à ON
      }
                  });
    } 
    catch (error) 
    {
      console.error("Erreur lors de la requête vers la base de données:", error);
      // Rétablir l'état local en cas d'erreur
      setIsInstallationOn(true); // Passer l'état à ON
     }
  }
  else
  {
    const formData = new FormData();
    formData.append("test", "1");
    try 
    {
      fetch("http://10.31.251.58/api/alimentationUpdate.php", 
      {
        method: "POST",
        body: formData,
      })
      .then((response) => response.json())
      .then((json) => 
      {
        if (json != false) 
        {
          setIsInstallationOn(true)
          console.log("Mise à jour réussie dans la base de données");
          
          publishMessage("DÉMARRAGE DES MICROCONTROLLEURS EXT !", "ETATS/BoutonApp");
          publishMessage("1", "BOUTON/AppAlimentation");
        } 
          
        else 
        {
          console.error("Échec de la mise à jour dans la base de données");
          // Rétablir l'état local en cas d'échec
          setIsInstallationOn(false); // Passer l'état à OFF
        }
      });
      } 
      
      catch (error) 
      {
        console.error("Erreur lors de la requête vers la base de données:", error);
        // Rétablir l'état local en cas d'erreur
        setIsInstallationOn(false); // Passer l'état à OFF
      }
  }
}, [mAlimentation])
 ///////////////////////////////////////////////////////////////////////////////////
 //// BOUTON DE L'ALIMENTATION
 //////////////////////////////////////// 
  const handleInstallationToggle = async () => 
  {
    if (!mqttClient) 
    {
      console.error("MQTT client not initialized");
      return;
    }
    // Vérifier l'état actuel de l'installation
    if (!isInstallationOn) 
    {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir démarrer l'installation ?",
        [
          {
            text: "Annuler",
            onPress: () => 
            {
              setIsInstallationOn(false); // Rétablir l'état local à OFF
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: async () => 
            {
              setIsInstallationOn(true); // Passer l'état à ON
              const formData = new FormData();
              formData.append("test", "1");
              try 
              {
                return fetch("http://10.31.251.58/api/alimentationUpdate.php", 
                {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((json) => 
                  {
                    if (json != false) 
                    {
                      console.log(
                        "Mise à jour réussie dans la base de données"
                      );
                      publishMessage(
                        "DÉMARRAGE DES MICROCONTROLLEURS PAR LE CLIENT !",
                        "ETATS/BoutonApp"
                      );
                      publishMessage(
                        "1", 
                        "BOUTON/AppAlimentation");
                    } else 
                    {
                      console.error(
                        "Échec de la mise à jour dans la base de données"
                      );
                      // Rétablir l'état local en cas d'échec
                      setIsInstallationOn(false); // Passer l'état à OFF
                    }
                  });
              } catch (error) 
              {
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
    } else 
    {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir arrêter l'installation ?",
        [
          {
            text: "Annuler",
            onPress: () => {
              setIsInstallationOn(true); // Rétablir l'état local à ON
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: () => {
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
                    if (json != false) 
                    {
                      console.log(
                        "Mise à jour réussie dans la base de données"
                      );
                      publishMessage(
                        "ARRÊT DES MICROCONTROLLEURS PAR LE CLIENT!",
                        "ETATS/BoutonApp"
                      );
                      publishMessage("0", "BOUTON/AppAlimentation");
                    } else 
                    {
                      console.error(
                        "Échec de la mise à jour dans la base de données"
                      );
                      // Rétablir l'état local en cas d'échec
                      setIsInstallationOn(true); // Passer l'état à ON
                    }
                  });
              } catch (error) 
              {
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
      setIsInstallationOn(!isInstallationOn);
    }
  };
  /////////////////////////////////////////////////////////////////////////////////////////
  /// BOUTON DE LA DÉTECTION
  //////////////////////////////////////////////////////////////////////////////////////////
  const handleMotionToggle = () => 
  {
    if (!mqttClient) 
    {
      console.error("MQTT client not initialized");
      return;
    }
    if (!isEnabledDetection) 
    {
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
                return fetch("http://10.31.251.58/api/testAppMotionUpdate.php", {
                  method: "POST",
                  body: formData,
                })
                  .then((response) => response.json())
                  .then((json) => {
                    if (json != false) 
                    {
                      console.log(
                        "Mise à jour réussie dans la base de données"
                      );
                      publishMessage(
                        "ACTIVATION DE LA DÉTECTION DE PRÉSENCE PAR LE CLIENT !",
                        "ETATS/BoutonPresenceApp"
                      );
                      publishMessage(
                        "1",
                        "BOUTON/appPresence"
                      );
                    } else 
                    {
                      console.error(
                        "Échec de la mise à jour dans la base de données"
                      );
                      // Rétablir l'état local en cas d'échec
                      setIsEnabledDetection(false); // Passer l'état à OFF
                    }
                  });
              } catch (error) 
              {
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
    } else 
    {
      Alert.alert(
        "Confirmation",
        "Êtes-vous sûr de vouloir arrêter la détection ?",
        [
          {
            text: "Annuler",
            onPress: () => 
            {
              setIsEnabledDetection(true); // Rétablir l'état local à ON
            },
            style: "cancel",
          },
          {
            text: "Oui",
            onPress: async () => 
            {
              setIsEnabledDetection(false); // Passer l'état à OFF
              // Définir la nouvelle valeur à envoyer à la base de données
              //const newValue2 = '0';
              const formData = new FormData();
              formData.append("test", "0");
              try {
                // Envoyer la requête de mise à jour à la base de données
                return fetch("http://10.31.251.58/api/testAppMotionUpdate.php", {
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
                      publishMessage(
                        "0",
                        "BOUTON/appPresence"
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
  ///////////////////////////////////////////////////////////////////////////////////////////////////////
/// MODIFICATION DE LA LUMINOSITÉ
////////////////////////////////////////////////////////////////////////////////
  const fetchUpdatedLuminosityValue = async (newValue) => 
  {
    const formData = new FormData();
    formData.append("test", newValue.toString());
    try 
    {
      // Envoiez la nouvelle valeur du slider à l'API pour la mettre à jour dans la base de données
      fetch("http://10.31.251.58/api/testAppBrightnessUpdate.php", 
      {
        method: "POST", // Utilisez la méthode POST pour envoyer la nouvelle valeur
        body: formData,
      })
      .then((response) => response.json())
      .then((json) => 
      {
        if (json != false)
        {
          // La valeur a été mise à jour avec succès dans la base de données
        console.log("Nouvelle valeur de luminosité mise à jour avec succès :", newValue);
        publishMessage(newValue.toString(), "BOUTON/AppBrightness");
      }else{
        console.error("Échec de la mise à jour de la valeur de luminosité dans la base de données");
      }})
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la valeur de luminosité :", error);
    }
  };
///////////////////////////////////////////////////////////////////////////////////////////
/// SLIDER DE LA LUMINOSITÉ
     const handleSliderChange = (value) => 
     {
    // Mettez à jour la valeur de luminosité en fonction de la position du slider
    setLuminosityValue(value);
    // Appel de la fonction fetch pour mettre à jour la valeur dans la base de données
    fetchUpdatedLuminosityValue(value);
    // Simplifiez la logique pour déterminer le seuil en fonction de la valeur
    if (value <= seuilInferieur) 
    {
      setSelectedThreshold("sombre");
    } else 
    {
      setSelectedThreshold("éclairé");
    }
    };
///////////////////////////////////////////////////////////////////////////////////
/// BOUTON MESURE TEMPÉRATURE
/////////////////////
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
  ///////////////////////////////////////////////////////////////////////////////////////////////
  /// BOUTON DE LA PRISE DE PHOTO
  ///////////////////////////////////////////////////////////////////////////////////////////////
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
////////////////////////////////////////////////////////////////////////////////////////////////////
/// BOUTON MODE LED
/////////////////////////////////////////////////////////////////////////////////////////////////////////
const handleLEDModeButton = async () =>
{
  if (!mqttClient) 
  {
    console.error('MQTT client not initialized');
    return;
  }
   if (!isEnabledColor) 
    {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir démarrer le mode LED ?',
      [
        {
          text: 'Annuler',
          onPress: () => {
            setIsEnabledColor(false)
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
              return fetch('http://10.31.251.58/api/testLEDModeUpdate.php', {
                method: 'POST',                 
                body: formData,
              })
              .then(response => response.json())
              .then(json => {
              if (json != false) 
              {
                console.log('Mise à jour réussie dans la base de données');
                publishMessage("1", "BOUTON/AppLEDMode")
                publishMessage("ACTIVATION DU MODE LED PAR LE CLIENT !", 'ETATS/AppLEDMode')
                
                setIsEnabledColor(true)
              } else 
              {
                console.error('Échec de la mise à jour dans la base de données');
                setIsEnabledColor(false)
              }})
            } 
            catch (error) 
            {
              console.error('Erreur lors de la requête vers la base de données:', error);
              setIsEnabledColor(false)
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
      'Êtes-vous sûr de vouloir arrêter le mode LED ?',
      [
        {
          text: 'Annuler',
          onPress: () => {
            setIsEnabledColor(true)
          },
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () => 
          {
            setIsEnabledColor(false)
            const formData = new FormData();
            formData.append('test', '0')
            try {
              // Envoyer la requête de mise à jour à la base de données
              return fetch('http://10.31.251.58/api/testLEDModeUpdate.php', {
                method: 'POST',   
                body: formData,
              })
              .then(response => response.json())
              .then(json => {
              if (json != false) 
              {
                console.log('Mise à jour réussie dans la base de données');
                publishMessage("0", "BOUTON/AppLEDMode")
                publishMessage("DESACTIVATION DU MODE LED PAR LE CLIENT !", 'ETATS/AppLEDMode')
              } 
              else 
              {
                console.error('Échec de la mise à jour dans la base de données');
                setIsEnabledColor(true)
              }})
            } 
            catch (error) 
            {
              console.error('Erreur lors de la requête vers la base de données:', error);
              setIsEnabledColor(false)
            }
          },
        },
      ],
      { cancelable: false }
    );
    }
}
//////////////////////////////////////////////////////////////////////////////////
/// FONCTION DE LA CONVERSION HÉXA VERS DÉCIMAL
    function hexToRGB(hex) {
    if (hex.startsWith("#")) {
      hex = hex.substring(1);
    }
    if (hex.length !== 6) {
      throw new Error("La chaîne hexadécimale doit avoir exactement 6 caractères.");
    }
    const r = parseInt(hex.substring(0, 2), 16);
    setRColor(r)
    const g = parseInt(hex.substring(2, 4), 16);
    setGColor(g)
    const b = parseInt(hex.substring(4, 6), 16);
    setBColor(b)
    console.log(`La valeur RVB de ${hex} est (${r}, ${g}, ${b})`);
    publishMessage(`${r} ${g} ${b}`, "BOUTON/AppColors")
    return { r, g, b };
  }
/////////////////////////////////////////////////////////////////////////////////////////////
/// AFFICHAGE DU STREAM WEBCAM
//////////////////////////////////////////////////////////////////////////////////////////////
  /*}  const MyWebComponent = () => {
    return (
      <WebView source={{ uri: "http://10.31.251.58:8080/?action=stream" }} />
    );
  };
/////////////////////////////////////////////////////////////////////////////////////////////
/// BOUTON DU WEBCAM
//////////////////////////////////////////////////////////////////////////////////////////////  
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
/////////////////////////////////////////////////////////////////////////////////////////////
/// RENDER
//////////////////////////////////////////////////////////////////////////////////////////////
  return (
    <>
      {/*webcamState ? <MyWebComponent /> : null*/}
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
          {/*  <View style={styles.cover}>
            <Logo
              width={"100%"}
              height={height * 0.5}
              right={30}
              fill={primaryColor}
              viewBox={`0 0 ${width} ${height}`}
            />
          </View> */}
        
          
{/*////////////////////////////////////////////////////////////////////////////////////////////
/// AFFICHAGE DE l'ALIMENTATION
/////////////////////////////////////////////////////////////////////////////////////////////*/}
        
          <View style={styles.section1}>
            <Text style={styles.sectionHeading}>Installation</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>OFF</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={isInstallationOn ? "#28B463" : "#800080"} // Utilisez violet pour OFF et vert pour ON
                onValueChange={() => {
                 // setIsInstallationOn(!isInstallationOn);
                  handleInstallationToggle();
                }}
                value={isInstallationOn}
              />
              <Text style={styles.toggleLabel}>ON</Text>
            </View>
            <Text style={styles.toggleStatus}>
              {isInstallationOn ? "Démarrer" : "Arrêter"}
            </Text>
          </View>
{/*////////////////////////////////////////////////////////////////////////////////////////////
/// AFFICHAGE DU MODE LED
/////////////////////////////////////////////////////////////////////////////////////////////*/}
{ isInstallationOn &&
          <View style={styles.section2}>
            <Text style={styles.sectionHeading}>LED</Text>
            <View style={styles.toggleContainer}>
              <Text style={styles.toggleLabel}>OFF</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#FFFFFF" }}
                thumbColor={isEnabledColor ? "#28B463" : "#800080"} // Utilisez violet pour OFF et vert pour ON
                onValueChange={() => {
                  //setIsEnabledColor(!isEnabledColor); 
                  handleLEDModeButton();}
                }
                value={isEnabledColor}
              />
              <Text style={styles.toggleLabel}>ON</Text>
            </View>
            {isEnabledColor && (
              <ColorPicker
                ref={r => { this.picker = r }}
                color="#FF0000"
                onColorChange={(color) => setPrimaryColor(color)}
                onColorChangeComplete={(color) => {
                  console.log(`ColorP selected: ${color}`);
                  hexToRGB(color);
                }}
                thumbSize={30}
                sliderSize={30}
                noSnap={true}
                row={true}
                swatches={false}
              />
            )}
            <Text style={{ color: '#FFFFFF' }}>R : {rColor}, G : {gColor}, B : {bColor}</Text>
          </View>
}
{/*////////////////////////////////////////////////////////////////////////////////////////////
/// AFFICHAGE DU SEUIL DE LA LUMINOSITÉ
/////////////////////////////////////////////////////////////////////////////////////////////*/}
{ isInstallationOn &&
          <View style={styles.section3}>
            <Text style={styles.sectionHeading}>Seuil de luminosité</Text>
            <Text style={styles.whiteText}>Min: 0</Text>
            <Text style={styles.whiteText}>Max: 9999</Text>
            <Text style={styles.whiteText}>Capteur luminosity: {brightness} </Text>
            <Slider
              style={styles.slider}
              minimumValue={0}
              maximumValue={9999}
              step={1}
              value={luminosityValue}
              onValueChange={(value) => {
                // Mettez à jour la valeur de luminosité en fonction de la position du slider
                handleSliderChange(value);
              }}
              thumbTintColor="purple" // Couleur de la poignée du slider
            />
            <Text style={styles.whiteText}>Luminosity Value: {luminosityValue} </Text>
           
          </View>
}
{/*////////////////////////////////////////////////////////////////////////////////////////////
/// AFFICHAGE DE LA DÉTECTION
/////////////////////////////////////////////////////////////////////////////////////////////*/}
{ isInstallationOn &&
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
                  thumbColor={isEnabledDetection ? "#28B463" : "#800080"} // Utilisez violet pour OFF et vert pour ON
                  onValueChange={() => {
                    //setIsEnabledDetection(!isEnabledDetection);
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
                    color={presence === "1" ? "purple" : "grey"}
                    onPress={() => setPeopleCount("1")}
                  />
                  <Text style={{ color: '#FFFFFF', fontSize: presence ? 10 : 10 }}>
                  {presence === "1" ? 'PRÉSENCE DÉTECTÉE' : 'AUCUNE PRÉSENCE DÉTECTÉE'}
                  </Text>
                </View>
              )}
            </View>
          </View>
}
{/*////////////////////////////////////////////////////////////////////////////////////////////
/// AFFICHAGE DE LA TEMPÉRATURE
/////////////////////////////////////////////////////////////////////////////////////////////*/}
{ isInstallationOn &&
          <View style={styles.section5}>
            <Text style={styles.sectionHeading}>Température</Text>
            <Text style={styles.temperatureText}>{ledTemperature} °C</Text>
             <TouchableOpacity
                onPress={() => handleTemperatureMeasurement()}
                style={{
                  backgroundColor: '#321289',
                  borderWidth:1,
                  borderColor: "white",
                  padding: 10,
                  borderRadius: 5,
                  alignItems: 'center', 
                }}
              >
            <Text style={{ color: '#FFFFFF' }}>Mesurer la Température</Text>
            </TouchableOpacity>
          </View>
}
{/*////////////////////////////////////////////////////////////////////////////////////////////
/// AFFICHAGE DE LA PRISE DE PHOTO
/////////////////////////////////////////////////////////////////////////////////////////////*/}
{ isInstallationOn &&
          <View style={styles.section6}>
            <Text style={styles.sectionHeading}>Prise de photos</Text>
            <View style={styles.toggleContainer}>
              <Text style={{ ...styles.toggleLabel, color: "#FFFFFF" }}>OFF</Text>
              <Switch
                trackColor={{ false: "#767577", true: "#81b0ff" }}
                thumbColor={pictureState ? "#28B463" : "#800080"} // Utilisez violet pour OFF et vert pour ON
                onValueChange={() => {
                  //setPictureState(!pictureState);
                  handleTakePhotosButton();
                }}
                value={pictureState}
              />
              <Text style={{ ...styles.toggleLabel, color: "#FFFFFF" }}>ON</Text>
            {pictureState ?(
            pictureMessage != "" 
            ? (<Text style= {{ color: '#FFFFFF', fontSize: pictureMessage ? 10 : 10 }}>Dernière image prise {pictureMessage}</Text>)
            : (<Text style= {{ color: '#FFFFFF', fontSize: pictureMessage ? 10 : 10 }}>Aucune image prise</Text>)
            ) :(null)
            }
            </View>
          </View>
}
              
          <View style={styles.resetallButton}>
            <MyButton
              val="Réinitialiser"
              onPress={handleResetAll}
              icon={<Icon name="refresh-outline" size={15} color="white" />}
            />
          </View>
          <View style={styles.logoutButton}>
            <MyButton
              val="Déconnexion"
              onPress={handleLogout}
              icon={<Icon name="log-out-outline" size={15} color="white" />}
            />
          </View>
          
        </ScrollView>
      </SafeAreaView>
    </>
  );
}
/*////////////////////////////////////////////////////////////////////////////////////////////
/// STYLESHEET
/////////////////////////////////////////////////////////////////////////////////////////////*/
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
  section1: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: 40,
  },
  section2: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: 40,
  },
  section3: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: 40,
  },
  section4: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: 40,
  },
  section5: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: 40,
  },
   section6: {
    marginBottom: 20,
    backgroundColor: "#1E1E3B",
    borderRadius: 10,
    padding: 10,
    top: 40,
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
  luminosityButton1: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  luminosityButton2: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#fff",
  },
  selectedLuminosityButton1: {
    backgroundColor: "#3d3a3a",
    borderColor: "#3d3a3a",
  },
  selectedLuminosityButton2: {
    backgroundColor: "#f6dd39",
    borderColor: "#f6dd39",
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
    left: 0,
    top: 120,
    width: "100%",
  },
  logoutButton: {
    marginBottom: 40,
    paddingBottom: 40, 
    left: 0,
    top: -80,
    width: "100%",
  },
  whiteText: {
    color: "#FFFFFF"
  }
});
const mapStateToProps = (state) => ({
  isLoggedIn: state.isLoggedIn,
});
export default connect(mapStateToProps)(Dashboard);
