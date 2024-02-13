import React from "react";
import {
	Modal,
	View,
	Text,
	StyleSheet,
	Dimensions,
	TouchableOpacity,
} from "react-native";

interface Content {
	title: string;
	description: string;
	buttonText: string;
}

interface OverlayProps {
	visible: boolean;
	targetMeasure: { x: number; y: number; width: number; height: number };
	content: Content;
	onClose: () => void;
}

const WalkthroughOverlay: React.FC<OverlayProps> = ({
	visible,
	targetMeasure,
	content,
	onClose,
}) => {
	const windowDimensions = Dimensions.get("window");

	// Calculate the styles for the dimmed areas
	const dimmedTopStyle = {
		top: 0,
		left: 0,
		width: windowDimensions.width,
		height: targetMeasure.y, // Top overlay extends from the top of the screen to the top of the highlighted area
	};

	const dimmedBottomStyle = {
		top: targetMeasure.y + targetMeasure.height,
		left: 0,
		width: windowDimensions.width,
		height: windowDimensions.height - (targetMeasure.y + targetMeasure.height), // Bottom overlay extends from the bottom of the highlighted area to the bottom of the screen
	};

	// Determine if the tooltip should be shown above the highlighted area based on its position.
	const showTooltipAbove =
		targetMeasure.y + targetMeasure.height + 100 > windowDimensions.height;

	// Adjust tooltip position dynamically.
	let tooltipStyle = {
		top: showTooltipAbove
			? targetMeasure.y - 200
			: targetMeasure.y + targetMeasure.height + 20, // Position above if too low, else below
		left: Math.max(0, targetMeasure.x + targetMeasure.width / 2 - 100),
		right: Math.max(
			0,
			windowDimensions.width - targetMeasure.x - targetMeasure.width / 2 - 100
		),
	};

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<View style={styles.fullscreenOverlay}>
				{/* Dimmed area above the highlighted area */}
				<View style={[styles.dimmedOverlay, dimmedTopStyle]} />

				{/* Dimmed area below the highlighted area */}
				<View style={[styles.dimmedOverlay, dimmedBottomStyle]} />

				{/* Tooltip container */}
				<TouchableOpacity
					style={[
						styles.tooltip, tooltipStyle,
					]}
					onPress={onClose}
				>
					<Text style={styles.title}>{content.title}</Text>
					<Text style={styles.description}>{content.description}</Text>
					<TouchableOpacity onPress={onClose} style={styles.button}>
						<Text>{content.buttonText}</Text>
					</TouchableOpacity>
				</TouchableOpacity>
			</View>
		</Modal>
	);
};

const styles = StyleSheet.create({
	fullscreenOverlay: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		position: "relative",
	},
	dimmedOverlay: {
		position: "absolute",
		backgroundColor: "rgba(0, 0, 0, 0.7)",
	},
	tooltip: {
		position: "absolute",
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		maxWidth: 300,
		zIndex: 5,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	description: {
		fontSize: 16,
		marginBottom: 16,
	},
	button: {
		alignSelf: "flex-end",
		backgroundColor: "#2196F3",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
	},
});

export default WalkthroughOverlay;
