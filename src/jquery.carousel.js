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
		nextCarousel	: 'next-carousel',
		prevCarousel	: 'prev-carousel',
		carouselListSel : '.carousel-list',
		nextPageSel		: '.carousel-next-page',
		prevPageSel		: '.carousel-prev-page',
		initCallback	: $.noop
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

		$el.children().css({
			'width': itemWidth
		});

		if ($children.length > opts.showItemNum) {
			$children.eq(opts.showItemNum).addClass(opts.nextCarousel);
		}

		_this.$wrap.find(opts.nextPageSel).on('click.carousel', $.proxy(_this.nextPage, _this));
		_this.$wrap.find(opts.prevPageSel).on('click.carousel', $.proxy(_this.prevPage, _this));

		$.isFunction(opts.initCallback) && opts.initCallback.call(_this, $children);
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

		var $children = $el.children();
		$children.removeClass(opts.prevCarousel)
				 .removeClass(opts.nextCarousel);

		if (index >= opts.showItemNum ) {
			$children.eq(index - opts.showItemNum).addClass(opts.prevCarousel);
		} else {
			$children.eq(0).addClass(opts.prevCarousel);
		}

		if (index + opts.showItemNum <= $children.length) {
			$children.eq(index + opts.showItemNum).addClass(opts.nextCarousel);
		}

	};

	Carousel.prototype.nextPage = function() {
		var _this = this,
			$el = _this.$el,
			opts = _this.opts;

		var $nextCarousel = $el.find('.' + opts.nextCarousel),
			$children = $el.children();

		if (!$nextCarousel.length) return;

		var nextIndex = $children.index($nextCarousel);
		if (_this.transitionendEvent) {
			$el.css('transform', 'translate3d(' + -(opts.itemWidth * nextIndex) + 'px, 0px, 0px)');
		} else {
			$el.animate({'left': -(opts.itemWidth * nextIndex)}, opts.pageSpeed);
		}

		if (nextIndex + opts.showItemNum <= $children.length) {
			$nextCarousel.removeClass(opts.nextCarousel);
			$children.eq(nextIndex + opts.showItemNum).addClass(opts.nextCarousel);
		}

		$children.removeClass(opts.prevCarousel);
		$children.eq(nextIndex - opts.showItemNum).addClass(opts.prevCarousel)

	};

	Carousel.prototype.prevPage = function() {
		var _this = this,
			$el = _this.$el,
			opts = _this.opts;

		var $prevCarousel = $el.find('.' + opts.prevCarousel),
			$children = $el.children();

		if (!$prevCarousel.length) return;

		var prevIndex = $children.index($prevCarousel);
		if (_this.transitionendEvent) {
			$el.css('transform', 'translate3d(' + -(opts.itemWidth * prevIndex) + 'px, 0px, 0px)');
		} else {
			$el.animate({'left': -(opts.itemWidth * prevIndex)}, opts.pageSpeed);
		}

		if (prevIndex >= opts.showItemNum ) {
			$prevCarousel.removeClass(opts.prevCarousel);
			$children.eq(prevIndex - opts.showItemNum).addClass(opts.prevCarousel);
		} else {
			$children.eq(0).addClass(opts.prevCarousel);
		}

		$children.removeClass(opts.nextCarousel);
		$children.eq(prevIndex + opts.showItemNum).addClass(opts.nextCarousel)

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
      var options = $.extend({}, Carousel.DEFAULTS, typeof option == 'object' && option);
    
      return this.each(function () {
        var $this = $(this);
        var data  = $this.data('carousel');

        if (!data) $this.data('carousel', new Carousel(this, options));

      });
    }

});
