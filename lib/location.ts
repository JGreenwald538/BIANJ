import * as Location from 'expo-location';

export async function getCurrentLocation() {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        // console.error('Permission to access location was denied');
        return null;
    }
  
    try {
        let location = await Location.getCurrentPositionAsync({});
        return {
            lat: location.coords.latitude,
            long: location.coords.longitude
        };
    } catch (error) {
        console.error('Error getting location:', error);
        return null;
    }
}