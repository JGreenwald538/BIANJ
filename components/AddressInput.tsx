import React, { useContext, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { LocationContext } from "../util/globalvars";


export const AddressInput: React.FC = () => {
    const [input, setInput] = useState('');
    // @ts-ignore
    const [currentLocation, setCurrentLocation, isRealLocation, setIsRealLocation] = useContext(LocationContext);

    const fetchCoordinates = async () => {
        try {
            const response = await fetch(`https://geocode.maps.co/search?q=${input}`);
            const data = await response.json();

            if (data && data.length > 0) {
                const { lat, lon } = data[0];
                setCurrentLocation({ lat: parseFloat(lat), long: parseFloat(lon) });
                setIsRealLocation(false)
            } else {
                throw new Error('No location found');
            }
        } catch (error) {
            Alert.alert('Error', 'Unable to fetch coordinates');
        }
    };

    return (
        <View style={styles.container}>
            <View style={{paddingVertical: 3}}>
                <Text style={{ fontWeight: '600', textAlign: "center" }}>{"Enter Address"}</Text>
            </View>
            <View>
              <TextInput
                  value={input}
                  onChangeText={setInput}
                  placeholder="Enter an address"
                  placeholderTextColor={"#6C6C75"}
                  style={{paddingHorizontal: 10, paddingVertical: 5, borderRadius: 5, borderColor: '#ffffff', borderWidth: 1 }}
              />
            </View>
            <View style={{ paddingHorizontal: 10, paddingTop: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <TouchableOpacity 
                    style={{ paddingVertical: 5, backgroundColor: "#572C5F", borderRadius: 5 }}
                    onPress={fetchCoordinates}>
                        <Text style={{ color: 'white', textAlign: "center", paddingHorizontal: 5 }}>Submit</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
      backgroundColor: '#e2cbe7',
      marginHorizontal: 20,
      borderRadius: 10,
      padding: 10,
      marginTop: 15,
      alignContent: 'center',
      justifyContent: "space-between",
      display: 'flex',
      width: 'auto',
      flexDirection: 'column',
    },
});
