import React, { Component } from 'react';
import { View, Text, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import MyButton from '../Components/MyButton';
import DateTimePicker from '@react-native-community/datetimepicker';

class PlageFonction extends Component {
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
    };
  }

  formatTime = (date) => {
    const hours = "0" + date.getHours();
    const minutes = "0" + date.getMinutes();

    return hours.substr(-2) + ':' + minutes.substr(-2);
  }

  addPlage = () => {
    const { endTime, startTime, selectedDay, plages } = this.state;
    if (endTime <= startTime) {
      Alert.alert("Erreur", "L'heure de fin doit être après l'heure de début !");
      return;
    }

    const newPlage = {
      id: Math.random().toString(),
      day: selectedDay,
      startTime: startTime,
      endTime: endTime,
    };

    this.setState(prevState => ({
      plages: [...prevState.plages, newPlage],
      startTime: new Date(),
      endTime: new Date(),
    }));
  }

  renderPlage = ({ item }) => (
    <TouchableOpacity
      onPress={() => this.setState({ selectedPlage: item })}
      style={{
        backgroundColor: this.state.selectedPlage && this.state.selectedPlage.id === item.id ? '#615197' : '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
      }}>
      <Text style={{ color: this.state.selectedPlage && this.state.selectedPlage.id === item.id ? '#FFFFFF' : '#615197' }}>
        {item.day + ' ' + this.formatTime(item.startTime) + ' - ' + this.formatTime(item.endTime)}
      </Text>
    </TouchableOpacity>
  );

  daysOfWeek = ['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'];

  handleStartPickerChange = (event, selectedDate) => {
    this.setState({ showStartPicker: false });

    if (selectedDate) {
      this.setState({ startTime: selectedDate });
    }
  }

  handleEndPickerChange = (event, selectedDate) => {
    this.setState({ showEndPicker: false });

    if (selectedDate) {
      this.setState({ endTime: selectedDate });
    }
  }

  render() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1F1E42' }}>
        <View style={{ flexDirection: 'row', marginBottom: 20, marginTop: 40 }}>
          <View style={{ flex: 1, marginLeft: 25, marginRight: 10 }}>
            <View
              style={{
                borderBottomWidth: 2,
                borderBottomColor: '#615197',
                width: '100%',
                alignSelf: 'center',
              }}
            />
          </View>
          {this.daysOfWeek.map((day, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => this.setState({ selectedDay: day })}
              style={{
                backgroundColor: this.state.selectedDay === day ? '#615197' : '#FFFFFF',
                borderRadius: 100,
                paddingVertical: 10,
                paddingHorizontal: 10,
                marginRight: 5,
                marginLeft: 5,
                alignItems: 'center',
              }}>
              <Text style={{ color: this.state.selectedDay === day ? '#FFFFFF' : '#615197' }}>
                {day}
              </Text>
            </TouchableOpacity>
          ))}
          <View style={{ flex: 1, justifyContent: 'center', marginLeft: 20, marginRight: 20 }}>
            <View
              style={{
                borderBottomWidth: 2,
                borderBottomColor: '#615197',
                width: '100%',
                alignSelf: 'center',
              }}
            />
          </View>
        </View>

        <View style={{ alignContent: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <MyButton onPress={() => this.setState({ showStartPicker: true })} val="Heure de démarrage" />
          {this.state.showStartPicker && (
            <DateTimePicker
              value={this.state.startTime}
              mode={'time'}
              is24Hour={true}
              display="default"
              onChange={this.handleStartPickerChange}
            />
          )}

          <MyButton onPress={() => this.setState({ showEndPicker: true })} val="Heure de fin" />
          {this.state.showEndPicker && (
            <DateTimePicker
              value={this.state.endTime}
              mode={'time'}
              is24Hour={true}
              display="default"
              onChange={this.handleEndPickerChange}
            />
          )}

          <MyButton val="Ajouter plage" onPress={this.addPlage} />
        </View>

        <FlatList
          data={this.state.plages}
          renderItem={this.renderPlage}
          keyExtractor={item => item.id}
        />

        {this.state.selectedPlage &&
          <Text style={{ backgroundColor: '#FFFFFF', color: '#615197' }}>
            Plage sélectionnée: {this.state.selectedPlage.day + ' ' + this.formatTime(this.state.selectedPlage.startTime) + ' - ' + this.formatTime(this.state.selectedPlage.endTime)}
          </Text>
        }

        <MyButton val="Démarrer" onPress={() => alert('Démarrage du programme')} />
      </View>
    );
  }
}

export default PlageFonction;
