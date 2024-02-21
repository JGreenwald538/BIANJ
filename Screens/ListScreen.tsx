import React, { Dispatch, SetStateAction, createContext, useContext, useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, View, LayoutAnimation } from "react-native";
import { Place, PlaceList } from "../components/Place";
import {
	CategoriesContext,
	LocationContext,
	PlacesContext,
	WalkthroughContext,
} from "../util/globalvars";
import LogoTitle from "../components/LogoTitle";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter } from "../components/Filter";
import { SortBy } from "../components/SortBy";
import WalkthroughOverlay from "../components/WalkthroughOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";


const sortBys = ["Alphabetical", "Category", "Distance"];

const screenHeight = Dimensions.get("window").height;

interface StepInfo {
	ref: React.RefObject<View>[];
	content: {
		title: string;
		description: string;
		buttonText: string;
	};
}

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

export const WalkthroughListScreenContext = createContext<[boolean, Dispatch<SetStateAction<boolean>>]>(undefined!);

export default function ListScreen(
	{ route, navigation }: any = { route: { params: {} }, navigation: null }
) {
	const empty: any[] = [];
	const [data, setData] = useState(empty);
	const values = useContext(PlacesContext);
	const [sortByEnabled, setSortByEnabled] = useState(
		route.params ? route.params.sortBy : ""
	);
	const currentLocation = useContext(LocationContext);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [sortByExpanded, setSortByExpanded] = useState(false);
	const [categoriesEnabled, setCategoriesEnabled] = useState([]);
	const categories = useContext(CategoriesContext);
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

	const [walkthrough, setWalkthrough] = useContext(WalkthroughContext);

	const [currentStep, setCurrentStep] = useState<number>(0);
	const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
	const updateVisibility = () => {
		setOverlayVisible(walkthrough !== 0);
	};

	const [centered, setCentered] = useState(true);

	const [targetMeasure, setTargetMeasure] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	}>({ x: 0, y: 0, width: 0, height: 0 });

	const screenRef = React.useRef<View>(null);
	const containerRef = React.useRef<View>(null);
	const titleRef = React.useRef<View>(null);
	const buttonRef = React.useRef<View>(null);
	const typeRef = React.useRef<View>(null);
	const [placeEnabled, setPlaceEnabled] = useState(false);

	// Define the steps of your walkthrough, including the ref to the target element and the content to display
	const steps: StepInfo[] = [
		{
			ref: [screenRef],
			content: {
				title: "List",
				description:
					"This page has a list of all the resources from our database.",
				buttonText: "Next",
			},
		},
		{
			ref: [containerRef],
			content: {
				title: "List",
				description:
					"Each resource is displayed with its name, type, and distance from your current location.",
				buttonText: "Next",
			},
		},
		{
			ref: [titleRef, typeRef, buttonRef],
			content: {
				title: "Resource Information",
				description:
					"You can see the title, type of place, and you can click on the button to see more information. Let's do it!",
				buttonText: "Next",
			},
		},
		{
			ref: [containerRef],
			content: {
				title: "Expanded Resource Information",
				description:
					"Now you can see all of the information for one place including the address, phone number, and website. You can also save the place. I'll save one for you.",
				buttonText: "Next",
			},
		},
	];

	// Effect to measure the current target element's position
	useEffect(() => {
		if (overlayVisible) {
			const currentRef = steps[currentStep].ref;
			let minX = Infinity;
			let minY = Infinity;
			let maxX = 0;
			let maxY = 0;

			let measurementsCount = 0;
			currentRef.forEach((ref) => {
				ref.current?.measure((x, y, width, height, pageX, pageY) => {
					minX = Math.min(minX, pageX);
					minY = Math.min(minY, pageY);
					maxX = Math.max(maxX, pageX + width);
					maxY = Math.max(maxY, pageY + height);

					measurementsCount++;
					if (measurementsCount === currentRef.length) {
						// All measurements are done
						setTargetMeasure({
							x: minX,
							y: minY,
							width: maxX - minX,
							height: maxY - minY,
						});
					}
				});
			});
		}
	}, [currentStep, overlayVisible]);

	// Function to proceed to the next step or end the walkthrough
	const nextStep = () => {
		if (currentStep === 2) {
			setPlaceEnabled(true);
			setTimeout(() => {
				setCurrentStep(currentStep + 1);
			}, 0);
		} else if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
			if (currentStep === 0) {
				setCentered(false);
			}
		} else {
			(async () => {
				await AsyncStorage.setItem(
					sortedValues[0].name,
					JSON.stringify(sortedValues[0])
				);
			})();
			setOverlayVisible(false);
			navigation.navigate("Saved");
			setWalkthrough(currentStep + 1);
		}
	};

	useFocusEffect(() => {
		{
			updateVisibility();
		}
	});

	const sortedValues = useMemo(() => {
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
			return sortedValues;
	}, [sortByEnabled, categoriesEnabled, values, currentLocation]);

	

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
			<View ref={screenRef}></View>
			<WalkthroughOverlay
				visible={overlayVisible}
				targetMeasure={targetMeasure}
				content={steps[currentStep].content}
				onClose={nextStep}
				center={centered}
			/>
			<ScrollView>
				<Place invisible />
				<WalkthroughListScreenContext.Provider value={[placeEnabled, setPlaceEnabled]}>

				<PlaceList 
				items={sortedValues}
				// save={undefined,
				// deleteIcon: undefined,
				// update: undefined,
				// setUpdate: undefined,
				titleRef={titleRef}
				typeRef={typeRef}
				buttonRef={buttonRef}
				containerRef={containerRef}
				useRef={true}
				// placeEnabled={placeEnabled}
				// setPlaceEnabled={setPlaceEnabled}

			/>
				</WalkthroughListScreenContext.Provider>

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
