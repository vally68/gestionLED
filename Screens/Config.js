import React from 'react';
import { View, Text, Button, FlatList, Alert, Modal,StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import MyButton from "../Components/MyButton";
import { Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';

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
            isSwitchOn: false,
            startAbsentDate: new Date(),
            endAbsentDate: new Date(),
            isVisible: true,
            showStartAbsentPicker: false,
            showEndAbsentPicker: false,
        };
    }

    formatTime = (date) => 
    {
        const hours = "0" + date.getHours();
        const minutes = "0" + date.getMinutes();

        return hours.substr(-2) + ':' + minutes.substr(-2);
    }

    setStartTime = (event, selectedDate) => 
    {
        const currentDate = selectedDate || this.state.startTime;
        this.setState({ startTime: currentDate, showStartPicker: false });
    };

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

    addPlage = () => 
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
                    style={{ color: 'white', height: 50, width: 150 }}
                    onValueChange={(itemValue, itemIndex) => this.setState({ selectedDay: itemValue })}>
                    {daysOfWeek.map((day, index) =>
                        <Picker.Item key={index} label={day} value={day} />
                    )}
                </Picker>

                <View style={{ alignContent: 'center', justifyContent: 'center', marginBottom: 20 }}>
                   <MyButton
                      onPress={() => this.setState({ showStartPicker: true })}
                      val="Heure de début"
                      icon={<Icon name="time-outline" size={20} color="black" />}
                    />

                    {this.state.showStartPicker && (
                        <DateTimePicker
                            value={this.state.startTime}
                            mode={'time'}
                            is24Hour={true}
                            display="default"
                            onChange={this.setStartTime}
                        />
                    )}

                    <MyButton
                      onPress={() => this.setState({ showEndPicker: true })}
                      val="Heure de fin"
                      icon={<Icon name="time-outline" size={20} color="black" />}
                    />
                    {this.state.showEndPicker && (
                        <DateTimePicker
                            value={this.state.endTime}
                            mode={'time'}
                            is24Hour={true}
                            display="default"
                            onChange={this.setEndTime}
                        />
                    )}

                    <MyButton
                      val="Ajouter plage"
                      onPress={this.addPlage}
                      icon={<Icon name="add-outline" size={20} color="black" />}
                    />
                </View>

                <FlatList
                    data={this.state.plages}
                    renderItem={({ item }) => (
                      <Button
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
                                    'Date de début : ' + this.state.startAbsentDate.toLocaleString() + '\nDate de fin : ' + this.state.endAbsentDate.toLocaleString(), 
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
                                                if(this.state.endAbsentDate.getTime() <= this.state.endAbsentDate.getTime())
                                                {
                                                    this.setState({showEndAbsentPicker: true})
                                                    Alert.alert("Date de fin","Vous venez de sélectionner la date de fin ! ");
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
                                                console.log("st : " + this.state.startAbsentDate.getTime())
                                                console.log("ar : " + this.state.endAbsentDate.getTime())
                                                if(this.state.startAbsentDate.getTime() <= this.state.endAbsentDate.getTime())
                                                {
                                                    this.setState({showStartAbsentPicker: true})
                                                    Alert.alert("Date de début","Vous venez de sélectionner la date de début ! "); 
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
                            display="default"
                            onChange={this.setStartAbsentDate}
                            dateFormat="dayofweek day month year"
                        />
                      
                        )
                }
                {this.state.showEndAbsentPicker && this.state.isSwitchOn && (
                    
                        
                    <DateTimePicker
                        value={this.state.endAbsentDate}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={this.setEndAbsentDate}
                        dateFormat="dayofweek day month year"
                    />
                  
                    )
                }
                {this.state.isSwitchOn && (
                    <>
                    <Text style={{color : 'red'}}>Vous avez sélectionné les dates suivantes : </Text>
                    <Text style={{color : 'red'}}>Date d'absence de début: {this.state.startAbsentDate.toLocaleDateString()} </Text>
                    <Text style={{color : 'red'}}>Date de fin : {this.state.endAbsentDate.toLocaleDateString()}</Text>
                    </>
                )
                }
                <MyButton
                  val="Démarrer"
                  onPress={() => alert('Démarrage du programme')}
                  icon={<Icon name="play-outline" size={20} color="black" />}
                />
            </View>
        );
    }
}
const styles = StyleSheet.create({
    container:
        {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#13043a',
            marginTop: 35,
        },
});
export default Config;