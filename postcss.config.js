const mode = process.env.NODE_ENV
const dev = mode === 'development'

module.exports = {
	plugins: [
		require('postcss-import')(),
		!dev &&
			require('cssnano')({
				preset: ['default', { discardComments: { removeAll: true } }],
			}),
	],
}