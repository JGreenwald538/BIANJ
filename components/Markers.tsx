import React from "react";
import { MarkerProps, MarkerReact } from "./Marker";

interface MarkersProps {
	data: any;
	categoriesEnabled: any;
	userLocation: any;
}

const colors: string[] = ["red", "green", "blue", "yellow", "orange"];

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
	userLocation: { lat: number; long: number },
	targetLocations: { lat: number; long: number }[]
) {
	let distances: any = [];
	for (let i = 0; i < targetLocations.length; i++) {
		const data = haversineDistance(
			userLocation.lat,
			userLocation.long,
			targetLocations[i].lat,
			targetLocations[i].long
		);
		distances.push(data);
	}
	return distances;
}

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

export default function Markers({data, categoriesEnabled, userLocation}: MarkersProps ) {
	let distances = [];
	if (userLocation !== null) {
		distances = isCoordinateWithinRadius(data, userLocation);
	}
	let markers: {
		marker: React.ReactElement | null;
		distance: number;
		typeOfPlace: string;
	}[] = [];
	const categories: string[] = [];
	for (let i = 0; i < data.length; i++) {
		const {
			typeOfPlace,
		} = data[i];
				markers.push({
					marker: <MarkerReact
						categories={categories}
						colors={colors}
						categoriesEnabled={categoriesEnabled}
						key={i}
						i={i}
						data={data[i]}
					/>,

					distance: distances[i],
					typeOfPlace: typeOfPlace,
			}); 
			
	}
	return {markers: markers, categories: categories};
}
