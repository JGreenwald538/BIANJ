import React, { useContext, useEffect, useState } from "react";
import { Animated, Dimensions, ScrollView, TouchableOpacity, View, Text, Image, LayoutAnimation, ActivityIndicator, Appearance, KeyboardAvoidingView } from "react-native";
import { API_URL } from "../constants";
import MapView, { Circle, Marker } from "react-native-maps";
import Markers from "../components/Markers";
import Slider from "../components/MileSlider";
import Checkbox from "../components/Checkbox";
import ClosestLocations  from "../components/ClosestLocations";
import { LocationContext, PlacesContext } from "../util/globalvars";
import { AddressInput } from "../components/AddressInput";
import LogoTitle from "../components/LogoTitle";
import { Platform } from 'react-native';
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "@react-navigation/native";
import { Filter } from "../components/Filter";
const screenHeight = Dimensions.get('window').height;


const colors: string[] = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
];

export default function MapScreen() {
    const data = useContext(PlacesContext);
    const [sliderValue, setSliderValue] = useState<number>(0);
    const currentLocation = useContext(LocationContext);
    // @ts-ignore
    const [isEnabled, setIsEnabled] = useState(false);
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const screenWidth = Dimensions.get('window').width;
    const [mapHeight, setMapHeight] = useState(0);
    const [categories, setCategories] = useState([]);
    const [categoriesEnabled, setCategoriesEnabled] = useState(["", "", "", "", ""]);
    const [nextCategory, setNextCategory] = useState(0);
    const [bottomBarExpanded, setBottomBarExpanded] = useState(true);
    const rotAnim = React.useRef(new Animated.Value(1)).current;
    const [bottomBarHeight, setBottomBarHeight] = useState(0);
    const insets = useSafeAreaInsets();
    const { colors: Colors } = useTheme();
    const colorScheme = Colors.background === "white" ? "light" : "dark";


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
    const handleEnabledChange = () => {
      if(currentLocation !== null) {
        setIsEnabled(!isEnabled);
      }
    };

    const onPress = () => {
        // Configure the animation before the state changes.
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setFiltersExpanded(!filtersExpanded); // This would be your state to control the button size.
      };
    const [markers, setMarkers] = useState([]);
    function updateMarkers() {
      // @ts-ignore
      const newMarkers = Markers(data, categoriesEnabled, currentLocation[0]);
      // @ts-ignore
      setMarkers(newMarkers[0]);
      // @ts-ignore
      setCategories(newMarkers[1]);
    } // Dependencies
    useEffect(() => {
      updateMarkers();
    }, [data, categoriesEnabled, currentLocation]);
  

    return (
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
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
          }}
        >
          {markers.map((marker) =>
            ((marker[1] <= sliderValue / 1.60934 || !isEnabled) &&
              categoriesEnabled.indexOf(marker[2]) !== -1) ||
            (!currentLocation && categoriesEnabled.indexOf(marker[2]) !== -1)
              ? marker[0]
              : null
          )}
            {currentLocation && currentLocation[0] && isEnabled && (
            <Circle
              center={{
                latitude: currentLocation && currentLocation[0] ? currentLocation[0].lat : 0,
                longitude: currentLocation && currentLocation[0] ? currentLocation[0].long : 0,
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
                latitude: currentLocation && currentLocation[0] ? currentLocation[0].lat : 0,
                longitude: currentLocation && currentLocation[0] ? currentLocation[0].long : 0,
              }}
              pinColor="#572C5F" // semi-transparent blue
              title={"Your Manual Location"}
            />
          )}
        </MapView>
        {bottomBarExpanded && (
          <View
            style={{ paddingBottom: 10 }}
            onLayout={(event) => {
              setBottomBarHeight(event.nativeEvent.layout.height);
            }}
          >
            {currentLocation && currentLocation[0] && (
              <Slider
                isEnabled={isEnabled}
                value={sliderValue}
                onValueChange={handleSliderChange}
                isEnabledChange={handleEnabledChange}
                filters={categoriesEnabled}
              />
            )}
            {currentLocation && currentLocation[0] && (
              <ClosestLocations
                locations={data}
                currentLocation={currentLocation}
                categories={[categories, categoriesEnabled]}
              />
            )}
            <AddressInput />
          </View>
        )}
        <Filter
          filtersExpanded={filtersExpanded}
          categoriesEnabled={categoriesEnabled}
          setCategoriesEnabled={setCategoriesEnabled}
          categories={categories}
          onPressFilters={onPress}
          colorScheme={colorScheme}
          insets={insets}
          screenWidth={screenWidth}
          screenHeight={screenHeight}

        />
        <LogoTitle />
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
              source={require("../assets/logos/ArrowIcon.png")}
              alt={"logo"}
              style={{
                height: 25,
                resizeMode: "contain",
                width: 25,
                borderRadius: 50,
              }}
            />
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    );
  }