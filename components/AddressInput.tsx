import React, { useContext, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { LocationContext } from "../util/globalvars";
import { useTheme } from "@react-navigation/native";

interface AddressInputProps {
  ref?: any;
}

export const AddressInput: React.FC<AddressInputProps> = ({ref}) => {
  const [input, setInput] = useState("");
  // @ts-ignore
  const [
    currentLocation,
    setCurrentLocation,
    isRealLocation,
    setIsRealLocation,
  ] = useContext(LocationContext);
  const { colors } = useTheme();
  const colorScheme = colors.background === "white" ? "light" : "dark";
  const styles = StyleSheet.create({
    container: {
      backgroundColor: colorScheme === "light" ? "#e2cbe7" : "#70387a", //
      marginHorizontal: 20,
      borderRadius: 10,
      padding: 10,
      marginTop: 15,
      alignContent: "center",
      justifyContent: "space-between",
      display: "flex",
      width: "auto",
      flexDirection: "column",
    },
  });

  const fetchCoordinates = async () => {
	if(input) {
		try {
		const response = await fetch(`https://geocode.maps.co/search?q=${input}`);
		const data = await response.json();

		if (data && data.length > 0) {
			const { lat, lon } = data[0];
			setCurrentLocation({ lat: parseFloat(lat), long: parseFloat(lon) });
			setIsRealLocation(false);
		} else {
			throw new Error("No location found");
		}
		} catch (error) {
		Alert.alert("Error", "Unable to fetch coordinates. Retry address input.");
		}
	} else {
		alert("Please enter an address.");
	}
  };

  return (
		<>
			<View style={styles.container} ref={ref}>
				<View style={{ paddingVertical: 3 }}>
					<Text
						style={{
							fontWeight: "600",
							textAlign: "center",
							color: colorScheme === "light" ? "black" : "white",
						}}
					>
						Enter Manual Address
					</Text>
				</View>
				<View>
					<TextInput
						value={input}
						onChangeText={setInput}
						placeholder="Enter an address"
						placeholderTextColor={colorScheme === "light" ? "black" : "white"}
						style={{
							paddingHorizontal: 10,
							paddingVertical: 5,
							borderRadius: 5,
							borderColor: colorScheme === "light" ? "black" : "white",
							borderWidth: 1,
						}}
					/>
				</View>
				<View
					style={{
						paddingHorizontal: 10,
						paddingTop: 10,
						display: "flex",
						alignItems: "center",
						justifyContent: "center",
					}}
				>
					<TouchableOpacity
						style={{
							paddingVertical: 5,
							backgroundColor: input ? "#572C5F" : "grey",
							opacity: input ? 1 : 0.75,
							borderRadius: 5,
						}}
						onPress={fetchCoordinates}
					>
						<Text
							style={{
								color: "white",
								textAlign: "center",
								paddingHorizontal: 5,
							}}
						>
							Submit
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</>
	);
};
