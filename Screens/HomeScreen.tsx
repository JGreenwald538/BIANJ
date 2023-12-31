import * as React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Linking } from 'react-native';
import { Place } from '../components/Place';
import LogoTitle from '../components/LogoTitle';
import Carousel from '../components/Carousel';



export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Logo and Title */}
        <Text style={[styles.title]}>Welcome to BIANJ Resource Center</Text>
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
    marginTop: 80,
    color: 'white',
    fontSize: 23,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  menu: {
    alignItems: 'center', // Center menu items horizontally
    flex: 1,
    paddingHorizontal: 40,
    
  },
  menuItem: {
    // Styles for menu items
    backgroundColor: '#3294A8',
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