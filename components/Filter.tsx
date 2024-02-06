import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Text,
} from "react-native";
import Checkbox from "./Checkbox";

// Define props for the Filter component
interface FilterProps {
  categories: string[];
  categoriesEnabled: string[];
  setCategoriesEnabled: any;
  colorScheme: string;
  filtersExpanded: boolean;
  onPressFilters: () => void;
  screenWidth: number;
  screenHeight: number;
  insets: any;
  update?: boolean;
  setUpdate?: (update: boolean) => void;
}

export const Filter: React.FC<FilterProps> = ({
  categories,
  categoriesEnabled,
  setCategoriesEnabled,
  colorScheme,
  filtersExpanded,
  onPressFilters,
  screenWidth,
  screenHeight,
  insets,
  update,
  setUpdate,
}) => {
  return (
    <>
      <Animated.ScrollView
        style={{
          position: "absolute",
          top: 0.14 * screenHeight,
          right: 20,
          width: screenWidth - 40, // 'auto' to fit content, or you could calculate the width based on the content size
          height: "50%", // Same as width, 'auto' or a calculated value
          backgroundColor: colorScheme === "light" ? "#e2cbe7" : "#70387a",
          borderRadius: 10,
          shadowColor: "#171717",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          display: filtersExpanded ? "flex" : "none",
          borderColor: "black",
          borderWidth: 2,
          opacity: 0.95,
        }}
        persistentScrollbar
      >
        <View style={{ flex: 1 }}>
          {categories.map((category, index) => (
            <View
              style={{
                padding: 10,
                alignContent: "center",
                justifyContent: "flex-start",
                display: "flex",
                flexDirection: "row",
                flex: 1,
              }}
              key={index}
            >
              <Checkbox
                // @ts-ignore
                isChecked={categoriesEnabled.indexOf(category) !== -1}
                onCheck={() => {
                  // @ts-ignore
                  const newCategoriesEnabled = [...categoriesEnabled];
                  if (categoriesEnabled.indexOf(category) === -1) {
                    newCategoriesEnabled.push(category);
                  } else {
                    newCategoriesEnabled.splice(
                      categoriesEnabled.indexOf(category),
                      1
                    );
                  }

                  setCategoriesEnabled(newCategoriesEnabled);
                }} // Pass the negated value of `isEnabled`
                color={colorScheme === "light" ? "black" : "white"}
                uncheckedColor={colorScheme === "light" ? "black" : "white"}
                alt={category + " Checkbox"}
              />
              <Text
                style={{
                  fontSize: 18,
                  paddingLeft: 7,
                  color: colorScheme === "light" ? "black" : "white",
                }}
              >
                {category}
              </Text>
            </View>
          ))}
        </View>
      </Animated.ScrollView>
      {categories.length !== 0 && (
        <TouchableOpacity
          onPress={onPressFilters}
          style={[
            {
              position: "absolute",
              top: filtersExpanded
                ? 0.15 * screenHeight
                : insets.top + screenHeight * 0.01,
              right: filtersExpanded ? 0.07 * screenWidth : 40,
              width: "auto", // 'auto' to fit content, or you could calculate the width based on the content size
              height: "auto", // Same as width, 'auto' or a calculated value
              backgroundColor: !filtersExpanded
                ? "rgb(87,44,95)"
                : "rgba(0, 0, 0, 0)",
              paddingHorizontal: filtersExpanded ? 5 : 15,
              borderRadius: filtersExpanded ? 50 : 15,
              opacity: 0.9,
            },
          ]}
          onLayout={() => {
            if(setUpdate) {
                setUpdate(!update);
            }
          }}
        >
          <Text
            accessibilityLabel={
              filtersExpanded ? "Close Button" : "Filters Button"
            }
            style={{
              fontSize: filtersExpanded ? 25 : 19,
              color: "rgb(255, 255, 255)",
              position: "relative",
              lineHeight: filtersExpanded ? 25 : 30,
              textAlign: "center",
            }}
          >
            {filtersExpanded ? "×" : "Filters"}
          </Text>
        </TouchableOpacity>
      )}
    </>
  );
};
