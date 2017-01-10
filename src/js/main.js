// TODO: test for clip-path support
// deliver svg illustrations instead? or png

var mountainData = mountainData || {};

// mountaindrawn
$(function() {
    var dataMountain = document.body.dataset.mountain,
        navLeft = document.querySelector('.nav-left'),
        navRight = document.querySelector('.nav-right'),
        swipeElement = document.querySelector('.container'),
        mtnShortcuts = document.querySelectorAll('.earth-mtn'),
        touch = new Hammer(swipeElement),
        supportsClipPath = false,
        mountainList = Object.keys(mountainData),
        length = mountainList.length,
        nLength = length - 1, // normalized length
        route = {},
        currentMountain, newMountain;

    // events
    if (navLeft && navRight) {
        navLeft.addEventListener('click', navigateLeft);
        navRight.addEventListener('click', navigateRight);
    }

    window.addEventListener('resize', sizeshards);
    // delay image download
    window.addEventListener('load', getFlickrImages(dataMountain));

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
        setData(dataMountain);
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
            supportsClipPath = true;
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

    function navigate(newMountain) {
        // navigate accepts string name or position in array
        // @requires mewMountain (string)
        // @optional mewMountain (number)
        var mountain = newMountain;

        if(typeof(newMountain) === 'number') {
            mountain = mountainList[newMountain];
        }

        document.body.dataset.mountain = mountain;
        setData(mountain);
        Router.navigate('#/' + mountain);
        getFlickrImages(mountain);
    }

    function setData(newMountain) {
        // @requires mewMountain (string)
        var newMountainData = mountainData[newMountain],
            title = document.querySelector('.title'),
            data = document.querySelector('.data'),
            template = '<h2 class="data-title"><%this.title%></h2>' +
            '<p class="data-elevation">elevation <b><%this.elevation%></b></p>' +
            '<p class="data-prominence">prominence <%this.prominence%></p>' +
            '<p class="data-description"><%this.description%></p>';

        // only show if there is a title
        if (newMountainData.title) {
            // set title
            title.innerHTML = TemplateEngine('<%this.title%>', newMountainData);
            // set data
            data.innerHTML = TemplateEngine(template, newMountainData);
            // show the data box
            data.classList.remove('transparent');
        } else {
            data.classList.add('transparent');
        }
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

    // earth sequence
    function earthSequence() {
        console.log('earthSequence');

        window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

        var field = document.getElementById('mountains');
        var satellite = document.querySelector('.earth-satellite');
        var bodyWidth = document.body.offsetWidth;
        var bodyHeight = document.body.offsetHeight;

        var maxX = field.clientWidth - satellite.offsetWidth;
        var maxY = field.clientHeight - satellite.offsetHeight;

        var duration = 7; // seconds
        var start = null;

        function step(timestamp) {
            var progress, x, y;
            if (start === null) {
                start = timestamp;
            }

            progress = (timestamp - start) / duration / 1000; // percent
            // do stuff

            if (progress >= 1) start = null; // reset to start position
            requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    // click mtn shortcut
    function setMtnClickEvents(e) {
        mtnShortcuts.forEach(function(mtn) {
            mtn.addEventListener('click', clickMtnShortcut);
            mtn.addEventListener('mouseover', hoverMtnShortcut);
        });
    }

    function hoverMtnShortcut(e) {
        // show mountain info on hover
        setData(e.target.dataset.mountain);
    }

    function clickMtnShortcut(e) {
        // navigate to the selected mountain
        navigate(e.target.dataset.mountain);
    }

    // flicker tag: classname + '-site'
    // i.e bugaboo-site
    function getFlickrImages(mountain) {
        // create document fragment to add all at once
        var apiKey = '6c6069e831fb567b86c7d9b75c82624f',
            baseURL = 'https://api.flickr.com/services/rest/?&method=flickr.photos.search',
            docFrag = document.createDocumentFragment(),
            images = document.querySelector('.photos'),
            flickrTag = mountain + '-site';

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

                    var photoURL = '//farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret,
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
                // TODO: load something else?
                console.log(msg);
            });
    } // END getFlickrImages

    function checkKey(e) {
        if (e.keyCode == '37') {
            // left arrow
            navigateLeft(e);
        } else if (e.keyCode == '39') {
            // right arrow
            navigateRight(e);
        }
    }

    function routes() {
        // change mountain
        var timeoutID;
        var mainRoute = {
            path: '#/:name',
            before: function() {
                // if currentMountain is not === name then set dataMountain
                if (document.body.dataset.mountain !== this.params.name) {
                    navigate(this.params.name);
                }
                if (document.body.dataset.mountain === 'earth') {
                    // timeoutID = window.setTimeout(function() {
                    //     earthSequence();
                    // }, 1000);
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

        var onRouteNotFound =  function(route) {
            // suppress notfound error
        }

        Router.add(mainRoute);
        Router.init(null, onRouteNotFound);
    }

    initialize();
});
