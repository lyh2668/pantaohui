$(function(){
	var mySwiper = new Swiper('.swiper-container',{
		prevButton:'.swiper-button-prev',
		nextButton:'.swiper-button-next',
		slidesPerView : 2,
		slidesPerGroup :2,
		autoplay:false,
		loop: true,
		spaceBetween : 10,
	});
	var tt=new TouchSlider('slider1',{
		duration:800,
		interval:5000, 
		direction:0, 
		autoplay:false, 
		align:'left', 
		mousewheel:false, 
		mouse:true, 
		fullsize:false
	});
})