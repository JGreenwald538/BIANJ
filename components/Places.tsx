import React, { Dispatch, SetStateAction, useContext } from "react";
import { Dimensions, View, Text } from "react-native";
import type { Place } from "../lib/place";
import PlaceExpandable from "./Place";
import { WalkthroughListScreenContext } from "../util/globalvars";

interface PlaceProps extends React.ComponentPropsWithoutRef<typeof View> {
	name: string;
	type: string;
	logoUri: string;
	address: string;
	phone: string;
	website: string;
	jsonPlaceInfo: object;
	save: boolean;
	setUpdate?: (value: React.SetStateAction<boolean>) => void;
	update?: boolean;
	titleRef?: React.RefObject<View>;
	typeRef?: React.RefObject<View>;
	buttonRef?: React.RefObject<View>;
	containerRef?: React.RefObject<View>;
	placeEnabled: boolean
	setPlaceEnabled: (value: React.SetStateAction<boolean>) => void;
	first: boolean;
}

declare global {
	var placeEnabled: boolean;
	var setPlaceEnabled: Dispatch<SetStateAction<boolean>>;
}

const Place: React.FC<Omit<PlaceProps, "placeEnabled" | "setPlaceEnabled">> = ({
	name = "Name",
	type = "Type",
	logoUri,
	address = "Address",
	phone = "Phone",
	website = "Website",
	jsonPlaceInfo: object,
	save,
	setUpdate,
	update,
	titleRef,
	typeRef,
	buttonRef,
	containerRef,
	first,
}) => {
	let [expanded, setExpanded] = React.useState(false);

	if (first) {
		[expanded, setExpanded] = useContext(WalkthroughListScreenContext);
	}

	return (
		<PlaceExpandable
			name={name}
			type={type}
			logoUri={logoUri}
			address={address}
			phone={phone}
			website={website}
			jsonPlaceInfo={object}
			save={save}
			update={update}
			setUpdate={setUpdate}
			titleRef={titleRef}
			typeRef={typeRef}
			buttonRef={buttonRef}
			containerRef={containerRef}
			placeEnabled={expanded}
			setPlaceEnabled={setExpanded}
		/>
	);
};


function PlaceList({
	items,
	save,
	update,
	setUpdate,
	titleRef,
	typeRef,
	buttonRef,
	containerRef,
	useRef = false,
}: {
	items: Place[];
	save: boolean;
	update?: boolean;
	setUpdate?: (value: React.SetStateAction<boolean>) => void;
	titleRef?: React.RefObject<View>;
	typeRef?: React.RefObject<View>;
	buttonRef?: React.RefObject<View>;
	containerRef?: React.RefObject<View>;
	useRef?: boolean;
}) {
	return (
		<View key={0} style={{ alignItems: "center" }}>
			{items.map((item, index) => {
				// if(index !== 0) {
				return (
					<Place
						key={index}
						name={item.name}
						type={item.typeOfPlace}
						logoUri={"../assets/logos/icon12.png"}
						address={`${item.streetAddress + " " + item.city + " "} ${
							item.state
						}`}
						phone={item.phone}
						website={item.website}
						jsonPlaceInfo={item}
						save={save}
						update={update}
						setUpdate={setUpdate}
						titleRef={ titleRef }
						typeRef={ typeRef }
						buttonRef={ buttonRef }
						containerRef={ containerRef }
						first={index === 0 && useRef}
					/>
				);
			})}
		</View>
	);
}

export { Place, PlaceList };
export function getCategoriesForItems(items: Place[]) {
	const categories: string[] = [];
	for (let i = 0; i < items.length; i++) {
		// @ts-ignore
		if (!categories.includes(items[i].typeOfPlace)) {
			categories.push(items[i].typeOfPlace);
		}
	}
	return categories;
}
