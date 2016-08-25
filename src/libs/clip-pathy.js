// modified from original https://www.smashingmagazine.com/2015/06/the-making-of-in-pieces/
// get clip-path triangle coordinates
// wrap the image to trace inside .polygon-wrap
var nodecount = nodecount || 0;
var nodescss = nodescss || '';

$('body').on('click', function (e) {
	var mouseX = e.pageX;
	var mouseY = e.pageY;
	var polygonWrap = $('.polygon-wrap');

	var shapesoffsetX = polygonWrap.offset().left;
	var shapesoffsetY = polygonWrap.offset().top;

	var polygonswidth = polygonWrap.width();
	var polygonsheight = polygonWrap.height();

	var shapesmouseX = mouseX - shapesoffsetX;
	var shapesmouseY = mouseY - shapesoffsetY;

	var mousepercentX = shapesmouseX / polygonswidth;
	var mousepercentY = shapesmouseY / polygonsheight;

	var finalmouseX = (mousepercentX) * 100 ;
	var finalmouseY = (mousepercentY) * 100 ;
	var normalisedX = parseFloat(finalmouseX).toFixed(3);
	var normalisedY = parseFloat(finalmouseY).toFixed(3);

	nodecount = nodecount+1;

	if (nodecount < 3) {
		nodescss = nodescss + normalisedX + '% ' + normalisedY + '%, ';
	} else
	if (nodecount == 3) {
		nodescss = '-webkit-clip-path: polygon( ' + nodescss;
		nodescss = nodescss + normalisedX + '% ' + normalisedY + '% );';
		alert(nodescss);
		// reset
		nodecount = 0;
		nodescss = '';
	}
});