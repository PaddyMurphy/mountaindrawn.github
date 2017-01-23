// eslint settings
/* global areClipPathShapesSupported, lightbox, mountainData, $, TemplateEngine, Router */

// TODO: test for clip-path support
// deliver svg illustrations instead? or png

// var mountainData = mountainData || {};
var Hammer = Hammer || {};

// mountaindrawn
$(function() {
	var navLeft = document.querySelector('.nav-left'),
		navRight = document.querySelector('.nav-right'),
		navEarth = document.querySelector('.nav-earth'),
		dataClose = document.querySelector('.data-close'),
		title = document.querySelector('.title'),
		data = document.querySelector('.data'),
		dataContent = data.querySelector('.data-content'),
		swipeElement = document.querySelector('.container'),
		mtnShortcuts = document.querySelectorAll('.earth-mtn'),
		touch = new Hammer(swipeElement),
		mountainList = Object.keys(mountainData),
		length = mountainList.length,
		nLength = length - 1, // normalized length
		currentMountain, newMountain;

	// events
	if (navLeft && navRight) {
		navLeft.addEventListener('click', navigateLeft);
		navRight.addEventListener('click', navigateRight);
		navEarth.addEventListener('click', navigateEarth);
	}

	dataClose.addEventListener('click', closeDateBox);
	data.addEventListener('click', viewMountain);

	window.addEventListener('resize', sizeshards);

	// keyboard navigation
	document.onkeydown = checkKey;

	// allow lightbox to launch
	$('.photos').on('click', 'a', function(e) {
		e.preventDefault();
	});

	// listen to swipe events...
	// TODO: fix swipe events
	touch.on('swipeleft', function(e) {
		console.log('swipeleft');
		navigateLeft(e);
	});

	touch.on('swipeRight', function(e) {
		console.log('swipeRight');
		navigateRight(e);
	});

	function initialize() {
		// populate the first mountain
		setData(document.body.dataset.mountain);
		routes();
		// earthSequence();
		sizeshards();
		// lightbox options
		lightbox.option({
			'resizeDuration': 250,
			'wrapAround': true
		});
		// test for clip-path support
		if (areClipPathShapesSupported()) {
			document.body.classList.remove('no-clip-path');
			document.body.classList.add('supports-clip-path');
			setMtnClickEvents();
		}
	}

	function navigateRight(e) {
		e.preventDefault();
		currentMountain = mountainList.indexOf($('body').attr('data-mountain'));
		// start at beginning again if at end
		newMountain = (currentMountain === nLength) ? 0 : (currentMountain + 1);
		// change mountain
		navigate(newMountain);
	}

	function navigateLeft(e) {
		e.preventDefault();
		currentMountain = mountainList.indexOf($('body').attr('data-mountain'));
		// start at end again if at beginning
		newMountain = (currentMountain === 0) ? nLength : (currentMountain - 1);
		// change mountain
		navigate(newMountain);
	}

	function navigateEarth(e) {
		e.preventDefault();
		// go back to earth
		navigate('earth');
	}

	function closeDateBox(e) {
		e.preventDefault();
		// go back to earth
		e.target.parentElement.classList.add('transparent');
		e.target.parentElement.classList.remove('animate');
	}

	function navigate(newMountain) {
		// navigate accepts string name or position in array
		// @requires mewMountain (string)
		// @optional mewMountain (number)
		var mountain = newMountain;

		if (typeof (newMountain) === 'number') {
			mountain = mountainList[newMountain];
		}

		document.body.dataset.mountain = mountain;
		setData(mountain);
		Router.navigate('#/' + mountain);
		getMountainImages(mountain);
	}

	function viewMountain(e) {
		if (document.body.dataset.mountain === 'earth') {
			navigate(e.currentTarget.dataset.mountain);
		}
	}

	function setData(newMountain) {
		// @requires mewMountain (string)
		var newMountainData = mountainData[newMountain],
			template = '<h2 class="data-title"><%this.title%></h2>' +
			'<p class="data-elevation">elevation <b><%this.elevation%></b></p>' +
			'<p class="data-prominence">prominence <%this.prominence%></p>' +
			'<p class="data-description"><%this.description%></p>';

		// only show if there is a title
		if (newMountainData.title.length) {
			// set title
			title.innerHTML = TemplateEngine('<%this.title%>', newMountainData);
			// set data
			dataContent.innerHTML = TemplateEngine(template, newMountainData);
			// show the data box
			data.classList.remove('transparent', 'animate');
			data.dataset.mountain = newMountain;
		} else {
			data.classList.add('transparent');
			title.innerHTML = '';
		}
	}

	function sizeshards() {
		// NOTE: maintain aspect ration of 5:3
		// calc height & width
		// height = new width * (original height / original width)
		// i.e. (600 / 1000) x 500 = 300
		// width = new height * (original width / original height)
		var width = document.body.offsetWidth,
			maxHeight = document.querySelector('.container').offsetHeight - 50,
			mountains = document.querySelector('.mountains'),
			w = width,
			h = Math.round(0.60 * w),
			ratio = (w / h); // 5:3

		if (h > maxHeight) {
			// console.log('maxed');
			w = maxHeight * ratio;
			h = maxHeight;
		}

		mountains.style.width = w + 'px';
		mountains.style.height = h + 'px';
	}

	// earth sequence
	function earthSequence() {
		// console.log('earthSequence');
		mtnShortcutReset();
	}

	// click mtn shortcut
	function setMtnClickEvents(e) {
		mtnShortcuts.forEach(function(mtn) {
			mtn.addEventListener('click', clickMtnShortcut);
			mtn.addEventListener('mouseover', hoverMtnShortcut);
		});
	}

	function mtnShortcutReset() {
		mtnShortcuts.forEach(function(mtn) {
			mtn.classList.remove('hover');
		});
	}

	function hoverMtnShortcut(e) {
		// show mountain info on hover
		// TODO: clear hover on return
		setData(e.target.dataset.mountain);
		// keep selected until another hover
		mtnShortcutReset();

		e.target.classList.add('hover');
		data.classList.add('animate');
	}

	function clickMtnShortcut(e) {
		// navigate to the selected mountain
		navigate(e.target.dataset.mountain);
	}

	function getMountainImages(mountain) {
		// @ requires mountain (string)
		// format: mtn-lg-bugaboo-1.jpg
		var baseURL = '../dist/images/photos/mtn-',
			docFrag = document.createDocumentFragment(),
			images = document.querySelector('.photos'),
			exclude = ['earth'],
			photo = '',
			photoHref = '',
			photoSmall = baseURL + 'sm-',
			photoLarge = baseURL + 'lg-';

		// clear photos
		images.innerHTML = '';

		// skip earth and anything else without photos
		if (!mountain || exclude.indexOf(mountain) !== -1) {
			return false;
		}

		// load 4 photos
		for (var i = 0; i < 4; i++) {
			photoHref = mountain + '-' + (i + 1) + '.jpg';
			photo = '<img src="' + photoSmall + photoHref + '"' + 'alt="' + mountain + '"' + ' />';
			// TODO: remove jquery
			$('<a/>').attr('href', photoLarge + photoHref)
				.attr('rel', 'prefetch')
				.attr('data-photohref', photoLarge + photoHref)
				.attr('data-lightbox', 'mountaindrawn')
				.appendTo(docFrag).append(photo);

			// var a = document.createElement('a');
			// a.href = photoLarge + photoHref;
			// a.rel = 'prefetch';
			// a.dataset.photohref = photoLarge + photoHref;
			// a.dataset.lightbox = 'mountaindrawn';
		} // END for photo loop

		// append images
		images.appendChild(docFrag);
	} // END getMountainImages

	function checkKey(e) {
		if (e.keyCode === '37') {
			// left arrow
			navigateLeft(e);
		} else if (e.keyCode === '39') {
			// right arrow
			navigateRight(e);
		}
	}

	function routes() {
		// change mountain
		var mainRoute = {
			path: '#/:name',
			before: function() {
				// if currentMountain is not === name then set mountain
				if (document.body.dataset.mountain !== this.params.name) {
					navigate(this.params.name);
				}
				if (document.body.dataset.mountain === 'earth') {
					// debounce
					window.setTimeout(function() {
						earthSequence();
					}, 0);
				}
				this.task.done();
			},
			on: function() {
				// check if name is list and redirect if undefined
				if (mountainList.indexOf(this.params.name) === -1) {
					navigate(1);
				}
			}
		};

		var onRouteNotFound = function(route) {
			// suppress notfound error
		};

		Router.add(mainRoute);
		Router.init(null, onRouteNotFound);
	}

	initialize();
});
