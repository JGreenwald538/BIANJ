import React from "react";
import { View, TouchableOpacity } from "react-native";
import BoxIcon from "../assets/SVGs/square-outline.svg";
import CheckedBoxIcon from "../assets/SVGs/checkbox-outline.svg";

// Define props for the Checkbox component
interface CheckboxProps {
	isChecked: boolean;
	onCheck: () => void;
	color: string;
	alt: string;
	enabled?: boolean;
	uncheckedColor?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
	isChecked,
	onCheck,
	color,
	alt,
	enabled = true,
	uncheckedColor = "gray",
}) => {
	return (
		<TouchableOpacity
			onPress={enabled ? onCheck : () => {}}
			style={{ display: "flex" }}
			accessibilityLabel={alt}
		>
			<View style={{ justifyContent: "center" }}>
				{isChecked ? (
					<CheckedBoxIcon width={30} height={30} color={color} />
				) : (
					<BoxIcon width={30} height={30} color={uncheckedColor} />
				)}
			</View>
		</TouchableOpacity>
	);
};

export default Checkbox;
