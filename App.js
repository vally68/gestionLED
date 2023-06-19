import { StyleSheet, Text, View } from 'react-native';
import Home from './Screens/Home';
import Inscription from './Screens/Inscription';
import Connexion from './Screens/Connexion';
import Dashboard from './Screens/Dashboard';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';


const Tab = createBottomTabNavigator();

const getIsLoginIn = () =>
{
  return false;
}

export default function App() 
{
  const isLoginIn = getIsLoginIn()

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        { isLoginIn ? (
          <>
        <Tab.Screen 
          name="Accueil" 
          component={Home} 
          options={{
            tabBarLabel : 'Home',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" color={"red"} size={30} />
            )
        }}
        />
          <Tab.Screen 
          name="Tableau" 
          component={Dashboard} 
          options={{
            tabBarLabel : 'Dashboard',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book" color={"green"} size={30} />
            )
        }}
          />
          </>
        ) : (
          <>
        <Tab.Screen 
          name="Inscription" 
          component={Inscription} 
          options={{
            tabBarLabel : 'Inscription',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="create" color={"black"} size={30} />
            )
        }}
        />
        <Tab.Screen 
          name="Connexion" 
          component={Connexion}
          options={{
            tabBarLabel : 'Connexion',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="log-in" color={"blue"} size={30} />
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
