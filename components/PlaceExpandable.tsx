import React, { useCallback, useRef } from "react";
import {
	Animated,
	Dimensions,
	Image,
	LayoutAnimation,
	Linking,
	Platform,
	StyleSheet,
	Text,
	TouchableOpacity,
	View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "@react-navigation/native";
import DropdownIcon from "../assets/SVGs/caret-down-circle-outline.svg"; // Ensure these SVG imports work in your setup
import DeleteIcon from "../assets/SVGs/close-circle-outline.svg";
import SaveIcon from "../assets/SVGs/download-outline.svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface PlaceProps {
	name?: string;
	type?: string;
	logoUri?: string;
	invisible?: boolean;
	address?: string;
	phone?: string;
	website?: string;
	object?: any; // Ideally, define a more specific type
	save?: boolean;
	deleteIcon?: boolean;
	setUpdate: (update: boolean) => void;
	update: boolean | undefined;
	placeEnabled: boolean;
	setPlaceEnabled: (enabled: boolean) => void;
	titleRef: any;
	typeRef: any;
	buttonRef: any;
	containerRef: any;
}

const { width, height } = Dimensions.get("window");
const hasNotch = height > 800;

const styles = StyleSheet.create({
	container: {
		flexDirection: "column",
		alignItems: "flex-start",
		width: width - 40,
		height: "auto",
		borderRadius: 10,
		marginBottom: 20,
		marginLeft: -2,
	},
	containerLight: {
		backgroundColor: "#e2cbe7",
	},
	containerDark: {
		backgroundColor: "#70387a",
	},
	logoContainer: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: "#572C5F",
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 2,
		elevation: 2,
		margin: 15,
	},
	logoImage: {
		width: "100%",
		height: "100%",
		borderRadius: 30,
		marginRight: 20,
		overflow: "hidden",
	},
	nameText: {
		fontSize: 20,
		overflow: "scroll",
		fontWeight: "bold",
		width: "80%",
	},
	nameTextLight: {
		color: "black",
	},
	nameTextDark: {
		color: "white",
	},
	typeText: {
		fontSize: 15,
		width: "80%",
	},
	typeTextLight: {
		color: "black",
	},
	typeTextDark: {
		color: "white",
	},
	actionButton: {
		flexDirection: "column",
		alignItems: "center",
		borderRadius: 10,
		backgroundColor: "#572C5F",
		paddingHorizontal: 8,
	},
	actionText: {
		fontSize: 12,
		borderRadius: 10,
		color: "white",
	},
	actionTextHidden: {
		display: "none",
	},
	invisibleDark: {
		backgroundColor: "black",
	},
});

