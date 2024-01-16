import { createContext } from "react";
import { Appearance } from "react-native";

export const ColorScheme = createContext<any>(null);
export const LocationContext = createContext<[{lat: number, long: number}, () => {}, boolean, () => {}] | null>(null);