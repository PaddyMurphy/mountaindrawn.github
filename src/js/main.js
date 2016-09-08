var mountainData = mountainData || {};

// mountaindrawn
$(function() {
    var dataMountain = document.body.dataset.mountain,
        navLeft = document.querySelector('.nav-left'),
        navRight = document.querySelector('.nav-right'),
        mountainList = Object.keys(mountainData),
        length = mountainList.length,
        nLength = length - 1; // normalized length

    var currentMountain, newMountain;

    // events
    navLeft.addEventListener('click', navigateControls);
    navRight.addEventListener('click', navigateControls);
    window.addEventListener('resize', sizeshards);
    // allow lightbox to launch
    $('.photos').on('click', 'a', function(e) {
    	e.preventDefault();
    });

    function initialize() {
        // populate the first mountain
        setData(dataMountain);
        sizeshards();
        // lightbox options
        lightbox.option({
            'resizeDuration': 250,
            'wrapAround': true
        });
        // delay image download
        window.setTimeout(function() {
        	getFlickrImages(dataMountain);
        }, 1000);
    }

    // arrow navigation
    function navigateControls(e) {
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
        getFlickrImages(mountainList[newMountain]);
    }

    function navigate(newMountain) {
        document.body.dataset.mountain = mountainList[newMountain];
    }

    function setData(newMountain) {
        var newMountainData = mountainData[newMountain],
            title = document.querySelector('.title'),
            data = document.querySelector('.data'),
            template = '<h2 class="data-title"><%this.title%></h2>' +
            '<p class="data-elevation">elevation <b><%this.elevation%></b></p>' +
            '<p class="data-prominence">prominence <%this.prominence%></p>' +
            '<p class="data-description"><%this.description%></p>';

        // set title
        title.innerHTML = TemplateEngine('<%this.title%>', newMountainData);
        // set data
        data.innerHTML = TemplateEngine(template, newMountainData);
        data.classList.remove('transparent');
    }

    function sizeshards() {
        // NOTE: maintain aspect ration of 5:3
        // calc height & width
        // height = new width * (original height / original width)
        // i.e. (600 / 1000) x 500 = 300
        // width = new height * (original width / original height)
        var width = document.body.offsetWidth,
            height = document.body.offsetHeight,
            maxHeight = document.querySelector('.container').offsetHeight - 50,
            mountains = document.querySelector('.mountains'),
            w = width,
            h = Math.round(.60 * w),
            ratio = (w / h); // 5:3

        if (h > maxHeight) {
            // console.log('maxed');
            w = maxHeight * ratio;
            h = maxHeight;
        }

        mountains.style.width = w + 'px';
        mountains.style.height = h + 'px';
    }

    // flicker tag: classname + '-site'
    // i.e bugaboo-site
    function getFlickrImages(mountain) {
        // create document fragment to add all at once
        var apiKey = '6c6069e831fb567b86c7d9b75c82624f',
            baseURL = 'https://api.flickr.com/services/rest/?&method=flickr.photos.search',
            docFrag = document.createDocumentFragment(),
            images = document.querySelector('.photos'),
            flickrTag =  mountain + '-site';

			console.log(flickrTag);

        // get the new ones
        $.getJSON(baseURL +
            '&api_key=' + apiKey +
            '&tags=' + flickrTag +
            '&per_page=' + 6 +
            '&tag_mode=' + 'all' +
            '&sort=' + 'interestingness-asc' +
            '&format=' + 'json' +
            '&jsoncallback=' + '?',
            function(data) {})
        	.done(function(data) {
	            //loop through the results with the following function
	            $.each(data.photos.photo, function(i, item) {

	                var photoURL = 'http://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret,
	                square = photoURL + '_q.jpg', // q = 150sq
	                photoLarge = photoURL + '_b.jpg', // b = 1024 on longest side,
	                // set the photo href for larger views
	                photoHref = '//www.flickr.com/photos/' + item.owner + '/' + item.id,
	                photo = '<img src="' + square + '" />';
	                // add photo to the docFrag
	                $("<a/>").attr('href', photoLarge)
	                    .attr('rel', 'prefetch')
	                    .attr('data-photohref', photoHref)
	                    .attr('data-lightbox', 'mountaindrawn')
	                    .appendTo(docFrag).append(photo);

	            }); // END $.each

	            // append once
	            // TODO: why does this insert [object DocumentFragment]
	            //flowApp.config.images.innerHTML = docFrag;
	            $(images).html(docFrag);

	        })
	        .fail(function(msg) {
	            console.log(msg);
	        });
	    }

    initialize();
});
