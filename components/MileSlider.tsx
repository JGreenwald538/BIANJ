import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Slider from 'react-native-a11y-slider';
import "../assets/check-mark-icon.jpg";
import Checkbox from "./Checkbox.tsx";

interface MileSliderProps {
    isEnabled: boolean;
    value: number | string;
    onValueChange: (value: number) => void;
    isEnabledChange: (isEnabled: boolean) => void;
}

const MileSlider: React.FC<MileSliderProps> = ({ isEnabled, value, onValueChange, isEnabledChange }) => {
    const handleChange = (newValue: number[]) => {
      if(isEnabled) {
        onValueChange(newValue[0]);
      }
    };
    if(!isEnabled) {
      value = "N/A";
    }
    return (
      <View style={styles.container}>
          <View style={{ paddingTop: 10 }}>
              <Checkbox
                  isChecked={isEnabled}
                  onCheck={() => isEnabledChange(!isEnabled)} // Pass the negated value of `isEnabled`
                  color={"#572C5F"}
              />
          </View>
          <View style={styles.checkMarkerLabelContainer}>
            <Text style={styles.radiusLabel}>Radius</Text>
          </View>
          <View style={styles.sliderContainer}>
              <Slider
                  style={isEnabled ? styles.sliderEnabled : styles.sliderDisabled}
                  min={1}
                  max={150}
                  // @ts-ignore
                  values={[value]}
                  onChange={handleChange}
                  markerColor={isEnabled ? '#572C5F' : '#d3d3d3'}
                  showLabel={false} // Disable the built-in label
              />
              <Text style={styles.sliderLabel}>{`Distance: ${value} miles`}</Text>
          </View>
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e2cbe7',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 10,
    marginTop: 15,
    alignContent: 'center',
    justifyContent: 'flex-start',
    display: 'flex',
    width: 'auto',
    flexDirection: 'row',
  },
  sliderEnabled: {
    opacity: 1,
    marginHorizontal: 20,
    width: '90%',
  },
  sliderDisabled: {
    opacity: 0.3,
    marginHorizontal: 20,
    width: '90%',
  },
  labelContainer: {
    // Provide a fixed width that can accommodate "200 miles"
    width: 100, // You may need to adjust this width
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Ensure the background doesn't obscure the slider
  },
  checkMarkerLabelContainer: {
    // Provide a fixed width that can accommodate "200 miles"
    width: 100, // You may need to adjust this width
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent', // Ensure the background doesn't obscure the slider
    marginLeft: -20,
    marginRight: -30,
    marginTop: -8,
  },
  labelText: {
    fontSize: 15,
    color: '#000',
    textAlign: 'center',
  },
  sliderContainer: {
    flex: 1,
    alignItems: 'center', // Center the slider and label horizontally
    justifyContent: 'center',
    width: '90%',
    marginHorizontal: 20,
  },
  sliderLabel: {
      fontSize: 15,
      color: '#000',
      textAlign: 'center',
      marginTop: 5, // Adjust this as needed to position the label
  },
  radiusLabel: {
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
    marginTop: 5, // Adjust this as needed to position the label
},
});

export default MileSlider;
