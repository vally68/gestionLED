import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';


export default class Inscription extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = 
        {
            name: "",
            firstnam: "",
            email: "",
            password: ""
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
                    INSCRIPTION
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
