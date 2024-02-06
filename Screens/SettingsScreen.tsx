import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ErrorBoundary from "react-native-error-boundary";
import LogoTitle from "../components/LogoTitle";
import { Place } from "../components/Place";

export default function SettingsScreen() {
    return (
      <ErrorBoundary>
        <Place invisible/>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={async () => {
                await AsyncStorage.clear()
                alert("Cleared");            
            }}>
            <Text style={styles.menuText}>Clear Saved</Text>
          </TouchableOpacity>
        </View>
        <LogoTitle />
      </ErrorBoundary>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    alignItems: 'center', // Center items horizontally in the container
    justifyContent: 'center', // Center items vertically in the container
    height: 200, // You can adjust the height as needed
  },
  title: {
    // Styles for the title
    marginTop: 80,
    color: 'white',
    fontSize: 23,
    textAlign: 'center',
    fontWeight: 'bold',
    fontFamily: 'Arial',
  },
  menu: {
    alignItems: 'center', // Center menu items horizontally
    flex: 1,
    paddingHorizontal: 40,
    
  },
  menuItem: {
    // Styles for menu items
    backgroundColor: '#572c5f',
    width: "100%",
    height: 45,
    justifyContent: "center",
    borderRadius: 10,
  },
  menuText: {
    // Styles for text inside menu items
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '500',
    color: 'white',
  },
  // Add any additional styles you might need
});