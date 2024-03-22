/* eslint-disable no-undef */
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {

	const config = getDefaultConfig(__dirname);

	const { transformer, resolver } = config;

	// @ts-ignore
	config.transformer = {
		...transformer,
		babelTransformerPath: require.resolve("react-native-svg-transformer"),
	};
	// @ts-ignore
	config.resolver = {
		...resolver,
		// @ts-ignore
		assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
		// @ts-ignore
		sourceExts: [...resolver.sourceExts, "svg"],
	};

	return config;
})();
