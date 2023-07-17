import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import MyButton from "../Components/MyButton";

const MySlider = forwardRef((props, ref) => {
  const [sliderValue, setSliderValue] = useState(15);
  const [isEditing, setIsEditing] = useState(false);
  const [manualValue, setManualValue] = useState('');

  const resetSliderValue = () => {
    setSliderValue(15); // Réinitialisation de la valeur du slider
  };

  const handleSliderPress = () => {
    setIsEditing(true);
  };

  const handleManualValueChange = (text) => {
    setManualValue(text);
  };

  const handleManualValueSubmit = () => {
    const value = parseInt(manualValue, 10);
    if (!isNaN(value)) {
      setSliderValue(value);
    }
    setIsEditing(false);
  };

  // Exposer la fonction de réinitialisation à travers la référence
  useImperativeHandle(ref, () => ({
    resetSliderValue,
  }));

  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.sliderLabel}>Valeur du slider : </Text>
        {isEditing ? (
          <TextInput
            style={styles.manualInput}
            placeholder=""
            keyboardType="numeric"
            value={manualValue}
            onChangeText={handleManualValueChange}
            onBlur={handleManualValueSubmit}
            autoFocus
          />
        ) : (
          <Text style={styles.sliderValue} onPress={handleSliderPress}>
            {sliderValue.toString()}
          </Text>
        )}
      </View>
      <Slider
        style={styles.slider}
        maximumValue={100}
        minimumValue={0}
        minimumTrackTintColor="#307ecc"
        maximumTrackTintColor="#FFFFFF"
        thumbTintColor="#66FFDD"
        thumbStyle={styles.thumbStyle}
        trackStyle={styles.trackStyle}
        step={1}
        value={sliderValue}
        onValueChange={(sliderValue) => setSliderValue(sliderValue)}
        onTouchEnd={() => setIsEditing(false)}
      />
      <MyButton
        title="Réinitialiser"
        onPress={resetSliderValue}
        buttonStyle={styles.resetButton}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderLabel: {
    color: '#FFFFFF',
  },
  sliderValue: {
    color: '#FFFFFF',
    textDecorationLine: 'underline',
  },
  manualInput: {
    color: '#FFFFFF',
    marginTop: 10,
  },
  slider: {
    height: 40,
    marginVertical: 10,
  },
  thumbStyle: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  trackStyle: {
    height: 10,
    borderRadius: 5,
  },
  resetButton: {
    borderWidth: 2,
    marginBottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MySlider;
