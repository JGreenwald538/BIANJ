import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SplashScreen from "expo-splash-screen";
import MapScreen from "./Screens/MapScreen";
import HomeScreen from "./Screens/HomeScreen";
import ListScreen from "./Screens/ListScreen";
import SavedScreen from "./Screens/SavedScreen.tsx";
import { getCurrentLocation } from "./lib/location";
import { Image, Platform, UIManager, useColorScheme } from "react-native";
import {
	LocationContext,
	PlacesContext,
	CategoriesContext,
	WalkthroughContext,
} from "./util/globalvars";
import { API_URL } from "./constants";
import { SafeAreaProvider } from "react-native-safe-area-context";

SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 1000);

if (Platform.OS === "android") {
	UIManager.setLayoutAnimationEnabledExperimental(true);
}

const lightTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: "white",
	},
};

const darkTheme = {
	...DefaultTheme,
	colors: {
		...DefaultTheme.colors,
		background: "black",
	},
};

const Tab = createBottomTabNavigator();

export default function App() {
	const [location, setLocation] = useState<{
		lat: number;
		long: number;
	} | null>(null);
	const [isRealLocation, setIsRealLocation] = useState(true);
	const colorScheme = useColorScheme();
	const [places, setPlaces] = useState<any[]>([]);
	const [walkthrough, setWalkthrough] = useState(0);

	useEffect(() => {
		const updateState = async () => {
			setLocation(await getCurrentLocation());
		};
		updateState();
	}, []);
	useEffect(() => {
		async function fetchData() {
			try {
				const res = await fetch(API_URL, { method: "GET" });
				const text = await res.text();
				const parsedData = JSON.parse(text);
				if (parsedData && parsedData.length > 0) {
					setPlaces(parsedData);
				} else {
					console.error("Parsed data is empty or not an array:", parsedData);
				}
			} catch (error) {
				console.error("Error parsing JSON:", error);
			}
		}
		fetchData();
		setInterval(fetchData, 60000);
	}, []);

	let categories = [...new Set(places.map((place) => place.typeOfPlace))];
	categories = categories.sort((a, b) => a[0].localeCompare(b[0]));

	return (
		<SafeAreaProvider>
			<WalkthroughContext.Provider value={[walkthrough, setWalkthrough]}>
				<CategoriesContext.Provider value={categories}>
					<PlacesContext.Provider value={places}>
						<LocationContext.Provider
							value={[location, setLocation, isRealLocation, setIsRealLocation]}
						>
							<NavigationContainer
								theme={colorScheme === "light" ? lightTheme : darkTheme}
							>
								<Tab.Navigator
									screenOptions={({ route }) => ({
										tabBarIcon: ({ focused, size }) => {
											if (route.name === "Home") {
												return (
													<Image
														source={
															focused
																? colorScheme === "dark"
																	? require("./assets/logos/icon2.png")
																	: require("./assets/logos/icon2purple.png")
																: require("./assets/logos/icon2dark.png")
														}
														alt={"logo"}
														style={{
															height: size,
															resizeMode: "contain",
															width: size,
														}}
													/>
												);
											} else if (route.name === "Settings") {
												return (
													<Image
														source={
															focused
																? colorScheme === "dark"
																	? require("./assets/logos/icon10.png")
																	: require("./assets/logos/icon10black.png")
																: require("./assets/logos/icon10dark.png")
														}
														alt={"logo"}
														style={{
															height: size,
															resizeMode: "contain",
															width: size,
														}}
													/>
												);
											} else if (route.name === "Map") {
												return (
													<Image
														source={
															focused
																? colorScheme === "dark"
																	? require("./assets/logos/icon5.png")
																	: require("./assets/logos/icon5purple.png")
																: require("./assets/logos/icon5dark.png")
														}
														alt={"logo"}
														style={{
															height: size,
															resizeMode: "contain",
															width: size,
														}}
													/>
												);
											} else if (route.name === "List") {
												return (
													<Image
														source={
															focused
																? colorScheme === "dark"
																	? require("./assets/logos/icon4.png")
																	: require("./assets/logos/icon4purple.png")
																: require("./assets/logos/icon4dark.png")
														}
														alt={"logo"}
														style={{
															height: size,
															resizeMode: "contain",
															width: size,
														}}
													/>
												);
											} else if (route.name === "Saved") {
												return (
													<Image
														source={
															focused
																? colorScheme === "dark"
																	? require("./assets/logos/icon7.png")
																	: require("./assets/logos/icon7purple.png")
																: require("./assets/logos/icon7dark.png")
														}
														alt={"logo"}
														style={{
															height: size,
															resizeMode: "contain",
															width: size,
														}}
													/>
												);
											}
										},
										tabBarInactiveTintColor: "#63666a",
										tabBarActiveTintColor:
											colorScheme !== "dark" ? "#572c5f" : "white",
										headerShown: false,
										tabBarStyle: {
											borderTopWidth: 0,
											elevation: 0,
											backgroundColor:
												colorScheme === "dark" ? "black" : "white",
											paddingHorizontal: 20,
											opacity: 1,
										},
										lazy: false,
										style: {
											backgroundColor:
												colorScheme === "dark" ? "black" : "white",
										},
									})}
								>
									<Tab.Screen name="Home" component={HomeScreen} />
									<Tab.Screen name="Map" component={MapScreen} />
									<Tab.Screen name="List" component={ListScreen} />
									<Tab.Screen name="Saved" component={SavedScreen} />
								</Tab.Navigator>
							</NavigationContainer>
						</LocationContext.Provider>
					</PlacesContext.Provider>
				</CategoriesContext.Provider>
			</WalkthroughContext.Provider>
		</SafeAreaProvider>
	);
}
