import webpack from 'webpack';
import { merge } from 'webpack-merge';
import base from './webpack.base';

const config = merge<webpack.Configuration>(base, {
	mode: 'development',
	devtool: 'source-map'
});

export default config;
