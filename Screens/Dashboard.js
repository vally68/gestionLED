import React, { useState, useEffect, useContext } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Switch, ScrollView, Dimensions, Button,luminosityLevel, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import { AuthContext } from '../fonction/AuthContext';
import { logoutSuccess } from '../reducer/UserReducer';
import MyButton from '../Components/MyButton';
import MySlider from '../Components/MySlider';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import init from 'react_native_mqtt';
import Logo from '../assets/logo.svg';
import ColorPicker from 'react-native-wheel-color-picker';


const { width } = Dimensions.get('window');
const { height } = Dimensions.get('window');


function Dashboard({ dispatch, isLoggedIn }) {
  const { setIsLoggedin } = useContext(AuthContext);
  const [isEnabledColor, setIsEnabledColor] = useState(false);
  const [isEnabledDetection, setIsEnabledDetection] = useState(false);
  const [isInstallationOn, setIsInstallationOn] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [peopleCount, setPeopleCount] = useState('1');
  const [temperature, setTemperature] = useState(0);
  const [brightness, setBrightness] = useState(0);
  const [primaryColor, setPrimaryColor] = useState('white');
  const [presence, setPresence] = useState(0);
  const [buttonState, setButtonState] = useState(0);
  const [luminosityLevel, setLuminosityLevel] = useState("éteint");

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken'); // Supprime le token
    setIsLoggedin(false); // Met à jour l'état local
    dispatch(logoutSuccess(false)); // Met à jour l'état dans le store Redux
  };
  const handleColorButtonPress = (color) => {
    setSelectedColor(color);
  };

  const handleResetColor = () => {
    setSelectedColor('#FFFFFF');
  };

  const handleResetAll = () => {
    setIsEnabledColor(false);
    setIsEnabledDetection(false);
    setIsInstallationOn(false);
    setSelectedColor('#FFFFFF');
  };

  function onConnect(client) 
  {
    client.subscribe('TEMP/value');
    client.subscribe('LUM/threshold');
    client.subscribe('PIR1/presence')
    client.subscribe('BOUTON/on_off');
  }

   function onMessageArrived(message) 
  {
    switch(message.topic) 
    {
      case 'TEMP/value':
        setTemperature(message.payloadString);
        if(temperature >= 10 && temperature <= 20)
        {
          setPrimaryColor('yellow');
        }
        else
        {
          if(temperature < 10)
          {
            setPrimaryColor('blue');
          }
          else
          {
            setPrimaryColor('red');
          }
        }
        
        break;
      case 'LUM/threshold':
        setBrightness(message.payloadString);
        break;
      case 'PIR1/presence':
        setPresence(message.payloadString);
        break;
      case 'BOUTON/on_off':
        setButtonState(message.payloadString);
        break;
    }
  }

  useEffect(() => 
  {
    init({
      size: 10000,
      storageBackend: AsyncStorage,
      defaultExpires: 1000 * 3600 * 24,
      enableCache: true,
      reconnect: true,
      sync : {}
    });

    const client = new Paho.MQTT.Client('10.31.251.144', 9002, 'username');
    client.connect({ onSuccess: () => onConnect(client) });
    client.onMessageArrived = onMessageArrived;

  }, [])

  

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        
        <Text style={styles.heading}>Gestion</Text>
        
        <View style={styles.section}>
          <Text style={styles.sectionHeading}>Installation</Text>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>OFF</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={isInstallationOn ? '#28B463' : '#EAFAF1'}
              onValueChange={() => setIsInstallationOn(!isInstallationOn)}
              value={isInstallationOn}
            />
            <Text style={styles.toggleLabel}>ON</Text>
          </View>
          <Text style={styles.toggleStatus}>
            {isInstallationOn ? 'Démarrer' : 'Arrêter'}
          </Text>
        </View>
        <View style={styles.cover}>
                <Logo width={"100%"} height={"60%"} right={30} fill={primaryColor} viewBox= {`0 0 ${width} ${height}`} />
              </View>
               <View style={styles.section2}>
          <Text style={styles.sectionHeading}>Mode de Couleur</Text>
          <View style={styles.toggleContainer}>
            <Text style={styles.toggleLabel}>Température</Text>
            <Switch
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={isEnabledColor ? '#28B463' : '#EAFAF1'}
              onValueChange={() => setIsEnabledColor(!isEnabledColor)}
              value={isEnabledColor}
            />
            <Text style={styles.toggleLabel}>Couleur</Text>
          </View>
          {isEnabledColor && (
            <ColorPicker
              
              onColorChange={(color) => setPrimaryColor(color)}
              onColorChangeComplete={color => console.log(`ColorP selected: ${color}`)}
              thumbSize={30}
              sliderSize={30}
              noSnap={true}
              row={true}
              swatches={false}
            />
          )}
        </View>

        
        <View style={styles.luminosityLevels}>
          <Text style={styles.textdeclanchlum}>
            Seuil de déclenchement de la luminosité
          </Text>
          <View style={styles.luminosityButtonsContainer}>
            <TouchableOpacity
              style={[
                styles.luminosityButton,
                luminosityLevel === "éteint" && styles.selectedLuminosityButton,
              ]}
              onPress={() => setLuminosityLevel("éteint")}
            >
              <Text style={styles.luminosityButtonText}>Éteint</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.luminosityButton,
                luminosityLevel === "faible" && styles.selectedLuminosityButton,
              ]}
              onPress={() => setLuminosityLevel("faible")}
            >
              <Text style={styles.luminosityButtonText}>Faible</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.luminosityButton,
                luminosityLevel === "moyen" && styles.selectedLuminosityButton,
              ]}
              onPress={() => setLuminosityLevel("moyen")}
            >
              <Text style={styles.luminosityButtonText}>Moyen</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.luminosityButton,
                luminosityLevel === "élevé" && styles.selectedLuminosityButton,
              ]}
              onPress={() => setLuminosityLevel("élevé")}
            >
              <Text style={styles.luminosityButtonText}>Élevé</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.detectgestion}>
          <Text style={styles.textdetectgestion}>
            Détection
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={styles.textdashboards}>
              OFF
            </Text>
            <Switch
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={isEnabledDetection ? '#28B463' : '#EAFAF1'}
              onValueChange={() => setIsEnabledDetection(!isEnabledDetection)}
              value={isEnabledDetection}
            />
            <Text style={styles.textdashboards}>
              ON
            </Text>
          </View>
          {isEnabledDetection && (
            <View style={styles.peopleSelectionContainer}>
              <Icon
                name='person-outline'
                size={30}
                color={peopleCount === '1' ? 'blue' : 'grey'}
                onPress={() => setPeopleCount('1')}
              />
              <Icon
                name='people-outline'
                size={30}
                color={peopleCount === '2' ? 'blue' : 'grey'}
                onPress={() => setPeopleCount('2')}
              />
            </View>
          )}
           </View>
         
        <View style={styles.resetallButton}>
          <MyButton
            val="Réinitialiser"
            onPress={handleResetAll}
            icon={<Icon name="refresh-outline" size={20} color="black" />}
          />
        </View>

        <View style={styles.logoutButton}>
          <MyButton
            val="Déconnexion"
            onPress={handleLogout}
            icon={<Icon name="log-out-outline" size={20} color="black" />}
          />
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13043a',
    marginTop: 35,
    paddingHorizontal: 0,
  },
  
  logo: {
      left:0,
      
  },

  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  heading: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#FFFFFF',
    marginVertical: 20,
  },

  section: {
    marginBottom: 30,
    backgroundColor: '#1E1E3B',
    borderRadius: 10,
    padding: 10,
  },
  section2: {
    marginBottom: 10,
    backgroundColor: '#1E1E3B',
    borderRadius: 10,
    padding: 10,
    top: -300,
  },

  sectionHeading: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 18,
    marginBottom: 10,
  },

  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  toggleLabel: {
    flex: 1,
    color: '#FFFFFF',
    textAlign: 'center',
  },

  toggleStatus: {
    textAlign: 'center',
    color: '#FFFFFF',
    marginTop: 10,
  },
  textdashboards: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 15,
    marginBottom: 10,
    color: '#FFFFFF',
  },


  colormode: {
    marginBottom: 30,
    marginTop: 30,
    fontSize: 15,
  },


  luminosityLevels: {
  marginBottom: 30,
  marginTop: 30,
  },

  luminosityButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },

  luminosityButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'gray',
  },

  selectedLuminosityButton: {
    backgroundColor: 'blue', // Ajoutez la couleur que vous préférez
    borderColor: 'blue',
  },

  luminosityButtonText: {
    color: 'white',
    textAlign: 'center',
  },


  textdeclanchlum: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
    fontSize: 15,
  },


  detectgestion: {
    marginBottom: 30,
    marginTop: 30,
  },


  textdetectgestion: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'white',
    fontSize: 15,
  },


  colorSelectionContainer: {
    alignItems: 'center',
    marginTop: -20,
  },


  colorButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginVertical: 10,
  },


   colorButton: {
    width: width * 0.2, 
    margin: width * 0.01, 
  },

  peopleSelectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
  },


  selectedColorIndicator: {
    width: 60,
    height: 20,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
  },

  resetallButton: {

    marginBottom: 20,
    left: 75,
    width: '80%', 
  },

  logoutButton: {
    marginBottom: 4000,
    left: 75,
    width: '80%',
  },
  
});
const mapStateToProps = (state) => ({
  isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(Dashboard);