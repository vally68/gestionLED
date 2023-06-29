import React from 'react';
import { Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';


class Event extends React.Component{
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
                <ScrollView contentContainerStyle={styles.scrollContainer}>
                    <Text style={styles.color}>
                        Details
                    </Text>
                </ScrollView>
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
        backgroundColor: '#13043a',
        marginTop: 35,
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },

    color: 
    {
        color: "#FFFFFF",
    },
});

export default Event;
