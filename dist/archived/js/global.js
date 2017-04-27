$(document).ready(function() {
	
	$('body').removeClass('nojs').addClass('js');
	
	// easing methods
	jQuery.extend( jQuery.easing,
{
	easeOutElastic: function (x, t, b, c, d) {
		var s=1.70158;var p=0;var a=c;
		if (t==0) return b;  if ((t/=d)==1) return b+c;  if (!p) p=d*.3;
		if (a < Math.abs(c)) { a=c; var s=p/4; }
		else var s = p/(2*Math.PI) * Math.asin (c/a);
		return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
	}
});

	
	// animate the clouds
	var cloud = $("#cloud");
	var cloudBehind = $("#cloud-behind");
						   
	$(cloud).animate({right: "+=1950px"}, 80000);
	$(cloudBehind).animate({right: "+=2150px"}, 100000);
	
	// animate top hand with card
	var handOfMe = $('#top-personal-site');
	
	function animateHand () {
		$(handOfMe).animate({top: "0"}, 900, 'easeOutElastic');
	}
	
	var t = setTimeout (animateHand, 2000);

	
});