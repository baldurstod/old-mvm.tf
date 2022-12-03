import nodeResolve from '@rollup/plugin-node-resolve';
import copy from 'rollup-plugin-copy';
import postcss from 'rollup-plugin-postcss';
import {terser} from 'rollup-plugin-terser';
import image from '@rollup/plugin-image';

const isDev = process.env.BUILD === 'dev';
const isProduction = process.env.BUILD === 'production';
const isBeta = process.env.BUILD === 'beta';

const betaOrProd = isProduction || isBeta;

export default (async () => ({
	input: './src/js/Application.js',
	output: {
		file: './dist/application.js',
		format: 'esm'
	},
	plugins: [
		postcss({}),
		image(),
		nodeResolve({
		}),
		betaOrProd ? terser() : null,
		copy({
			targets: [
				{src: 'src/index.html', dest: 'dist/'},
				{src: 'src/json/', dest: 'dist/'},
			]
		}),
	],
}))();
