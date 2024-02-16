import { useTheme } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { Link } from "native-base";
import React, { useEffect, useState } from "react";
import {
	Animated,
	View,
	Text,
	StyleSheet,
	Image,
	Dimensions,
	Button,
	TouchableOpacity,
	Linking,
	Platform,
	Easing,
	LayoutAnimation,
	Appearance,
} from "react-native";
const { width, height } = Dimensions.get("window");
import Ionicons from "react-native-vector-icons/Ionicons";
import DropdownIcon from "../assets/SVGs/caret-down-circle-outline.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import { useTheme } from "@react-navigation/native";
import { useColorScheme } from "react-native";
import SaveIcon from "../assets/SVGs/download-outline.svg";
import DeleteIcon from "../assets/SVGs/close-circle-outline.svg"


interface PlaceProps extends React.ComponentPropsWithoutRef<typeof View> {
	name?: string;
	type?: string;
	logoUri?: string;
	invisible?: boolean;
	address?: string;
	phone?: string;
	website?: string;
	object?: any;
	save?: boolean;
	deleteIcon?: boolean;
	setUpdate?: any;
	update?: boolean;
	titleRef?: any
	typeRef?: any
	buttonRef?: any
	containerRef?: any
	placeEnabled?: any
}

let hasNotch = false;

