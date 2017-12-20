let mix = require('laravel-mix');

// CSS
mix.sass('src/css/app.scss', 'build')

// JS
.js('src/js/app.js', 'build');

mix.browserSync('imagegrid.loc');