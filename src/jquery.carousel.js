/**
 * jquery carousel plug.
 *
 * @author LanceLi
 */

;(function(factory) {
  if (typeof define === 'function' && define.amd) {
    //AMD support
    define(['jquery'], factory);
  } else {
    //Browser global
    factory(jQuery);
  }

})(function($) {

	var Carousel = function(el, options) {
		this.opts = options;
		this.$el = $(el).children(options.carouselListSel);
		this.$wrap = $(el);
		this.transitionendEvent = getTransitionEndEvent();
		this.init();
	};

	Carousel.DEFAULTS = {
		pageSpeed		: 800,
		showItemNum		: 'auto',
		screenType		: 'destop',
		activeClass		: 'active-carousel',
		carouselListSel : '.carousel-list',
		nextPageSel		: '.carousel-next-page',
		prevPageSel		: '.carousel-prev-page',
		responsive		: true,
		responsiveType	: ['destop', 'tablet'],
		itemsTablet		: [768, 992],
		tabletShowItem	: 4,
		destopShowItem	: 5,
		afterInit		: $.noop,
		afterUpdate		: $.noop,
		afterAnimate	: $.noop
	};

	Carousel.prototype.init = function() {
		var _this = this,
			$el = _this.$el,
			opts = _this.opts;

		var $children = $el.children(),
			itemWidth;

		if (opts.showItemNum === 'auto') {
			opts.showItemNum = Math.round(_this.$wrap.width() / $children.eq(0).outerWidth());
		}

		if (opts.responsive) {
			var docWidth = $(document).width();

			if (_this._getScreenType() === opts.responsiveType[0]) {
				opts.showItemNum = opts.destopShowItem;
				opts.screenType = opts.responsiveType[0];

			} else if (_this._getScreenType() === opts.responsiveType[1]) {
				opts.showItemNum = opts.tabletShowItem;
				opts.screenType = opts.responsiveType[1];
			}

			_this._onWindowResize();
		}

		itemWidth = _this.$wrap.width() / opts.showItemNum;
		opts.itemWidth = itemWidth;

		_this.$wrap.css('overflow', 'hidden');
		$el.css({
			'width': itemWidth * $children.length * 2,
			'display': 'block',
			'position': 'relative'
		});
		if (_this.transitionendEvent) {
			$el.css({
				'transition': 'all ' + opts.pageSpeed + 'ms' + ' ease',
				'transform': 'translate3d(0px, 0px, 0px)'
			});
		} else {
			$el.css({
				'left': 0
			});
		}

		$children.css({
			'width': itemWidth
		});

		$children.eq(0).addClass(opts.activeClass);

		_this.$wrap.find(opts.nextPageSel).on('click.carousel', $.proxy(_this.nextPage, _this));
		_this.$wrap.find(opts.prevPageSel).on('click.carousel', $.proxy(_this.prevPage, _this));

		$.isFunction(opts.afterInit) && opts.afterInit.call(_this, $children);
	};

	Carousel.prototype.to = function(index) {
		var _this = this,
			$el = _this.$el,
			opts = _this.opts;

		if (_this.transitionendEvent) {
			$el.css('transform', 'translate3d(' + -(opts.itemWidth * index) + 'px, 0px, 0px)');
		} else {
			$el.animate({'left': -(opts.itemWidth * index)}, opts.pageSpeed);
		}

		$el.children()
		   .removeClass(opts.activeClass)
		   .eq(index)
		   .addClass(opts.activeClass);

		$.isFunction(opts.afterAnimate) && opts.afterAnimate.call(_this, index);
	};

	Carousel.prototype.nextPage = function() {
		var _this = this,
			$el = _this.$el,
			opts = _this.opts;

		var newActiveIndex = _this._setActivePosition('next');

		if (_this.transitionendEvent) {
			$el.css('transform', 'translate3d(' + -(opts.itemWidth * newActiveIndex) + 'px, 0px, 0px)');
		} else {
			$el.animate({'left': -(opts.itemWidth * newActiveIndex)}, opts.pageSpeed);
		}

		$.isFunction(opts.afterAnimate) && opts.afterAnimate.call(_this, newActiveIndex);
	};

	Carousel.prototype.prevPage = function() {
		var _this = this,
			$el = _this.$el,
			opts = _this.opts;

		var newActiveIndex = _this._setActivePosition('prev');

		if (_this.transitionendEvent) {
			$el.css('transform', 'translate3d(' + -(opts.itemWidth * newActiveIndex) + 'px, 0px, 0px)');
		} else {
			$el.animate({'left': -(opts.itemWidth * newActiveIndex)}, opts.pageSpeed);
		}

		$.isFunction(opts.afterAnimate) && opts.afterAnimate.call(_this, newActiveIndex);
	};

	Carousel.prototype._setActivePosition = function(type) {
		var _this = this,
			$el = _this.$el,
			opts = _this.opts;

		var $oldActive = $el.find('.' + opts.activeClass),
			$children = $el.children(),
			oldActiveIndex = $children.index($oldActive);

		var newActiveIndex;
		if (type === 'next') {
			if (oldActiveIndex + opts.showItemNum >= $children.length) {
				return oldActiveIndex;
			}

			$children.removeClass(opts.activeClass);
			if (oldActiveIndex + opts.showItemNum * 2 <= $children.length) {
				newActiveIndex = oldActiveIndex + opts.showItemNum;
			} else {
				newActiveIndex = ($children.length - oldActiveIndex) % opts.showItemNum + oldActiveIndex;
			}

		} else if (type === 'prev') {
			$children.removeClass(opts.activeClass);

			if (oldActiveIndex - opts.showItemNum >= 0) {
				newActiveIndex = oldActiveIndex - opts.showItemNum;
			} else {
				newActiveIndex = 0;
			}
		}

		$children.eq(newActiveIndex).addClass(opts.activeClass);
		return newActiveIndex;
	};

	Carousel.prototype.update = function() {
		var _this = this,
			opts = _this.opts,
			$el = _this.$el;

		var $children = $el.children(),
			itemWidth;

		itemWidth = _this.$wrap.width() / opts.showItemNum;
		opts.itemWidth = itemWidth;

		if (_this.transitionendEvent) {
			$el.css({
				'transition': 'all ' + opts.pageSpeed + 'ms' + ' ease',
				'transform': 'translate3d(0px, 0px, 0px)'
			});
		} else {
			$el.css({
				'left': 0
			});
		}

		$el.css('width', itemWidth * $children.length * 2);
		$children.css({
			'width': itemWidth
		});
		$children.eq(0).addClass(opts.activeClass);

		$.isFunction(opts.afterUpdate) && opts.afterUpdate.call(_this, $children);
	};
 
	Carousel.prototype._onWindowResize = function() {
		var _this = this,
			opts = _this.opts,
			st;

		$(window).on('resize.carousel', function() {
			var screenType = _this._getScreenType();

			if (screenType === opts.responsiveType[0]) {
				opts.showItemNum = opts.destopShowItem;
				opts.screenType = opts.responsiveType[0];

			} else if (screenType === opts.responsiveType[1]) {
				opts.showItemNum = opts.tabletShowItem;
				opts.screenType = opts.responsiveType[1];
			}

			clearTimeout(st);
			st = setTimeout(function() {
				_this.update();
			}, 200);
		});
	};

	Carousel.prototype._getScreenType = function() {
		var docWidth = $(document).width();

		if (docWidth >= this.opts.itemsTablet[1]) {
			return this.opts.responsiveType[0];
		} else if (docWidth >= this.opts.itemsTablet[0] && docWidth < this.opts.itemsTablet[1]) {
			return this.opts.responsiveType[1];
		}
	};

	function getTransitionEndEvent() {
	    var t;
	    var el = document.createElement('div');
	    var transitions = {
	        'transition':'transitionend',
	        'OTransition':'oTransitionEnd',
	        'MozTransition':'transitionend',
	        'WebkitTransition':'webkitTransitionEnd'
	    }

	    for(t in transitions){
	        if(el.style[t] !== undefined) {
	            return transitions[t];
	        }
	    }
	}

	$.fn.carousel = function (option) {
     
      this.each(function () {
      	var options = $.extend({}, Carousel.DEFAULTS, typeof option == 'object' && option);
        var $this = $(this);
        var data  = $this.data('carousel');

        if (!data) $this.data('carousel', new Carousel(this, options));
        if (typeof option == 'string') data[option]();

      });
    }

});
