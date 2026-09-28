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
	// ListScreen reads these off route.params; both are optional because the
	// tab can also be opened directly with no params.
	List: { sortBy?: string; categoriesEnabled?: string[] } | undefined;
	Map: undefined;
	Saved: undefined;
}
export const sortBys = ["Alphabetical", "Category", "Distance"];
