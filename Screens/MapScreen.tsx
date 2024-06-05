import React, { useContext, useEffect, useState } from "react";
import {
	Animated,
	Dimensions,
	TouchableOpacity,
	View,
	Image,
	LayoutAnimation,
	ActivityIndicator,
	KeyboardAvoidingView,
} from "react-native";
import MapView, { Circle, Marker } from "react-native-maps";
import Markers from "../components/Markers";
import Slider from "../components/MileSlider";
import ClosestLocations from "../components/ClosestLocations";
import {
	CategoriesContext,
	LocationContext,
	NavigationParamsList,
	PlacesContext,
	WalkthroughContext,
} from "../util/globalvars";
import { AddressInput } from "../components/AddressInput";
import LogoTitle from "../components/LogoTitle";
import { Platform } from "react-native";
import { NavigationProp, useFocusEffect } from "@react-navigation/native";
import { Filter } from "../components/Filter";
import WalkthroughOverlay from "../components/WalkthroughOverlay";

interface StepInfo {
	ref: React.RefObject<View>[];
	content: {
		title: string;
		description: string;
		buttonText: string;
	};
}

export default function MapScreen({
	navigation,
}: {
	navigation: NavigationProp<NavigationParamsList>;
}) {
	const data = useContext(PlacesContext);
	const [sliderValue, setSliderValue] = useState<number>(10);
	const currentLocation = useContext(LocationContext) ?? [null, false, false];
	const [isRadiusEnabled, setIsRadiusEnabled] = useState(false);
	const [filtersExpanded, setFiltersExpanded] = useState(false);
	const screenWidth = Dimensions.get("window").width;
	const [mapHeight, setMapHeight] = useState(0);
	const categories = useContext(CategoriesContext);
	const [categoriesEnabled, setCategoriesEnabled] = useState([
		"",
		"",
		"",
		"",
		"",
	]);
	const [nextCategory, setNextCategory] = useState(0);
	const [bottomBarExpanded, setBottomBarExpanded] = useState(true);
	const rotAnim = React.useRef(new Animated.Value(1)).current;
	const [bottomBarHeight, setBottomBarHeight] = useState(0);
	const mapRef = React.useRef(null);
	const filterRef = React.useRef(null);
	const filterMenuRef = React.useRef(null);
	const radiusRef = React.useRef(null);
	const closestLocationsRef = React.useRef(null);
	const addressInputRef = React.useRef(null);
	const closeButtonRef = React.useRef(null);

	const [walkthrough, setWalkthrough] = useContext(WalkthroughContext);

	// State to manage the current step, overlay visibility, and target element position
	const [currentStep, setCurrentStep] = useState<number>(0);
	const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
	const [centered, setCentered] = useState(false);
	const updateVisibility = () => {
		setOverlayVisible(walkthrough !== 0 && navigation.isFocused());
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
			ref: [mapRef],
			content: {
				title: "Map",
				description:
					"This is the map of New Jersey. You can see the locations of the resources on the map.",
				buttonText: "Next",
			},
		},
		{
			ref: [closeButtonRef],
			content: {
				title: "Close Button",
				description:
					"This button closes the bottom bar. You can open it again by tapping on the arrow.",
				buttonText: "Next",
			},
		},
		{
			ref: [filterRef],
			content: {
				title: "Filter Button",
				description:
					"This button opens the filter menu where you can filter the resources by category. Let's try it out!",
				buttonText: "Open Filters",
			},
		},
		{
			ref: [filterMenuRef],
			content: {
				title: "Filter Menu",
				description:
					"In this menu, you can filter the resources by up to 5 categories. We will filter by the first category for now.",
				buttonText: "Filter",
			},
		},
		{
			ref: [filterMenuRef],
			content: {
				title: "Filter Menu",
				description: "Great! Now let's close the filter menu.",
				buttonText: "Close Filter Menu",
			},
		},
		{
			ref: [mapRef],
			content: {
				title: "Map",
				description:
					"Now we can see all of the " +
					categories[0] +
					" resources on the map. Clicking on a resource will show more information about it. But you can do that after the walkthrough.",
				buttonText: "Next",
			},
		},
		{
			ref: [radiusRef],
			content: {
				title: "Radius Selector",
				description:
					"Here, we can turn on or off the radius selector to limit resources of a certain distance from your location. Note: This still only shows resources within the selected filters.",
				buttonText: "Next",
			},
		},
		{
			ref: [closestLocationsRef],
			content: {
				title: "Closest Locations",
				description:
					"The three closest resources within the categories you have filtered are displayed here. Note: The radius does not affect this.",
				buttonText: "Next",
			},
		},
		{
			ref: [addressInputRef],
			content: {
				title: "Address Input",
				description:
					"Here, you can input an address to see the resources near a location that is different from your current location.",
				buttonText: "Next",
			},
		},
	];

	// Effect to measure the current target element's position
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
		if (currentStep === 1) {
			onPress();
			setTimeout(() => {
				setCurrentStep(currentStep + 1);
			}, 0);
		} else if (currentStep === 2) {
			categoriesEnabled[nextCategory % 5] = categories[0];
			setCurrentStep(currentStep + 1);
		} else if (currentStep === 3) {
			onPress();
			setTimeout(() => {
				setCurrentStep(currentStep + 1);
			}, 0);
			setCentered(true);
		} else if (currentStep < steps.length - 1) {
			setCentered(false);
			setCurrentStep(currentStep + 1);
		} else {
			navigation.navigate({ name: "List", key: "List" });
			setCurrentStep(0);
			setOverlayVisible(false);
			setWalkthrough(2);
		}
	};

	useFocusEffect(() => {
		if (walkthrough !== 0 && !bottomBarExpanded) {
			handleClose();
		}
		setTimeout(() => {
			updateVisibility();
		}, 100);
	});

	const handleClose = () => {
		setBottomBarExpanded(!bottomBarExpanded);
		Animated.timing(rotAnim, {
			toValue: +!bottomBarExpanded,
			duration: 150,
			useNativeDriver: true,
		}).start();
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
	};

	const handleSliderChange = (newValue: number) => {
		setSliderValue(newValue);
	};
	const handleEnabledChange = (isRadiusEnabled: boolean) => {
		if (categoriesEnabled.some((category) => category !== "")) {
			setIsRadiusEnabled(!isRadiusEnabled);
		} else {
			alert("Please enable filters to use the radius selector");
		}
	};

	const onPress = () => {
		// Configure the animation before the state changes.
		LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
		setFiltersExpanded(!filtersExpanded); // This would be your state to control the button size.
	};
	const [markers, setMarkers] = useState<
		{
			marker: React.ReactElement | null;
			distance: number;
			typeOfPlace: string;
		}[]
	>([]);
	function updateMarkers() {
		const newMarkers = Markers({
			data: data,
			categoriesEnabled: categoriesEnabled,
			userLocation: currentLocation[0],
		});
		setMarkers(newMarkers.markers);
	} // Dependencies
	useEffect(() => {
		updateMarkers();
	}, [data, categoriesEnabled, currentLocation]);

	function changeCategoriesEnbaled(categories: string[]) {
		setCategoriesEnabled(categories);
		if (categories.every((category) => category === "")) {
			setIsRadiusEnabled(false);
		}
	}

	return (
		<KeyboardAvoidingView
			style={{ flex: 1 }}
			behavior={Platform.OS === "ios" ? "padding" : "height"}
			keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
		>
			<WalkthroughOverlay
				visible={overlayVisible}
				targetMeasure={targetMeasure}
				content={steps[currentStep].content}
				onClose={nextStep}
				center={centered}
			/>
			<View ref={mapRef} collapsable={false} style={{ flex: 1 }}>
				<MapView
					style={{
						width: "100%",
						height: "100%",
						flex: 1,
						opacity: markers.length > 0 ? 1 : 0.5,
					}}
					initialRegion={{
						latitude: 40.273043,
						longitude: -74.548957,
						latitudeDelta: 2.581346 * 1.25,
						longitudeDelta: 1.618236 * 1.25,
					}}
					showsUserLocation={true}
					onLayout={(layout) => {
						setMapHeight(layout.nativeEvent.layout.height);
						updateVisibility();
					}}
				>
					{markers.map((marker) =>
						((marker.distance <= sliderValue / 1.60934 || !isRadiusEnabled) &&
							categoriesEnabled.indexOf(marker.typeOfPlace) !== -1) ||
						(!currentLocation &&
							categoriesEnabled.indexOf(marker.typeOfPlace) !== -1)
							? // || true
							  marker.marker
							: null
					)}
					{currentLocation && currentLocation[0] && isRadiusEnabled && (
						<Circle
							center={{
								latitude:
									currentLocation && currentLocation[0]
										? currentLocation[0].lat
										: 0,
								longitude:
									currentLocation && currentLocation[0]
										? currentLocation[0].long
										: 0,
							}}
							radius={sliderValue * 1000}
							strokeWidth={1}
							strokeColor="#000000"
							fillColor="rgba(51,153,255,0.2)"
						/>
					)}
					{currentLocation && !currentLocation[2] && (
						<Marker
							coordinate={{
								latitude:
									currentLocation[0] && currentLocation[0]
										? currentLocation[0].lat
										: 0,
								longitude:
									currentLocation[0] && currentLocation[0]
										? currentLocation[0].long
										: 0,
							}}
							pinColor="#572C5F" // semi-transparent blue
							title={"Your Manual Location"}
						/>
					)}
				</MapView>
			</View>
			{bottomBarExpanded && (
				<View
					style={{ paddingBottom: 10 }}
					onLayout={(event) => {
						setBottomBarHeight(event.nativeEvent.layout.height);
					}}
				>
					{currentLocation && currentLocation[0] && (
						<View ref={radiusRef} collapsable={false}>
							<Slider
								isEnabled={isRadiusEnabled}
								value={sliderValue}
								onValueChange={handleSliderChange}
								isEnabledChange={handleEnabledChange}
								filters={categoriesEnabled}
								setFiltersExpanded={setFiltersExpanded}
							/>
						</View>
					)}
					{currentLocation && currentLocation[0] && (
						<View ref={closestLocationsRef} collapsable={false}>
							<ClosestLocations
								locations={data}
								categories={[categories, categoriesEnabled]}
								setFiltersExpanded={setFiltersExpanded}
							/>
						</View>
					)}
					<View ref={addressInputRef} collapsable={false}>
						<AddressInput />
					</View>
				</View>
			)}
			<Filter
				filtersExpanded={filtersExpanded}
				categoriesEnabled={categoriesEnabled}
				setCategoriesEnabled={changeCategoriesEnbaled}
				categories={categories}
				onPressFilters={onPress}
				nextCategory={nextCategory}
				setNextCategory={setNextCategory}
				map
				buttonRef={filterRef}
				menuRef={filterMenuRef}
			/>
			<LogoTitle left={!bottomBarExpanded} />
			<View
				style={{
					position: "absolute",
					top: mapHeight / 2,
					left: screenWidth / 2,
				}}
			>
				{markers.length === 0 ? <ActivityIndicator color="#ffffff" /> : null}
			</View>
			<Animated.View
				style={{
					position: "absolute",
					right: 10,
					bottom: bottomBarExpanded ? bottomBarHeight + 5 : 5,

					transform: [
						{
							rotate: rotAnim.interpolate({
								inputRange: [0, 1],
								outputRange: ["0deg", "180deg"],
							}),
						},
					],
				}}
				ref={closeButtonRef}
			>
				<TouchableOpacity
					onPress={() => {
						handleClose();
					}}
					style={{
						opacity: 0.8,
						zIndex: -4,
					}}
					activeOpacity={1}
				>
					<Image
						source={require("../assets/logos/arrowIcon.png")}
						alt={
							bottomBarExpanded
								? "Close Bottom Bar Button"
								: "Open Bottom Bar Button"
						}
						style={{
							height: 30,
							resizeMode: "contain",
							width: 30,
							borderRadius: 50,
						}}
					/>
				</TouchableOpacity>
			</Animated.View>
		</KeyboardAvoidingView>
	);
}
