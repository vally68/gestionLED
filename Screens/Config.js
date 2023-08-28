import React from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native';

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

   renderPlage = ({ item }) => (
    <TouchableOpacity
      style={[styles.plageContainer, item === this.state.selectedPlage && styles.selectedPlage]}
      onPress={() => this.setState({ selectedPlage: item })}
    >
      <View style={styles.plageInfo}>
        <Text style={styles.plageText}>
          {`${item.day} ${this.formatTime(item.startTime)} - ${this.formatTime(item.endTime)}`}
        </Text>
        <View style={styles.plageButtons}>
          <TouchableOpacity
            onPress={() => this.toggleFavorite(item)}
            style={[
              styles.plageButton,
              { backgroundColor: item.isFavorite ? '#FF6F61' : '#66BB6A' },
            ]}
          >
            <Text style={styles.plageButtonText}>
              {item.isFavorite ? 'Retirer' : 'Favoris'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => this.deletePlage(item)}
            style={[styles.plageButton, { backgroundColor: 'red' }]}
          >
            <Text style={styles.plageButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  render() {
  const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuration</Text>

      <View style={styles.pickerContainer}>
        <Text style={styles.label}>Jour :</Text>
        <Picker
          selectedValue={this.state.selectedDay}
          style={styles.picker}
          onValueChange={(itemValue, itemIndex) => this.setState({ selectedDay: itemValue })}
        >
          {daysOfWeek.map((day, index) =>
            <Picker.Item key={index} label={day} value={day} />
          )}
        </Picker>
      </View>

      <View style={styles.timePickerContainer}>
        <Text style={styles.label}>Heure de début :</Text>
        <Button
          onPress={() => this.setState({ showStartPicker: true })}
          title={this.formatTime(this.state.startTime)}
          icon={<Icon name="time-outline" size={20} color="black" />}
          color="#0080FF"
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
          color="#0080FF"
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

      <Button
        title="Ajouter plage"
        onPress={this.addPlage}
        color="#0080FF"
        icon={<Icon name="add-outline" size={20} color="black" />}
      />

      <Text style={styles.sectionTitle}>Plages de fonctionnement :</Text>
      <FlatList
        data={this.state.plages}
        renderItem={this.renderPlage}
        keyExtractor={item => item.id}
      />

    <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Mode absent :</Text>
      <Switch
        value={this.state.isSwitchOn}
        onValueChange={() => this.setState({ isSwitchOn: !this.state.isSwitchOn })}
      />

      {this.state.isSwitchOn && (
        <View style={[styles.absentModeDetails, { color: '#FFFFFF' }]}>
           <TouchableOpacity
      onPress={() => {
        Alert.alert(
          'Informations',
          `Date de début : ${this.state.startAbsentDate.toLocaleString()}\nDate de fin : ${this.state.endAbsentDate.toLocaleString()}`,
          [
            {
              text: 'Annuler',
              onPress: () => console.log('Bouton Annuler pressé'),
              style: 'cancel',
            },
            {
              
                text: 'Modifier date de fin',
                onPress: () => {
                  if (this.state.endAbsentDate.getTime() <= this.state.startAbsentDate.getTime()) {
                    this.setState({ showEndAbsentPicker: true });
                    Alert.alert(
                      "Date de fin",
                      "Vous venez de sélectionner la date de fin !",
                      [
                        { text: "OK", onPress: () => console.log("OK Pressed"), style: 'cancel', color: 'white' }
                      ],
                      { cancelable: false }
                    );
                  } else {
                    Alert.alert(
                      "Erreur",
                      "L'heure de fin est avant l'heure de début !",
                      [
                        { text: "OK", onPress: () => console.log("OK Pressed"), style: 'cancel', color: 'white' }
                      ],
                      { cancelable: false }
                    );
                  }
                }
              },
              {
                text: 'Modifier date de début',
                onPress: () => {
                  if (this.state.startAbsentDate.getTime() <= this.state.endAbsentDate.getTime()) {
                    this.setState({ showStartAbsentPicker: true });
                    Alert.alert(
                      "Date de début",
                      "Vous venez de sélectionner la date de début !",
                      [
                        { text: "OK", onPress: () => console.log("OK Pressed"), style: 'cancel', color: 'white' }
                      ],
                      { cancelable: false }
                    );
                  } else {
                    Alert.alert(
                      "Erreur",
                      "L'heure de début est avant l'heure de fin !",
                      [
                        { text: "OK", onPress: () => console.log("OK Pressed"), style: 'cancel', color: 'white' }
                      ],
                      { cancelable: false }
                    );
                  }
                }
              },
          ]
        );
      }}
      style={styles.infoButton}
    >
       <Text style={[styles.infoButtonText, { color: 'white' }]}>Informations</Text>
      <Icon name="information-circle-outline" size={20} color="black" />
    </TouchableOpacity>

          {this.state.showStartAbsentPicker && (
            <DateTimePicker
              value={this.state.startAbsentDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={this.setStartAbsentDate}
            />
          )}

          {this.state.showEndAbsentPicker && (
            <DateTimePicker
              value={this.state.endAbsentDate}
              mode="date"
              is24Hour={true}
              display="default"
              onChange={this.setEndAbsentDate}
            />
          )}

          <Text style={styles.selectedDates}>
            Vous avez sélectionné les dates suivantes :
          </Text>
          <Text style={styles.selectedDates}>
            Date absence de début : {this.state.startAbsentDate.toLocaleDateString()}
          </Text>
          <Text style={styles.selectedDates}>
            Date de fin : {this.state.endAbsentDate.toLocaleDateString()}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.startButton}
        onPress={() => alert('Démarrage du programme')}
      >
        <Icon name="play-outline" size={20} color="black" />
        <Text style={styles.startButtonLabel}>Démarrer</Text>
      </TouchableOpacity>
    </View>
  );
}
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#13043a',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    left: 75,
    color: 'white',
    marginBottom: 16,
  },
  pickerContainer: {
    marginBottom: 16,
  },
  label: {
    color: 'white',
    marginRight: 8,
    fontSize: 16,
  },
  picker: {
    color: 'white',
    height: 50,
  },
  timePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 20,
    marginBottom: 10,
  },
  plageContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    padding: 10,
    elevation: 2,
  },
  selectedPlage: {
    backgroundColor: '#0080FF',
  },
  plageInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  plageText: {
    flex: 1,
    color: 'black',
    fontSize: 16,
  },
  plageButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  plageButton: {
    padding: 5,
    borderRadius: 5,
    marginLeft: 5,

  },
  plageButtonText: {
    color: 'black',
  },
  absentModeContainer: {
    marginTop: 20,
  },
  absentModeDetails: {
    marginTop: 10,
    color: 'white',
  },
  infoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  infoButtonText: {
    marginRight: 5,
  },
  selectedDate: {
    color: 'red',
    marginBottom: 5,
  },
  startButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#0080FF',
    borderRadius: 10,
    paddingVertical: 12,
  },
  startButtonLabel: {
    color: 'white',
    fontSize: 18,
    marginLeft: 8,
  },
});

export default Config;
