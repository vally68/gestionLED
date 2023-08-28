import React, { Component } from 'react';
import { Text, SafeAreaView, StyleSheet, View, Switch, ScrollView, Dimensions } from 'react-native';
import { connect } from 'react-redux';
import { AuthContext } from '../fonction/AuthContext';
import { logoutSuccess } from '../reducer/UserReducer';
import MySlider from '../Components/MySlider';
import MyButton from "../Components/MyButton";
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

class Dashboard extends Component {
  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.state = {
      isEnabledColor: false,
      isEnabledDetection: false,
      isInstallationOn: false,
      selectedColor: '#FFFFFF',
      peopleCount: '1',
    };
  }

  handleLogout = () => {
    this.context.setIsLoggedin(false); 
    this.props.dispatch(logoutSuccess(false));
  };

  handleColorButtonPress = (color) => {
    this.setState({ selectedColor: color });
  };

  handleResetColor = () => {
    this.setState({ selectedColor: '#FFFFFF' });
  };

  handleResetAll = () => {
    this.setState({
      isEnabledColor: false,
      isEnabledDetection: false,
      isInstallationOn: false,
      selectedColor: '#FFFFFF',
    });
  };

  render() {
    const { isEnabledColor, isEnabledDetection, isInstallationOn, selectedColor, peopleCount } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
         <Text style={styles.textdashboards}>
        Installation
        </Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={styles.textdashboards}>
            OFF
          </Text>
          <Switch
            trackColor={{ false: '#767577', true: '#81b0ff' }}
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
            Seuil de déclenchement de la luminosité
          </Text>
          <MySlider />
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
              onPress={this.handleResetAll}
              icon={<Icon name="refresh-outline" size={20} color="black" />}
            />
          </View>
          <View style={styles.logoutButton}>
            <MyButton
              val="Déconnexion"
              onPress={this.handleLogout}
              icon={<Icon name="log-out-outline" size={20} color="black" />}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#13043a',
    marginTop: 35,
    paddingLeft: 10,
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 80,
    paddingRight: 100,
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
    width: '80%', // pour le design responsive
  },

  logoutButton: {
    marginBottom: 40,
    width: '80%', // pour le design responsive
  },
});

const mapStateToProps = (state) => ({
  isLoggedIn: state.isLoggedIn,
});

export default connect(mapStateToProps)(Dashboard);
