// mountaindrawn
$(function() {
    var body = $('body');
    var mountainList = ['bugaboo', 'tetons', 'glacier-peak', 'rainier'];
    var length = mountainList.length;
    var title = $('.title');
    var navRight = $('.nav-right');
    var navLeft = $('.nav-left');
    var currentMountain;

    navLeft.on('click', navigateLeft);
    navRight.on('click', navigateRight);


    function navigateLeft(e) {
    	e.preventDefault();
    	console.log(e.currentTarget);
    	//currentMountain();
    	body.attr('class', 'bugaboo');
    }

    function navigateRight(e) {
    	e.preventDefault();
    	//currentMountain();
    	body.attr('class', 'tetons');
    }

    function currentMountain() {
    	currentMountain = mountainList.indexOf(body.attr('class'));
    	// if (currentMountain > length) {
    	// 	currentMountain = 0;
    	// } else {
    	// 	currentMountain;
    	// }

    	console.log(currentMountain);
    	return currentMountain;
    }

});
