import React from 'react';
import { View, Text, Button, FlatList, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyButton from "../Components/MyButton";
import DateTimePickerModal from 'react-native-modal-datetime-picker';

class Config extends React.Component 
{
    constructor(props) 
    {
        super(props);

        this.state = 
        {
            selectedDay: 'Lundi',
            startTime: new Date(),
            endTime: new Date(),
            showStartPicker: false,
            showEndPicker: false,
            plages: [],
            selectedPlage: null,
        };
    }

    formatTime = (date) => 
    {
        const hours = "0" + date.getHours();
        const minutes = "0" + date.getMinutes();

        return hours.substr(-2) + ':' + minutes.substr(-2);
    }

    setStartTime = (selectedDate) => 
    {
        const currentDate = selectedDate || this.state.startTime;
        this.setState({ startTime: currentDate, showStartPicker: false });
    };

    setEndTime = (selectedDate) => 
    {
        const currentDate = selectedDate || this.state.endTime;
        this.setState({ endTime: currentDate, showEndPicker: false });
    };

    addPlage = () => 
    {
        if(this.state.endTime <= this.state.startTime)
        {
            Alert.alert("Erreur","L'heure de fin doit être après l'heure de début !");
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

    renderPlage = ({ item }) => (
        <Button
            onPress={() => this.setState({ selectedPlage: item })}
            title={item.day + ' ' + this.formatTime(item.startTime) + ' - ' + this.formatTime(item.endTime)}
        />
    );

    render() {
        const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

        return (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor:'#1F1E42' }}>
                <Picker
                    selectedValue={this.state.selectedDay}
                    style={{ height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedDay: itemValue })}>
                    {daysOfWeek.map((day, index) =>
                        <Picker.Item key={index} label={day} value={day} />
                    )}
                </Picker>

                <View style={{ alignContent: 'center', justifyContent: 'center', marginBottom: 20 }}>
                    <MyButton onPress={() => this.setState({ showStartPicker: true })} val="Heure de demarrage" />
                    {this.state.showStartPicker && (
                        <DateTimePicker
                            value={this.state.startTime}
                            mode={'time'}
                            is24Hour={true}
                            display="default"
                            onChange={this.setStartTime}
                        />
                    )}

                    <MyButton onPress={() => this.setState({ showEndPicker: true })} val="Heure de fin" />
                    {this.state.showEndPicker && (
                        <DateTimePicker
                            value={this.state.endTime}
                            mode={'time'}
                            is24Hour={true}
                            display="default"
                            onChange={this.setEndTime}
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
                    <Text  style={{backgroundColor: '#FFFFFF', color: '#615197',}}>Plage sélectionnée: {this.state.selectedPlage.day + ' ' + this.formatTime(this.state.selectedPlage.startTime) + ' - ' + this.formatTime(this.state.selectedPlage.endTime)}</Text>
                }


                <MyButton val="Démarrer" onPress={() => alert('Démarrage du programme')} />
            </View>
        );
    }
}

export default Config;