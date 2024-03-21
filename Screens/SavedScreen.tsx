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
import { CategoriesContext, LocationContext, WalkthroughContext } from "../util/globalvars";
import LogoTitle from "../components/LogoTitle";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter } from "../components/Filter";
import { SortBy } from "../components/SortBy";
import WalkthroughOverlay from "../components/WalkthroughOverlay";

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

interface StepInfo {
	ref: React.RefObject<View>[];
	content: {
		title: string;
		description: string;
		buttonText: string;
	};
}

export default function SavedScreen({ navigation }: { navigation: any }) {
	const currentLocation = useContext(LocationContext);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [sortByExpanded, setSortByExpanded] = useState(false);
	const [categoriesEnabled, setCategoriesEnabled] = useState([]);
	const [categories, setCategories] = useState<string[]>([]);
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
				const keys = await AsyncStorage.getAllKeys();
				const values = await AsyncStorage.multiGet(keys);
				const filteredValues = values.filter(
					(value) => value[0] !== "walkthroughed"
				);

				let sortedValues = [];
				if (filteredValues.length === 0) {
					setCategories([]);
				}
				sortedValues = filteredValues
					.map(([_, value]) => {
						const tempCategories = categories;
						if (
							!tempCategories.includes(
								JSON.parse(value as string).typeOfPlace as string
							)
						) {
							tempCategories.push(
								JSON.parse(value as string).typeOfPlace as string
							);
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
				const places = PlaceList({
					items: sortedValues,
					save: false,
					deleteIcon: true,
					update,
					setUpdate,
				});
				if (sortedValues.length !== 0) {
					// @ts-ignore
					setPlaces(places);
				} else {
					// @ts-ignore
					setPlaces(null);
				}
			};

			sortData();
			// @ts-ignore
		}, [sortByEnabled, currentLocation[0], update, categoriesEnabled])
	);
	useFocusEffect(
		React.useCallback(() => {
			return () => {
				setFiltersExpanded(false);
				setSortByExpanded(false);
			};
		}, [])
	);

	const [walkthrough, setWalkthrough] = useContext(WalkthroughContext);

	// State to manage the current step, overlay visibility, and target element position
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
	const [centered, setCentered] = useState(true);
	const updateVisibility = () => {
		setOverlayVisible(walkthrough !== 0);
	};
	const [targetMeasure, setTargetMeasure] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	}>({ x: 0, y: 0, width: 0, height: 0 });

	// Define the steps of your walkthrough, including the ref to the target element and the content to display
	const steps: StepInfo[] = [
		{
			ref: [],
			content: {
				title: "Saved Screen",
				description:
					"This is the saved screen where you can see all the places you have saved and information similar to the list screen.",
				buttonText: "Go to the end",
			},
		},
	];

	useEffect(() => {
		if (overlayVisible && steps[currentStep]?.ref) {
			let measurementsCount = 0;
			const totalRefs = steps[currentStep].ref.length;
			let minX = Infinity,
				minY = Infinity,
				maxX = 0,
				maxY = 0;

			steps[currentStep].ref.forEach((ref) => {
				if (ref.current) {
					ref.current.measureInWindow((x, y, width, height) => {
						// console.log(
						// 	`Measurements for step ${currentStep}:`,
						// 	x,
						// 	y,
						// 	width,
						// 	height
						// ); // Debugging log
						if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height)) {
							minX = Math.min(minX, x);
							minY = Math.min(minY, y);
							maxX = Math.max(maxX, x + width);
							maxY = Math.max(maxY, y + height);
						}

						measurementsCount++;
						if (measurementsCount === totalRefs) {
							if (minX < Infinity && minY < Infinity) {
								setTargetMeasure({
									x: minX,
									y: minY,
									width: maxX - minX,
									height: maxY - minY,
								});
							} else {
								console.error("Invalid measurements detected");
							}
						}
					});
				}
			});
		}
	}, [overlayVisible, currentStep, steps]);

	// Function to proceed to the next step or end the walkthrough
	const nextStep = () => {
		if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			setOverlayVisible(false);
			navigation.navigate("Home");
			setWalkthrough(currentStep + 1);
			setCurrentStep(0);
		}
	};

	useFocusEffect(() => {
		{
			updateVisibility();
		}
	});

	return (
		<View>
			<WalkthroughOverlay
				visible={overlayVisible}
				targetMeasure={targetMeasure}
				content={steps[currentStep].content}
				onClose={nextStep}
				center={centered}
			/>
			<ScrollView style={{ height: "100%" }}>
				<Place invisible />
				{!places && (
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
				)}
				{places}
				{places && (
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
								// Make it so everything except for "walkthroughed" is cleared
								const keys = await AsyncStorage.getAllKeys();
								const values = await AsyncStorage.multiGet(keys);
								const filteredValues = values.filter(
									(value) => value[0] !== "walkthroughed"
								);
								filteredValues.forEach((value) => {
									AsyncStorage.removeItem(value[0]);
								});
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
			{places && (
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
			)}
			{places && (
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
			)}
			<LogoTitle />
		</View>
	);
}
