import { Config, ConfigOptions } from 'karma';

export default function(config: Config & ConfigOptions) {
	config.set({
		basePath: '',
		files: [
			// Angular
			'node_modules/angular/angular.js',
			'node_modules/angular-sanitize/angular-sanitize.js',
			'node_modules/angular-mocks/angular-mocks.js',

			// App
			'service.ts',

			// Tests
			'*.spec.ts',

			// Test data
			{
				pattern: 'test_data/*.txt',
				watched: true,
				served: true,
				included: false
			}
		],

		reporters: ['progress', 'karma-typescript'],
		port: 9876,
		colors: true,

		logLevel: config.LOG_INFO,

		browsers: ['Chrome'],
		preprocessors: {
			'./*.+(js|ts)': ['karma-typescript']
		},
		// @ts-ignore
		karmaTypescriptConfig: {
			tsconfig: 'tsconfig.test.json',
			//bundlerOptions: {
			//	transforms: [
			//		require("karma-typescript-es6-transform")()
			//	]
			//}
		},
		plugins: [
			'karma-typescript',
			'karma-chrome-launcher',
			'karma-jasmine',
		],
		mime: {
			'text/x-typescript': ['ts']
		},
		frameworks: ['jasmine','karma-typescript'],
		captureTimeout: 60000,

		autoWatch: true,
		singleRun: false
	});
};
