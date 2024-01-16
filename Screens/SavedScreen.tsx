import React, { useState, useEffect, useContext } from "react";
import { View, TouchableOpacity, ScrollView, Animated, Text, Dimensions, LayoutAnimation, Platform } from "react-native";
import { Place, PlaceList } from "../components/Place";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Checkbox from "../components/Checkbox";
import { RadioButton } from 'react-native-paper';
import { AddressInput } from "../components/AddressInput";
import { LocationContext } from "../util/globalvars";
import LogoTitle from "../components/LogoTitle";
import { useFocusEffect, useTheme } from "@react-navigation/native";

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  // Haversine formula to calculate the distance
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * 
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c / 1.609; // Distance in mi
};

const sortBys = [
  "Alphabetical",
  "Category",
  "Distance"
];

export default function SavedScreen() {
  const [data, setData] = useState([]);
  const currentLocation = useContext(LocationContext);
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [sortByExpanded, setSortByExpanded] = useState(false);
  const [categoriesEnabled, setCategoriesEnabled] = useState([]);
  const [nextCategory, setNextCategory] = useState(0);
  const [categories, setCategories] = useState([]);
  const [sortByEnabled, setSortByEnabled] = useState("");
  const [places, setPlaces] = useState([]);
  const {colors} = useTheme();
  const colorScheme = colors.background === "white" ? "light" : "dark";

  const onPressFilters = () => {
    // Configure the animation before the state changes.
    if(!sortByExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setFiltersExpanded(!filtersExpanded); // This would be your state to control the button size.
    }
  };

  const onPressSortBy = () => {
    // Configure the animation before the state changes.
    if(!filtersExpanded) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setSortByExpanded(!sortByExpanded); // This would be your state to control the button size.
    }
  };

  useEffect(() => {
    const sortData = async () => {
      const keys = await AsyncStorage.getAllKeys();
      const values = await AsyncStorage.multiGet(keys);
      let sortedValues = [];

      // Convert to JSON and apply the sorting logic
      sortedValues = values
      // @ts-ignore
        .map(([_, value]) => JSON.parse(value))
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
                return getDistance(a.lat, a.long, currentLocation[0].lat, currentLocation[0].long) -
                  // @ts-ignore
                       getDistance(b.lat, b.long, currentLocation[0].lat, currentLocation[0].long);
              }
              return 0;
            default:
              return 0;
          }
        });
      // @ts-ignore
      setData(sortedValues);
      // @ts-ignore
      const places = PlaceList(data)
      if(places) {
        // @ts-ignore
        setPlaces(places.view);
        // @ts-ignore
        setCategories(places.categories);
      }
    };

    sortData();
    // @ts-ignore
  }, [sortByEnabled, currentLocation[0], data]);

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
        <View style={{paddingHorizontal: 40}}>
          <TouchableOpacity style={{backgroundColor: '#572c5f',
                  width: "100%",
                  height: 45,
                  justifyContent: "center",
                  borderRadius: 10,
                  }} onPress={async () => {
                  await AsyncStorage.clear()
                  alert("Cleared");            
              }}>
              <Text style={{textAlign: 'center',
              fontSize: 18,
              fontWeight: '500',
              color: 'white',}}>Clear Saved</Text>
            </TouchableOpacity>
        </View>
      </ScrollView>
      <Animated.ScrollView
                style={{
                    position: 'absolute',
                    top: 0.14 * screenHeight,
                    right: 20,
                    width: screenWidth - 40, // 'auto' to fit content, or you could calculate the width based on the content size
                    height: '50%', // Same as width, 'auto' or a calculated value
                    backgroundColor: "white",
                    borderRadius: 10,
                    shadowColor: '#171717',
                    shadowOffset: {width: -2, height: 4},
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    display: filtersExpanded ? "flex" : 'none',
                    borderColor: 'black',
                    borderWidth:  2,
                    opacity: 0.9,
                }}
                persistentScrollbar
            >
            <View style={{flex: 1}}>
              {categories.map((category, index) => (
                <View style={{padding: 10, alignContent: 'center',
                justifyContent: 'flex-start',
                display: 'flex', flexDirection: 'row', flex: 1}} key={index}>
                  <Checkbox
                    // @ts-ignore
                    isChecked={categoriesEnabled.indexOf(category) !== -1}
                    onCheck={() => {
                      // @ts-ignore
                      const newCategoriesEnabled = [...categoriesEnabled];
                      newCategoriesEnabled[nextCategory % 5] = category;
                      setNextCategory(nextCategory + 1);
                      setCategoriesEnabled(newCategoriesEnabled);
                    }} // Pass the negated value of `isEnabled`
                    color={"#471f7d"}
                  />
                  <Text style={{fontSize: 18, paddingLeft: 2, paddingTop: 1}}>{category}</Text>
                </View>
              ))}
            </View>
        </Animated.ScrollView>
        {categories.length !== 0 && <TouchableOpacity
          onPress={onPressFilters}
          style={
              {
                position: 'absolute',
                top: filtersExpanded ? (0.15 * screenHeight) : (0.07 * screenHeight),
                right: filtersExpanded ? (0.07 * screenWidth) : 40,
                width: 'auto', // 'auto' to fit content, or you could calculate the width based on the content size
                height: 'auto', // Same as width, 'auto' or a calculated value
                backgroundColor: colorScheme === "light" ? '#e2cbe7' : "white",
                paddingHorizontal: (filtersExpanded ? 5 : 10),
                borderRadius: (filtersExpanded ? 50 : 15),
                borderColor: '#572C5F',
                borderWidth: filtersExpanded ? 2: 0,
                opacity: 0.7,
              }
          }
          >
          <Text style={{ fontSize: filtersExpanded ? 25 : 19, color: '#471f7d', position: 'relative', lineHeight: filtersExpanded ? 25 : 30 , textAlign: 'center'
              }}>{filtersExpanded ? "×" : "Filters"}
          </Text>
        </TouchableOpacity>}
        <Animated.View
                style={{
                    position: 'absolute',
                    top: 0.14 * screenHeight,
                    right: 20,
                    width: screenWidth - 40, // 'auto' to fit content, or you could calculate the width based on the content size, // Same as width, 'auto' or a calculated value
                    backgroundColor: "white",
                    borderRadius: 10,
                    shadowColor: '#171717',
                    shadowOffset: {width: -2, height: 4},
                    shadowOpacity: 0.2,
                    shadowRadius: 3,
                    display: sortByExpanded ? "flex" : 'none',
                    borderColor: 'black',
                    borderWidth:  2,
                    opacity: 0.9,
                }}
            >
            <View style={{flex: 1}}>
              {sortBys.map((sortBy, index) => (
                <View style={{padding: 10, alignContent: 'center',
                justifyContent: 'flex-start',
                display: 'flex', flexDirection: 'row', flex: 1}} key={index}>
                  <RadioButton.Android
                    value={sortBy} // Assuming sortBy is the value you want to associate with this radio button
                    status={sortByEnabled === sortBy ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSortByEnabled(sortBy);
                    }}
                    color={"#471f7d"}
                    disabled={sortBy === "Distance" && currentLocation && !currentLocation[0] ? true :false}
                  />
                  <Text style={{fontSize: 18, paddingLeft: 2, paddingTop: 6}}>{sortBy}</Text>
                </View>
              ))}
              <View style={{marginTop: -30}}>
                <AddressInput />
              </View>
            </View>
        </Animated.View>
        {categories.length !== 0 && <TouchableOpacity
          onPress={onPressSortBy}
          style={[
            {
              position: 'absolute',
              top: sortByExpanded ? 0.15 * screenHeight : 0.07 * screenHeight,
              left: sortByExpanded ? (0.86 * screenWidth) : 40,
              // remove the right property
              height: 'auto',
              backgroundColor: colorScheme === "light" ? '#e2cbe7' : "white",
              paddingHorizontal: (sortByExpanded ? 5 : 10),
              borderRadius: (sortByExpanded ? 50 : 15),
              borderColor: '#572C5F',
              borderWidth: sortByExpanded ? 2: 0,
              opacity: 0.7,
            },
          ]}
        >
          <Text style={{ fontSize: sortByExpanded ? 25 : 19, color: '#471f7d', lineHeight: sortByExpanded ? 25 : 30, textAlign: 'center', width: "auto", position: 'relative', 
              }}>{sortByExpanded ? "×" : "Sort By"}
          </Text>
        </TouchableOpacity>}
        <LogoTitle />
    </View>
  );
}