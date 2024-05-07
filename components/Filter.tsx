import React from "react";
import {
	View,
	TouchableOpacity,
	Animated,
	Text,
	TouchableWithoutFeedback,
	Platform,
	Dimensions,
	ScrollView,
} from "react-native";
import Checkbox from "./Checkbox";
import { useTheme } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const colors: string[] = ["red", "green", "blue", "yellow", "orange"];

// Define props for the Filter component
interface FilterProps {
	categories: string[];
	categoriesEnabled: string[];
	setCategoriesEnabled: (categories: string[]) => void;
	filtersExpanded: boolean;
	onPressFilters: () => void;
	update?: boolean;
	setUpdate?: (update: boolean) => void;
	nextCategory: number;
	setNextCategory: any;
	map?: boolean;
	buttonRef?: React.RefObject<TouchableOpacity>;
	menuRef?: React.RefObject<ScrollView>;
}

export const Filter: React.FC<FilterProps> = ({
	categories,
	categoriesEnabled,
	setCategoriesEnabled,
	filtersExpanded,
	onPressFilters,
	update,
	setUpdate,
	nextCategory,
	setNextCategory,
	map = false,
	buttonRef,
	menuRef,
}) => {
	const { colors: colorsList } = useTheme();
	const colorScheme = colorsList.background === "white" ? "light" : "dark";
	const insets = useSafeAreaInsets();
	const {width: screenWidth, height: screenHeight} = Dimensions.get("window");
	console.log(categoriesEnabled);
	return (
		<>
			{filtersExpanded && (
				<TouchableWithoutFeedback
					onPress={onPressFilters}
					accessibilityLabel="Close Filters Menu Button"
				>
					<View
						style={{
							position: "absolute",
							top: 0,
							bottom: 0,
							left: 0,
							right: 0,
							backgroundColor: "transparent",
						}}
					></View>
				</TouchableWithoutFeedback>
			)}
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
					zIndex: filtersExpanded ? 1 : 0, // Ensure the menu is above the transparent view when expanded
					opacity: 0.95,
				}}
				persistentScrollbar
				ref={menuRef}
				collapsable={false}
				accessibilityLabel={"Filter Menu"}
			>
				{map && (
					<Text
						style={{
							fontSize: 20,
							color: colorScheme === "light" ? "black" : "white",
							textAlign: "center",
							padding: 10,
						}}
					>
						Select Five Categories
					</Text>
				)}

				<View style={{ flex: 1 }}>
					{categories.map((category, index) => (
						<TouchableOpacity
							style={{
								padding: 10,
								alignContent: "center",
								justifyContent: "flex-start",
								display: "flex",
								flexDirection: "row",
								flex: 1,
							}}
							key={index}
							onPress={() => {
								if (map) {
									const newCategoriesEnabled = [...categoriesEnabled];
									if (newCategoriesEnabled.indexOf(category) === -1) {
										newCategoriesEnabled[nextCategory % 5] = category;
									} else {
										newCategoriesEnabled[
											newCategoriesEnabled.indexOf(category)
										] = "";
									}
									setNextCategory(
										newCategoriesEnabled.indexOf("") !== -1
											? newCategoriesEnabled.indexOf("")
											: nextCategory + (1 % 5)
									);
									setCategoriesEnabled(newCategoriesEnabled);
								} else {
									if (categoriesEnabled.indexOf(category) === -1) {
										setCategoriesEnabled([...categoriesEnabled, category]);
									} else {
										setCategoriesEnabled(
											categoriesEnabled.filter((x) => x !== category)
										);
									}
								}
							}} // Pass the negated value of `isEnabled`
						>
							<Checkbox
								// @ts-ignore
								isChecked={categoriesEnabled.indexOf(category) !== -1}
								onCheck={() => {
									if (map) {
										const newCategoriesEnabled = [...categoriesEnabled];
										if (newCategoriesEnabled.indexOf(category) === -1) {
											newCategoriesEnabled[nextCategory % 5] = category;
										} else {
											newCategoriesEnabled[
												newCategoriesEnabled.indexOf(category)
											] = "";
										}
										setNextCategory(
											newCategoriesEnabled.indexOf("") !== -1
												? newCategoriesEnabled.indexOf("")
												: nextCategory + (1 % 5)
										);
										setCategoriesEnabled(newCategoriesEnabled);
									} else {
										if (categoriesEnabled.indexOf(category) === -1) {
											setCategoriesEnabled([...categoriesEnabled, category]);
										} else {
											setCategoriesEnabled(
												categoriesEnabled.filter((x) => x !== category)
											);
										}
									}
								}}
								color={
									map && Platform.OS === "ios"
										? colors[categoriesEnabled.indexOf(category)] ?? "black"
										: colorScheme === "light"
										? "black"
										: "white"
								}
								uncheckedColor={colorScheme === "light" ? "black" : "white"}
								alt={category + " Checkbox Button" + (categoriesEnabled.indexOf(category) !== -1 ? "checked" : "unchecked")}
							/>
							<Text
								style={{
									fontSize: 18,
									paddingLeft: 7,
									color: colorScheme === "light" ? "black" : "white",
								}}
								accessibilityLabel=""
							>
								{category}
							</Text>
						</TouchableOpacity>
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
							zIndex: 2, // Ensure the button is always on top
						},
					]}
					onLayout={() => {
						if (setUpdate) {
							setUpdate(!update);
						}
					}}
					ref={buttonRef}
				>
					<Text
						accessibilityLabel={
							filtersExpanded ? "Close Menu Button" : "Filters Menu Button"
						}
						style={{
							fontSize: filtersExpanded ? 25 : 19,
							color:
								colorScheme === "light"
									? filtersExpanded
										? "black"
										: "white"
									: "white",
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
