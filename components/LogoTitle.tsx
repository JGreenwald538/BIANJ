import { useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, Image, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface LogoTitleProps {
  left?: boolean;
}


let screenWidth = Dimensions.get('window').width;

const LogoTitle: React.FC<LogoTitleProps> = ({left}) => {
  const insets = useSafeAreaInsets();
  const {colors} = useTheme();
  const colorScheme = colors.background === "white" ? "light" : "dark";
  useEffect(() => {
    screenWidth = Dimensions.get('window').width;
  });
  return (
    <View style={{ flex: 1, alignItems: 'center', position: 'absolute', top: insets.top, left: left ? 40 : 0.5 * screenWidth - 20 }}>
      <Image
        source={colorScheme === "light" ? require('../assets/logos/BIANJLogo.png') : require('../assets/logos/BIANJLogoHeader.png')}
        alt={"Brain Injury Alliance of New Jersey Logo"}
        style={{ height: 50, resizeMode: "contain", width: 50 }}
      />
    </View>
  );
}

export default LogoTitle;