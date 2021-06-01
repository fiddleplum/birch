module.exports = {
	entry: './src/index.ts',
	output: {
		filename: 'script.js',
		library: 'Birch'
	},
	resolve: {
		extensions: ['.ts', '.js']
	},
	watchOptions: {
		aggregateTimeout: 1000,
		poll: 1000,
	},
	module: {
		rules: [{
			test: /\.ts$/,
			loader: 'ts-loader'
		}]
	},
	stats: {
		assets: false,
	}
};
