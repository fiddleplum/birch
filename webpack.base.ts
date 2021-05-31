import * as webpack from 'webpack';

const config: webpack.Configuration = {
	entry: './src/index.ts',
	output: {
		filename: 'script.js',
		library: 'Birch',
		libraryExport: 'Birch'
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

export default config;
