import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Ionicons from "@expo/vector-icons/Ionicons";

// Define props for the Checkbox component
interface CheckboxProps {
  isChecked: boolean;
  onCheck: () => void;
  color: string;
  alt: string;
  enabled? : boolean;
  uncheckedColor?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({ isChecked, onCheck, color, alt, enabled = true, uncheckedColor = "gray" }) => {
  const checkboxColor = isChecked ? color : uncheckedColor; // Color for the checkbox
  const colors: { [key: string]: any } = {
    "red": require("../assets/logos/checkboxRed.png"),
    "green": require("../assets/logos/checkboxGreen.png"),
    "blue": require("../assets/logos/checkboxBlue.png"),
    "yellow": require("../assets/logos/checkboxYellow.png"),
    "orange": require("../assets/logos/checkboxOrange.png"),
    "gray": require("../assets/logos/checkboxGray.png"),
    "white": require("../assets/logos/checkboxWhite.png"),
    "black": require("../assets/logos/checkboxBlack.png"),
  };
  return (
		<TouchableOpacity
			onPress={enabled ? onCheck : () => {}}
			style={{ display: "flex" }}
		>
			<View style={{ justifyContent: "center" }}>
				<Image
					source={colors[checkboxColor]}
					alt={alt}
					style={{
						height: 20,
						resizeMode: "contain",
						width: 20,
						borderRadius: 3,
					}}
				/>
				<Image
					source={require("../assets/logos/checkmark.png")}
					alt={"check"}
					style={{
						position: "absolute",
						height: 15,
						resizeMode: "contain",
						width: 15,
						display: isChecked ? "flex" : "none",
            left: 2.5,
					}}
				/>
			</View>
		</TouchableOpacity>
	);
};



export default Checkbox;
