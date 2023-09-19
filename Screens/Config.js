import React from 'react';
import { View, Text, StyleSheet, Button, Alert, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Switch } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { FlatList } from 'react-native';
import Paho from 'paho-mqtt';

class Config extends React.Component
{
  constructor(props)
  {
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
      dbPlages: [],
      mqttClient: null,
      buttonStartStatus: false

    };
  }

  initializeMQTTClient = () =>
  {
    const client = new Paho.Client('ws://10.31.251.58:9003/mqtt', 'Mobile Client');
    // Add any additional event handlers or configurations as needed
    //client.onMessageArrived = onMessageArrived;

    return client;
  };

  onConnect = (client) =>
  {
    console.log('Connected to MQTT broker');
    client.subscribe('COUCOU/Test');
    // message = new Paho.Message("HI");
    message.destinationName = 'COUCOU/Test';
    client.send(message);

    client.subscribe('TEMP/value');
    client.subscribe('LUM/threshold');
    client.subscribe('PIR1/presence');
    client.subscribe('BOUTON/on_off');
    client.subscribe('ETATS/BoutonApp');
    client.subscribe('ETATS/BoutonPresenceApp');
  //  client.subscribe('ETATS/ModeAbsence');
  }

  componentDidMount()
  {
    const client = this.initializeMQTTClient();
    client.connect({ onSuccess: () => this.onConnect(client) });
    this.setState({ mqttClient: client })

   /* fetch('http://10.31.251.58/api/testAbsentModeCheck.php',
    {
      method: 'POST',
      headers:
      {
        "Content-Type": "multipart/form-data"
      }
      }).then((response) => response.json())
      .then((json) =>
      {
        if(json)
        {
          console.log("Réponse mode absent : " + json)
          if(json === "1")
          {
            this.setState({ isSwitchOn: true })
            Alert.alert(
            'Mode absent activé',
            'Mode absent activé',
            [
              {
                text: 'OK',
                onPress: () => console.log('Oui pressé')
              }
            ]
          )
          }
          else
          {
            this.setState({ isSwitchOn: false })
            Alert.alert(
            'Mode absent désactivé',
            'Mode absent désactivé',
            [
              {
                text: 'OK',
                onPress: () => console.log('OK pressé')
              }
            ]
            )
          }
        }
        else
        {
          console.error('Échec de la récupération de l\'état de l\'installation depuis la base de données');
        }
        }) */




    fetch('http://10.31.251.58/api/timeslot.php',
    {
      method: 'POST',
      headers:
      {
        "Content-Type": "multipart/form-data"
      }
      }).then((response) => response.json())
      .then((json) =>
      {
        if(json != false)
        {
          let arr = []
          for(let i=0;i<json.length;i++)
          {
            arr.push({id: json[i].id, day: json[i].day, startTime: json[i].start, endTime: json[i].end});
          }

          this.setState({ dbPlages: arr });

        }
        })
  }

  publishMessage = (messageText, topic) =>
  {
    if (!this.state.mqttClient)
    {
      console.error('MQTT client not initialized');
      return;
    }

    console.log('Envoi message');
    this.state.mqttClient.subscribe(topic);
    const message = new Paho.Message(messageText);
    message.destinationName = topic;

    this.state.mqttClient.send(message);
  };

  formatTime = (date) =>
  {
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

    if (isDayExists && isStartTimeExists && isEndTimeExists)
    {
      Alert.alert("Erreur", "Les données existent déjà dans la plage de fonctionnement !");
      return;
    }

    if (isDayExists && a.some(s => (this.state.startTime <= s.endTime)))
    {
      Alert.alert("Erreur", "L'heure de début est comprise entre 2 plages existantes !");
      return;
    }

    const formdata = new FormData;
    formdata.append("day", this.state.selectedDay);
    formdata.append("start", this.state.startTime.toLocaleTimeString('fr-FR'));
    formdata.append("end", this.state.endTime.toLocaleTimeString('fr-FR'));

    fetch('http://10.31.251.58/api/timeslotInsert.php',
    {
        method: 'POST',
        body: formdata,
        headers:
        {
            "Content-Type": "multipart/form-data"
        }
        }).then((response) => response.json())
        .then((json) =>
        {
            if(json != false)
            {
                console.log("Données insérées dans la BDD !");
            }
        });

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
      `Êtes-vous sûr ?`,
      [
        {
          text: "Oui",
          onPress: () => {

            const formdata = new FormData;
            formdata.append("day", item.day);
            formdata.append("start", item.startTime.toLocaleTimeString('fr-FR'));
            formdata.append("end", item.endTime.toLocaleTimeString('fr-FR'));

            fetch('http://10.31.251.58/api/timeslotDelete.php',
            {
              method: 'POST',
              body: formdata,
              headers:
              {
                "Content-Type": "multipart/form-data"
              }
            }).then((response) => response.json())
            .then((json) =>
            {
            if(json != false)
            {
                console.log("Données effacées dans la BDD !");
            }
            });

            this.setState({ plages: this.state.plages.filter(i => i.id !== item.id) })
          }
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
            onPress={() => this.deletePlage(item)}
            style={[styles.plageButton, { backgroundColor: 'red' }]}
          >
            <Text style={styles.plageButtonText}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

/*  handleAbsentModeToggle = async () =>
  {
    if (!this.state.mqttClient)
    {
      console.error('MQTT client not initialized');
      return;
    }

    if (!this.state.isSwitchOn)
    {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir démarrer le mode absent ?',
      [
        {
          text: 'Annuler',
          onPress: () => {
            this.setState({ isSwitchOn: false });
          },
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () => {

            this.setState({ isSwitchOn: true });

            const formData = new FormData();
            formData.append('test', '1')
            try
            {
              return fetch('http://10.31.251.58/api/testAbsentModeUpdate.php', {
                method: 'POST',
                body: formData,
              })
              .then(response => response.json())
              .then(json => {
              if (json != false)
              {
                console.log('Mise à jour réussie dans la base de données');
                this.publishMessage("ACTIVATION DU MODE ABSENCE PAR LE CLIENT !", "ETATS/ModeAbsence")
              } else {
                console.error('Échec de la mise à jour dans la base de données');

                this.setState({ isSwitchOn: false });
              }})
            } catch (error) {
              console.error('Erreur lors de la requête vers la base de données:', error);

              this.setState({ isSwitchOn: false });
            }
          },
        },
      ],
      { cancelable: false }
    );
  } else
  {

    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir arrêter le mode absent ?',
      [
        {
          text: 'Annuler',
          onPress: () => {
            this.setState({ isSwitchOn: true });
          },
          style: 'cancel',
        },
        {
          text: 'Oui',
          onPress: async () =>
          {

            this.setState({ isSwitchOn: false });

            const formData = new FormData();
            formData.append('test', '0')
            try {
              // Envoyer la requête de mise à jour à la base de données
              return fetch('http://10.31.251.58/api/testAbsentModeUpdate.php', {
                method: 'POST',

                body: formData,
              })
              .then(response => response.json())
              .then(json => {
              if (json != false)
              {
                console.log('Mise à jour réussie dans la base de données');
                this.publishMessage("DÉSACTIVATION DU MODE ABSENCE PAR LE CLIENT !", 'ETATS/ModeAbsence')


              } else {
                console.error('Échec de la mise à jour dans la base de données');
                this.setState({ isSwitchOn: true });
              }})
            } catch (error)
            {
              console.error('Erreur lors de la requête vers la base de données:', error);
              this.setState({ isSwitchOn: false });
            }
          },
        },
      ],
      { cancelable: false }
    );

  }
  }

  startButton = () =>
  {
    if(!this.state.buttonStartStatus)
    {
      if(this.state.isSwitchOn)
      {
        this.setState(prevState => {
          return{
              buttonStartStatus: !prevState.buttonStartStatus
          };
        })
        alert('Demarrage du programme avec mode absence !')
        this.publishMessage("Démarrage de la configuration des plages avec le mode absent !", "ETATS/ConfigStatus");
      }
      else
      {
        if(this.state.plages.length > 0)
        {
          this.setState(prevState => {
            return{
                buttonStartStatus: !prevState.buttonStartStatus
            };
          })
          alert('Demarrage du programme !')
          this.publishMessage("Démarrage de la configuration des plages !", "ETATS/ConfigStatus");
        }
        else
        {
          Alert.alert(
            "Erreur démarrage",
            "Vous n'avez pas saisi de plages !",
            [
              {
                text: "OK",
                onPress: () => console.log("Bouton OK pressé")
              }
            ]
          )
        }
      }
    }
    else
    {
      Alert.alert(
        "Confirmation arrêt plages",
        "Voulez-vous arrêter la config ?",
        [
          {
            text: "OUI",
            onPress: () => {
              alert("Arrêt du config !");
              this.setState(prevState => {
                return{
                    buttonStartStatus: !prevState.buttonStartStatus
                };
              })
              this.publishMessage("Arrêt de la configuration des plages !", "ETATS/ConfigStatus");
            }
          },
          {
            text: "NON",
            onPress: () => console.log("Bouton NON pressé")
          }
        ]
      )
    }
  }*/

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
          itemStyle={styles.pickerItem}
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
          color="#321289"
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
          color="#321289"
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
        color="#321289"
        icon={<Icon name="add-outline" size={20} color="black" />}
      />

      <Text style={styles.sectionTitle}>Plages de fonctionnement :</Text>
      <FlatList
        data={this.state.plages}
        renderItem={this.renderPlage}
        keyExtractor={item => item.id}
      />

{/*   <Text style={[styles.sectionTitle, { color: '#FFFFFF' }]}>Mode absent :</Text>
      <Switch
        value={this.state.isSwitchOn}
        onValueChange={() =>
        {
          this.handleAbsentModeToggle()
          this.setState({ isSwitchOn: !this.state.isSwitchOn })
        }
        }
      />

      {this.state.isSwitchOn && (
        <View style={[styles.absentModeDetails, { color: '#FFFFFF' }]}>
           <TouchableOpacity
      onPress={() => {
        Alert.alert(
          'Informations',
          `Date de début : ${this.state.startAbsentDate.toLocaleString()}\nDate de fin : ${this.state.endAbsentDate.toLocaleString()} et ${this.state.startAbsentDate.getDay()}`,
          [
            {
              text: 'Confirmer',
              onPress: () => {
                const formdata = new FormData;
                formdata.append("day_start", this.state.startAbsentDate.getDay());
                formdata.append("start", this.state.startAbsentDate.toLocaleTimeString('fr-FR'));
                formdata.append("day_end", this.state.endAbsentDate.getDay());
                formdata.append("end", this.state.endAbsentDate.toLocaleTimeString('fr-FR'));

              fetch('http://10.31.251.58/api/testAbsentModeDetails.php',
              {
              method: 'POST',
              body: formdata,
              headers:
              {
                "Content-Type": "multipart/form-data"
              }
              }).then((response) => response.json())
              .then((json) =>
              {
              if(json != false)
              {
                console.log("Données effacées dans la BDD !");
              }
              });
              }
            },
            {

                text: 'Modifier date de fin',
                onPress: () => {
                  if (this.state.endAbsentDate.getTime() <= this.state.startAbsentDate.getTime())
                  {
                    this.setState({ showEndAbsentPicker: true });
                    Alert.alert(
                      "Date de fin",
                      "Vous venez de sélectionner la date de fin ! N'oubliez pas de confirmer en réappuyant!",
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
                      "Vous venez de sélectionner la date de début ! N'oubliez pas de confirmer en réappuyant!",
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
       <Text style={[styles.infoButtonText, { color: 'white' }]}>BOUTON(CLIC ICI !!!) Informations</Text>
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

          <Text style={styles.selectedDate}>
            Vous avez sélectionné les dates suivantes :
          </Text>
          <Text style={styles.selectedDate}>
            Date absence de début : {this.state.startAbsentDate.toLocaleDateString()}
          </Text>
          <Text style={styles.selectedDate}>
            Date de fin : {this.state.endAbsentDate.toLocaleDateString()}
          </Text>
        </View>
      )} */}

      <TouchableOpacity
        style={styles.startButton}
        onPress={this.startButton}
      >
        <Icon name="play-outline" size={20} color="white" />
        {
          this.state.buttonStartStatus ?
          <Text style={styles.startButtonLabel}>Arrêter</Text>
          :
          <Text style={styles.startButtonLabel}>Démarrer</Text>
        }
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
    marginBottom: 5,
    flex :1,
    flexDirection: 'row', // Ajoutez cette ligne
    alignItems: 'center',
    width: "100%",
    height: 20,
  },
  label: {
    color: 'white',
    marginRight: 8,
    fontSize: 16,
    flex: 1, // Assurez-vous que le texte prend autant d'espace que nécessaire
  },
  picker: {
    color: 'white',
    backgroundColor:'#321289',
    flex: 2,
    fontSize: 14,
    height: 20,
  },
  pickerItem: {
    height: 20, // Ajoutez cette ligne et ajustez la hauteur selon vos besoins
    color: 'white',
    backgroundColor: '#321289',
    fontSize: 14,
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
    backgroundColor: '#321289',
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
    backgroundColor: '#321289',
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