const Place: React.FC<PlaceProps> = ({
	name = "Name",
	type = "Type",
	logoUri,
	invisible = false,
	address = "Address",
	phone = "Phone",
	website = "Website",
	object,
	save = true,
	deleteIcon = false,
	setUpdate,
	update,
	placeEnabled,
	setPlaceEnabled,
	titleRef,
	typeRef,
	buttonRef,
	containerRef,
}) => {
	const rotAnim = useRef(new Animated.Value(0)).current;
	const { colors } = useTheme();
	const colorScheme = colors.background === "white" ? "light" : "dark";
	const insets = useSafeAreaInsets();
	const invisibleStyle = {
		backgroundColor: "white",
		width: width - 40,
		height: hasNotch ? 80 + insets.top * (3/4) : 80,
	}

	const togglePlaceEnabled = useCallback(() => {
		setPlaceEnabled(!placeEnabled);
		Animated.timing(rotAnim, {
			toValue: +!placeEnabled,
			duration: 150,
			useNativeDriver: true,
		}).start();
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	}, [placeEnabled, setPlaceEnabled, rotAnim]);

	const handleSave = useCallback(async () => {
		try {
			await AsyncStorage.setItem(name, JSON.stringify(object));
			alert("Saved!");
		} catch (e) {
			console.log(e);
		}
	}, [name, object]);

	const handleDelete = useCallback(async () => {
		try {
			await AsyncStorage.removeItem(name);
			setUpdate(!update);
			alert("Removed!");
		} catch (e) {
			console.log(e);
		}
	}, [name, update, setUpdate]);

	const openURL = useCallback(async (url: string) => {
		await Linking.openURL(url);
	}, []);

	if (invisible) {
		return (
			<View
				style={[
					invisibleStyle,
					colorScheme === "dark" && styles.invisibleDark,
				]}
			/>
		);
	}

	return (
		<View
			style={[
				styles.container,
				colorScheme === "light" ? styles.containerLight : styles.containerDark,
			]}
			ref={containerRef}
			collapsable={false}
		>
			<View style={{ flexDirection: "row" }}>
				<View style={styles.logoContainer}>
					{logoUri ? (
						<Image
							source={require("../assets/logos/icon12.png")}
							alt={"logo"}
							style={{
								height: "80%",
								resizeMode: "contain",
								width: "80%",
								borderRadius: 10,
							}}
						/>
					) : (
						<Text style={styles.actionText}>Logo</Text>
					)}
				</View>
				<View style={{ flexDirection: "column", flex: 1, marginTop: 10 }}>
					<Text
						style={
							colorScheme === "light"
								? styles.nameText
								: [styles.nameTextDark, styles.nameText]
						}
						ref={titleRef}
					>
						{name}
					</Text>
					<Text
						style={
							colorScheme === "light"
								? styles.typeText
								: [styles.typeText, styles.typeTextDark]
						}
						ref={typeRef}
					>
						{type}
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
							width: "80%",
							marginVertical: 10,
						}}
					>
						<TouchableOpacity
							onPress={async () => {
								Linking.openURL(website);
							}}
						>
							<View
								style={{
									flexDirection: "column",
									alignItems: "center",
									borderRadius: 10,
									backgroundColor: "#572C5F",
									paddingHorizontal: 5,
									display: placeEnabled ? "flex" : "none",
								}}
							>
								<Image
									source={require("../assets/logos/icon6.png")}
									alt={"logo"}
									style={{
										resizeMode: "contain",
										height: 30,
										width: 30,
										margin: 5,
									}}
								/>
								<Text
									style={
										placeEnabled ? styles.actionText : styles.actionTextHidden
									}
								>
									Address
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={async () => {
								Linking.openURL(`tel:${phone}`);
							}}
						>
							<View
								style={{
									flexDirection: "column",
									alignItems: "center",
									borderRadius: 10,
									backgroundColor: "#572C5F",
									paddingHorizontal: 8,
									display: placeEnabled ? "flex" : "none",
								}}
							>
								<Image
									source={require("../assets/logos/phoneicon.png")}
									alt={"logo"}
									style={{
										resizeMode: "contain",
										height: 30,
										width: 30,
										margin: 5,
									}}
								/>
								<Text
									style={[
										placeEnabled ? styles.actionText : styles.actionTextHidden,
										{ flex: 1 },
									]}
								>
									{"    Call    "}
								</Text>
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={async () => {
								Linking.openURL(website.replaceAll(/[\s]/g, ""));
							}}
						>
							<View
								style={{
									flexDirection: "column",
									alignItems: "center",
									borderRadius: 10,
									backgroundColor: "#572C5F",
									paddingHorizontal: 8,
									display: placeEnabled ? "flex" : "none",
								}}
							>
								<Image
									source={require("../assets/logos/webicon.png")}
									alt={"logo"}
									style={{
										resizeMode: "contain",
										height: 30,
										width: 30,
										margin: 5,
									}}
								/>
								<Text
									style={
										placeEnabled ? styles.actionText : styles.actionTextHidden
									}
								>
									Website
								</Text>
							</View>
						</TouchableOpacity>
					</View>
				</View>
				<Animated.View
					ref={buttonRef}
					collapsable={false}
					style={{
						width: 30,
						height: 30,
						position: "absolute",
						right: 10,
						bottom: 10,
						transform: [
							{
								rotate: rotAnim.interpolate({
									inputRange: [0, 1],
									outputRange: ["0deg", "180deg"],
								}),
							},
						],
					}}
				>
					<TouchableOpacity
						onPress={() => {
							setPlaceEnabled(!placeEnabled);
							Animated.timing(rotAnim, {
								toValue: +!placeEnabled,
								duration: 150,
								useNativeDriver: true,
							}).start();
							LayoutAnimation.configureNext(
								LayoutAnimation.Presets.easeInEaseOut
							);
						}}
					>
						<DropdownIcon
							width={30}
							height={30}
							color={colorScheme === "light" ? "#471f7d" : "white"}
						/>
					</TouchableOpacity>
				</Animated.View>
				{save && (
					<TouchableOpacity
						onPress={async () => {
							try {
								await AsyncStorage.setItem(name, JSON.stringify(object));
								alert("Saved!");
							} catch (e) {
								console.log(e);
							}
						}}
						style={{
							position: "absolute",
							right: placeEnabled ? "auto" : 10,
							top: placeEnabled ? "auto" : 8,
							bottom: placeEnabled ? 8 : "auto",
							zIndex: 1,
							left: placeEnabled ? 25 : "auto",
						}}
					>
						<View
							style={{
							// 	// width: 30,
							// 	// height: 30,
							// 	position: "absolute",
							// 	right: placeEnabled ? "auto" : 10,
							// 	left: placeEnabled ? 10 : "auto",
							// 	top: placeEnabled ? "auto" : 8,
							// 	bottom: placeEnabled ? 8 : "auto",
							// 	zIndex: 1,
								alignContent: "center",
							}}
						>
							<SaveIcon
								width={30}
								height={30}
								color={colorScheme === "light" ? "#471f7d" : "white"}
								style={{ marginLeft: 2 }}
							/>
							{placeEnabled && (
								<Text
									style={{
										fontSize: 12,
										textAlign: "center",
										color: colorScheme === "light" ? "#471f7d" : "white",
										marginTop: 2,
										marginLeft: 3,
									}}
								>
									Save
								</Text>
							)}
						</View>
					</TouchableOpacity>
				)}
				{deleteIcon && (
					<TouchableOpacity
						onPress={async () => {
							try {
								await AsyncStorage.removeItem(name);
								setUpdate(!update);
								alert("Removed!");
							} catch (e) {
								console.log(e);
							}
						}}
						style={{
							position: "absolute",
							right: placeEnabled ? width * 0.75 : 10,
							top: placeEnabled ? "auto" : 8,
							bottom: placeEnabled ? 8 : "auto",
							zIndex: 1,
						}}
					>
						<View style={{ flexDirection: "column", alignItems: "center" }}>
							<DeleteIcon
								width={30}
								height={30}
								color={colorScheme === "light" ? "#471f7d" : "white"}
							/>
							{placeEnabled && (
								<Text
									style={{
										fontSize: 12, // Consider using a scalable unit or responsive size here
										textAlign: "center",
										color: colorScheme === "light" ? "#471f7d" : "white",
										marginTop: 2,
									}}
								>
									Remove
								</Text>
							)}
						</View>
					</TouchableOpacity>
				)}
			</View>
		</View>
	);
};

export default Place;
