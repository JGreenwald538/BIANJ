import * as React from "react";
import {
	View,
	Text,
	TouchableOpacity,
	StyleSheet,
	Dimensions,
	Linking,
} from "react-native";
import LogoTitle from "../components/LogoTitle";
import Carousel from "../components/Carousel";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { useContext, useEffect, useRef, useState } from "react";
import WalkthroughOverlay from "../components/WalkthroughOverlay";
import ReloadIcon from "../assets/SVGs/reload-circle-outline.svg";
import { LocationContext, WalkthroughContext } from "../util/globalvars";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";

const screenHeight = Dimensions.get("window").height;

interface StepInfo {
	ref: React.RefObject<View>[];
	content: {
		title: string;
		description: string;
		buttonText: string;
	};
}

interface ButtonMenuItemProps {
	title: string;
	styles: any;
	ref: React.RefObject<View>;
	url: string;
}

const ButtonMenuItem = ({ title, styles, ref, url }: ButtonMenuItemProps) => {
	return (
		<View style={styles.menu} ref={ref} collapsable={false}>
			<TouchableOpacity
				style={styles.menuItem}
				onPress={async () => {
					Linking.openURL(url);
				}}
			>
				<Text style={styles.menuText}>{title}</Text>
			</TouchableOpacity>
		</View>
	);
};

