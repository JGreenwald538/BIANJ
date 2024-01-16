import React, {createContext, useEffect} from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as SplashScreen from 'expo-splash-screen';
import MapScreen from "./Screens/MapScreen";
import HomeScreen from "./Screens/HomeScreen";
import LogoTitle from "./components/LogoTitle";
import ListScreen from "./Screens/ListScreen";
import SavedScreen from "./Screens/SavedScreen";
import SettingsScreen from "./Screens/SettingsScreen";
import { getCurrentLocation } from "./lib/location";
import { Image, Platform, UIManager, Appearance } from "react-native";

const colorScheme = Appearance.getColorScheme();


SplashScreen.preventAutoHideAsync();
setTimeout(SplashScreen.hideAsync, 1000);
 
export const LocationContext = createContext<[{lat: number, long: number}, () => {}, boolean, () => {}] | null>(null);

if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}


const MyTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colorScheme === "dark" ? "black" : "white",
  },
};

const Tab = createBottomTabNavigator();

export default function App() {
  const [location, setLocation] = React.useState<{lat: number, long: number} | null>(null);
  const [isRealLocation, setIsRealLocation] = React.useState<boolean>(true);
  useEffect(() => {
    (async () => {
      setLocation(await getCurrentLocation());
    })();
  }, [])
  return (
    // @ts-ignore
    <LocationContext.Provider value={[location, setLocation, isRealLocation, setIsRealLocation]}>
    <NavigationContainer theme={MyTheme}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            if (route.name === "Home") {
              return (
                <Image
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon2.png") : require("./assets/logos/icon2black.png")) : require("./assets/logos/icon2dark.png")}
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
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon5.png") : require("./assets/logos/icon5black.png")) : require("./assets/logos/icon5dark.png")}
                  alt={"logo"}
                  style={{ height: size, resizeMode: "contain", width: size }}
                />
              );
            } else if (route.name === "List") {
              return (
                <Image
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon4.png") : require("./assets/logos/icon4black.png")) : require("./assets/logos/icon4dark.png")}
                  alt={"logo"}
                  style={{ height: size, resizeMode: "contain", width: size }}
                />
              );
            } else if (route.name === "Saved") {
              return (
                <Image
                  source={focused ? (colorScheme === "dark" ? require("./assets/logos/icon7.png") : require("./assets/logos/icon7black.png")) : require("./assets/logos/icon7dark.png")}
                  alt={"logo"}
                  style={{ height: size, resizeMode: "contain", width: size }}
                />
              );
            }
          },
          tabBarInactiveTintColor: "#63666a",
          tabBarActiveTintColor: colorScheme !== "dark" ? "black" : "white",
          headerShown: false,
          // tabBarActiveBackgroundColor: "#572C5F",
          // tabBarInactiveBackgroundColor: "#572C5F",
          tabBarStyle: {
            borderTopWidth: 0,
            elevation: 0,
            backgroundColor: colorScheme === "dark" ? "black" : "white",
            height: 60,
            paddingBottom: 5,
            paddingHorizontal: 20,
            opacity: 1,
          },
          lazy: true,
          headerTitle: () => <LogoTitle />,
          headerTransparent: true
        })}
      >
        <Tab.Screen name="Map" component={MapScreen} /> 
        <Tab.Screen name="List" component={ListScreen} /> 
        <Tab.Screen name="Home" component={HomeScreen} /> 
        <Tab.Screen name="Saved" component={SavedScreen} /> 
        <Tab.Screen name="Settings" component={SettingsScreen} /> 
      </Tab.Navigator>
      </NavigationContainer>
      </LocationContext.Provider>
  );
}
