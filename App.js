import { StyleSheet } from 'react-native';
import NavigatorScreen from './Screens/NavigatorScreen'; 
import { Provider } from 'react-redux';
import Store from './Store/ConfigStore';


export default function App()
{  
        return (
    <Provider store={Store}>
        <NavigatorScreen />
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

