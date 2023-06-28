import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { View, Text } from 'react-native';
import Slider from '@react-native-community/slider';

const MySlider = forwardRef((props, ref) => {
  const [sliderValue, setSliderValue] = useState(15);

  const resetSliderValue = () => {
    setSliderValue(15); // Réinitialisation de la valeur du slider
  };

  // Exposer la fonction de réinitialisation à travers la référence
  useImperativeHandle(ref, () => ({
    resetSliderValue,
  }));

  return (
    <View>
      <Text style={{ color: '#FFFFFF' }}>Valeur du slider : {sliderValue}</Text>
      <Slider
        maximumValue={100}
        minimumValue={0}
        minimumTrackTintColor="#307ecc"
        maximumTrackTintColor="#FFFFFF"
        step={1}
        value={sliderValue}
        onValueChange={(sliderValue) => setSliderValue(sliderValue)}
      />
    </View>
  );
});

export default MySlider;
