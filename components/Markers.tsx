import { Marker, Callout } from "react-native-maps";
import { Text, View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import React from "react";
import SaveIcon from "../assets/SVGs/download-outline.svg";
import { useTheme } from "@react-navigation/native";
import { MarkerReact } from "./Marker";


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
		fontSize: 16,
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
		const {
			typeOfPlace,
		} = data[i];
		markers.push([
			<MarkerReact
				data={data[i]}
				categories={categories}
				colors={colors}
				categoriesEnabled={categoriesEnabled}
				key={i}
				i={i}
			/>,

			distances[i],
			typeOfPlace,
		]); 
			
	}
	return [markers, categories];
}
