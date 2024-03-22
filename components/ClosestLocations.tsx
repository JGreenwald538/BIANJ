import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';


// Define a type for the location objects
type Location = {
    lat: number;
    long: number;
    name: string;
    typeOfPlace: any;
};

// Define a type for the component props
type ClosestLocationComponentProps = {
    locations: Location[];
    currentLocation: any;
    categories: any;
	setFiltersExpanded: (filtersExpanded: boolean) => void;
	ref?: any;
};

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    // Haversine formula to calculate the distance
    const R = 6371; // Radius of the Earth in km
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c / 1.609; // Distance in km
};

const ClosestLocationComponent: React.FC<ClosestLocationComponentProps> = ({ locations, currentLocation, categories, ref, setFiltersExpanded }) => {
    const {colors} = useTheme();
    const colorScheme = colors.background === "white" ? "light" : "dark";
    const styles = StyleSheet.create({
        container: {
          backgroundColor: colorScheme === "light" ? '#e2cbe7' : "#70387a", // 
          marginHorizontal: 20,
          borderRadius: 10,
          padding: 10,
          marginTop: 15,
          alignContent: 'center',
          justifyContent: "space-between",
          display: 'flex',
          width: 'auto',
          flexDirection: 'column',
        },
    });
    const navigation = useNavigation();
    if(!currentLocation[0] || !locations) {
        return null;
    }
    const sortedLocations = locations
        .filter(location => {
            return categories[1].indexOf(location.typeOfPlace) !== -1;
        }
            )
        .map(location => ({
            name: location.name,
            distance: getDistance(currentLocation[0].lat, currentLocation[0].long, location.lat, location.long)
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3); // Get top 3 locations

	const categoriesEmpty = categories[1].every((category: string) => category === "");
    return (
			<View style={styles.container} ref={ref}>
				<Text
					style={{
						textAlign: "center",
						fontWeight: "600",
						color: colorScheme === "light" ? "black" : "white",
					}}
				>
					Closest Locations
				</Text>
				{sortedLocations.length > 0 ? (
					sortedLocations.map((location, index) => (
						<Text
							key={index}
							style={{
								textAlign: "center",
								color: colorScheme === "light" ? "black" : "white",
							}}
						>
							{index + 1}. {location.name}: (
							{Math.round(parseFloat(location.distance.toFixed(2)))} mi)
						</Text>
					))
				) : (
					<TouchableOpacity onPress={() => {
						setFiltersExpanded(true)
						LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
					}}>
						<Text
							style={{
								textAlign: "center",
								color: colorScheme === "light" ? "black" : "white",
							}}
						>
							Select Filters To See Closest Locations
						</Text>
					</TouchableOpacity>
				)}
				<View
					style={{
						paddingHorizontal: 10,
						paddingVertical: 5,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<TouchableOpacity
						style={{
							paddingVertical: 5,
							backgroundColor: !categoriesEmpty ? "#572C5F" : "grey",
							borderRadius: 5,
							opacity: !categoriesEmpty ? 1 : 0.75,
						}}
						onPress={() => {
							if (!categoriesEmpty) {
								// @ts-ignore
								navigation.navigate("List", {
									sortBy: "Distance",
									categoriesEnabled: categories[1],
								});
							} else {
								alert("Please select filters to see closest locations");
							}
						}}
					>
						<Text
							style={{
								color: "white",
								textAlign: "center",
								paddingHorizontal: 5,
							}}
							accessibilityLabel='See All Closest Locations'
						>
							See All
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		);
};

export default ClosestLocationComponent;
