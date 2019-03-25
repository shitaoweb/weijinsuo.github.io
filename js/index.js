$(function(){
	/*动态轮播图*/
	banner()
	/*移动端页签*/
	initMobileTab()
	/*初始化工具提示*/
  	$('[data-toggle="tooltip"]').tooltip()
})

var banner = function () {

	/* 做缓存 */
	var getData = function (callback) {
		/* 如果做了缓存直接调用回调函数，反之则发送ajax请求数据再回调函数*/
		if (window.data) {
			callback && callback(window.data)
		} else {
			$.ajax({
				type: 'get',
				url: 'js/data.json',
				dataType: 'json',
				data: '',
				success: function(data){
					window.data = data
					callback && callback(window.data)
				}
			})
		}	
	}
	
	/* 渲染页面 */
	var render = function () {
		getData(function (data) {
			var isMobile = $(window).width() < 768 ? true : false
			var pointHtml = template('pointTemplate', {list: data})
			var imageHtml = template('imageTemplate', {list: data, isMobile: isMobile})
			$('.carousel-indicators').html(pointHtml)
			$('.carousel-inner').html(imageHtml)
		})
	}
	/* 测试功能 */
	/* 监听页面尺寸发生变化 */
	$(window).on("resize", function () {
		render()
		// 通过js主动触发某个事件
	}).trigger('resize')


	var startX = 0
	var distanceX = 0
	var isMove = false
	$('.wjs_banner').on('touchstart', function (e) {
		/*orginalEvent 代表js原生事件*/
		startX = e.originalEvent.touches[0].clientX
	}).on('touchmove', function (e) {
		var moveX = e.originalEvent.touches[0].clientX
		distanceX = moveX - startX
		isMove = true
	}).on('touchend', function (e) {
		if (isMove && Math.abs(distanceX) > 50) {
			if (distanceX < 0) {
				/*左滑*/
				$('.carousel').carousel('next')
			} else {
				/*右滑*/
				$('.carousel').carousel('prev')
			}
		}
		startX = 0
		distanceX = 0
		isMove = false
	})

}

var initMobileTab = function () {
	/*1.解决换行问题*/
	/*2.修改结构，使得父容器大于子容器 .nav_tabs_parent*/
	/*3.使用iscroll组件实现区域滚动*/
	var $navTabs = $('.wjs_product .nav-tabs')
	var width = 0
	$navTabs.find('li').each(function (i, item) {
		var $currentLi = $(this)
		var liWidth = $currentLi.outerWidth(true)
		width += liWidth
	})
	$navTabs.width(width)

	/*$('nav_tabs_parent').on('touchmove', function (e) {
		e.preventDefault()
	})*/

    new IScroll($('.nav_tabs_parent')[0],{
        scrollX:true,
        scrollY:false,
        click:true
    });
}

