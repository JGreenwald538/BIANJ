import React, { useContext, useEffect, useState } from "react";
import { Animated, Dimensions, ScrollView, TouchableOpacity, View, Text, LayoutAnimation, Platform } from "react-native";
import { API_URL } from "../constants";
import { Place, PlaceList } from "../components/Place";
import { LocationContext } from "../App";
import Checkbox  from "../components/Checkbox";
import { RadioButton } from 'react-native-paper';
import { AddressInput } from "../components/AddressInput";
import LogoTitle from "../components/LogoTitle";
import { useFocusEffect } from "@react-navigation/native";

const sortBys = [
  "Alphabetical",
  "Category",
  "Distance"
];

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

export default function ListScreen(sortBy: object | string= "") {
    const empty: any[] = []
    const [data, setData] = useState(empty);
    const [values, setValues] = useState([]);
    // @ts-ignore
    const [sortByEnabled, setSortByEnabled] = useState(sortBy.route.params ? sortBy.route.params.sortBy : "");
    const currentLocation = useContext(LocationContext);
    const [filtersExpanded, setFiltersExpanded] = useState(false);
    const [sortByExpanded, setSortByExpanded] = useState(false);
    const [categoriesEnabled, setCategoriesEnabled] = useState([]);
    const [nextCategory, setNextCategory] = useState(0);
    const [categories, setCategories] = useState([]);
    const [places, setPlaces] = useState([]);

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

    const screenWidth = Dimensions.get('window').width;  
    
    useEffect(() => {
      async function fetchData() {
        try {
          const res = await fetch(API_URL, { method: "GET" });
          const text = await res.text();
          const parsedData = JSON.parse(text);
          if (parsedData && parsedData.length > 0) {
            setValues(parsedData);
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
      const sortData = async () => {
        let sortedValues = [];
        // Convert to JSON and apply the sorting logic
        sortedValues = values
        // @ts-ignore
          .sort((a, b) => {
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
                  return getDistance(a.lat, a.long, currentLocation[0].lat, currentLocation[0].long) -
                    // @ts-ignore
                         getDistance(b.lat, b.long, currentLocation[0].lat, currentLocation[0].long);
                }
                return 0;
              default:
                return 0;

            }
          });
        
        setData(sortedValues);
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

    }, [sortByEnabled, currentLocation[0], values, data]);

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
        {categories.length !== 0 && <ScrollView>
          <Place invisible />
          {places }
        </ScrollView>}
        <Animated.ScrollView
                style={{
                    position: 'absolute',
                    top: '14%',
                    right: 20,
                    width: screenWidth - 40, // 'auto' to fit content, or you could calculate the width based on the content size
                    height: '50%', // Same as width, 'auto' or a calculated value
                    backgroundColor: '#e2cbe7',
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
                    color={"#572C5F"}
                  />
                  <Text style={{fontSize: 18, paddingLeft: 2, paddingTop: 1}}>{category}</Text>
                </View>
              ))}
            </View>
        </Animated.ScrollView>
        {categories.length !== 0 && <TouchableOpacity
          onPress={onPressFilters}
          style={[
              {
                position: 'absolute',
                top: filtersExpanded ? (0.15 * screenHeight) : (0.07 * screenHeight),
                right: filtersExpanded ? (0.07 * screenWidth) : 40,
                width: 'auto', // 'auto' to fit content, or you could calculate the width based on the content size
                height: 'auto', // Same as width, 'auto' or a calculated value
                backgroundColor: 'rgb(255, 255, 255)',
                paddingHorizontal: (filtersExpanded ? 5 : 10),
                borderRadius: (filtersExpanded ? 50 : 15),
                borderColor: '#572C5F',
                borderWidth: filtersExpanded ? 2: 0,
                opacity: 0.7,
              },
          ]}
          >
          <Text style={{ fontSize: filtersExpanded ? 25 : 19, color: '#572C5F', position: 'relative', lineHeight: filtersExpanded ? 25 : 30 , textAlign: 'center'
              }}>{filtersExpanded ? "×" : "Filters"}
          </Text>
        </TouchableOpacity>}
        <Animated.View
                style={{
                    position: 'absolute',
                    top: '14%',
                    right: 20,
                    width: screenWidth - 40, // 'auto' to fit content, or you could calculate the width based on the content size, // Same as width, 'auto' or a calculated value
                    backgroundColor: '#e2cbe7',
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
                    color={"#572C5F"}
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
                backgroundColor: 'rgb(255, 255, 255)',
                paddingHorizontal: (sortByExpanded ? 5 : 10),
                borderRadius: (sortByExpanded ? 50 : 15),
                borderColor: '#572C5F',
                borderWidth: sortByExpanded ? 2: 0,
                opacity: 0.7,
              },
          ]}
          >
          <Text style={{ fontSize: sortByExpanded ? 25 : 19, color: '#471f7d', lineHeight: sortByExpanded ? 25 : 30 , textAlign: 'center'
              }}>{sortByExpanded ? "×" : "Sort By"}
          </Text>
        </TouchableOpacity>}
        <LogoTitle />
      </View>
    );
  }