hasNotch = Dimensions.get("window").height > 800;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;


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
	titleRef,
	typeRef,
	buttonRef,
	containerRef,
	placeEnabled,
}) => {
	const [expanded, setExpanded] = React.useState(false);
	const [expandedText, setExpandedText] = React.useState(false);
	const rotAnim = React.useRef(new Animated.Value(0)).current;
	const { colors } = useTheme();
	const colorScheme = colors.background === "white" ? "light" : "dark";
	// console.log(placeEnabled)
	// if(placeEnabled){
	// 	console.log("false")
	// 	setExpanded(placeEnabled)
	// }

	useEffect(() => {
		if (placeEnabled !== expanded) {
			setExpanded(placeEnabled);
		}
	}, [placeEnabled, expanded]);

	const styles = StyleSheet.create({
		container: {
			flexDirection: "column",
			alignItems: "flex-start",
			backgroundColor: colorScheme === "light" ? "#e2cbe7" : "#70387a",
			width: width - 40,
			height: "auto",
			borderRadius: 10,
			marginBottom: 20,
			marginLeft: -2,
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
		logoText: {
			fontSize: 18,
			color: "#333",
		},
		nameText: {
			fontSize: 20,
			color: colorScheme === "light" ? "black" : "white",
			overflow: "scroll",
			fontWeight: "bold",
			width: "80%",
		},
		typeText: {
			fontSize: 15,
			color: colorScheme === "light" ? "black" : "white",
			width: "80%",
		},
		hiddenText: {
			fontSize: 12,
			color: "white",
			display: expanded ? "flex" : "none",
			borderRadius: 10,
		},

		checkmark: {
			fontSize: 24,
			color: "#333",
		},
		invisible: {
			backgroundColor: colorScheme === "dark" ? "black" : "white",
			width: width - 40,
			height: hasNotch ? 125 : 100,
		},
	});

	const urlScheme = Platform.select({
		ios: "maps://0,0?q=",
		android: "geo:0,0?q=",
	});
	const url = `${urlScheme}${address}`;
	const justNumber = phone.replaceAll(/[\(\)-\s]/g, "");
	const tele = `${"tel:"}${justNumber}`;

	if (!invisible) {
		return (
			<View style={{ ...styles.container }} ref={containerRef}>
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
							<Text style={styles.logoText}>Logo</Text>
						)}
					</View>
					<View style={{ flexDirection: "column", flex: 1, marginTop: 10 }}>
						<Text style={styles.nameText} ref={titleRef}>
							{name}
						</Text>
						<Text style={styles.typeText} ref={typeRef}>
							{type}
						</Text>
						<View
							style={{
								flexDirection: "row",
								justifyContent: "space-between",
								width: "85%",
								marginTop: 10,
							}}
						>
							<TouchableOpacity
								onPress={async () => {
									Linking.openURL(url);
								}}
							>
								<View
									style={{
										flexDirection: "column",
										alignItems: "center",
										borderRadius: 10,
										backgroundColor: "#572C5F",
										paddingHorizontal: 5,
										display: expanded ? "flex" : "none",
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
									<Text style={styles.hiddenText}>Address</Text>
								</View>
							</TouchableOpacity>
							<TouchableOpacity
								onPress={async () => {
									Linking.openURL(tele);
								}}
							>
								<View
									style={{
										flexDirection: "column",
										alignItems: "center",
										borderRadius: 10,
										backgroundColor: "#572C5F",
										paddingHorizontal: 8,
										display: expanded ? "flex" : "none",
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
									<Text style={styles.hiddenText}>Call</Text>
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
										display: expanded ? "flex" : "none",
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
									<Text style={styles.hiddenText}>Website</Text>
								</View>
							</TouchableOpacity>
						</View>
						<View>
							<Text style={styles.typeText}></Text>
						</View>
					</View>
					<Animated.View
						ref={buttonRef}
						style={{
							width: 30,
							height: 30,
							position: "absolute",
							right: 1,
							bottom: 1,
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
								setExpanded(!expanded);
								Animated.timing(rotAnim, {
									toValue: +!expanded,
									duration: 150,
									useNativeDriver: true,
								}).start();
								LayoutAnimation.configureNext(
									LayoutAnimation.Presets.easeInEaseOut
								);
								if (expanded) {
									setTimeout(() => {
										setExpandedText(true);
									}, 150);
								} else {
									setExpandedText(false);
								}
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
						>
							<View
								style={{
									// width: 30,
									// height: 30,
									position: "absolute",
									right: expanded ? screenWidth * 0.77 : 1,
									top: expanded ? screenHeight * 0.095 : 1,
									zIndex: 1,
									alignContent: "center",
								}}
							>
								<SaveIcon
									width={30}
									height={30}
									color={colorScheme === "light" ? "#471f7d" : "white"}
								/>
								{expanded && (
									<Text
										style={{
											fontSize: 12,
											textAlign: "center",
											color: colorScheme === "light" ? "#471f7d" : "white",
											marginTop: 2,
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
						>
							<View
								style={{
									// width: 30,
									// height: 30,
									position: "absolute",
									right: expanded ? screenWidth * 0.77 : 1,
									top: expanded ? screenHeight * 0.095 : 1,
									zIndex: 1,
									alignContent: "center",
									justifyContent: "center",
								}}
							>
								<View
									style={{
										justifyContent: "center",
										alignContent: "center",
										flexDirection: "column",
									}}
								>
									<DeleteIcon
										width={30}
										height={30}
										color={colorScheme === "light" ? "#471f7d" : "white"}
										style={{ marginLeft: 5 }}
									/>
									{expanded && (
										<Text
											style={{
												fontSize: 12,
												textAlign: "center",
												color: colorScheme === "light" ? "#471f7d" : "white",
												marginTop: 2,
											}}
										>
											Remove
										</Text>
									)}
								</View>
							</View>
						</TouchableOpacity>
					)}
				</View>
			</View>
		);
	} else {
		return <View style={[styles.invisible]}></View>;
	}
};

// @ts-ignore
function PlaceList(items, save?: boolean, deleteIcon?: boolean, update?: boolean, setUpdate?: any, titleRef?: any, typeRef?: any, buttonRef?: any, containerRef?: any, placeEnabled?: any) {
	// @ts-ignore
	const categories = [];
	for (let i = 0; i < items.length; i++) {
		// @ts-ignore
		if (!categories.includes(items[i].typeOfPlace)) {
			categories.push(items[i].typeOfPlace);
		}
	}
	if (items) {
		return {
			view: (
				<View key={0} style={{ alignItems: "center" }}>
					{
						// @ts-ignore
						items.map((item, index) => (
							<Place
								key={index}
								name={item.name}
								type={item.typeOfPlace}
								logoUri={"../assets/logos/icon12.png"}
								invisible={item.invisible}
								address={`${item.streetAddress + " " + item.city + " "} ${
									item.state
								}`}
								phone={item.phone}
								website={item.website}
								object = {item}
								save = {save}
								deleteIcon = {deleteIcon}
								update = {update}
								setUpdate={setUpdate}
								titleRef={index === 0 ? titleRef : null}
								typeRef={index === 0 ? typeRef : null}
								buttonRef={index === 0 ? buttonRef : null}
								containerRef={index === 0 ? containerRef : null}
								placeEnabled={index === 0 ? placeEnabled : undefined}
							/>
						))
					}
				</View>
			),
			categories: categories,
		};
	} else {
		return null;
	}
}

export { PlaceList, Place };
