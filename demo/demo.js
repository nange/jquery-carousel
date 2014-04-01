$(function() {
	$('.carousel-wrapper').carousel({
		showItemNum		: 4,
		afterInit: function($children) {
			var _this = this,
				$children = _this.$el.children();

			$children.on('click', function(e) {
				e.stopPropagation();
				var $this = $(this);
				var index = $children.index($this);

				_this.to(index);
				$children.animate({
					'width': _this.opts.itemWidth
				}, 150);
				$this.animate({
					'width': 2 * _this.opts.itemWidth
				}, 400);
			});

			$(document).on('click', function() {
				$children.animate({
					'width': _this.opts.itemWidth,
				});
			});

		}
	});
});