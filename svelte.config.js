const preprocess = require('svelte-preprocess')

module.exports = {
	preprocess: preprocess({
        postcss: true,
        scss: {
          includePaths: ["src"],
          prependData: "@import 'src/styles/global.sass';",
          postcss: {
            plugins: [require("autoprefixer")],
          },
        },
        postcss: {
          plugins: [require("autoprefixer")]
        }
    })
}

