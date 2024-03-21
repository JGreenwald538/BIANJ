/* eslint-disable no-undef */
// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require("expo/metro-config");

module.exports = (async () => {
	const config = getDefaultConfig(__dirname);

	const {
		resolver: { sourceExts, assetExts },
	} = config;

	// Ensure SVG files are treated as source files, enabling them to be transformed.
	// This might require installing and configuring a transformer like react-native-svg-transformer.
	return {
		...config,
		transformer: {
			...config.transformer,
			// Use react-native-svg-transformer for SVG files.
			babelTransformerPath: require.resolve("react-native-svg-transformer"),
		},
		resolver: {
			...config.resolver,
			// Exclude 'svg' from assetExts since it will be included in sourceExts.
			assetExts: assetExts.filter((ext) => ext !== "svg"),
			// Include 'svg' in sourceExts to support SVG files as React components.
			sourceExts: [...sourceExts, "svg", "mjs"],
		},
	};
})();
