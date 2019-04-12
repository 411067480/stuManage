var ha = ( $('#videoBox').offset().top + $('#videoBox').height() );
//offset().top：视频距离顶部的偏移距离
//('#videoBox').height()：视频本身的高度

// $(window).scroll(function(){  

// 	if ( $(window).scrollTop() > ha + 500 ) { 
//     $('#videoBox').css('bottom','0'); 
// 	} else if ( $(window).scrollTop() < ha + 200) {  
//     $('#videoBox').removeClass('out').addClass('in');     
// 	} else {       
//   	$('#videoBox').removeClass('in').addClass('out');   
//     $('#videoBox').css('bottom','-500px');             
//   };  

// });