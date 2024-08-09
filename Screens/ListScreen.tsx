import React, { useContext, useEffect, useMemo, useState } from "react";
import { Dimensions, ScrollView, View, LayoutAnimation } from "react-native";
import { Place, PlaceList } from "../components/Places";
import {
	CategoriesContext,
	LocationContext,
	NavigationParamsList,
	PlacesContext,
	WalkthroughContext,
	WalkthroughListScreenContext,
} from "../util/globalvars";
import LogoTitle from "../components/LogoTitle";
import { useFocusEffect, useTheme, NavigationProp } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Filter } from "../components/Filter";
import { SortBy } from "../components/SortBy";
import WalkthroughOverlay from "../components/WalkthroughOverlay";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PlaceInvisible from "../components/PlaceInvisible";
import getDistance from "../lib/distance";

interface StepInfo {
	ref: React.RefObject<View>[];
	content: {
		title: string;
		description: string;
		buttonText: string;
	};
}


export default function ListScreen(
	{
		// route = { params: { sortBy: "Category", categoriesEnabled: [] } },
		navigation,
	}: any // { route?: { params: {sortBy: string, categoriesEnabled: string[] } }; navigation: NavigationProp<NavigationParamsList> } 
) {
	const values = useContext(PlacesContext);
	const [sortByEnabled, setSortByEnabled] = useState("Category");
	const currentLocation = useContext(LocationContext);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const [sortByExpanded, setSortByExpanded] = useState(false);
	const [categoriesEnabled, setCategoriesEnabled] = useState<string[]>([]);
	const categories = useContext(CategoriesContext);
	const { colors } = useTheme();
	const colorScheme = colors.background === "white" ? "light" : "dark";
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
					"Each resource is displayed with its name and type of location.",
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
			setCurrentStep(0);
		}
	};

	useFocusEffect(() => {
		updateVisibility();
	});

	

	useEffect(() => {
		setSortByEnabled(route.params ? route.params.sortBy : sortByEnabled);
		setCategoriesEnabled(
			route.params ? route.params.categoriesEnabled : categoriesEnabled
		);
	}, [route.params]);

	const sortedValues = useMemo(() => {
		let sortedValues = [];
		// Convert to JSON and apply the sorting logic
		sortedValues = values.sort((a, b) => {
			switch (sortByEnabled) {
				case "Alphabetical":
					return a.name.localeCompare(b.name);
				case "Category":
					return a.typeOfPlace.localeCompare(b.typeOfPlace);
				case "Distance":
					if (currentLocation && currentLocation[0]) {
						return (
							getDistance(
								a.lat,
								a.long,
								currentLocation![0].lat,
								currentLocation![0].long
							) -
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
			<View ref={screenRef} collapsable={false}></View>
			<WalkthroughOverlay
				visible={overlayVisible}
				targetMeasure={targetMeasure}
				content={steps[currentStep].content}
				onClose={nextStep}
				center={centered}
			/>
			<ScrollView style={{ height: "100%" }}>
				<PlaceInvisible />
				<WalkthroughListScreenContext.Provider
					value={[placeEnabled, setPlaceEnabled]}
				>
					<PlaceList
						items={sortedValues}
						titleRef={titleRef}
						typeRef={typeRef}
						buttonRef={buttonRef}
						containerRef={containerRef}
						useRef={true}
						save
					/>
				</WalkthroughListScreenContext.Provider>
			</ScrollView>
			<Filter
				filtersExpanded={filtersExpanded}
				categoriesEnabled={categoriesEnabled}
				setCategoriesEnabled={setCategoriesEnabled}
				categories={categories}
				update={update}
				setUpdate={setUpdate}
				onPressFilters={onPressFilters}
				nextCategory={nextCategory}
				setNextCategory={setNextCategory}
			/>
			<SortBy
				categories={categories}
				colorScheme={colorScheme}
				sortByExpanded={sortByExpanded}
				onPressSortBy={onPressSortBy}
				sortByEnabled={sortByEnabled}
				setSortByEnabled={setSortByEnabled}
				currentLocation={currentLocation}
				setSortByExpanded={setSortByExpanded}
			/>
			<LogoTitle />
		</View>
	);
}
