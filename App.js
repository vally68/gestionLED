import { StyleSheet, Text, View } from 'react-native';
import Home from './Screens/Home';
import Inscription from './Screens/Inscription';
import Connexion from './Screens/Connexion';
import Dashboard from './Screens/Dashboard';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Provider } from 'react-redux'
import Store from './Store/ConfigStore'

const Tab = createBottomTabNavigator();

export default function App()
{  
        return (
    <Provider store={Store}>
        <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
         
          
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
          name="Tableau" 
          component={Dashboard} 
          options={{
            tabBarLabel : 'Dashboard',
            tabBarIcon: () => (
              <Ionicons name="book" color={"green"} size={30} />
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
        
        
      
      </Tab.Navigator>
    </NavigationContainer>
    </Provider>
  );
    
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

