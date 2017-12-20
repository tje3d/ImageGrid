import TheImage from './TheImage';

export default class ImageManager {
	constructor(conf) {
		this.imageSources = conf.sources;
		this.stage = conf.Stage;
		this.shadowRectangle = conf.shadowRectangle;
		this.layer = conf.layer;
		this.images = [];
	}

	/**
	 * Add images to layer and redraw
	 * Also store them in images array
	 */
	addToLayer() {
		var that = this;
		var layer = this.layer;

		for(let i in this.imageSources) {
			let myimage = new TheImage({
				manager: this,
				stage: this.stage,
				src: this.imageSources[i],
				shadowRectangle: this.shadowRectangle,
			});

			myimage.generate(function({image, group}){
				layer.add(group);
				layer.draw();
			});

			this.images.push(myimage);
		}

		setTimeout(function(){
			if(that.hasAnyOverlap()) {
		    	$("#overlap").fadeIn('fast');
		    } else {
		    	$("#overlap").fadeOut('fast');
		    }
		}, 500);
	}

	/**
	 * Image overlap?
	 */
	hasOverlap(target) {
		var tleft = target.group.x();
		var ttop = target.group.y();
		var tright = target.group.x() + target.group.width();
		var tbottom = target.group.y() + target.group.height();

		var overlapped = this.images.filter((theimage)=>{
			if (theimage.id == target.id) {
				return false;
			}

			var img = theimage.group;
			var left = img.x();
			var top = img.y();
			var right = img.x() + img.width();
			var bottom = img.y() + img.height();

			if (
				(left >= tright) ||
				(right <= tleft) ||
				(top >= tbottom) ||
				(bottom <= ttop)
			) {
				return false;
			}

			return true;
		});

		return overlapped.length > 0;
	}

	/**
	 * Any image has overlap?
	 */
	hasAnyOverlap() {
		var that = this;

		var result = this.images.map(function(target){
			return that.hasOverlap(target);
		}).filter(res => res !== false);

		return result.length > 0;
	}
};