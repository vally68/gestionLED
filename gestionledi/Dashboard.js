import React, { useState, useContext, useRef } from 'react';
import { Text, Button, SafeAreaView, StyleSheet, View, Switch, ScrollView } from 'react-native';
import { connect } from 'react-redux';
import { AuthContext } from './AuthContext';
import { logoutSuccess } from '../store/reducer/UserReducer';
import MySlider from '../Components/MySlider';
import MyButton from "../Components/MyButton";

function Dashboard({ dispatch, isLoggedIn }) {
  const { setIsLoggedin } = useContext(AuthContext);
  const [isEnabledColor, setIsEnabledColor] = useState(false);
  const [isInstallationOn, setIsInstallationOn] = useState(false);
  const [isEnabledDetection, setIsEnabledDetection] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#FFFFFF');
  const sliderRef = useRef();

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
    setSelectedColor('#FFFFFF');
    sliderRef.current.resetSliderValue();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.texttitle}>
          TABLEAU DE BORD
        </Text>
          <Text style={styles.textdashboards}>
          Statut :

        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.textdashboards}>
            OFF
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#FFFFFF' }}
            thumbColor={isInstallationOn ? '#28B463' : '#EAFAF1'}
            onValueChange={() => setIsInstallationOn(!isInstallationOn)}
            value={isInstallationOn}
          />
          <Text style={styles.textdashboards}>
            ON
          </Text>
        </View>
        <Text style={styles.textdashboards}>
          {isInstallationOn ? 'Démarrer' : 'Arrêter'}
        </Text>

        <View style={styles.colormode}>

          <Text style={styles.textcolormode}>
            Mode de couleur
          </Text>

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>

            <Text style={styles.textdashboards}>
              Température
            </Text>

            <Switch
              trackColor={{ false: '#767577', true: '#FFFFFF' }}
              thumbColor={isEnabledColor ? '#28B463' : '#EAFAF1'}
              onValueChange={() => setIsEnabledColor(!isEnabledColor)}
              value={isEnabledColor}
            />

            <Text style={styles.textdashboards}>
              Couleur
            </Text>

          </View>
        </View>

        {isEnabledColor && (
          <View style={styles.colorSelectionContainer}>

            <Text style={styles.textcolormode}>
              Sélection de couleur
            </Text>

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
            <View style={[styles.selectedColorIndicator, { backgroundColor: selectedColor }]} />
            <View style={styles.colorButton}>
              <MyButton
                val="Réinitialiser"
                onPress={handleResetColor}
              />
            </View>
          </View>
        )}


        <View style={styles.declanchluminosity}>

          <Text style={styles.textdeclanchlum}>
            Gestion du seuil de déclenchement de la luminosité
          </Text>

          <MySlider ref={sliderRef} />

        </View>


        <View style={styles.detectgestion}>

          <Text style={styles.textdetectgestion}>
            Gestion de détection
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
        </View>

        <MyButton
          val="Réinitialiser tout"
          onPress={handleResetAll}
        />

        <MyButton
          val="Déconnexion"
          onPress={handleLogout}
        />
        {isLoggedIn && (
          <Button
            title="Déconnexion"
            onPress={handleLogout}
          />
        )}


      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1E42',
    marginTop: 35,
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 80,
    paddingRight: 100,
  },

  texttitle: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
  },

  textdashboards: {
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#FFFFFF',
  },

  colormode: {
    marginBottom: 30,
    marginTop: 30,
    fontSize: 15,
  },

  textcolormode: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#FFFFFF',
    fontSize: 15,
  },

  declanchluminosity: {
    marginBottom: 30,
    marginTop: 30,
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
    width: '20%',
    margin: 4,
  },

  selectedColorIndicator: {
    width: 60,
    height: 20,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'gray',
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(Dashboard);
