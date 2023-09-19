import React from "react";
import {StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default class MyButton extends React.Component
{
    constructor(props){
        super(props);
    }

    render()
    {
        const {val, icon} = this.props;
        return (
            <View>
                <TouchableOpacity onPress={this.props.onPress} style={styles.button}>
                    <View style={styles.buttonContent}>
                        {icon}
                        <Text style={styles.buttonText}>{val}</Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
button: {
    backgroundColor: "#321289",
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom:10,
    width:150,
    height:50,
    borderWidth:3
  },

  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },

  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});