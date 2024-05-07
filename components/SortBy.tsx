import React, { useState } from "react";
import {
	View,
	TouchableOpacity,
	StyleSheet,
	Animated,
	Text,
	TouchableWithoutFeedback,
} from "react-native";
import Checkbox from "./Checkbox";
import { AddressInput } from "./AddressInput";
import { RadioButton } from "react-native-paper";

// Define props for the Filter component
interface FilterProps {
	categories: string[];
	colorScheme: string;
	sortByExpanded: boolean;
	onPressSortBy: () => void;
	screenWidth: number;
	screenHeight: number;
	insets: any;
	sortByEnabled: string;
	setSortByEnabled: any;
	currentLocation: any;
	sortBys: string[];
	setSortByExpanded: any;
}

export const SortBy: React.FC<FilterProps> = ({
	categories,
	colorScheme,
	onPressSortBy,
	screenWidth,
	screenHeight,
	insets,
	sortByExpanded,
	sortByEnabled,
	setSortByEnabled,
	currentLocation,
	sortBys,
}) => {
	return (
		<>
			{sortByExpanded && (
				<TouchableWithoutFeedback onPress={onPressSortBy} accessibilityLabel="Close Sort By Menu Button">
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
			<Animated.View
				style={{
					position: "absolute",
					top: 0.14 * screenHeight,
					right: 20,
					width: screenWidth - 40, // 'auto' to fit content, or you could calculate the width based on the content size, // Same as width, 'auto' or a calculated value
					backgroundColor: colorScheme === "light" ? "#e2cbe7" : "#70387a",
					borderRadius: 10,
					shadowColor: "#171717",
					shadowOffset: { width: -2, height: 4 },
					shadowOpacity: 0.2,
					shadowRadius: 3,
					display: sortByExpanded ? "flex" : "none",
					opacity: 0.95,
				}}
				accessibilityLabel={"Sort By Menu"}
			>
				<View style={{ flex: 1 }}>
					{sortBys.map((sortBy, index) => (
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
							<RadioButton.Android
								value={sortBy} // Assuming sortBy is the value you want to associate with this radio button
								status={sortByEnabled === sortBy ? "checked" : "unchecked"}
								onPress={() => {
									setSortByEnabled(sortBy);
								}}
								color={colorScheme === "light" ? "black" : "white"}
								uncheckedColor={colorScheme === "light" ? "black" : "white"}
								disabled={
									sortBy === "Distance" &&
									currentLocation &&
									!currentLocation[0]
										? true
										: false
								}
								accessibilityLabel={sortBy + " Sort By Select"}
							/>
							<TouchableOpacity onPress={() => setSortByEnabled(sortBy)}>
								<Text
									style={{
										fontSize: 18,
										paddingLeft: 2,
										paddingTop: 6,
										color: colorScheme === "light" ? "black" : "white",
									}}
									accessibilityLabel={sortBy + " Sort By Select." + (sortByEnabled === sortBy ? "checked" : "unchecked")}
								>
									{sortBy}
								</Text>
							</TouchableOpacity>
						</View>
					))}
					<View style={{ marginTop: -20 }}>
						<AddressInput />
					</View>
				</View>
			</Animated.View>
			{categories.length !== 0 && (
				<TouchableOpacity
					onPress={onPressSortBy}
					style={[
						{
							position: "absolute",
							top: sortByExpanded
								? 0.15 * screenHeight
								: insets.top + screenHeight * 0.01,
							left: sortByExpanded ? 0.86 * screenWidth : 40,
							height: "auto",
							backgroundColor: !sortByExpanded
								? "rgb(87,44,95)"
								: "rgba(0, 0, 0, 0)",
							paddingHorizontal: sortByExpanded ? 5 : 15,
							borderRadius: sortByExpanded ? 50 : 15,
							opacity: 0.9,
						},
					]}
				>
					<Text
						accessibilityLabel={
							sortByExpanded ? "Close Menu Button" : "Sort By Menu Button"
						}
						style={{
							fontSize: sortByExpanded ? 25 : 19,
							color:
								colorScheme === "light"
									? sortByExpanded
										? "black"
										: "white"
									: "white",
							lineHeight: sortByExpanded ? 25 : 30,
							textAlign: "center",
						}}
					>
						{sortByExpanded ? "×" : "Sort By"}
					</Text>
				</TouchableOpacity>
			)}
		</>
	);
};
