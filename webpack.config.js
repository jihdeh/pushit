"use strict";
var webpack = require("webpack");
var path = require("path");
var loaders = require("./webpack.loaders");
var HtmlWebpackPlugin = require("html-webpack-plugin");

// global css
loaders.push({
	test: /\.css$/,
	exclude: /[\/\\]src[\/\\]/,
	loaders: [
		"style?sourceMap",
		"css"
	]
});
// local scss modules
loaders.push({
	test: /\.scss$/,
	exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
	loaders: [
		"style?sourceMap",
		"css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]",
		"postcss",
		"sass"
	]
});

// local css modules
loaders.push({
	test: /\.css$/,
	exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
	loaders: [
		"style?sourceMap",
		"css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]"
	]
});

module.exports = {
	entry: [
		"react-hot-loader/patch",
		"./src/index.jsx" // your app"s entry point
	],
	devtool: process.env.WEBPACK_DEVTOOL || "cheap-module-source-map",
	output: {
		path: path.join(__dirname, "public"),
		filename: "bundle.js"
	},
	resolve: {
		extensions: ["", ".js", ".jsx"]
	},
	module: {
		loaders
	},
	plugins: [
		new webpack.NoErrorsPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new HtmlWebpackPlugin({
			template: "./src/template.html"
		}),
	]
};
