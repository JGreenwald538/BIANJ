import React, { useState, useEffect, useContext } from "react";
import {
	View,
	TouchableOpacity,
	ScrollView,
	Animated,
	Text,
	Dimensions,
	LayoutAnimation,
	Platform,
} from "react-native";
import { Place, PlaceList } from "../components/Place";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "../components/Checkbox";
import { RadioButton } from "react-native-paper";
import { AddressInput } from "../components/AddressInput";
import { CategoriesContext, LocationContext } from "../util/globalvars";
import LogoTitle from "../components/LogoTitle";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter } from "../components/Filter";
import { SortBy } from "../components/SortBy";

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

const getDistance = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number => {
	// Haversine formula to calculate the distance
	const R = 6371; // Radius of the Earth in km
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return (R * c) / 1.609; // Distance in mi
};

const sortBys = ["Alphabetical", "Category", "Distance"];

export default function SavedScreen() {
	const currentLocation = useContext(LocationContext);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [sortByExpanded, setSortByExpanded] = useState(false);
	const [categoriesEnabled, setCategoriesEnabled] = useState([]);
	const [categories, setCategories] = useState([]);
	const [sortByEnabled, setSortByEnabled] = useState("Category");
	const [places, setPlaces] = useState([]);
	const { colors } = useTheme();
	const colorScheme = colors.background === "white" ? "light" : "dark";
	const insets = useSafeAreaInsets();
	const [update, setUpdate] = useState(false);
	const [nextCategory, setNextCategory] = useState(0);

	const onPressFilters = () => {
		// Configure the animation before the state changes.
		if (!sortByExpanded) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			setFiltersExpanded(!filtersExpanded); // This would be your state to control the button size.
		}
	};

	const onPressSortBy = () => {
		// Configure the animation before the state changes.
		if (!filtersExpanded) {
			LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
			setSortByExpanded(!sortByExpanded); // This would be your state to control the button size.
		}
	};
	useFocusEffect(
		React.useCallback(() => {
			const sortData = async () => {
				console.log("Sorting");
				const keys = await AsyncStorage.getAllKeys();
				const values = await AsyncStorage.multiGet(keys);
				let sortedValues = [];
				if(values.length === 0) {
					setCategories([]);
				}
				sortedValues = values
					.map(([_, value]) => {
						const tempCategories = categories;
						if (
							!tempCategories.includes(JSON.parse(value as string).typeOfPlace)
						) {
							tempCategories.push(JSON.parse(value as string).typeOfPlace);
						}
						setCategories(tempCategories);
						return JSON.parse(value as string);
					})

					.sort((a, b) => {
						switch (sortByEnabled) {
							case "Alphabetical":
								return a.name.localeCompare(b.name);
							case "Category":
								return a.typeOfPlace.localeCompare(b.typeOfPlace);
							case "Distance":
								// @ts-ignore
								if (currentLocation[0]) {
									// @ts-ignore
									return (
										getDistance(
											a.lat,
											a.long,
											currentLocation![0].lat,
											currentLocation![0].long
										) -
										// @ts-ignore
										getDistance(
											b.lat,
											b.long,
											currentLocation![0].lat,
											currentLocation![0].long
										)
									);
								}
								return 0;
							default:
								return 0;
						}
					});

				if (categoriesEnabled.length !== 0) {
					sortedValues = sortedValues.filter((value) => {
						// @ts-ignore
						return categoriesEnabled.indexOf(value.typeOfPlace) !== -1;
					});
				}
				// @ts-ignore
				const places = PlaceList(sortedValues, false, true, update, setUpdate);
				if (places) {
					// @ts-ignore
					setPlaces(places.view);
				}
			};

			sortData();
			// @ts-ignore
		}, [sortByEnabled, currentLocation[0], update, categoriesEnabled])
	);

	console.log(categories)

	useFocusEffect(
		React.useCallback(() => {
			return () => {
				setFiltersExpanded(false);
				setSortByExpanded(false);
			};
		}, [])
	);

	return (
		<View>
			<ScrollView>
				<Place invisible />
				{categories.length === 0 && (
					<View
						style={{
							flex: 1,
							justifyContent: "center",
							alignItems: "center",
							marginTop: screenHeight / 3,
						}}
					>
						<Text
							style={{
								fontSize: 25,
								color: colorScheme === "light" ? "black" : "white",
							}}
						>
							No Saved Places
						</Text>
					</View>
				)
						}
				{places}
				{categories.length !== 0 && (
					<View style={{ paddingHorizontal: 40 }}>
						<TouchableOpacity
							style={{
								backgroundColor: "#572c5f",
								width: "100%",
								height: 45,
								justifyContent: "center",
								borderRadius: 10,
							}}
							onPress={async () => {
								await AsyncStorage.clear();
								alert("Cleared");
								setUpdate(!update);
								setCategoriesEnabled([]);
								setCategories([]);
							}}
						>
							<Text
								style={{
									textAlign: "center",
									fontSize: 18,
									fontWeight: "500",
									color: "white",
								}}
							>
								Clear Saved
							</Text>
						</TouchableOpacity>
					</View>
				)}
			</ScrollView>
			<Filter
				filtersExpanded={filtersExpanded}
				categoriesEnabled={categoriesEnabled}
				setCategoriesEnabled={setCategoriesEnabled}
				categories={categories}
				colorScheme={colorScheme}
				screenHeight={screenHeight}
				insets={insets}
				screenWidth={screenWidth}
				onPressFilters={onPressFilters}
				update={update}
				setUpdate={setUpdate}
				nextCategory={nextCategory}
				setNextCategory={setNextCategory}
			/>
			<SortBy
				categories={categories}
				colorScheme={colorScheme}
				sortByExpanded={sortByExpanded}
				onPressSortBy={onPressSortBy}
				screenWidth={screenWidth}
				screenHeight={screenHeight}
				insets={insets}
				sortByEnabled={sortByEnabled}
				setSortByEnabled={setSortByEnabled}
				currentLocation={currentLocation}
				sortBys={sortBys}
				setSortByExpanded={setSortByExpanded}
			/>
			<LogoTitle />
		</View>
	);
}
