import { Dispatch, SetStateAction, createContext } from "react";
import type {Place} from '../lib/place';

export const LocationContext = createContext<[{lat: number, long: number} | null, Dispatch<SetStateAction<{lat: number, long: number} | null>> , boolean | null, Dispatch<SetStateAction<boolean>> ] | null>(null);
export const PlacesContext = createContext<Place[]>([]);
export const CategoriesContext = createContext<any[]>([]);
export const WalkthroughContext = createContext<any[]>([]);
export const WalkthroughListScreenContext = createContext<
	[boolean, Dispatch<SetStateAction<boolean>>]
>(undefined!);
