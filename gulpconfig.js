/**
 * GULP Configuration file
 *
 */

module.exports = {

	// Main folders
	folder: {
		source: './_source',
		build: './build',
		assets: './build/assets'
	},

	// Styles options
	styles: {
		outputStyle: 'compact', // Options → 'compact', 'compressed', 'nested' or 'expanded'
		src: './_source/styles/*.scss',
		dest: './build/assets/css',
	},

	// Templating options
	template: {
		base: './_source/templates',
		src: './_source/templates/**/*.{html,htm}',
		dest: './build'
	},

	// Extra moving moving
    extra: [
		"./_source/fonts/**/*.{eot,svg,ttf,woff,woff2}",
		"./_source/img/**/*.{jpg,svg,png,jpeg,gif}"
    ]
}