import React from 'react';
import { SafeAreaView, StyleSheet, Text, TouchableOpacity} from 'react-native';



export default class Home extends React.Component 
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

    validateButton = () =>
    {
        this.props.navigation.navigate("Dashboard", {name: this.state.name, firstname: this.state.firstname, email: this.state.email, password: this.state.password})
    }

    render() 
    {
        
       

        return (
            <SafeAreaView style={styles.container}>
                <Text>
                    ACCUEIL
                </Text>
                <Text>

                </Text>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: 
    {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});
