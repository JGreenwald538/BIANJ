import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from "react-native";
import Slider from "react-native-a11y-slider";
import Checkbox from "./Checkbox.tsx";
import { useTheme } from "@react-navigation/native";

interface MileSliderProps {
	isEnabled: boolean;
	value: number | string;
	onValueChange: (value: number) => void;
	isEnabledChange: (isEnabled: boolean) => void;
	filters: string[];
	setFiltersExpanded: (expanded: boolean) => void;
	ref?: any;
}

const MileSlider: React.FC<MileSliderProps> = ({
  isEnabled,
  value,
  onValueChange,
  isEnabledChange,
  filters,
  setFiltersExpanded,
  ref
}) => {
  const handleChange = (newValue: number[]) => {
    if (isEnabled) {
      onValueChange(newValue[0]);
    }
  };
  if (!isEnabled) {
    value = "N/A";
  }
  const { colors } = useTheme();
  const colorScheme = colors.background === "white" ? "light" : "dark";
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colorScheme === "light" ? "#e2cbe7" : "#70387a",
      marginHorizontal: 20,
      borderRadius: 10,
      padding: 10,
      marginTop: 15,
      alignContent: "center",
      justifyContent: "flex-start",
      display: "flex",
      width: "auto",
      flexDirection: "row",
    },
    sliderEnabled: {
      opacity: 1,
      marginHorizontal: 20,
      width: "90%",
    },
    sliderDisabled: {
      opacity: 0.3,
      marginHorizontal: 20,
      width: "90%",
    },
    labelContainer: {
      // Provide a fixed width that can accommodate "200 miles"
      width: 100, // You may need to adjust this width
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent", // Ensure the background doesn't obscure the slider
    },
    checkMarkerLabelContainer: {
      // Provide a fixed width that can accommodate "200 miles"
      width: 90, // You may need to adjust this width
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "transparent", // Ensure the background doesn't obscure the slider
      marginLeft: -20,
      marginRight: -30,
      marginTop: -10,
      zIndex: -1,
    },
    labelText: {
      fontSize: 15,
      color: colorScheme === "light" ? "black" : "white",
      textAlign: "center",
    },
    sliderContainer: {
      flex: 1,
      alignItems: "center", // Center the slider and label horizontally
      justifyContent: "center",
      width: "90%",
      // marginRight: 10,
      marginLeft: 10,
    },
    sliderLabel: {
      fontSize: 15,
      color: colorScheme === "light" ? "black" : "white",
      textAlign: "center",
      marginTop: 5, // Adjust this as needed to position the label
    },
    radiusLabel: {
      fontSize: 12,
      color: colorScheme === "light" ? "black" : "white",
      textAlign: "center",
      marginTop: 10, // Adjust this as needed to position the label
      marginLeft: 5,
    },
  });
  console.log(isEnabled);
  return (
    <View style={styles.container} ref={ref}>
      <View style={{flexDirection: "column", justifyContent: "center" }}>
        <Checkbox
          isChecked={isEnabled}
          onCheck={
            () => isEnabledChange(isEnabled )
          } // Pass the negated value of `isEnabled`
          color={"#572C5F"}
          alt="Radius Checkbox"
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
          markerColor={isEnabled ? "#572C5F" : "#d3d3d3"}
          showLabel={false} // Disable the built-in label
          trackStyle={{width: "100%"}}
          alt = "Radius Slider"
          accessibilityLabel={"Radius Slider" + (isEnabled ? "Enabled" : "Disabled: Select Filters to Enable")}
        />
        {isEnabled ? <Text style={styles.sliderLabel}>
            {`Distance: ${value} miles`}
        </Text>
        : filters.every((str) => str === "") ?
        <TouchableOpacity onPress={() => {
          setFiltersExpanded(true)
          LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        }}>
          <Text style={styles.sliderLabel}>Select Filters</Text>
        </TouchableOpacity> :
        <TouchableOpacity onPress={() => isEnabledChange(!isEnabled && !filters.every((str) => str === ""))}>
          <Text style={styles.sliderLabel}>Enable Radius</Text>
        </TouchableOpacity>}
      </View>
    </View>
  );
};

export default MileSlider;
