import * as React from 'react';
import {
    View,
    SafeAreaView,
    Dimensions,
    Image,
} from 'react-native';
import Carousel from 'react-native-snap-carousel';

const { width: screenWidth } = Dimensions.get('window');

interface CarouselItem {
    title: string;
    text: string;
}

interface AppState {
    activeIndex: number;
    carouselItems: CarouselItem[];
}

const carouselImages: Record<number, any> = {
    0: require('../assets/CarouselImages/Carousel0.jpg'),
    1: require('../assets/CarouselImages/Carousel1.jpg'),
    2: require('../assets/CarouselImages/Carousel2.jpg'),
    3: require('../assets/CarouselImages/Carousel3.jpg'),
    4: require('../assets/CarouselImages/Carousel4.jpg'),
    // Add more images as needed
};

const scale = 0.6;

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
            ]
        };
    }

    _renderItem = ({ index }: { index: number }) => {
        return (
            <View style={{
                height: screenWidth * scale, 
                width: screenWidth * scale,
                overflow: 'hidden',
            }}>
                <Image
                    source={carouselImages[index]}
                    style={{ 
                        resizeMode: "stretch",
                        borderRadius: 20,
                        width: screenWidth * scale,
                        height: screenWidth * scale
                    }}
                />
            </View>
        )
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 5 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                    <Carousel
                        layout={"default"}
                        ref={this.carousel}
                        data={this.state.carouselItems}
                        sliderWidth={screenWidth}
                        itemWidth={screenWidth * scale}
                        renderItem={this._renderItem}
                        onSnapToItem={index => this.setState({ activeIndex: index })} 
                        vertical={false}
                        autoplay={true}
                        autoplayInterval={5000}
                    />
                </View>
            </SafeAreaView>
        );
    }
}
