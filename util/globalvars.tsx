import { Dispatch, SetStateAction, createContext } from "react";

export const LocationContext = createContext<[{lat: number, long: number} | null, Dispatch<SetStateAction<{lat: number, long: number} | null>> , boolean | null, Dispatch<SetStateAction<boolean>> ] | null>(null);
export const PlacesContext = createContext<any[]>([]);
export const CategoriesContext = createContext<any[]>([]);
export const WalkthroughContext = createContext<any[]>([]);