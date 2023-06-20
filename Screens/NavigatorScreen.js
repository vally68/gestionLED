import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Home from './Home';
import Inscription from './Inscription';
import Connexion from './Connexion';
import Dashboard from './Dashboard';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { connect } from "react-redux";

const Tab = createBottomTabNavigator();

class NavigationS extends React.Component
{  
  constructor(props) 
    {
        super(props);
        this.state = 
        {
        
        };
    }
    

    componentDidMount()
    {
       
    }

    render()
  {
      return (
    
        <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
         {
         this.props.isLoggedIn ? (
          
          <Tab.Screen 
          name="Tableau" 
          component={Dashboard} 
          options={{
            tabBarLabel : 'Dashboard',
            tabBarIcon: () => (
              <Ionicons name="book" color={"green"} size={30} />
            )
        }}
          />
          ) : (
          <>
        <Tab.Screen 
          name="Accueil" 
          component={Home} 
          options={{
            tabBarLabel : 'Home',
            tabBarIcon: () => (
              <Ionicons name="home" color={"red"} size={30} />
            )
        }}
        />
        <Tab.Screen 
          name="Connexion" 
          component={Connexion}
          options={{
            tabBarLabel : 'Connexion',
            tabBarIcon: () => (
              <Ionicons name="log-in" color={"blue"} size={30} />
            )
        }} 
          />
         <Tab.Screen 
          name="Inscription" 
          component={Inscription} 
          options={{
            tabBarLabel : 'Inscription',
            tabBarIcon: () => (
              <Ionicons name="create" color={"black"} size={30} />
            )
        }}
        /> 
        </>
          )
  }
      </Tab.Navigator>
    </NavigationContainer>
    
  );
}   
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = (state) => 
{
    return state
}

export default connect(mapStateToProps)(NavigationS)