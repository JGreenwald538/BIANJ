// @ts-check

import Constants from "expo-constants";

export const API_URL = Constants?.expoConfig?.hostUri
  ? `http://${Constants.expoConfig.hostUri.split(`:`).shift()}:3000`
  : process.env.EXPO_PUBLIC_API_URL ?? '';

