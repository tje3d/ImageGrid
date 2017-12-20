import Konva from 'konva';
import Config from './inc/config';
import shadowRectangle from './inc/shadowRectangle';
import Stage from './inc/stage';
import Grid from './inc/grid';
import ImageManager from './inc/ImageManager';

window.$ = window.jQuery = require('jquery');

var layer = new Konva.Layer();
layer.add(shadowRectangle);
shadowRectangle.hide();

var imageManager = new ImageManager({
	sources: [
		'img/yoda.jpg',
		'img/vader.jpg',
	],
	Stage,
	shadowRectangle,
	layer
});

imageManager.addToLayer();

$("#zoom").on('input', function(){
	var val = $(this).val() < 1 ? 1 : $(this).val();
	var percent = (val / 100) * 2;
	Stage.scale({
		x: percent,
		y: percent
	});
	Stage.batchDraw();
}).on('dblclick', function() {
	$(this).val(50);
	Stage.scale({
		x: 1,
		y: 1
	});
	Stage.batchDraw();
});

Stage.add(Grid);
Stage.add(layer);