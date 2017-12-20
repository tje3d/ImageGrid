import Config from './config';

export default class TheImage {
	constructor(conf) {
		this.id = Math.random();
		this.manager = conf.manager;
		this.stage = conf.stage;
		this.src = conf.src;
		this.shadowRectangle = conf.shadowRectangle;
		this.imageObject = null;
		this.group = new Konva.Group({ draggable: true });

		this.positionHelper = null;

		this.textCode = new Konva.Text({
			name: 'textCode',
			x: 5,
			y: 5,
			text: '[210]',
			fontSize: 15,
			fontFamily: 'Calibri',
			fill: 'white',
			shadowColor: 'black',
			shadowOffset: {x: 0, y: 0},
			shadowBlur: 1
		});

		this.textSize = new Konva.Text({
			name: 'textSize',
			x: 5,
			y: 5,
			text: '45x30',
			fontSize: 15,
			fontFamily: 'Calibri',
			fill: 'white',
			shadowColor: 'black',
			shadowOffset: {x: 0, y: 0},
			shadowBlur: 1
		});

		this.textRemove = new Konva.Text({
			name: 'textRemove',
			text: "❌",
			fontSize: 15,
		});

		this.textRotate = new Konva.Text({
			name: 'textRotate',
			text: "🔄",
			fontSize: 17,
		});

		this.textRemove.on('mousedown', (e) => {
			e.cancelBubble = true;
			if (confirm('از حذف این تصویر اطمینان دارید؟')) {
				this.group.destroy();
				this.stage.batchDraw();
			}
		});

		this.textRotate.on('mousedown', (e) => {
			e.cancelBubble = true;
			this.imageObject.rotate(90);
			this.stage.batchDraw();
		});
	}

	generate(callback) {
		var that = this;
		var img = new Image();
		img.src = this.src;

		Konva.Image.fromURL(this.src, function(image){
			// image.draggable(true);
			that.group.add(image);
			that.group.add(that.textCode);

			// Set textRemove pos and add to group
			that.textRemove.position({
				x: image.x() + image.width() - 25,
				y: image.y() + image.height() - 25
			});
			that.group.add(that.textRemove);

			// Set textRotate pos and add to group
			// that.textRotate.position({
			// 	x: image.x() + image.width() - 55,
			// 	y: image.y() + image.height() - 25
			// });
			// that.group.add(that.textRotate);

			// Set textSize pos and add to group
			that.textSize.position({
				x: image.x() + 5,
				y: image.y() + image.height() - 17
			});
			that.group.add(that.textSize);

			// Set group width + height
			that.group.width(image.width());
			that.group.height(image.height());

			that.attachDragListeners(that.group);
			that.attachOtherListeners(that.group);

			that.imageObject = image;
			that.positionHelper = new PositionHelper(that.group);

			callback({image: image, group: that.group});
		});
	}

	attachDragListeners(el) {
		var that = this;
		
		el.on('mousedown', (e) => el.moveToTop());

		el.on('dragstart', (e) => {
			el.opacity(0.7);

			that.shadowRectangle.size({
				width: el.size().width,
				height: el.size().height
			});

		    that.shadowRectangle.show();
		    that.shadowRectangle.moveToTop();
		    el.moveToTop();
		});

		el.on('dragend', (e) => {
			el.opacity(1);

		    el.position({
		        x: Math.round(el.x() / Config.blockSnapSize) * Config.blockSnapSize,
		        y: Math.round(el.y() / Config.blockSnapSize) * Config.blockSnapSize
		    });
		    that.stage.batchDraw();
		    that.shadowRectangle.hide();


		    if (that.manager.hasOverlap(that)) {
		    	$("#overlap").fadeIn('fast');
		    } else {
		    	$("#overlap").fadeOut('fast');
		    }
		});

		el.on('dragmove', (e) => {
			el.position({
				x: this.positionHelper.getX(),
				y: this.positionHelper.getY()
			});

		    that.shadowRectangle.position({
		        x: Math.round(el.x() / Config.blockSnapSize) * Config.blockSnapSize,
		        y: Math.round(el.y() / Config.blockSnapSize) * Config.blockSnapSize
		    });
		    that.stage.batchDraw();
		});
	}

	attachOtherListeners(el) {

	}
};

/**
 * Image position helper
 */
class PositionHelper {
	constructor(el) {
		this.el = el;
	}

	// X -> right ( plus )
	outsideXP() {
		if (this.el.x() + this.el.width() > Config.width) {
			return true;
		}

		return false;
	}

	// X -> left ( minus )
	outsideXM() {
		if (this.el.x() < 0) {
			return true;
		}

		return false;
	}

	// Y -> bottom ( plus )
	outsideYP() {
		if (this.el.y() + this.el.height() > Config.height) {
			return true;
		}

		return false;
	}

	// Y -> top ( minus )
	outsideYM() {
		if (this.el.y() < 0) {
			return true;
		}

		return false;
	}

	/**
	 * Calculate el X
	 */
	getX() {
		if (this.outsideXM()) {
			return 0;
		}

		if (this.outsideXP()) {
			return Config.width - this.el.width();
		}

		return this.el.x();
	}

	/**
	 * Calculate el Y
	 */
	getY() {
		if (this.outsideYM()) {
			return 0;
		}

		if (this.outsideYP()) {
			return Config.height - this.el.height();
		}

		return this.el.y();
	}
}