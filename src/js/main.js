var mountainData = mountainData || {};

// mountaindrawn
$(function () {
	var dataMountain = $('body').attr('data-mountain');
	var mountainList = ['bugaboo', 'tetons', 'blanca-traverse', 'rainier', 'glacier-peak'];
	var length = mountainList.length;
	var nLength = length - 1; // normalized length

	var currentMountain, newMountain;

	// events
	$('body').on('click', '.nav-arrow', navigateControls);

	function initialize () {
		// populate the first mountain
		setData(dataMountain);
	}

	// arrow navigation
	function navigateControls (e) {
		e.preventDefault();
		currentMountain = mountainList.indexOf($('body').attr('data-mountain'));

		if (e.currentTarget.classList.contains('nav-right')) {
			// start at beginning again if at end
			newMountain = (currentMountain === nLength) ? 0 : (currentMountain + 1);
		} else {
			// start at end again if at beginning
			newMountain = (currentMountain === 0) ? nLength : (currentMountain - 1);
		}
		// change mountain
		navigate(newMountain);
		// setTitle(mountainList[newMountain]);
		setData(mountainList[newMountain]);
	}

	function navigate (newMountain) {
		$('body').attr('data-mountain', mountainList[newMountain]);
	}

	function setData (newMountain) {
		var newMountainData = mountainData[newMountain];
		var template = '<p>Elevation: <%this.elevation%></p>' +
			'<p><%this.description%></p>';

		console.log(newMountainData.position);
		// set title
		$('.title').text(TemplateEngine('<%this.title%>', newMountainData));
		// set data
		$('.data')
			.html(TemplateEngine(template, newMountainData))
			.css('transform', 'translate(' + newMountainData.position + ')');
	}

	initialize();
});
