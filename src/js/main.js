// mountaindrawn
$(function() {
    var dataMountain = $('body').attr('data-mountain');
    var mountainList = ['bugaboo', 'tetons', 'rainier', 'glacier-peak'];
    var length = mountainList.length;

    var currentMountain, newMountain;

    $( "body" ).on( "click", ".nav-arrow", function(e) {
    	e.preventDefault();
    	currentMountain = mountainList.indexOf($('body').attr('data-mountain'));

    	if(e.currentTarget.classList.contains('nav-right')) {
    		// start at beginning again
    		newMountain = (currentMountain === (length - 1)) ? 0 : (currentMountain + 1);
    		navigate(newMountain);
    		setTitle(mountainList[newMountain]);
    	} else {
    		// start at end again
    		newMountain = (currentMountain === 0) ? (length - 1) : (currentMountain - 1);
    		navigate(newMountain);
    		setTitle(mountainList[newMountain]);
    	}
    });

    function navigate(newMountain) {
		$('body').attr('data-mountain', mountainList[newMountain]);

    	console.log(currentMountain = mountainList.indexOf($('body').attr('data-mountain')));
    }

    function setTitle(title) {
    	$('.title').text(formatTitle(title));
    }

    function formatTitle(title) {
    	return title = title.replace('-', ' ');
    }

    // function setMountain(mountain) {
    // TODO: works once?
    // 	$('body').attr('data-mountain', mountain);
    // 	return false;
    // }

});
