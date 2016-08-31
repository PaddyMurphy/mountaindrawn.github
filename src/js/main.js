var mountainData = mountainData || {};

// mountaindrawn
$(function () {
	var dataMountain = $('body').attr('data-mountain');
	var mountainList = Object.keys(mountainData);
	var length = mountainList.length;
	var nLength = length - 1; // normalized length

	var currentMountain, newMountain;

	// events
	$('.nav-arrow').on('click', navigateControls);

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
		setData(mountainList[newMountain]);
	}

	function navigate (newMountain) {
		$('body').attr('data-mountain', mountainList[newMountain]);
	}

	function setData (newMountain) {
		var newMountainData = mountainData[newMountain];
		var template = '<p class="data-elevation">elevation <%this.elevation%></p>' +
			'<p class="data-prominence">prominence <%this.prominence%></p>' +
			'<p class="data-description"><%this.description%></p>';

		// set title
		$('.title').text(TemplateEngine('<%this.title%>', newMountainData));
		// set data
		$('.data')
			.html(TemplateEngine(template, newMountainData))
			.removeClass('transparent')
			.css({'transform': 'translate(' + newMountainData.position + ')'});
	}

	initialize();
});
