import React, { useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, LayoutAnimation } from 'react-native';
import { useNavigation, useTheme } from '@react-navigation/native';
import { LocationContext } from '../util/globalvars';
import getDistance from '../lib/distance';
import { Place } from '../lib/place';


// Define a type for the component props
type ClosestLocationComponentProps = {
    locations: Place[];
    categories: [string[], string[]];
	setFiltersExpanded: (filtersExpanded: boolean) => void;
	ref?: React.RefObject<View>;
};


const ClosestLocationComponent: React.FC<ClosestLocationComponentProps> = ({ locations, categories, ref, setFiltersExpanded }) => {
    const {colors} = useTheme();
    const colorScheme = colors.background === "white" ? "light" : "dark";
	const currentLocation = useContext(LocationContext);
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
	if (currentLocation) {
		if(!currentLocation[0] || !locations) {
			return null;
		}
	} else {
		return null
	}
	const sortedLocations = locations
		.filter(location => {
			return categories[1].indexOf(location.typeOfPlace) !== -1;
		}
			)
		.map(location => ({
			name: location.name,
			distance: currentLocation[0] ? getDistance(currentLocation[0].lat, currentLocation[0].long, location.lat, location.long) : 0
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
								// @ts-expect-error
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
