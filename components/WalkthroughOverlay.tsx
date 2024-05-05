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

const WalkthroughOverlay: React.FC<OverlayProps> = React.memo(
	({ visible, targetMeasure, content, onClose, center }) => {
		const windowDimensions = Dimensions.get("window");
		const [tooltipDimensions, setTooltipDimensions] = React.useState({
			height: 0,
			width: 0,
		});

		const safeTargetMeasure = React.useMemo(
			() => ({
				x: !isNaN(targetMeasure.x) ? targetMeasure.x : 0,
				y: !isNaN(targetMeasure.y) ? targetMeasure.y : 0,
				width: !isNaN(targetMeasure.width) ? targetMeasure.width : 0,
				height: !isNaN(targetMeasure.height) ? targetMeasure.height : 0,
			}),
			[targetMeasure]
		);

		const dimmedStyles = React.useMemo(
			() => ({
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
			}),
			[safeTargetMeasure, windowDimensions]
		);

		const tooltipStyle = React.useMemo(() => {
			const showTooltipAbove =
				safeTargetMeasure.y +
					safeTargetMeasure.height +
					tooltipDimensions.height >
				windowDimensions.height;
			return {
				top: center
					? (windowDimensions.height - tooltipDimensions.height) / 2
					: showTooltipAbove
					? safeTargetMeasure.y - tooltipDimensions.height - 20
					: safeTargetMeasure.y + safeTargetMeasure.height + 20,
				left: center
					? (windowDimensions.width - tooltipDimensions.width) / 2
					: Math.max(
							0,
							Math.min(
								safeTargetMeasure.x +
									safeTargetMeasure.width / 2 -
									tooltipDimensions.width / 2,
								windowDimensions.width - tooltipDimensions.width
							)
					  ),
			};
		}, [center, safeTargetMeasure, tooltipDimensions, windowDimensions]);

		const handleClose = React.useCallback(() => {
			onClose();
		}, [onClose]);

		return (
			<Modal
				visible={visible}
				transparent
				animationType="fade"
				onRequestClose={handleClose}
			>
				<TouchableOpacity
					style={styles.fullscreenOverlay}
					onPress={handleClose}
					activeOpacity={1}
				>
					{/* Dimmed areas */}
					<View style={[styles.dimmedOverlay, dimmedStyles.top]} />
					<View style={[styles.dimmedOverlay, dimmedStyles.bottom]} />
					<View style={[styles.dimmedOverlay, dimmedStyles.left]} />
					<View style={[styles.dimmedOverlay, dimmedStyles.right]} />

					{/* Tooltip container */}
					<View
						style={[styles.tooltip, tooltipStyle]}
						onLayout={({
							nativeEvent: {
								layout: { height, width },
							},
						}) => {
							setTooltipDimensions({ height: height + 30, width });
						}}
					>
						<Text style={styles.title}>{content.title}</Text>
						<Text style={styles.description}>{content.description}</Text>
						{/* Button can be uncommented and used as needed */}
						{/* <TouchableOpacity onPress={handleClose} style={styles.button}>
            <Text>{content.buttonText}</Text>
          </TouchableOpacity> */}
					</View>
				</TouchableOpacity>
			</Modal>
		);
	}
);

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
