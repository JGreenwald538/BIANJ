import { Marker, Callout } from 'react-native-maps';
import { Text, View, TouchableOpacity, StyleSheet } from 'react-native';
import { Linking } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const colors: string[] = [
  "red",
  "green",
  "blue",
  "yellow",
  "orange",
];

const device = Platform.OS;

const styles = StyleSheet.create({
  nameText: {
    fontSize: 18,
    color: "#333",
    overflow: "visible",
    justifyContent: "center",
  },
  typeText: {
    fontSize: 15,
    color: "#63666a",
  },
});

function toRadians(degrees: number): number {
  return degrees * Math.PI / 180;
}

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const rLat1 = toRadians(lat1);
  const rLat2 = toRadians(lat2);

  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(rLat1) * Math.cos(rLat2) * 
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c / 1.609;
}

// Function to calculate the distance between two coordinates using Bing Maps API
function getDistanceTwoPoints(userLocation: { lat: any; long: any; }, targetLocation: any) {
  let distances: any = [];
  for(let i = 0; i < targetLocation.length; i++) {
    const data = haversineDistance(userLocation.lat, userLocation.long, targetLocation[i].lat, targetLocation[i].long);
    distances.push(data);
  }
  return distances;
}

// Function to request permission and get user's current location

// Function to check if a coordinate is within a certain radius from the user
function isCoordinateWithinRadius(targetLocations: { lat: any; long: any; }[], userLocation: { lat: any; long: any; } | null) {
    if (userLocation === null) {
        return [-1];
    }
    // console.log(targetLocations);
    const distances = getDistanceTwoPoints(userLocation, targetLocations);
    if (distances === null) {
        return -1;
    }
    
    return distances;
}


// @ts-ignore
export default function Markers(data, categoriesEnabled, userLocation) {
      // const userLocation = useContext(LocationContext);
      // @ts-ignore
      let distances = []
      if(userLocation !== null) {
        distances = isCoordinateWithinRadius(data, userLocation);
      }
      let markers = [];
      const categories: any[] = []
      for (let i = 0; i < data.length; i++) {
        if (device === "ios") {
            const { name, typeOfPlace, streetAddress, state, phone, website, city, lat, long } = data[i];
            const urlScheme = Platform.select({
              ios: "maps://0,0?q=",
              android: "geo:0,0?q=",
            });
            const address = `${urlScheme}${streetAddress + " " + city + " "} ${state}`;
            const justNumber = phone.replaceAll(/[\(\)-\s]/g, "")
            const tele = `${"tel:"}${justNumber}`;
            if(!categories.includes(typeOfPlace)) {
              categories.push(typeOfPlace);
            }
            const color = colors[categoriesEnabled.indexOf(typeOfPlace)];
            // console.log(color, typeOfPlace);
            markers.push ([(
                <Marker
                    coordinate={{ latitude: lat, longitude: long }}
                    title={name}
                    description="This is a custom info window."
                    key={i}
                    pinColor={color}
                  >
                    <Callout>
                    <View style={{flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                      <Text style={styles.nameText}>{name}</Text>
                      <Text style={styles.typeText}>{typeOfPlace}</Text>
                      <TouchableOpacity
                        onPress={async () => {
                          Linking.openURL(address);
                        }}
                      >
                        <View>
                          <Text style={styles.typeText}>Address</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          Linking.openURL(tele);
                        }}
                      >
                        <View>
                          <Text style={styles.typeText}>Phone</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={async () => {
                          Linking.openURL(website);
                        }}
                      >
                        <View>
                          <Text style={styles.typeText}>Website</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                      onPress={async () => {
                        try{
                          await AsyncStorage.setItem(i.toString(), JSON.stringify(data[i]))
                          alert("Saved!");
                        } catch (e) {
                          console.log(e)
                        }
                      }}
                    >
                      <View>
                        <Text style={ styles.typeText }>Save</Text>
                      </View>
                    </TouchableOpacity>
                    </View>
                    
                    </Callout>
                  </Marker>
            
                ), distances[i], typeOfPlace])
        } else {
          const { name, typeOfPlace, streetAddress, state, phone, website, city, lat, long } = data[i];
          if(!categories.includes(typeOfPlace)) {
            categories.push(typeOfPlace);
          }
          markers.push(
            [<Marker
                coordinate={{ latitude: data[i].lat, longitude: data[i].long }}
                title={data[i].name}
                description="This is a custom info window."
                key={i}
                onPress={async () => {
                  try{
                    await AsyncStorage.setItem(i.toString(), JSON.stringify(data[i]))
                  } catch (e) {
                    console.log(e)
                  }
                }}
              >
                
                <Callout>
                  <View>
                    <Text>{data[i].name}</Text>
                  </View>
                </Callout>
              </Marker>, distances[i], typeOfPlace]
        )
        }
      }
      return [markers, categories];
    }  
