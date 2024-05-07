import { useTheme } from "@react-navigation/native";
import React from "react";
import { Dimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function PlaceInvisible() {
	const { colors } = useTheme();
	const { width, height } = Dimensions.get("window");
	const hasNotch = height > 800;
	const colorScheme = colors.background === "white" ? "light" : "dark";
	const insets = useSafeAreaInsets();
	const invisibleStyle = {
		backgroundColor: "white",
		width: width - 40,
		height: hasNotch ? 80 + insets.top * (3 / 4) : 80,
	};
	const invisibleDark = {
		backgroundColor: "black",
	};
	return (
		<View style={[invisibleStyle, colorScheme === "dark" && invisibleDark]} />
	);
}
