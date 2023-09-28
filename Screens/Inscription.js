import React from 'react';
import { FlatList, Button, Image, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView, ScrollView } from 'react-native';
import { validateForm } from '../fonction/outils';
import { connect } from "react-redux";
import { ADD_USER } from '../reducer/UserReducer';
import MyButton from "../Components/MyButton";
import Icon from 'react-native-vector-icons/Ionicons';
import MyNotification from "../Components/MyNotification";

const mapStateToProps = (state) => {
  return {
    // Mettez ici les propriétés du state que vous voulez passer en props
  };
};

class Inscription extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      nom: '',
      prenom:'',
      email: '',
      password: '',
      nomError: '',
      emailError: '',
      passwordError: '',
      notificationArr: [],
      showNotification: false
    };
  }

  componentDidMount(){
    fetch('http://10.31.251.58/api/testNotifications.php',
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
            arr.push({id: json[i].id, date_insertion: json[i].date_insertion, nom: json[i].nom, prenom: json[i].prenom, msg: json[i].msg, vue: json[i].vue});
            //console.log(arr[i].id)
          }
          this.setState({ notificationArr: arr })
        }
        })
  }

  componentDidUpdate()
  {
    fetch('http://10.31.251.58/api/testNotifications.php',
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
            arr.push({id: json[i].id, date_insertion: json[i].date_insertion, nom: json[i].nom, prenom: json[i].prenom, msg: json[i].msg, vue: json[i].vue});
            //console.log(arr[i].id)
          }
          this.setState({ notificationArr: arr })
        }
        })
  }

  handleSubmit = () => 
  {
    const formData = new FormData();
    formData.append("nom", this.state.nom);
    formData.append("prenom", this.state.prenom);
    formData.append("email", this.state.email);
    formData.append("password", this.state.password);

    fetch('http://10.31.251.58/api/test.php', {
      method: 'POST',
      body: formData,
      headers: {
        "Content-Type": "multipart/form-data" // Utilisez "Content-Type" au lieu de "content-type"
      }
    })
      .then(response => response.json())
      .then(json => {

        if (json === false) {
          Alert.alert(
            'Erreur',
            'L\'e-mail saisi existe déjà. Veuillez saisir une autre adresse mail ou récupérer votre mdp',
            [
              { text: 'OK', onPress: () => console.log('OK Pressed') },
            ],
            { cancelable: false }
          );
        } else {
          this.setState({ showNotification: true })
          setTimeout(() => {
            this.setState({ showNotification: false });
            this.props.navigation.navigate('Connexion', { email: this.state.email });  
          }, 3000);
          //this.props.navigation.navigate('Connexion', { email: this.state.email });      
        }
        })

      .catch(error => {
        console.error(error);
      });
  }

  handleCloseNotification = () => 
  {
    this.setState({ showNotification: false });
  };

  renderPlage = ({ item }) => (
    <View>

      <Text style={{color: "red"}}>
        {item.prenom} {item.nom} s'est connecté à {item.date_insertion} !
      </Text>

      {item.vue === 0 && (
          <Button
              title="Marquer comme lu"
              onPress={() => this.markAsRead(item.id)}
          />
      )}
      
    </View>
);

markAsRead = (notificationId) => 
{
  const formData = new FormData();
  formData.append('test', notificationId)
      try {
        // Envoyer la requête de mise à jour à la base de données
        return fetch('http://10.31.251.58/api/testNotificationsSeen.php', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(json => {
        if (json != false) 
        {
          console.log('Mise à jour réussie dans la base de données');
          const updatedNotifications = this.state.notificationArr.map(n => {
              if(n.id === notificationId)
              {
                  return { ...this.state.notificationArr, vue: 1}
              }
              return n;
          })
          this.setState({ notificationArr : updatedNotifications})
        } 
        else 
        {
          console.error('Échec de la mise à jour dans la base de données');
        }})
      } 

      catch (error) 
      {
        console.error('Erreur lors de la requête vers la base de données:', error);
      }
}  

  render() {
    return (

      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {this.state.showNotification && (
            <MyNotification
              message={"Bienvenue  " + this.state.nom + "  " + this.state.prenom}
              onClose={this.handleCloseNotification}
            />
          )}

        {/*  <Text>Notifications :</Text>
          <FlatList
            data={this.state.notificationArr}
            renderItem={this.renderPlage}
            keyExtractor={item => item.id} 
          />
              */}

          <Image
            source={require('../assets/logo.png')}
            style={styles.image}
          />

          <View>
            
            <TextInput
              placeholder="nom"
              placeholderTextColor="#FFFFFF"
              returnKeyType="next"
              value={this.state.nom}
              onChangeText={text => this.setState({nom: text})}
              style={styles.textenter}
              autoCompleteType="nom"
              onBlur={() => {
                const { nomError } = validateForm(this.state.nom, '', '','');
                this.setState({ nomError });
              }}
            />

            <Text style={styles.errorText}>{this.state.nomError}</Text>

            <TextInput
              placeholder="Prénom"
              placeholderTextColor="#FFFFFF"
              returnKeyType="next"
              value={this.state.prenom}
              onChangeText={text => this.setState({prenom: text})}
              style={styles.textenter}
              autoCompleteType="prenom"
              onBlur={() => {
                const { prenomError } = validateForm('',this.state.prenom, '','',);
                this.setState({ prenomError });
              }}
            />

            <Text style={styles.errorText}>{this.state.prenomError}</Text>

            <TextInput
              placeholder="Email"
              placeholderTextColor="#FFFFFF"
              returnKeyType="next"
              value={this.state.email}
              onChangeText={text => this.setState({email: text})}
              style={styles.textenter}
              autoCompleteType="email"
              onBlur={() => {
                const { emailError } = validateForm('','', this.state.email, '');
                this.setState({ emailError });
              }}
            />

            <Text style={styles.errorText}>{this.state.emailError}</Text>

            <TextInput
              placeholder="Password"
              placeholderTextColor="#FFFFFF"
              returnKeyType="done"
              value={this.state.password}
              onChangeText={text => this.setState({password: text})}
              style={styles.textenter}
              autoCompleteType="password"
              secureTextEntry
              onBlur={() => {
                const { passwordError } = validateForm('', '', '',this.state.password);
                this.setState({ passwordError });
              }}
            />

            <Text style={styles.errorText}>{this.state.passwordError}</Text>

        </View>

            <MyButton
              onPress={this.handleSubmit}
              val="Valider"
              icon={<Icon name="checkmark-outline" size={15} color="white" />}
            />
            
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
    marginTop: 30,
  },

  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 80,
    paddingRight: 100,
  },

  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 5,
  },

  image: {
    width: 180,
    height: 180,
    marginBottom: 20,
    marginTop: 30,
  },

  texttitle: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 30,
    textAlign: 'center',
  },

  bloctext: {
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },

  textenter: {
    height: 40,
    width: 200,
    borderWidth: 1,
    borderColor: 'purple',
    color: '#FFFFFF',
    padding: 5,
    marginBottom: 10,
  },

  link: {
    color: '#FFFFFF',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },

});

const mapDispatchToProps = (dispatch) => ({
  addUser: (user) => dispatch({ type: ADD_USER, value: user }),

});

export default connect(mapStateToProps, mapDispatchToProps)(Inscription);