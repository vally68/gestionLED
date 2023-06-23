import React from "react";
import {StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default class MyButton extends React.Component
{
    constructor(props){
        super(props);
    }

    render()
    {
        const {val, style} = this.props;
        return (
            <View>
                <TouchableOpacity onPress={this.props.onPress} style={[style]}>
                    <Text style={styles.buttonText}>{val}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        color: '#000',
    }
});
