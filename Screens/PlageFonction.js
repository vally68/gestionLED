import React, { useState } from 'react';
import { View, Text, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import MyButton from '../Components/MyButton';
import DateTimePicker from '@react-native-community/datetimepicker';

const PlageFonction = () => {
  const [selectedDay, setSelectedDay] = useState('Lundi');
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [plages, setPlages] = useState([]);
  const [selectedPlage, setSelectedPlage] = useState(null);

  const formatTime = (date) => {
    const hours = "0" + date.getHours();
    const minutes = "0" + date.getMinutes();

    return hours.substr(-2) + ':' + minutes.substr(-2);
  }

  const addPlage = () => {
    if (endTime <= startTime) {
      Alert.alert("Erreur", "L'heure de fin doit être après l'heure de début !");
      return;
    }

    setPlages(prevPlages => [
      ...prevPlages,
      {
        id: Math.random().toString(),
        day: selectedDay,
        startTime: startTime,
        endTime: endTime,
      }
    ]);

    setStartTime(new Date());
    setEndTime(new Date());
  }

  const renderPlage = ({ item }) => (
    <TouchableOpacity
      onPress={() => setSelectedPlage(item)}
      style={{
        backgroundColor: selectedPlage && selectedPlage.id === item.id ? '#615197' : '#FFFFFF',
        borderRadius: 20,
        padding: 10,
        marginBottom: 10,
        alignItems: 'center',
      }}>
      <Text style={{ color: selectedPlage && selectedPlage.id === item.id ? '#FFFFFF' : '#615197' }}>
        {item.day + ' ' + formatTime(item.startTime) + ' - ' + formatTime(item.endTime)}
      </Text>
    </TouchableOpacity>
  );

  const daysOfWeek = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

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
        {daysOfWeek.map((day, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setSelectedDay(day)}
            style={{
              backgroundColor: selectedDay === day ? '#615197' : '#FFFFFF',
              borderRadius: 100,
              paddingVertical: 10,
              paddingHorizontal: 15,
              marginRight: 5,
              marginLeft: 5,
              alignItems: 'center',
            }}>
            <Text style={{ color: selectedDay === day ? '#FFFFFF' : '#615197' }}>
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
        <MyButton onPress={() => setShowStartPicker(true)} val="Heure de demarrage" />
        {showStartPicker && (
          <DateTimePicker
            value={startTime}
            mode={'time'}
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => setStartTime(selectedDate)}
          />
        )}

        <MyButton onPress={() => setShowEndPicker(true)} val="Heure de fin" />
        {showEndPicker && (
          <DateTimePicker
            value={endTime}
            mode={'time'}
            is24Hour={true}
            display="default"
            onChange={(event, selectedDate) => setEndTime(selectedDate)}
          />
        )}

        <MyButton val="Ajouter plage" onPress={addPlage} />
      </View>

      <FlatList
        data={plages}
        renderItem={renderPlage}
        keyExtractor={item => item.id}
      />

      {selectedPlage &&
        <Text style={{ backgroundColor: '#FFFFFF', color: '#615197' }}>
          Plage sélectionnée: {selectedPlage.day + ' ' + formatTime(selectedPlage.startTime) + ' - ' + formatTime(selectedPlage.endTime)}
        </Text>
      }

      <MyButton val="Démarrer" onPress={() => alert('Démarrage du programme')} />
    </View>
  );
}

export default PlageFonction;
