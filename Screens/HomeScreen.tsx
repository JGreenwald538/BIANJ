import * as React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, Linking, Appearance } from 'react-native';
import LogoTitle from '../components/LogoTitle';
import Carousel from '../components/Carousel';
// import { ColorScheme } from "../util/globalvars";
// const colorScheme = React.useContext(ColorScheme);
import { useTheme } from '@react-navigation/native';


const screenWidth = Dimensions.get('window').width;




export default function HomeScreen() {
  const {colors} = useTheme();
  const colorScheme = colors.background === "white" ? "light" : "dark";
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    header: {
      alignItems: 'center', // Center items horizontally in the container
      justifyContent: 'center', // Center items vertically in the container
      flex: 3, // You can adjust the height as needed
    },
    title: {
      // Styles for the title
      marginTop: 100,
      color: colorScheme !== "dark" ? "black" : "white",
      fontSize: 0.05 * screenWidth,
      textAlign: 'center',
      fontWeight: 'bold',
    },
    menu: {
      alignItems: 'center', // Center menu items horizontally
      flex: 1,
      paddingHorizontal: 40,
      justifyContent: 'center', // Center menu items vertically
    },
    menuItem: {
      // Styles for menu items
      backgroundColor: '#572c5f',
      width: "100%",
      height: "70%",
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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Logo and Title */}
        <Text style={[styles.title]}>Welcome to the Brain Injury Alliance of New Jersey Resource Center</Text>
      </View>

      <Carousel />

        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={async () => {
            Linking.openURL("https://bianj.org/donate/");
          }}>
            <Text style={styles.menuText}>Donate</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={async () => {
            Linking.openURL("https://bianj.org/contact-us/");
          }}>
            <Text style={styles.menuText}>Contact Us</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={async () => {
            Linking.openURL("https://bianj.org/upcoming-events/");
          }}>
            <Text style={styles.menuText}>Get Involved</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={async () => {
            Linking.openURL("https://bianj.org/about-us/");
          }}>
            <Text style={styles.menuText}>About Us</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.menu}>
          <TouchableOpacity style={styles.menuItem} onPress={async () => {
            Linking.openURL("https://bianj.org/resources/");
          }}>
            <Text style={styles.menuText}>Resources</Text>
          </TouchableOpacity>
        </View>
        {/* Repeat the above TouchableOpacity for each menu item */}
      <LogoTitle />
    </View>
    
  );
};

