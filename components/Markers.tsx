import React from "react";
import { MarkerProps, MarkerReact } from "./Marker";
import { Place } from "../lib/place";
import getDistance from "../lib/distance";

interface MarkersProps {
	data: Place[];
	categoriesEnabled: string[];
	userLocation: { lat: number; long: number } | null;
}

const colors: string[] = ["red", "green", "blue", "yellow", "orange"];

function getDistanceTwoPoints(
	userLocation: { lat: number; long: number },
	targetLocations: { lat: number; long: number }[]
) {
	let distances = [];
	for (let i = 0; i < targetLocations.length; i++) {
		const data = getDistance(
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
	targetLocations: { lat: number; long: number }[],
	userLocation: { lat: number; long: number } | null
) {
	if (userLocation === null) {
		return null;
	}
	const distances = getDistanceTwoPoints(userLocation, targetLocations);
	if (distances === null) {
		return null;
	}

	return distances;
}

export default function Markers({data, categoriesEnabled, userLocation}: MarkersProps ) {
	let distances: number[] | null = [];
	if (userLocation !== null) {
		distances = isCoordinateWithinRadius(data, userLocation);
	}
	let markers: {
		marker: React.ReactElement | null;
		distance: number;
		typeOfPlace: string;
	}[] = [];
	const categories: string[] = [];
	if(distances === null) {
		return {markers: [], categories: []};
	}
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
