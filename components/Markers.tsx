import { Marker, Callout } from "react-native-maps";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import React from "react";

const colors: string[] = ["red", "green", "blue", "yellow", "orange"];

const device = Platform.OS;

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
		fontSize: 8,
		borderRadius: 10,
		color: "white",
	},
	actionTextHidden: {
		display: "none",
	},
});

function toRadians(degrees: number): number {
	return (degrees * Math.PI) / 180;
}

function haversineDistance(
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number {
	const R = 6371; // Earth's radius in kilometers
	const dLat = toRadians(lat2 - lat1);
	const dLon = toRadians(lon2 - lon1);
	const rLat1 = toRadians(lat1);
	const rLat2 = toRadians(lat2);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(rLat1) * Math.cos(rLat2) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return (R * c) / 1.609;
}

// Function to calculate the distance between two coordinates using Bing Maps API
function getDistanceTwoPoints(
	userLocation: { lat: any; long: any },
	targetLocation: any
) {
	let distances: any = [];
	for (let i = 0; i < targetLocation.length; i++) {
		const data = haversineDistance(
			userLocation.lat,
			userLocation.long,
			targetLocation[i].lat,
			targetLocation[i].long
		);
		distances.push(data);
	}
	return distances;
}

// Function to request permission and get user's current location

// Function to check if a coordinate is within a certain radius from the user
function isCoordinateWithinRadius(
	targetLocations: { lat: any; long: any }[],
	userLocation: { lat: any; long: any } | null
) {
	if (userLocation === null) {
		return [-1];
	}
	const distances = getDistanceTwoPoints(userLocation, targetLocations);
	if (distances === null) {
		return -1;
	}

	return distances;
}

// @ts-ignore
export default function Markers(data, categoriesEnabled, userLocation) {
	// const userLocation = useContext(LocationContext);
	// @ts-ignore
	let distances = [];
	if (userLocation !== null) {
		distances = isCoordinateWithinRadius(data, userLocation);
	}
	let markers = [];
	const categories: any[] = [];
	for (let i = 0; i < data.length; i++) {
		if (device === "ios") {
			const {
				name,
				typeOfPlace,
				streetAddress,
				state,
				phone,
				website,
				city,
				lat,
				long,
			} = data[i];
			const urlScheme = Platform.select({
				ios: "maps://0,0?q=",
				android: "geo:0,0?q=",
			});
			const address = `${urlScheme}${
				streetAddress + " " + city + " "
			} ${state}`;
			const justNumber = phone.replaceAll(/[\(\)-\s]/g, "");
			const tele = `${"tel:"}${justNumber}`;
			if (!categories.includes(typeOfPlace)) {
				categories.push(typeOfPlace);
			}
			const color = colors[categoriesEnabled.indexOf(typeOfPlace)];
			markers.push([
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
                width: "90%"
							}}
						>
							<Text style={styles.nameText}>{name}</Text>
							<Text style={styles.typeText}>{typeOfPlace}</Text>
							<View
								style={{
									flexDirection: "row",
									justifyContent: "space-between",
									width: "100%",
									marginTop: 10,
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
											display: "flex",
										}}
									>
										<Image
											source={require("../assets/logos/icon6.png")}
											alt={"logo"}
											style={{
												resizeMode: "contain",
												height: 15,
												width: 15,
												margin: 5,
											}}
										/>
										<Text style={styles.actionText}>Address</Text>
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
											display: "flex",
										}}
									>
										<Image
											source={require("../assets/logos/phoneicon.png")}
											alt={"logo"}
											style={{
												resizeMode: "contain",
												height: 15,
												width: 15,
												margin: 5,
											}}
										/>
										<Text style={[styles.actionText, { flex: 1 }]}>
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
											display: "flex",
										}}
									>
										<Image
											source={require("../assets/logos/webicon.png")}
											alt={"logo"}
											style={{
												resizeMode: "contain",
												height: 15,
												width: 15,
												margin: 5,
											}}
										/>
										<Text style={styles.actionText}>Website</Text>
									</View>
								</TouchableOpacity>
							</View>
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
								<View>
									<Text style={[styles.typeText, {marginBottom: 10}]}>Save</Text>
								</View>
							</TouchableOpacity>
						</View>
					</Callout>
				</Marker>,

				distances[i],
				typeOfPlace,
			]);
		} else {
			const {
				name,
				typeOfPlace,
				streetAddress,
				state,
				phone,
				website,
				city,
				lat,
				long,
			} = data[i];
			if (!categories.includes(typeOfPlace)) {
				categories.push(typeOfPlace);
			}
			markers.push([
				<Marker
					coordinate={{ latitude: data[i].lat, longitude: data[i].long }}
					title={data[i].name}
					description="This is a custom info window."
					key={i}
					onPress={async () => {
						try {
							await AsyncStorage.setItem(name, JSON.stringify(data[i]));
						} catch (e) {
							console.log(e);
						}
					}}
				>
					<Callout>
						<View>
							<Text>{data[i].name}</Text>
						</View>
					</Callout>
				</Marker>,
				distances[i],
				typeOfPlace,
			]);
		}
	}
	return [markers, categories];
}
