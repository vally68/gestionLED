import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';


export default class Connexion extends React.Component 
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
            <SafeAreaView style={styles.container}>
                <Text>
                    CONNEXION
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
