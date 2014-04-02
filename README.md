jquery-carousel
===============

jquery插件，实现轮播效果。

### Usage Examples

HTML structure

```
<div class="carousel-wrapper">
  <ul class="carousel-list">
		<li class="carousel-item"> ... </li>
	  <li class="carousel-item"> ... </li>
	  <li class="carousel-item"> ... </li>
	  <li class="carousel-item"> ... </li>
	  <li class="carousel-item"> ... </li>
	  <li class="carousel-item"> ... </li>
	  <li class="carousel-item"> ... </li>
	  <li class="carousel-item"> ... </li>
	</ul>
	<div class="control">
		<input type="button" value="prev" class="carousel-prev-page">
		<input type="button" value="next" class="carousel-next-page">
	</div>
</div>
```

**Sample Example**

```
$('.carousel-wrapper').carousel();
```

### Options

----------------------------

#### pageSpeed

* **Type:** `number`
* **Default:** '800'

每页的切换时间.

----------------------------

#### showItemNum

* **Type:** `number` or 'string'
* **Default:** 'auto'

每页显示item个数.

----------------------------

#### carouselListSel

* **Type:** 'string'
* **Default:** '.carousel-list'

carousel list 选择器.

----------------------------

#### nextPageSel

* **Type:** 'string'
* **Default:** '.carousel-next-page'

下一页选择器.

----------------------------

#### prevPageSel

* **Type:** 'string'
* **Default:** '.carousel-prev-page'

上一页选择器.

----------------------------

#### responsive

* **Type:** 'boolean'
* **Default:** 'true'

是否启用响应式支持.

----------------------------

#### itemsTablet

* **Type:** 'array'
* **Default:** '[768, 992]'

响应式临界值.

----------------------------

#### tabletShowItem

* **Type:** 'number'
* **Default:** '4'

平板情况下显示个数.

----------------------------

#### destopShowItem

* **Type:** 'number'
* **Default:** '4'

桌面情况下显示个数.

----------------------------

#### afterInit

* **Type:** 'function'
* **Default:** '$.noop'

初始化完成后的回调函数.

----------------------------

#### afterUpdate

* **Type:** 'function'
* **Default:** '$.noop'

重新更新显示后的回调函数(比如窗口大小发生变化后).

----------------------------

#### afterAnimate

* **Type:** 'function'
* **Default:** '$.noop'

执行动画后的回调.

----------------------------
