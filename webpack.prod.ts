import * as Webpack from 'webpack';
import { merge } from 'webpack-merge';
import base from './webpack.base';
import TerserPlugin from 'terser-webpack-plugin';

const config = merge<Webpack.Configuration>(base, {
	mode: 'production',
	optimization: {
		minimizer: [
			new TerserPlugin({
				terserOptions: {
					keep_fnames: false,
				},
			}),
		],
	},
});

export default config;
