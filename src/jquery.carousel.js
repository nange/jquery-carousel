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
			$parent = $el.parent(),
			itemWidth;

		opts.showItemNum !== 'auto' || 
			(opts.showItemNum = Math.round($parent.width() / $children.eq(0).width()));

		itemWidth = $el.parent().width() / opts.showItemNum;
		opts.itemWidth = itemWidth;
		$el.css({
			'width': itemWidth * $children.length * 2,
			'display': 'block',
			'transition': 'all ' + opts.pageSpeed + 'ms' + ' ease',
			'transform': 'translate3d(0px, 0px, 0px)'
		});
		$el.children().css({
			'width': itemWidth
		});

		if ($children.length > opts.showItemNum) {
			$children.eq(opts.showItemNum).addClass(opts.nextCarousel);
		}

		_this.$wrap.find(opts.nextPageSel).on('click.carousel', $.proxy(_this.nextPage, _this));
		_this.$wrap.find(opts.prevPageSel).on('click.carousel', $.proxy(_this.prevPage, _this));

		opts.initCallback.call(_this, $children);
	};

	Carousel.prototype.to = function(index) {
		var _this = this,
			$el = _this.$el,
			opts = _this.opts;

		$el.css('transform', 'translate3d(' + -(opts.itemWidth * index) + 'px, 0px, 0px)');

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
		$el.css('transform', 'translate3d(' + -(opts.itemWidth * nextIndex) + 'px, 0px, 0px)');

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
		$el.css('transform', 'translate3d(' + -(opts.itemWidth * prevIndex) + 'px, 0px, 0px)');

		if (prevIndex >= opts.showItemNum ) {
			$prevCarousel.removeClass(opts.prevCarousel);
			$children.eq(prevIndex - opts.showItemNum).addClass(opts.prevCarousel);
		} else {
			$children.eq(0).addClass(opts.prevCarousel);
		}

		$children.removeClass(opts.nextCarousel);
		$children.eq(prevIndex + opts.showItemNum).addClass(opts.nextCarousel)

	};


	$.fn.carousel = function (option) {
      var options = $.extend({}, Carousel.DEFAULTS, typeof option == 'object' && option);
    
      return this.each(function () {
        var $this = $(this);
        var data  = $this.data('carousel');

        if (!data) $this.data('carousel', new Carousel(this, options));

      });
    }

});
