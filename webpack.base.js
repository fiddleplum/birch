const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './src/index.ts',
	output: {
		filename: 'script.js'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'ts-loader'
		}, {
			test: /\.(css|svg|html)$/,
			use: 'raw-loader'
		}]
	}
};
