import { useTheme } from "@react-navigation/native";
import React from "react";
import { Linking, Platform } from "react-native";
import { Marker, Callout } from "react-native-maps";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SaveIcon from "../assets/SVGs/download-outline.svg";
import { parse } from "react-native-svg";

interface MarkerProps {
	data: any;
	categories: string[];
	colors: string[];
	categoriesEnabled: string[];
	i: number;
}

const styles = StyleSheet.create({
	nameText: {
		fontSize: 18,
		color: "#333",
		overflow: "scroll",
		justifyContent: "center",
		display: "flex",
		flexWrap: "wrap",
		textAlign: "center",
	},
	typeText: {
		fontSize: 15,
		color: "#63666a",
	},
	actionText: {
		fontSize: 16,
		borderRadius: 10,
		color: "white",
		marginLeft: 5,
	},
	actionTextHidden: {
		display: "none",
	},
	clickText: {
		fontSize: 10,
		color: "#63666a",
	},
});

export const MarkerReact: React.FC<MarkerProps> = ({
	data,
	categories,
	colors,
	categoriesEnabled,
	i,
}) => {
	let {
		name,
		typeOfPlace,
		streetAddress,
		state,
		phone,
		website,
		city,
		lat,
		long,
	} = data;
	const urlScheme = Platform.select({
		ios: "maps://0,0?q=",
		android: "geo:0,0?q=",
	});
	const address = `${streetAddress + " " + city + " "} ${state}`;
	const url = `${urlScheme}${address}`;
	const justNumber = phone.replaceAll(/[\(\)-\s]/g, "");
	const tele = `${"tel:"}${justNumber}`;
	if (!categories.includes(typeOfPlace)) {
		categories.push(typeOfPlace);
	}
	const color = colors[categoriesEnabled.indexOf(typeOfPlace)];
	const device = Platform.OS;
	const iconSize = 25;
	lat = parseFloat(lat);
	long = parseFloat(long);
	if (device === "ios") {
		return (
			<Marker
				coordinate={{ latitude: lat, longitude: long }}
				title={name}
				description="This is a custom info window."
				key={i}
				pinColor={color}
			>
				<Callout>
					<View
						style={{
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
							width: "91%",
							minWidth: 300,
						}}
					>
						<Text style={styles.nameText}>{name}</Text>
						<Text style={styles.typeText}>{typeOfPlace}</Text>
						<View
							style={{
								flexDirection: "column",
								justifyContent: "space-between",
								width: "100%",
								marginTop: 10,
							}}
						>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-evenly",
								}}
							>
								<TouchableOpacity
									onPress={async () => {
										Linking.openURL(url);
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											borderRadius: 10,
											backgroundColor: "#572C5F",
											paddingHorizontal: 15,
											display: "flex",
										}}
									>
										<Image
											source={require("../assets/logos/nav.png")}
											alt={"logo"}
											style={{
												resizeMode: "contain",
												height: iconSize,
												width: iconSize,
												margin: 5,
											}}
										/>
										<Text style={styles.actionText}>Address</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={async () => {
										Linking.openURL(tele);
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											borderRadius: 10,
											backgroundColor: "#572C5F",
											paddingHorizontal: 18,
											display: "flex",
										}}
									>
										<Image
											source={require("../assets/logos/phoneIcon.png")}
											alt={"Phone Button"}
											style={{
												resizeMode: "contain",
												height: iconSize,
												width: iconSize,
												margin: 5,
											}}
										/>
										<Text style={[styles.actionText, { flex: 1 }]}>
											{"Call"}
										</Text>
									</View>
								</TouchableOpacity>
							</View>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-evenly",
									marginTop: 10,
									marginBottom: 5,
								}}
							>
								<TouchableOpacity
									onPress={async () => {
										Linking.openURL(website.replaceAll(/[\s]/g, ""));
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											borderRadius: 10,
											backgroundColor: "#572C5F",
											paddingHorizontal: 15,
											display: "flex",
										}}
									>
										<Image
											source={require("../assets/logos/webIcon.png")}
											alt={"logo"}
											style={{
												resizeMode: "contain",
												height: iconSize,
												width: iconSize,
												margin: 5,
											}}
										/>
										<Text style={styles.actionText}>Website</Text>
									</View>
								</TouchableOpacity>
								<TouchableOpacity
									onPress={async () => {
										try {
											await AsyncStorage.setItem(
												i.toString(),
												JSON.stringify(data[i])
											);
											alert("Saved!");
										} catch (e) {
											console.log(e);
										}
									}}
								>
									<View
										style={{
											flexDirection: "row",
											alignItems: "center",
											borderRadius: 10,
											backgroundColor: "#572C5F",
											paddingRight: 18,
											paddingLeft: 13,
											paddingHorizontal: 13,
											display: "flex",
										}}
									>
										<SaveIcon
											width={iconSize}
											height={iconSize}
											color="white"
											style={{
												margin: 5,
											}}
										/>
										<Text style={styles.actionText}>Save</Text>
									</View>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				</Callout>
			</Marker>
		);
	} else {
		return (
			<Marker
				coordinate={{ latitude: lat, longitude: long }}
				title={name}
				description="This is a custom info window."
				key={i}
			>
				<Callout
					onPress={async () => {
						try {
							alert("Saved!");
							await AsyncStorage.setItem(name, JSON.stringify(data));
						} catch (e) {
							console.log(e);
						}
					}}
				>
					<View
						style={{
							flexDirection: "column",
							justifyContent: "center",
							alignItems: "center",
						}}
					>
						<Text style={styles.nameText}>{name}</Text>
						<Text style={styles.typeText}>{typeOfPlace}</Text>
						<Text style={styles.clickText}>{"(Tap to Save and See More Info)"}</Text>
					</View>
				</Callout>
			</Marker>
		);
	}
};
