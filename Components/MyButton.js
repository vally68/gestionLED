import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

export default class MyButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { val, style, isConnected } = this.props;
    const indicatorColor = isConnected ? 'green' : 'red';

    return (
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={this.props.onPress} style={[style]}>
          <Text style={styles.buttonText}>{val}</Text>
        </TouchableOpacity>
        {isConnected && <View style={[styles.indicator, { backgroundColor: indicatorColor }]} />}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 18,
    color: '#000',
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
});
