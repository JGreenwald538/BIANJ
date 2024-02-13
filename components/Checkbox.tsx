import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CheckboxIcon from "../assets/SVGs/square-outline.svg"
import CheckedBoxIcon from "../assets/SVGs/checkbox-outline.svg"

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
  return (
		<TouchableOpacity
			onPress={enabled ? onCheck : () => {}}
			style={{ display: "flex" }}
			accessibilityLabel={alt}
		>
			<View style={{ justifyContent: "center" }}>
				{!isChecked && <CheckboxIcon color={checkboxColor} width="25" height="25" />}
				{isChecked && <CheckedBoxIcon color={checkboxColor} width="25" height="25" /> }
			</View>
		</TouchableOpacity>
	);
};



export default Checkbox;
