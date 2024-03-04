import * as React from "react";
import { View, SafeAreaView, Dimensions, Image } from "react-native";
import Carousel from "react-native-snap-carousel";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

interface CarouselItem {
	title: string;
	text: string;
}

interface AppState {
	activeIndex: number;
	carouselItems: CarouselItem[];
}

const carouselImages: Record<number, any> = {
	0: require("../assets/CarouselImages/Carousel1.jpg"),
	1: require("../assets/CarouselImages/Carousel4.jpg"),
	2: require("../assets/CarouselImages/Carousel5.jpg"),
	3: require("../assets/CarouselImages/Carousel6.jpg"),
	4: require("../assets/CarouselImages/Carousel7.jpg"),
	5: require("../assets/CarouselImages/Carousel8.jpg"),
	6: require("../assets/CarouselImages/Carousel9.jpg"),
	7: require("../assets/CarouselImages/Carousel10.jpg"),
	8: require("../assets/CarouselImages/Carousel11.jpg"),
	// Add more images as needed
};

const scale = 0.25;

export default class App extends React.Component<{}, AppState> {
	private carousel: React.RefObject<Carousel<any>>;

	constructor(props: {}) {
		super(props);
		this.carousel = React.createRef();
		this.state = {
			activeIndex: 0,
			carouselItems: [
				{
					title: "Item 1",
					text: "Text 1",
				},
				{
					title: "Item 2",
					text: "Text 2",
				},
                {
                    title: "Item 3",
                    text: "Text 3",
                },
                {
                    title: "Item 4",
                    text: "Text 4",
                },
                {
                    title: "Item 5",
                    text: "Text 5",
                },
                {
                    title: "Item 6",
                    text: "Text 6",
                },
                {
                    title: "Item 7",
                    text: "Text 7",
                },
                {
                    title: "Item 8",
                    text: "Text 8",
                },
                {
                    title: "Item 9",
                    text: "Text 9",
                },
			],
		};
	}

	_renderItem = ({ index }: { index: number }) => {
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
