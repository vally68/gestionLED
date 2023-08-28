import React, { useState, useContext } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Switch, ScrollView, Dimensions, Button,luminosityLevel, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { AuthContext } from '../fonction/AuthContext';
import { logoutSuccess } from '../reducer/UserReducer';
import MyButton from '../Components/MyButton';
import MySlider from '../Components/MySlider';
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

function Dashboard({ dispatch, isLoggedIn }) {
  const { setIsLoggedin } = useContext(AuthContext);
  const [isEnabledColor, setIsEnabledColor] = useState(false);
  const [isEnabledDetection, setIsEnabledDetection] = useState(false);
  const [isInstallationOn, setIsInstallationOn] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const [peopleCount, setPeopleCount] = useState('1');

  const handleLogout = () => {
    setIsLoggedin(false); 
    dispatch(logoutSuccess(false));
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

  const [luminosityLevel, setLuminosityLevel] = useState("éteint");

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

        <View style={styles.section}>
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
        </View>
        
        {isEnabledColor && (
          <View style={styles.section}>
            <Text style={styles.sectionHeading}>Sélection de Couleur</Text>
            <View style={styles.colorButtonsContainer}>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#000080')}
                  color="#000080"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#0000FF')}
                  color="#0000FF"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#00FFFF')}
                  color="#00FFFF"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#008080')}
                  color="#008080"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#008000')}
                  color="#008000"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#00FF7F')}
                  color="#00FF7F"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#32CD32')}
                  color="#32CD32"
                />
            </View>

              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#00FF00')}
                  color="#00FF00"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#800080')}
                  color="#800080"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#FF00FF')}
                  color="#FF00FF"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#FF1493')}
                  color="#FF1493"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#FF69B4')}
                  color="#FF69B4"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#FF0000')}
                  color="#FF0000"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#FF6347')}
                  color="#FF6347"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#FFA500')}
                  color="#FFA500"
                />
              </View>
              <View style={styles.colorButton}>
                <Button
                  title=""
                  onPress={() => handleColorButtonPress('#FFFF00')}
                  color="#FFFF00"
                />
              </View>
            </View>
            <View style={styles.selectedColorIndicator} />
            <View style={styles.colorButton}>
              <MyButton
                val="Réinitialiser"
                onPress={handleResetColor}
              />
            </View>
          </View>
        )}
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
    paddingHorizontal: 10,
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
    padding: 20,
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
    marginBottom: 40,
    left: 75,
    width: '80%',
  },
  
});
const mapStateToProps = (state) => ({
  isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(Dashboard);
