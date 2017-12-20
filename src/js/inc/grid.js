import Config from './config';

var padding = Config.blockSnapSize;
var gridLayer = new Konva.Layer();

for (var i = 0; i < Config.width / padding; i++) {
    gridLayer.add(new Konva.Line({
        points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, Config.height],
        stroke: '#ddd',
        strokeWidth: 1,
    }));
}

gridLayer.add(new Konva.Line({
    points: [0, 0, 10, 10]
}));

for (var j = 0; j < Config.height / padding; j++) {
    gridLayer.add(new Konva.Line({
        points: [0, Math.round(j * padding), Config.width, Math.round(j * padding)],
        stroke: '#ddd',
        strokeWidth: 0.5,
    }));
}

export default gridLayer;