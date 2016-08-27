// mountaindrawn
$(function() {
    var dataMountain = $('body').attr('data-mountain');
    var mountainList = ['bugaboo', 'tetons', 'rainier', 'glacier-peak'];
    var length = mountainList.length;
    var title = $('.title');
    var navRight = $('.nav-right');
    var navLeft = $('.nav-left');
    var currentMountain, newMountain;

    $( "body" ).on( "click", ".nav-arrow", function(e) {
    	e.preventDefault();
    	currentMountain = mountainList.indexOf($('body').attr('data-mountain'));
    	console.log('currentMountain: ' + currentMountain);

    	if(e.currentTarget.classList.contains('nav-right')) {
    		// navigate( (currentMountain <= length) ? (currentMountain + 1) : 0 );
    		newMountain = (currentMountain === length) ? 0 : (currentMountain + 1);
    		navigate(newMountain);
    		setTitle(mountainList[newMountain]);
    	} else {
    		newMountain = (currentMountain <= length) ? (currentMountain - 1) : length;
    		navigate(newMountain);
    		setTitle(mountainList[newMountain]);
    	}
    });

    function navigate(newMountain) {
    	console.log('newMountain: ' + newMountain);
		$('body').attr('data-mountain', mountainList[newMountain]);
    	console.log(currentMountain = mountainList.indexOf($('body').attr('data-mountain')));
    }

    function setTitle(title) {
    	console.log(title);
    	$('.title').html(title);
    }

    // function setMountain(mountain) {
    // 	$('body').attr('data-mountain', mountain);
    // 	return false;
    // }

});
