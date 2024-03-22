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
	const [tooltipHeight, setTooltipHeight] = React.useState(0);
	const [tooltipWidth, setTooltipWidth] = React.useState(0);


	// Before using targetMeasure values, check if they are valid numbers
	const safeTargetMeasure = {
		x: !isNaN(targetMeasure.x) ? targetMeasure.x : 0,
		y: !isNaN(targetMeasure.y) ? targetMeasure.y : 0,
		width: !isNaN(targetMeasure.width) ? targetMeasure.width : 0,
		height: !isNaN(targetMeasure.height) ? targetMeasure.height : 0,
	};

	const dimmedStyles = {
		top: {
			top: 0,
			left: 0,
			right: 0,
			height: safeTargetMeasure.y,
		},
		bottom: {
			top: safeTargetMeasure.y + safeTargetMeasure.height,
			left: 0,
			right: 0,
			bottom: 0,
		},
		left: {
			top: safeTargetMeasure.y,
			left: 0,
			width: safeTargetMeasure.x,
			height: safeTargetMeasure.height,
		},
		right: {
			top: safeTargetMeasure.y,
			right: 0,
			width:
				windowDimensions.width -
				(safeTargetMeasure.x + safeTargetMeasure.width),
			height: safeTargetMeasure.height,
		},
	};

	// Ensure no calculation results in NaN
	Object.keys(dimmedStyles).forEach((key) => {
		const style = dimmedStyles[key as keyof typeof dimmedStyles];
		Object.keys(style).forEach((prop) => {
			const value = prop as keyof typeof style;
			if (isNaN(style[value])) {
				console.error(`Invalid calculation for ${key} ${value}:`, style[value]);
				style[value] = 0; // Default to 0 if NaN
			}
		});
	});

	// Determine if the tooltip should be shown above or below based on available space
	const showTooltipAbove =
		targetMeasure.y + targetMeasure.height + tooltipHeight >
		windowDimensions.height;

	// Adjust tooltip position dynamically
	let tooltipStyle = {
		top: center
			? (windowDimensions.height - tooltipHeight) / 2
			: showTooltipAbove
			? targetMeasure.y - tooltipHeight - 20
			: targetMeasure.y + targetMeasure.height + 20, // Position above if too low, else below
		left: center
			? (windowDimensions.width - tooltipWidth) / 2 // Centered horizontally in the window
			: Math.max(
				0, // Minimum left padding to keep tooltip inside screen bounds
			Math.min(
			targetMeasure.x + targetMeasure.width / 2 - tooltipWidth / 2,
			windowDimensions.width - tooltipWidth - 20 // Maximum right position to keep tooltip inside screen bounds
			)
		)
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
				{/* Dimmed areas */}
				<View style={[styles.dimmedOverlay, dimmedStyles.top]} />
				<View style={[styles.dimmedOverlay, dimmedStyles.bottom]} />
				<View style={[styles.dimmedOverlay, dimmedStyles.left]} />
				<View
					style={[styles.dimmedOverlay, { ...dimmedStyles.right, right: 0 }]}
				/>

				{/* Tooltip container */}
				<View
					style={[styles.tooltip, tooltipStyle]}
					onLayout={({
						nativeEvent: {
							layout: { height, width },
						},
					}) => {
						setTooltipHeight(height + 30);
						setTooltipWidth(width);
					}}
				>
					<Text style={styles.title}>{content.title}</Text>
					<Text style={styles.description}>{content.description}</Text>
					{/* <TouchableOpacity onPress={onClose} style={styles.button}>
						<Text>{content.buttonText}</Text>
					</TouchableOpacity> */}
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
		width: "100%",
	},
	tooltip: {
		position: "absolute",
		backgroundColor: "white",
		borderRadius: 8,
		padding: 16,
		zIndex: 5,
		borderWidth: 1,
		borderColor: "#ddd",
		// Ensure the tooltip is centered and does not go off-screen
		// maxWidth: "80%",
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
		backgroundColor: "#70387a",
		paddingHorizontal: 20,
		paddingVertical: 10,
		borderRadius: 20,
		color: "white",
	},
});

export default WalkthroughOverlay;
