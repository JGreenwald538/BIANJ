import { LinearGradient } from "expo-linear-gradient";
import { Link } from "native-base";
import React, { useEffect } from "react";
import {
  Animated,
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Button,
  TouchableOpacity,
  Linking,
  Platform,
  Easing,
  LayoutAnimation
} from "react-native";
const { width, height } = Dimensions.get("window");
import Ionicons from "react-native-vector-icons/Ionicons";


interface PlaceProps extends React.ComponentPropsWithoutRef<typeof View> {
  name?: string;
  type?: string;
  logoUri?: string;
  invisible?: boolean;
  address?: string;
  phone?: string;
  website?: string;
}

const Place: React.FC<PlaceProps> = ({
  name = "Name",
  type = "Type",
  logoUri,
  invisible = false,
  address = "Address",
  phone = "Phone",
  website = "Website",
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [expandedText, setExpandedText] = React.useState(false);
  const rotAnim = React.useRef(new Animated.Value(0)).current;
  const styles = StyleSheet.create({
    container: {
      flexDirection: "column",
      alignItems: "flex-start",
      backgroundColor: "white",
      width: width - 40,
      height: "auto",
      borderRadius: 10,
      marginBottom: 20
    },
    logoContainer: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: "#572C5F",
      alignItems: "center",
      justifyContent: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
      margin: 15,
    },
    logoImage: {
      width: "100%",
      height: "100%",
      borderRadius: 30,
      marginRight: 20,
      overflow: "hidden",
    },
    logoText: {
      fontSize: 18,
      color: "#333",
    },
    nameText: {
      fontSize: 20,
      color: "black",
      overflow: "scroll",
      fontWeight: "bold",
    },
    typeText: {
      fontSize: 15,
      color: "black",
    },
    hiddenText: {
      fontSize: 12,
      color: !expandedText ? "white" : "#ffffff",
      display: expanded ? "flex": "none",
      borderRadius: 10,
    },

    checkmark: {
      fontSize: 24,
      color: "#333",
    },
    invisible: {
      backgroundColor: "#572C5F",
      width: width - 40,
      height: 125,
    },
  });

  const urlScheme = Platform.select({
    ios: "maps://0,0?q=",
    android: "geo:0,0?q=",
  });
  const url = `${urlScheme}${address}`;
  const justNumber = phone.replaceAll(/[\(\)-\s]/g, "")
  const tele = `${"tel:"}${justNumber}`;

  if (!invisible) {
    return (
      
      <Animated.View 
      style={
        {...styles.container,
        }}>
          <LinearGradient
        // Start position (x, y)
        start={{ x: 0, y: 0 }}
        // End position (x, y)
        end={{ x: 0, y: 0 }}
        // Array of color stops
        colors={['rgba(71,31,125,1)', 'rgba(255,255,255,1)']}
        // How far along the gradient to start and end the color stops
        locations={[0.3, 1]}
        style={{ width: '100%', borderRadius: 10 }}
              >
        <View style={{ flexDirection: "row"}}>
          <View style={styles.logoContainer}>
            {logoUri ? (
              <Image
                source={require("../assets/logos/icon12.png")}
                alt={"logo"}
                style={{ height: "80%", resizeMode: "contain", width: "80%", borderRadius: 10 }}
              />
            ) : (
              <Text style={styles.logoText}>Logo</Text>
            )}
          </View>
          <View style={{ flexDirection: "column", flex: 1, marginTop: 10 }}>
            <Text style={styles.nameText}>{}</Text>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.typeText}>{type}</Text>
            <View style={{flexDirection: "row", justifyContent: "space-between", width: "85%", marginTop: 10}}>
              <TouchableOpacity
                onPress={async () => {
                  Linking.openURL(url);
                }}
              >
                <View style={{flexDirection: "column", alignItems: "center", borderRadius: 10, backgroundColor: "#572C5F", paddingHorizontal: 5, display: expanded ? "flex": "none"}}>
                  <Image
                    source={require("../assets/logos/icon6.png")}
                    alt={"logo"}
                    style={{ resizeMode: "contain", height: 30, width: 30, margin: 5 }}
                  />
                  <Text style={styles.hiddenText}>Address</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  Linking.openURL(tele);
                }}
              >
                <View style={{flexDirection: "column", alignItems: "center", borderRadius: 10, backgroundColor: "#572C5F", paddingHorizontal: 8, display: expanded ? "flex": "none"}}>
                  <Image
                    source={require("../assets/logos/icon13.png")}
                    alt={"logo"}
                    style={{ resizeMode: "contain", height: 30, width: 30, margin: 5 }}
                  />
                  <Text style={styles.hiddenText}>Call</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={async () => {
                  console.log(website)
                  Linking.openURL(encodeURI(website));
                }}
              >
                <View style={{flexDirection: "column", alignItems: "center", borderRadius: 10, backgroundColor: "#572C5F", paddingHorizontal: 8, display: expanded ? "flex": "none"}}>
                  <Image
                    source={require("../assets/logos/icon14.png")}
                    alt={"logo"}
                    style={{ resizeMode: "contain", height: 30, width: 30, margin: 5 }}
                  />
                  <Text style={styles.hiddenText}>Website</Text>
                </View>
              </TouchableOpacity>
            </View>
          <View>
            <Text style={styles.typeText}></Text>
          </View>
          </View>
          <Animated.View
            style={{
              width: 36,
              height: 36,
              position: "absolute",
              right: 1,
              bottom: 1,
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
                setExpanded(!expanded);
                Animated.timing(rotAnim, {
                  toValue: +!expanded,
                  duration: 150,
                  useNativeDriver: true,
                }).start();
                LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
                if (expanded) {
                  setTimeout(() => {
                    setExpandedText(true);
                  }, 150);
                } else {
                  setExpandedText(false);
                }
              }}
            >
              <Ionicons
                name={"caret-down-circle-outline"}
                size={36}
                color={"#471f7d"}
              />
            </TouchableOpacity>
          </Animated.View>
        </View>
        </LinearGradient>
      </Animated.View>
      
    );
  } else {
    return <View style={[styles.invisible]}></View>;
  }
};

// @ts-ignore
function PlaceList(items) {
  // @ts-ignore
  const categories = [];
  for (let i = 0; i < items.length; i++) {
    // @ts-ignore
    if (!categories.includes(items[i].typeOfPlace)) {
      categories.push(items[i].typeOfPlace);
    }
  }
    if(items) {
      return {view: <View key={0} style= {{alignItems: "center"}}>
        
        { // @ts-ignore
        items.map((item, index) => (
          <Place
            key={index}
            name={item.name}
            type={item.typeOfPlace}
            logoUri={"../assets/logos/icon12.png"}
            invisible={item.invisible}
            address={`${item.streetAddress + " " + item.city + " "} ${item.state}`}
            phone={item.phone}
            website={item.website}
          />
        ))}
      </View>, categories: categories}
    } else {
      return null;
    }
};

export {PlaceList, Place};