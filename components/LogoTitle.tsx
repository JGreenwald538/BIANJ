import React from 'react';
import { View, Image, Dimensions } from 'react-native';
let hasNotch = false;

hasNotch = Dimensions.get('window').height > 800;


const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function LogoTitle() {
  return (
    <View style={{ flex: 1, alignItems: 'center', position: 'absolute', top: (hasNotch ? screenHeight * 0.07 : screenHeight * 0.04), left: 0.5 * screenWidth - 20 }}>
      <Image
        source={require('../assets/BIANJLogoHeader.png')}
        alt={"logo"}
        style={{ height: 50, resizeMode: "contain", width: 50 }}
      />
    </View>
  );
}
