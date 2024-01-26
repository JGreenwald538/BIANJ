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
          onLayout={
            (layout) => {
              setMapHeight(layout.nativeEvent.layout.height);
            }
          }
        >
          {markers.map((marker) => (
          // @ts-ignore
          ((marker[1] <= (sliderValue / 1.60934)   || sliderValue === 0) && (categoriesEnabled.indexOf(marker[2]) !== -1)) || (!currentLocation && categoriesEnabled.indexOf(marker[2]) !== -1)
          ) ? marker[0] : null)}
          {/* @ts-ignore */}
          {currentLocation[0] && isEnabled && <Circle
            // @ts-ignore
            center={{latitude: currentLocation[0].lat, longitude: currentLocation[0].long}}
            radius={sliderValue * 1000}
            strokeWidth={1}
            strokeColor="#000000"
            fillColor="rgba(51,153,255,0.2)"
          />}
          {/* @ts-ignore */}
          {!currentLocation[2] &&
            <Marker
            // @ts-ignore
            coordinate={{latitude: currentLocation[0].lat, longitude: currentLocation[0].long}}
            pinColor="#572C5F" // semi-transparent blue
            title={"Your Manual Location"}
        />
          }
        </MapView>
        {bottomBarExpanded && <View style={{paddingBottom: 10}} onLayout={(event) => {
          setBottomBarHeight(event.nativeEvent.layout.height);
        } }>
          {/* @ts-ignore */}
          {currentLocation[0] && <Slider
            isEnabled={isEnabled}
            value={sliderValue}
            onValueChange={handleSliderChange}
            isEnabledChange={handleEnabledChange}
          />}
          {/* @ts-ignore */}
          {currentLocation[0] && <ClosestLocations
            locations={data}
            currentLocation={currentLocation}
            categories={[categories, categoriesEnabled]}
          />}
          <AddressInput />
        </View> }
        <ScrollView
                style={{
                    position: 'absolute',
                    top: '14%',
                    right: 20,
                    width: screenWidth - 40, // 'auto' to fit content, or you could calculate the width based on the content size
                    height: '50%', // Same as width, 'auto' or a calculated value
                    backgroundColor: 'white',
                    borderRadius: 10,
                    shadowColor: '#171717',
                    shadowOffset: {width: -2, height: 4},
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    display: filtersExpanded ? "flex" : 'none',
                    opacity: 0.9,
                }}
                persistentScrollbar
            >
            <View style={{paddingTop: 10, justifyContent: 'flex-end', alignContent: 'center', display: 'flex'}}>
              <Text style={{fontSize: 22, justifyContent: 'flex-end', textAlign: "center", fontWeight: "500"}}>Pick Five Categories</Text>
            </View>
            {categories.map((category, index) => (
              <View style={{padding: 10, alignContent: 'center',
              justifyContent: 'flex-start',
              display: 'flex', flexDirection: 'row'}} key={index}>
                <Checkbox
                  // @ts-ignore
                  isChecked={categoriesEnabled.indexOf(category) !== -1}
                  onCheck={() => {
                      const newCategoriesEnabled = [...categoriesEnabled];
                      if (newCategoriesEnabled.indexOf(category) === -1) {
                        if((nextCategory % 5) === (5 - newCategoriesEnabled.filter(x => x === "").length) ||  newCategoriesEnabled.filter(x => x === "").length === 0) {
                          setNextCategory(nextCategory + 1);
                        } else {
                          setNextCategory(newCategoriesEnabled.filter(x => x === "").length - 1 % 5);
                        }
                        newCategoriesEnabled[nextCategory % 5] = category;
                      } else {
                        newCategoriesEnabled[newCategoriesEnabled.indexOf(category)] = "";
                        setNextCategory(categoriesEnabled.indexOf(category));
                      }
                      setCategoriesEnabled(newCategoriesEnabled);
                  }} // Pass the negated value of `isEnabled`
                  color={colors[categoriesEnabled.indexOf(category)]}
                  alt= {category + " Checkbox"}
                />
                <Text style={{fontSize: 18, paddingLeft: 2, paddingTop: 1}}>{category}</Text>
              </View>
            ))}
        </ScrollView>
        {markers.length !== 0 && <TouchableOpacity
                    onPress={onPress}
                    style={[
                        {
                          position: 'absolute',
                          top: filtersExpanded ? "15%" : (insets.top + screenHeight * 0.01),
                          right: filtersExpanded ? 20 + (0.01 * screenWidth) : (0.08 * screenWidth),
                          width: 'auto', // 'auto' to fit content, or you could calculate the width based on the content size
                          height: 'auto', // Same as width, 'auto' or a calculated value
                          backgroundColor: 'rgba(255, 255, 255, 0.75)',
                          paddingHorizontal: (filtersExpanded ? 5 : 10),
                          borderRadius: (filtersExpanded ? 50 : 15),
                          borderColor: '#572C5F',
                          borderWidth: filtersExpanded ? 2: 0,
                        },
                    ]}
                    >
                    <Text accessibilityLabel={filtersExpanded ? "Close Button" : "Filters Button"}
                    style={{ fontSize: filtersExpanded ? 25 : 19, color: '#572C5F', position: 'relative', lineHeight: filtersExpanded ? 25 : 30 , textAlign: 'center'
                        }}>{filtersExpanded ? "×" : "Filters"}
                    </Text>
        </TouchableOpacity>}
        <LogoTitle />
        <View style={{position: "absolute", top: mapHeight / 2, left: screenWidth / 2}}>
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
                zIndex: -4
              }}
              activeOpacity={1}
            >
              <Image
                source={require('../assets/logos/ArrowIcon.png')}
                alt={"logo"}
                style={{ height: 25, resizeMode: "contain", width: 25, borderRadius: 50, }}
              />
            </TouchableOpacity>
          </Animated.View>
      </KeyboardAvoidingView>
    );
  }