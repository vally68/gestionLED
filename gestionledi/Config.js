import React from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Switch, SafeAreaView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
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
        isVisible: true,
        showStartAbsentPicker: false,
        showEndAbsentPicker: false,
      };
    }

    formatTime = (date) => {
      const hours = "0" + date.getHours();
      const minutes = "0" + date.getMinutes();

      return hours.substr(-2) + ':' + minutes.substr(-2);
    }



      setEndTime = (event, selectedDate) =>
      {
          const currentDate = selectedDate;
          this.setState({ endTime: currentDate, showEndPicker: false });
      };

      setStartAbsentDate = (event, selectedDate) =>
      {
          const currentDate = selectedDate || this.state.startAbsentDate;
          this.setState({ startAbsentDate: currentDate, showStartAbsentPicker: false });
      };

      setEndAbsentDate = (event, selectedDate) =>
      {
          const currentDate = selectedDate;
          this.setState({ endAbsentDate: currentDate, showEndAbsentPicker: false });
      };

      ddPlage = () =>
    {
        if(this.state.endTime.getTime() <= this.state.startTime.getTime())
        {
            Alert.alert("Erreur","L'heure de fin doit être après l'heure de début !");
            return;
        }

        const a = this.state.plages
        console.log("start exists : " + a.some(s => (s.startTime.getHours() === this.state.startTime.getHours() && s.startTime.getMinutes() === this.state.startTime.getMinutes())))
        console.log("end exists : " + a.some(s => (s.endTime.getHours() === this.state.endTime.getHours() && s.endTime.getMinutes() === this.state.endTime.getMinutes())))
        console.log("day exists : " + a.some(d => d.day === this.state.selectedDay))
        let da = a.some(d => d.day === this.state.selectedDay)
        let st = a.some(s => (s.startTime.getHours() === this.state.startTime.getHours() && s.startTime.getMinutes() === this.state.startTime.getMinutes()))
        let en = a.some(s => (s.endTime.getHours() === this.state.endTime.getHours() && s.endTime.getMinutes() === this.state.endTime.getMinutes()))
        if(da && st && en)
        {
            Alert.alert("Erreur", "Les données existent déjà dans la plage de fonctionnement !");
            return;
        }
        if(da && a.some(s=> (this.state.startTime <= s.endTime)))
        {

            console.log("std : " + this.state.startTime.getHours())
            console.log("f : " + this.state.endTime.getHours())
            Alert.alert("Erreur","L'heure de début est compris entre 2 !");
            return;
        }



        this.setState(prevState => ({
            plages: [...prevState.plages, {
                id: Math.random().toString(),
                day: prevState.selectedDay,
                startTime: prevState.startTime,
                endTime: prevState.endTime,
            }],
            startTime: new Date(),
            endTime: new Date(),
        }))
    }

    deletePlage = (item) =>
    {
        console.log(item.id)
        Alert.alert("Effacer", "Êtes-vous sûr ?",
        [{
        text:"Yes",
        onPress: () => this.setState({plages:this.state.plages.filter((i) => i.id != item.id)}),
        },
        {text: "Non"}
        ]
      )

    }



    renderPlage = ({ item }) => (
      <TouchableOpacity
        onPress={() => this.setState({ selectedPlage: item })}
        style={[
          styles.plageItem,
          {
            backgroundColor: this.state.selectedPlage && this.state.selectedPlage.id === item.id ? '#615197' : '#FFFFFF',
          }
        ]}>
        <Text style={[
          styles.plageText,
          {
            color: this.state.selectedPlage && this.state.selectedPlage.id === item.id ? '#FFFFFF' : '#615197',
          }
        ]}>
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
        <SafeAreaView style={styles.container}>
          <View style={styles.dayOfWeekContainer}>
            <View style={styles.separator} />
            {this.daysOfWeek.map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => this.setState({ selectedDay: day })}
                style={[
                  styles.dayOfWeekButton,
                  {
                    backgroundColor: this.state.selectedDay === day ? '#615197' : '#FFFFFF',
                  }
                ]}>
                <Text style={[
                  styles.dayOfWeekText,
                  {
                    color: this.state.selectedDay === day ? '#FFFFFF' : '#615197',
                  }
                ]}>
                  {day}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={styles.separator} />
          </View>

          <View style={styles.timePickerContainer}>
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
                    renderItem={({ item }) => (
                      <MyButton
                          onPress={() => {this.setState({ selectedPlage: item }); this.deletePlage(item)}}
                          title={item.day + ' ' + this.formatTime(item.startTime) + ' - ' + this.formatTime(item.endTime)}
                      />
                  )}
                    keyExtractor={(item, index) => index}
/>



                <Text style={{color : 'white'}}>Jour sélectionné : {this.state.selectedDay}</Text>
                <Text style={{color : 'white'}}>Heure de début sélectionnée : {this.state.startTime.toLocaleString()}</Text>
                <Text style={{color : 'white'}}>Heure de fin sélectionnée : {this.state.endTime.toLocaleString()}</Text>

                <Text style={{color : 'white'}}>Mode absent</Text>
                <Switch
                    value={this.state.isSwitchOn}
                    onValueChange={() => this.setState({isSwitchOn: !this.state.isSwitchOn})}
                />
                {
                    this.state.isSwitchOn &&
                    <MyButton
                        onPress={() =>
                            {
                                Alert.alert(
                                    'Informations',
                                    'Date de début : ' + this.state.startAbsentDate + ' et date de fin : ' + this.state.endAbsentDate,
                                    [
                                        {
                                            text: 'Annuler',
                                            onPress: () =>
                                            {
                                                console.log('Bouton Annuler pressé');
                                            },
                                            style: 'cancel',
                                        },
                                        {
                                            text: 'Modifier date de fin',
                                            onPress: () =>
                                            {
                                                if(this.state.endAbsentDate.getTime() <= this.state.startAbsentDate.getTime())
                                                {
                                                    this.setState({showEndAbsentPicker: true})
                                                }
                                                else
                                                {
                                                    Alert.alert("Erreur","L'heure de fin est avant l'heure de début !");
                                                }

                                            }
                                        },
                                        {
                                            text: 'Modifier date de début',
                                            onPress: () =>
                                            {
                                                if(this.state.startAbsentDate.getTime() <= this.state.endAbsentDate.getTime())
                                                {
                                                    this.setState({showStartAbsentPicker: true})
                                                }
                                                else
                                                {
                                                    Alert.alert("Erreur","L'heure de début est avant l'heure de fin !");
                                                }
                                            }
                                        },

                                    ]);
                            }
                        }

                        val="Informations"
                    />

                }
                {this.state.showStartAbsentPicker && this.state.isSwitchOn && (


                        <DateTimePicker
                            value={this.state.startAbsentDate}
                            mode={'date'}
                            is24Hour={true}
                            display="inline"
                            onChange={this.setStartAbsentDate}
                        />
                        )
                }
                {this.state.showEndAbsentPicker && this.state.isSwitchOn && (


                    <DateTimePicker
                        value={this.state.endAbsentDate}
                        mode={'date'}
                        is24Hour={true}
                        display="inline"
                        onChange={this.setEndAbsentDate}
                    />

                    )
                }
                {this.state.isSwitchOn && (
                    <Text style={styles.absence}>Vous avez sélectionné la date d'absence de début: {this.state.startAbsentDate.toLocaleString()} et date de fin : {this.state.endAbsentDate.toLocaleString()}</Text>
                )
                }
                <MyButton val="Démarrer" onPress={() => alert('Démarrage du programme')} />
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
      marginTop: 40,
    },

    separator: {
      flex: 1,
      marginLeft: 25,
      marginRight: 10,
    },

    dayOfWeekButton: {
      backgroundColor: '#FFFFFF',
      borderRadius: 100,
      paddingVertical: 10,
      paddingHorizontal: 10,
      marginRight: 5,
      marginLeft: 5,
      alignItems: 'center',
    },

    dayOfWeekText: {
      color: '#615197',
    },

    timePickerContainer: {
      alignContent: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },

    plageItem: {
      backgroundColor: '#FFFFFF',
      borderRadius: 20,
      padding: 10,
      marginBottom: 10,
      alignItems: 'center',
    },

    plageText: {
      color: '#615197',
    },

    selectedPlageText: {
      backgroundColor: '#FFFFFF',
      color: '#615197',
    },

    absence:{
      color:'red',
      textAlign: 'center',
    },
  });

  export default Config;