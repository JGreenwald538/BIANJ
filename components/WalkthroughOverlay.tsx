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
	center?: boolean;
}

const WalkthroughOverlay: React.FC<OverlayProps> = ({
	visible,
	targetMeasure,
	content,
	onClose,
	center,
}) => {
	const windowDimensions = Dimensions.get("window");
	const [height, setHeight] = React.useState(200);
	const [width, setWidth] = React.useState(200);

	// Calculate styles for additional dimmed overlays (left and right)
	const dimmedLeftStyle = {
		top: targetMeasure.y,
		left: 0,
		width: targetMeasure.x,
		height: targetMeasure.height,
	};

	const dimmedRightStyle = {
		top: targetMeasure.y,
		right: 0,
		width: windowDimensions.width - targetMeasure.x - targetMeasure.width,
		height: targetMeasure.height,
	};

	// Determine if the tooltip should be shown above or below based on available space
	const showTooltipAbove =
		targetMeasure.y + targetMeasure.height + height > windowDimensions.height;

	// Adjust tooltip position dynamically
	let tooltipStyle = {
		top: center ? (windowDimensions.height - height) / 2 : showTooltipAbove
			? targetMeasure.y - height
			: targetMeasure.y + targetMeasure.height + 20, // Position above if too low, else below
		left: center ? (windowDimensions.width - width) / 2  : Math.max(0, targetMeasure.x + targetMeasure.width / 2 - 100),
		right: center ? undefined :  Math.max(
			0,
			windowDimensions.width - targetMeasure.x - targetMeasure.width / 2 - 100
		),
	};
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

	return (
		<Modal
			visible={visible}
			transparent
			animationType="fade"
			onRequestClose={onClose}
		>
			<TouchableOpacity
				style={styles.fullscreenOverlay}
				onPress={onClose}
				activeOpacity={1}
			>
				{/* Dimmed area above the highlighted area */}
				<View
					style={[
						styles.dimmedOverlay,
						{ top: 0, height: targetMeasure.y, left: 0, right: 0 },
					]}
				/>
				{/* Dimmed area below the highlighted area */}
				<View
					style={[
						styles.dimmedOverlay,
						{ top: targetMeasure.y + targetMeasure.height, left: 0, right: 0 },
					]}
				/>
				<View style={[styles.dimmedOverlay, dimmedTopStyle]} />

				{/* Dimmed area below the highlighted area */}
				<View style={[styles.dimmedOverlay, dimmedBottomStyle]} />
				{/* Dimmed area to the left of the highlighted area */}
				<View style={[styles.dimmedOverlay, dimmedLeftStyle]} />
				{/* Dimmed area to the right of the highlighted area */}
				<View style={[styles.dimmedOverlay, dimmedRightStyle]} />

				{/* Tooltip container */}
				<View style={[styles.tooltip, tooltipStyle]} onLayout={
					({
						nativeEvent: {
							layout: { height, width },
						},
					}) => {
						setHeight(height)
						setWidth(width)
					}
				
				}>
					<Text style={styles.title}>{content.title}</Text>
					<Text style={styles.description}>{content.description}</Text>
					<TouchableOpacity onPress={onClose} style={styles.button}>
						<Text>{content.buttonText}</Text>
					</TouchableOpacity>
				</View>
			</TouchableOpacity>
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
		borderWidth: 1,
		borderColor: "#ddd",
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
