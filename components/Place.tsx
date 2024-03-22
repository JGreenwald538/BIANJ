import React, { Dispatch, SetStateAction, useContext } from "react";
import {
	Dimensions,
	View
} from "react-native";
const { width, height } = Dimensions.get("window");
import type { Place } from '../lib/place';
import PlaceExpandable from "./PlaceExpandable";
import { WalkthroughListScreenContext } from "../util/globalvars";

interface PlaceProps extends React.ComponentPropsWithoutRef<typeof View> {
	name?: string;
	type?: string;
	logoUri?: string;
	invisible?: boolean;
	address?: string;
	phone?: string;
	website?: string;
	object?: any;
	save?: boolean;
	deleteIcon?: boolean;
	setUpdate?: any;
	update?: boolean;
	titleRef?: any;
	typeRef?: any;
	buttonRef?: any;
	containerRef?: any;
	placeEnabled?: any;
	setPlaceEnabled?: any;
	first?: boolean;
	activateAlert?: any;
}

let hasNotch = false;

hasNotch = Dimensions.get("window").height > 800;

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;

declare global {
	var placeEnabled: boolean;
	var setPlaceEnabled: Dispatch<SetStateAction<boolean>>;
}

const Place: React.FC<Omit<PlaceProps, 'placeEnabled' |'setPlaceEnabled'>> = ({
	name = "Name",
	type = "Type",
	logoUri,
	invisible = false,
	address = "Address",
	phone = "Phone",
	website = "Website",
	object,
	save = true,
	deleteIcon = false,
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

	
	return <PlaceExpandable
		name={name}
		type={type}
		logoUri={logoUri}
		invisible={invisible}
		address={address}
		phone={phone}
		website={website}
		object={object}
		save={save}
		deleteIcon={deleteIcon}
		update={update}
		setUpdate={setUpdate}
		titleRef={titleRef}
		typeRef={typeRef}
		buttonRef={buttonRef}
		containerRef={containerRef}
		placeEnabled={expanded}
		setPlaceEnabled={setExpanded}
	/>
};

// @ts-ignore
function PlaceList({
	items,
	save,
	deleteIcon,
	update,
	setUpdate,
	titleRef,
	typeRef,
	buttonRef,
	containerRef,
	useRef,
	activateAlert
}: {
	items: Place[];
	save?: boolean;
	deleteIcon?: boolean;
	update?: boolean;
	setUpdate?: any;
	titleRef?: any;
	typeRef?: any;
	buttonRef?: any;
	containerRef?: any;
	useRef?: boolean;
	activateAlert?: any;
}) {
		return 	<View key={0} style={{ alignItems: "center" }}>
					{
						items.map((item, index) => {
							// if(index !== 0) {
								return(
									<Place
										key={index}
										name={item.name}
										type={item.typeOfPlace}
										logoUri={"../assets/logos/icon12.png"}
										invisible={item.invisible}
										address={`${item.streetAddress + " " + item.city + " "} ${
											item.state
										}`}
										phone={item.phone}
										website={item.website}
										object={item}
										save={save}
										deleteIcon={deleteIcon}
										update={update}
										setUpdate={setUpdate}
										titleRef={index === 0 ? titleRef : null}
										typeRef={index === 0 ? typeRef : null}
										buttonRef={index === 0 ? buttonRef : null}
										containerRef={index === 0 ? containerRef : null}
										first={index === 0 && useRef}
										activateAlert={activateAlert}
									/>
								)
						})
					}
				</View>
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

