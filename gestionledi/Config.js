import React from 'react';
import { View, Text, StyleSheet, Button, Alert, SafeAreaView, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native';
import MyButton from "../Components/MyButton";

class Config extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedDay: 'Lundi',
      startTime: new Date(),
      endTime: new Date(),
      showStartPicker: false,
      showEndPicker: false,
      plages: [],
      selectedPlage: null,
      isSwitchOn: false,
      startAbsentDate: new Date(),
      endAbsentDate: new Date(),
      showStartAbsentPicker: false,
      showEndAbsentPicker: false,
    };
  }

  formatTime = (date) => {
    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

    return `${hours}:${minutes}`;
  };

  setStartTime = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.startTime;
    this.setState({ startTime: currentDate, showStartPicker: false });
  };

  setEndTime = (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({ endTime: currentDate, showEndPicker: false });
  };

  setStartAbsentDate = (event, selectedDate) => {
    const currentDate = selectedDate || this.state.startAbsentDate;
    this.setState({ startAbsentDate: currentDate, showStartAbsentPicker: false });
  };

  setEndAbsentDate = (event, selectedDate) => {
    const currentDate = selectedDate;
    this.setState({ endAbsentDate: currentDate, showEndAbsentPicker: false });
  };

  addPlage = () => {
    if (this.state.endTime.getTime() <= this.state.startTime.getTime()) {
      Alert.alert("Erreur", "L'heure de fin doit être après l'heure de début !");
      return;
    }

    const a = this.state.plages;
    const isStartTimeExists = a.some(s => (
      s.startTime.getHours() === this.state.startTime.getHours() &&
      s.startTime.getMinutes() === this.state.startTime.getMinutes()
    ));
    const isEndTimeExists = a.some(s => (
      s.endTime.getHours() === this.state.endTime.getHours() &&
      s.endTime.getMinutes() === this.state.endTime.getMinutes()
    ));
    const isDayExists = a.some(d => d.day === this.state.selectedDay);

    if (isDayExists && isStartTimeExists && isEndTimeExists) {
      Alert.alert("Erreur", "Les données existent déjà dans la plage de fonctionnement !");
      return;
    }

    if (isDayExists && a.some(s => (this.state.startTime <= s.endTime))) {
      Alert.alert("Erreur", "L'heure de début est comprise entre 2 plages existantes !");
      return;
    }

    this.setState(prevState => ({
      plages: [
        ...prevState.plages,
        {
          id: Math.random().toString(),
          day: prevState.selectedDay,
          startTime: prevState.startTime,
          endTime: prevState.endTime,
          isFavorite: false
        }
      ],
      startTime: new Date(),
      endTime: new Date(),
    }));
  };

  deletePlage = (item) => {
    Alert.alert(
      "Effacer",
      "Êtes-vous sûr ?",
      [
        {
          text: "Oui",
          onPress: () => this.setState({ plages: this.state.plages.filter(i => i.id !== item.id) })
        },
        {
          text: "Non"
        }
      ]
    );
  };

  toggleFavorite = (item) => {
    this.setState(prevState => ({
      plages: prevState.plages.map(p =>
        p.id === item.id ? { ...p, isFavorite: !p.isFavorite } : p
      )
    }));
  };

  toggleSelectedPlage(item) {
    if (item === this.state.selectedPlage) {
      this.setState({ selectedPlage: null });
    } else {
      this.setState({ selectedPlage: item });
    }
  }


  renderPlage = ({ item }) => (
    <View
  style={[
    styles.plageContainer,
    item === this.state.selectedPlage ? styles.selectedPlage : null,
  ]}
>
  <TouchableOpacity
    onPress={() => this.toggleSelectedPlage(item)}
    style={[
      styles.button,
      item === this.state.selectedPlage ? styles.selectedButton : null,
    ]}
  >
    <Text style={styles.buttonText}>{`${item.day} ${this.formatTime(
      item.startTime
    )} - ${this.formatTime(item.endTime)}`}</Text>
  </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.toggleFavorite(item)}
        style={[
            styles.button,
            { backgroundColor: item.isFavorite ? 'purple' : '#615197' },
          ]}
        >
        <Text style={styles.buttonText}>
          {item.isFavorite ? 'Retirer' : 'Favoris'}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => this.deletePlage(item)}
        style={styles.deleteButton}
      >
        <Text style={styles.deleteButtonText}>X</Text>
      </TouchableOpacity>
    </View>
  );


  render() {

    const daysOfWeek = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.dayOfWeekContainer}>
          <View style={styles.separator} />
          {daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.setState({ selectedDay: day })}
              style={[
                styles.dayOfWeekButton,
                {
                  backgroundColor: this.state.selectedDay === day ? '#615197' : '#FFFFFF',
                },
              ]}
            >
              <Text
                style={[
                  styles.dayOfWeekText,
                  {
                    color: this.state.selectedDay === day ? '#FFFFFF' : '#615197',
                  },
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={styles.separator} />
        </View>

        <View style={styles.timePickerContainer}>
          <Text style={styles.label}>Heure de début :</Text>
          <Button
            onPress={() => this.setState({ showStartPicker: true })}
            title={this.formatTime(this.state.startTime)}
            icon={<Icon name="time-outline" size={20} color="black" />}
            color="#000000"
          />
          {this.state.showStartPicker && (
            <DateTimePicker
              value={this.state.startTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={this.setStartTime}
            />
          )}
        </View>

        <View style={styles.timePickerContainer}>
          <Text style={styles.label}>Heure de fin :</Text>
          <Button
            onPress={() => this.setState({ showEndPicker: true })}
            title={this.formatTime(this.state.endTime)}
            icon={<Icon name="time-outline" size={20} color="black" />}
            color="#000000"
          />
          {this.state.showEndPicker && (
            <DateTimePicker
              value={this.state.endTime}
              mode="time"
              is24Hour={true}
              display="default"
              onChange={this.setEndTime}
            />
          )}
        </View>

        <MyButton
          onPress={this.addPlage} // corrected function name
          title="Ajouter plage" // corrected title
        />

        <FlatList
          style={styles.flatlist}
          data={this.state.plages}
          renderItem={this.renderPlage}
          keyExtractor={(item) => item.id}
        />

        <Text style={{ color: 'white' }}>Mode absent</Text>
        <Switch
          value={this.state.isSwitchOn}
          onValueChange={() => this.setState({ isSwitchOn: !this.state.isSwitchOn })}
        />

        {this.state.isSwitchOn && (
          <View style={styles.informationButton}>
            <MyButton
              onPress={() =>
                Alert.alert(
                  'Informations',
                  'Date de début : ' +
                    this.state.startAbsentDate +
                    ' et date de fin : ' +
                    this.state.endAbsentDate,
                  [
                    {
                      text: 'Annuler',
                      onPress: () => {
                        console.log('Bouton Annuler pressé');
                      },
                      style: 'cancel',
                    },
                    {
                      text: 'Modifier date de fin',
                      onPress: () => {
                        if (this.state.endAbsentDate.getTime() <= this.state.startAbsentDate.getTime()) {
                          this.setState({ showEndAbsentPicker: true });
                        } else {
                          Alert.alert("Erreur", "L'heure de fin est avant l'heure de début !");
                        }
                      },
                    },
                    {
                      text: 'Modifier date de début',
                      onPress: () => {
                        if (this.state.startAbsentDate.getTime() <= this.state.endAbsentDate.getTime()) {
                          this.setState({ showStartAbsentPicker: true });
                        } else {
                          Alert.alert("Erreur", "L'heure de début est avant l'heure de fin !");
                        }
                      },
                    },
                  ]
                )}
              title="Informations"
            />

            {this.state.showStartAbsentPicker && this.state.isSwitchOn && (
              <DateTimePicker
                value={this.state.startAbsentDate}
                mode={'date'}
                is24Hour={true}
                display="inline"
                onChange={this.setStartAbsentDate}
              />
            )}

            {this.state.showEndAbsentPicker && this.state.isSwitchOn && (
              <DateTimePicker
                value={this.state.endAbsentDate}
                mode={'date'}
                is24Hour={true}
                display="inline"
                onChange={this.setEndAbsentDate}
              />
            )}

            {this.state.isSwitchOn && (
              <Text style={styles.absence}>
                Date d'absence sélectionnée début: {this.state.startAbsentDate.toLocaleString()} et date de fin :{' '}
                {this.state.endAbsentDate.toLocaleString()}
              </Text>
            )}
          </View>
        )}

        <MyButton
          onPress={() => alert('Démarrage du programme')}
          title="Démarrer"
        />
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1F1E42',
    marginTop: 35,
  },

  dayOfWeekContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
  },

  separator: {
    flex: 1,
    marginLeft: 25,
    marginRight: 10,
  },

  dayOfWeekButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 100,
    paddingVertical: 8,
    paddingHorizontal: 9,
    marginRight: 5,
    marginLeft: 5,
    alignItems: 'center',
  },

  dayOfWeekText: {
    fontSize: 16,
    fontWeight: 'bold',
  },

  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop:5,
    paddingBottom: 5,
    marginBottom: 10,
    borderRadius: 50,
    backgroundColor:'#FFFFFF',

  },

  label: {
    marginRight: 10,
    color: '#615197',
    textAlign: 'center'
  },

  flatlist: {
    marginTop: 20,
    marginBottom: 20,
    width: '80%',


  },

  plageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  selectedPlage: {
    backgroundColor: '#615197',
    borderRadius:20,
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#615197',
    marginRight: 10,
  },
  selectedButton: {
    backgroundColor: '##342F6D',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  favoriteButtonText: {
    fontWeight: 'normal',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 100,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },

  informationButton: {
    marginTop: -5,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  absence: {
    marginTop: 10,
    color: '#FF0A0A',
  },
});

export default Config;
