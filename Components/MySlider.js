import React, {useState} from 'react';
import {View, Text, SafeAreaView, StyleSheet} from 'react-native';

import Slider from '@react-native-community/slider';

const MySlider = () =>
{
    const [sliderValue, setSliderValue] = useState(15);

    return (

        <View>

            <Text style={{color: 'black'}}>Valeur du slider : {sliderValue}</Text>

            <Slider
                maximumValue={100}
                minimumValue={0}
                minimumTrackTintColor="#307ecc"
                maximumTrackTintColor="#000000"
                step={1}
                value={sliderValue}
                onValueChange={(sliderValue) => setSliderValue(sliderValue)}
            />
        </View>

    );
};


export default MySlider;