export default function HomeScreen({ navigation }: any) {
	const { colors } = useTheme();
	const colorScheme = colors.background === "white" ? "light" : "dark";
	const currentLocation = useContext(LocationContext);
	const insets = useSafeAreaInsets();
	const styles = StyleSheet.create({
		container: {
			flex: 1,
		},
		header: {
			alignItems: "center", // Center items horizontally in the container
			justifyContent: "flex-end", // Center items vertically in the container
			flex: 3, // You can adjust the height as needed
			marginBottom: 15,
		},
		title: {
			// Styles for the title
			marginBottom: 10,
			color: colorScheme !== "dark" ? "black" : "white",
			fontSize: 0.025 * screenHeight,
			textAlign: "center",
			fontWeight: "bold",
			width: "90%",
		},
		menu: {
			alignItems: "center", // Center menu items horizontally
			flex: 1,
			paddingHorizontal: 40,
			justifyContent: "center", // Center menu items vertically
		},
		menuItem: {
			// Styles for menu items
			backgroundColor: colorScheme === "light" ? "#e2cbe7" : "#70387a",
			width: "100%",
			height: "70%",
			justifyContent: "center",
			borderRadius: 10,
		},
		menuText: {
			// Styles for text inside menu items
			textAlign: "center",
			fontSize: 18,
			fontWeight: "500",
			color: colorScheme === "light" ? "black" : "white",
		},
		// Add any additional styles you might need
	});

	// Define refs for the target elements in your walkthrough
	const welcomeRef = useRef<View>(null);
	const carouselRef = useRef<View>(null);
	const aboutUsRef = useRef<View>(null);
	const getInvolvedRef = useRef<View>(null);
	const resourcesRef = useRef<View>(null);
	const donateRef = useRef<View>(null);
	const contactUsRef = useRef<View>(null);
	const reloadButtonRef = useRef<View>(null);

	const [walkthrough, setWalkthrough] = React.useContext(WalkthroughContext);

	// State to manage the current step, overlay visibility, and target element position

	const [overlayVisible, setOverlayVisible] = useState(false);

	useEffect(() => {
		const checkWalkthroughStatus = async () => {
			const value = await AsyncStorage.getItem("walkthroughed");
			// Only set the overlay to be visible if the value indicates the walkthrough hasn't been completed.
			if (value !== "true" && currentLocation && currentLocation[0]) {
				setOverlayVisible(true);
			}
			// No need for an additional loading state since we're defaulting to the desired end state.
		};

		checkWalkthroughStatus();
	}, []);

	const [currentStep, setCurrentStep] = useState<number>(walkthrough);
	const [centered, setCentered] = useState(true);
	const [targetMeasure, setTargetMeasure] = useState<{
		x: number;
		y: number;
		width: number;
		height: number;
	}>({ x: 0, y: 0, width: 0, height: 0 });

	// Define the steps of your walkthrough, including the ref to the target element and the content to display
	const steps: StepInfo[] = [
		{
			ref: [welcomeRef],
			content: {
				title: "Title",
				description:
					"Welcome to the Brain Injury Alliance of New Jersey Resource Center Walkthrough. Press anywhere to advance.",
				buttonText: "Let's Start!",
			},
		},
		{
			ref: [carouselRef],
			content: {
				title: "Carousel",
				description:
					"This is a carousel of images from the Brain Injury Alliance of New Jersey events.",
				buttonText: "Next",
			},
		},
		{
			ref: [aboutUsRef, getInvolvedRef, resourcesRef, donateRef, contactUsRef],
			content: {
				title: "Links",
				description:
					"Each of these buttons will help you learn more about BIANJ on our website.",
				buttonText: "Next",
			},
		},
		{
			ref: [reloadButtonRef],
			content: {
				title: "Conclusion",
				description:
					"Thank you for taking the time to learn more about the Brain Injury Alliance of New Jersey Resource Center. In order to start the walkthrough again, click the reload button in the top left corner.",
				buttonText: "Finish",
			},
		},
	];

	useEffect(() => {
		if (overlayVisible && steps[currentStep]?.ref) {
			let measurementsCount = 0;
			const totalRefs = steps[currentStep].ref.length;
			let minX = Infinity,
				minY = Infinity,
				maxX = 0,
				maxY = 0;

			steps[currentStep].ref.forEach((ref) => {
				if (ref.current) {
					ref.current.measureInWindow((x, y, width, height) => {
						if (!isNaN(x) && !isNaN(y) && !isNaN(width) && !isNaN(height)) {
							minX = Math.min(minX, x);
							minY = Math.min(minY, y);
							maxX = Math.max(maxX, x + width);
							maxY = Math.max(maxY, y + height);
						}
						measurementsCount++;
						if (measurementsCount === totalRefs) {
							if (minX < Infinity && minY < Infinity) {
								setTargetMeasure({
									x: minX,
									y: minY,
									width: maxX - minX,
									height: maxY - minY,
								});
							} else {
								console.error("Invalid measurements detected");
							}
						}
					});
				}
			});
		}
	}, [overlayVisible, currentStep]);

	useFocusEffect(() => {
		if (walkthrough !== 0) {
			setCentered(true);
			setOverlayVisible(true);
		}
	});

	// Function to start the walkthrough
	const startWalkthrough = () => {
		if (currentLocation && currentLocation[0]) {
			setCurrentStep(0);
			setOverlayVisible(true);
			setCentered(false);
		} else {
			alert("Please enable location services to start the walkthrough.");
		}
	};

	// Function to proceed to the next step or end the walkthrough
	const nextStep = () => {
		if (currentStep === 2) {
			navigation.navigate("Map");
			setOverlayVisible(false);
			setWalkthrough(1);
			setCurrentStep(currentStep + 1);
		} else if (currentStep < steps.length - 1) {
			setCurrentStep(currentStep + 1);
		} else {
			setWalkthrough(0);
			setOverlayVisible(false);
			setCurrentStep(0);
			setCentered(false);
			// Save that the user has completed the walkthrough
			AsyncStorage.setItem("walkthroughed", "true");
		}
	};

	return (
		<View style={styles.container}>
			<WalkthroughOverlay
				visible={overlayVisible}
				targetMeasure={targetMeasure}
				content={steps[currentStep].content}
				onClose={nextStep}
				center={centered}
			/>
			<View style={styles.header}>
				<Text style={[styles.title]} ref={welcomeRef}>
					Welcome to the Brain Injury Alliance of New Jersey Resource Center
				</Text>
			</View>
			<View
				ref={carouselRef}
				style={{ marginBottom: 15 }}
				collapsable={false}
				accessibilityLabel="Carousel of BIANJ Images"
			>
				<Carousel />
			</View>
			<ButtonMenuItem
				title="About Us"
				styles={styles}
				ref={aboutUsRef}
				url="https://bianj.org/about-us/"
			/>
			<ButtonMenuItem
				title="Get Involved"
				styles={styles}
				ref={getInvolvedRef}
				url="https://bianj.org/get-involved/"
			/>
			<ButtonMenuItem
				title="Resources"
				styles={styles}
				ref={resourcesRef}
				url="https://bianj.org/resources/"
			/>
			<ButtonMenuItem
				title="Donate"
				styles={styles}
				ref={donateRef}
				url="https://bianj.org/donate/"
			/>
			<ButtonMenuItem
				title="Contact Us"
				styles={styles}
				ref={contactUsRef}
				url="https://bianj.org/contact-us/"
			/>
			<LogoTitle />

			<View
				ref={reloadButtonRef}
				collapsable={false}
				style={{
					position: "absolute",
					zIndex: 10,
					top: insets.top,
					left: 20,
				}}
			>
				<View
					accessibilityLabel="Reload Walkthrough Button"
				>
					<TouchableOpacity
						onPress={startWalkthrough}
						accessibilityLabel="Reload Walkthrough Button"
						style={{ alignItems: "center" }}
					>
						<ReloadIcon
							color={colorScheme === "light" ? "#e2cbe7" : "#70387a"}
							width={30}
							height={30}
						/>
						<Text
							style={{ color: colorScheme === "light" ? "#e2cbe7" : "#70387a" }}
							numberOfLines={2}
						>
							Reload
						</Text>
						<Text
							style={{ color: colorScheme === "light" ? "#e2cbe7" : "#70387a" }}
							numberOfLines={2}
						>
							Walkthrough
						</Text>
					</TouchableOpacity>
				</View>
			</View>
		</View>
	);
}
