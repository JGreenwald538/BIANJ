// @ts-check

import Constants from "expo-constants";

export const API_URL = Constants?.expoConfig?.hostUri
  ? `http://${Constants.expoConfig.hostUri.split(`:`).shift()}:8000/places`
  : process.env.EXPO_PUBLIC_API_URL ?? '';

