import { Dispatch, SetStateAction, createContext } from "react";
import type {Place} from '../lib/place';

export type LocationContext = [
	{ lat: number; long: number } | null,
	Dispatch<SetStateAction<{ lat: number; long: number } | null>>,
	boolean | null,
	Dispatch<SetStateAction<boolean>>
] | null;

export const LocationContext = createContext<LocationContext>(null);
export const PlacesContext = createContext<Place[]>([]);
export const CategoriesContext = createContext<string[]>([]);
export const WalkthroughContext = createContext<
	[number, Dispatch<SetStateAction<number>>]
>(undefined!);
export const WalkthroughListScreenContext = createContext<
	[boolean, Dispatch<SetStateAction<boolean>>]
>(undefined!);

export type NavigationParamsList = {
	Home: undefined;
	List: {params: {sortBy: string}};
	Map: undefined;
	Saved: undefined;
}
export const sortBys = ["Alphabetical", "Category", "Distance"];
