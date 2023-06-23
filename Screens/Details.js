import React from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';

export default class Details extends React.Component 
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
                <Text style={styles.color}>
                    Details
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
        backgroundColor: '#1F1E42',
    },

    color: 
    {
        color: "#FFFFFF",
    },
});
