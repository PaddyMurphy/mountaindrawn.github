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
	$(window).on('resize', sizeshards);

	function initialize () {
		// populate the first mountain
		setData(dataMountain);
		sizeshards();
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
			.removeClass('transparent');
	}

	function sizeshards() {
		// NOTE: maintain aspect ration of 5:3
		// calc height & width
		// height = new width * (original height / original width)
		// i.e. (600 / 1000) x 500 = 300
		// width = new height * (original width / original height)

		var width = document.body.offsetWidth,
			height = document.body.offsetHeight,
			maxHeight = document.querySelector('.container').offsetHeight - 50;
			w = width,
		    h = Math.round(.60 * w),
		    ratio = (w / h); // 5:3

		console.log('h: ' + h);
		console.log('max height: ' + maxHeight);

		if(h > maxHeight) {
			console.log('maxed');
			w = maxHeight * ratio;
			h = maxHeight;
		}

	    $('.mountains').css({
            width: w,
            height: h
	    });
	}

	initialize();
});
