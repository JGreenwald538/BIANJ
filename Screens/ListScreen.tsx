import React, { useContext, useEffect, useState } from "react";
import {
	Animated,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	View,
	Text,
	LayoutAnimation,
	Platform,
} from "react-native";
import { API_URL } from "../constants";
import { Place, PlaceList } from "../components/Place";
import {
	CategoriesContext,
	LocationContext,
	PlacesContext,
} from "../util/globalvars";
import Checkbox from "../components/Checkbox";
import { RadioButton } from "react-native-paper";
import { AddressInput } from "../components/AddressInput";
import LogoTitle from "../components/LogoTitle";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter } from "../components/Filter";
import { SortBy } from "../components/SortBy";

const sortBys = ["Alphabetical", "Category", "Distance"];

const screenHeight = Dimensions.get("window").height;

const getDistance = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
): number => {
	const R = 6371;
	const dLat = (lat2 - lat1) * (Math.PI / 180);
	const dLon = (lon2 - lon1) * (Math.PI / 180);
	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(lat1 * (Math.PI / 180)) *
			Math.cos(lat2 * (Math.PI / 180)) *
			Math.sin(dLon / 2) *
			Math.sin(dLon / 2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return (R * c) / 1.609;
};

export default function ListScreen(sortBy: any = "") {
	const empty: any[] = [];
	const [data, setData] = useState(empty);
	const values = useContext(PlacesContext);
	const [sortByEnabled, setSortByEnabled] = useState(
		sortBy.route.params ? sortBy.route.params.sortBy : ""
	);
	const currentLocation = useContext(LocationContext);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [sortByExpanded, setSortByExpanded] = useState(false);
	const [categoriesEnabled, setCategoriesEnabled] = useState([]);
	const categories = useContext(CategoriesContext);
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

	const screenWidth = Dimensions.get("window").width;

	useEffect(() => {
		const sortData = async () => {
			let sortedValues = [];
			// Convert to JSON and apply the sorting logic
			sortedValues = values.sort((a, b) => {
				switch (sortByEnabled) {
					case "Alphabetical":
						// @ts-ignore
						return a.name.localeCompare(b.name);
					case "Category":
						// @ts-ignore
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
			const places = PlaceList(sortedValues);
			if (places) {
				// @ts-ignore
				setPlaces(places.view);
			}
		};

		sortData();
		// @ts-ignore
	}, [sortByEnabled, currentLocation[0], categoriesEnabled, update]);

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
				{places}
			</ScrollView>
			<Filter
        filtersExpanded={filtersExpanded}
        categoriesEnabled={categoriesEnabled}
        setCategoriesEnabled={setCategoriesEnabled}
        categories={categories}
        colorScheme={colorScheme}
        insets={insets}
        screenWidth={screenWidth}
        update={update}
        setUpdate={setUpdate}
        onPressFilters={onPressFilters}
        screenHeight={screenHeight}
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
