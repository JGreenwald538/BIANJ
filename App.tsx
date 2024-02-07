import React, {createContext, useContext, useEffect} from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as SplashScreen from 'expo-splash-screen';
import MapScreen from "./Screens/MapScreen";
import HomeScreen from "./Screens/HomeScreen";
import LogoTitle from "./components/LogoTitle";
import ListScreen from "./Screens/ListScreen";
import SavedScreen from "./Screens/SavedScreen.tsx";
import SettingsScreen from "./Screens/SettingsScreen";
import { getCurrentLocation } from "./lib/location";
import { Image, Platform, UIManager, Appearance, useColorScheme } from "react-native";
import { LocationContext, PlacesContext, CategoriesContext } from "./util/globalvars";
import { color } from "native-base/lib/typescript/theme/styled-system";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { API_URL } from "./constants";
import { Ionicons } from "@expo/vector-icons";
import { useFonts } from "expo-font";


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 1000);
 


if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
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
  const [location, setLocation] = React.useState<{lat: number, long: number} | null>(null);
  const [isRealLocation, setIsRealLocation] = React.useState<boolean>(true);
  const colorScheme = useColorScheme();
  const [places, setPlaces] = React.useState<any[]>([]);
  const [categories, setCategories] = React.useState<any[]>([]);
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
  }, []);
  useEffect(() => {
    const tempCategories: any[] = [];
    places.forEach((place) => {
      if (!tempCategories.includes(place.typeOfPlace)) {
        tempCategories.push(place.typeOfPlace);
      }
    });
    setCategories(tempCategories);
  }, [places])

  // const [loaded] = useFonts({
	// 	checkbox: require("@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/checkbox.ttf"),
	// });

	// if (!loaded) {
	// 	return null;
	// }

  return (
    // <SafeAreaProvider style={{backgroundColor: colorScheme === "dark" ? "black" : "white"}}>
    <CategoriesContext.Provider value={categories}>
    <PlacesContext.Provider value={places}>
    <LocationContext.Provider value={[location, setLocation, isRealLocation, setIsRealLocation]}>
    <NavigationContainer theme={colorScheme === "light" ? lightTheme : darkTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, size }) => {
            if (route.name === "Home") {
              return (
                <Image
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon2.png") : require("./assets/logos/icon2purple.png")) : require("./assets/logos/icon2dark.png")}
                  alt={"logo"}
                  style={{ height: size, resizeMode: "contain", width: size }}
                />
              );
            } else if (route.name === "Settings") {
              return (
                <Image
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon10.png") : require("./assets/logos/icon10black.png")) : require("./assets/logos/icon10dark.png")}
                  alt={"logo"}
                  style={{ height: size, resizeMode: "contain", width: size }}
                />
              );
            } else if (route.name === "Map") {
              return (
                <Image
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon5.png") : require("./assets/logos/icon5purple.png")) : require("./assets/logos/icon5dark.png")}
                  alt={"logo"}
                  style={{ height: size, resizeMode: "contain", width: size }}
                />
              );
            } else if (route.name === "List") {
              return (
                <Image
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon4.png") : require("./assets/logos/icon4purple.png")) : require("./assets/logos/icon4dark.png")}
                  alt={"logo"}
                  style={{ height: size, resizeMode: "contain", width: size }}
                />
              );
            } else if (route.name === "Saved") {
              return (
                <Image
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon7.png") : require("./assets/logos/icon7purple.png")) : require("./assets/logos/icon7dark.png")}
                  alt={"logo"}
                  style={{ height: size, resizeMode: "contain", width: size }}
                />
              );
            }
          },
          tabBarInactiveTintColor: "#63666a",
          tabBarActiveTintColor: colorScheme !== "dark" ? "#572c5f" : "white",
          headerShown: false,
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "dark" ? "black" : "white",
            paddingHorizontal: 20,
            opacity: 1,
          },
          lazy: true,
          headerTitle: () => <LogoTitle />,
          headerTransparent: true,
          style: {backgroundColor: colorScheme === "dark" ? "black" : "white"}
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} /> 
        <Tab.Screen name="Map" component={MapScreen} /> 
        <Tab.Screen name="List" component={ListScreen} /> 
        <Tab.Screen name="Saved" component={SavedScreen} /> 
        {/* <Tab.Screen name="Settings" component={SettingsScreen} />  */}
      </Tab.Navigator>
      </NavigationContainer>
      </LocationContext.Provider>
      </PlacesContext.Provider>
      </CategoriesContext.Provider>
      // </SafeAreaProvider>
  );
}
