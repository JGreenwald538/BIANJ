import * as React from "react";
import { View, Dimensions, Image, ImageSourcePropType } from "react-native";
import Carousel from "react-native-snap-carousel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CarouselItem {
	title: string;
	text: string;
	accessibilityLabel: string; // Accessibility label for each image
}

interface AppState {
	activeIndex: number;
	carouselItems: CarouselItem[];
}

interface CarouselImageMap {
	[index: number]: ImageSourcePropType;
}

// To add more images to the carousel, follow this:
// 1. Format the image as a square
// 2. Add the image to the CarouselImages folder
// 3. Import the image in the carouselImages object below
// 4. Add one more item to the carouselItems array(starts at line 50) in the state

const carouselImages: CarouselImageMap = {
	0: require("../assets/CarouselImages/Carousel1.jpg"),
	1: require("../assets/CarouselImages/Carousel4.jpg"),
	2: require("../assets/CarouselImages/Carousel5.jpg"),
	3: require("../assets/CarouselImages/Carousel6.jpg"),
	4: require("../assets/CarouselImages/Carousel7.jpg"),
	5: require("../assets/CarouselImages/Carousel9.jpg"),
	6: require("../assets/CarouselImages/Carousel10.jpg"),
	7: require("../assets/CarouselImages/Carousel11.jpg"),
	// Add more images as needed
};

const scale = 0.25;

export default class App extends React.Component<{}, AppState> {
	private carousel: React.RefObject<Carousel<CarouselItem>>;

	constructor(props: {}) {
		super(props);
		this.carousel = React.createRef<Carousel<CarouselItem>>();
		this.state = {
			activeIndex: 0,
			carouselItems: [
				{
					title: "Item 1",
					text: "Text 1",
					accessibilityLabel: "Carousel of BIANJ Images",
				},
				{
					title: "Item 2",
					text: "Text 2",
					accessibilityLabel: "Carousel of BIANJ Images",
				},
				{
					title: "Item 3",
					text: "Text 3",
					accessibilityLabel: "Carousel of BIANJ Images",
				},
				{
					title: "Item 4",
					text: "Text 4",
					accessibilityLabel: "Carousel of BIANJ Images",
				},
				{
					title: "Item 5",
					text: "Text 5",
					accessibilityLabel: "Carousel of BIANJ Images",
				},
				{
					title: "Item 6",
					text: "Text 6",
					accessibilityLabel: "Carousel of BIANJ Images",
				},
				{
					title: "Item 7",
					text: "Text 7",
					accessibilityLabel: "Carousel of BIANJ Images",
				},
				{
					title: "Item 8",
					text: "Text 8",
					accessibilityLabel: "Carousel of BIANJ Images",
				},
			],
		};
	}

	_renderItem = ({ item, index }: { item: CarouselItem; index: number }) => {
		return (
			<View
				style={{
					height: screenHeight * scale,
					width: screenHeight * scale,
					overflow: "hidden",
				}}
			>
				<Image
					source={carouselImages[index]}
					style={{
						resizeMode: "stretch",
						borderRadius: 20,
						width: screenHeight * scale,
						height: screenHeight * scale,
					}}
					accessible={true}
					accessibilityLabel={item.accessibilityLabel}
				/>
			</View>
		);
	};

	render() {
		return (
			<Carousel
				layout={"default"}
				ref={this.carousel}
				data={this.state.carouselItems}
				sliderWidth={screenWidth}
				itemWidth={screenHeight * scale}
				renderItem={this._renderItem}
				onSnapToItem={(index) => this.setState({ activeIndex: index })}
				vertical={false}
				autoplay={true}
				autoplayInterval={5000}
			/>
		);
	}
}
