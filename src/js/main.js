var mountainData = mountainData || {};

// mountaindrawn
$(function() {
    var dataMountain = $('body').attr('data-mountain');
    var mountainList = ['bugaboo', 'tetons', 'rainier', 'glacier-peak'];
    var length = mountainList.length;
    var nLength = length - 1; // normalized length

    var currentMountain, newMountain;

    $('body').on('click', '.nav-arrow', function(e) {
    	e.preventDefault();
    	currentMountain = mountainList.indexOf($('body').attr('data-mountain'));

    	if(e.currentTarget.classList.contains('nav-right')) {
    		// start at beginning again if at end
    		newMountain = (currentMountain === nLength) ? 0 : (currentMountain + 1);
    		navigate(newMountain);
    		setTitle(mountainList[newMountain]);
    	} else {
    		// start at end again if at beginning
    		newMountain = (currentMountain === 0) ? nLength : (currentMountain - 1);
    		navigate(newMountain);
    		setTitle(mountainList[newMountain]);
    	}
    });

    function navigate(newMountain) {
		$('body').attr('data-mountain', mountainList[newMountain]);
    }

    function setTitle(title) {
    	$('.title').text(formatTitle(title));
    }

    function formatTitle(title) {
    	return title = title.replace('-', ' ');
    }
});
