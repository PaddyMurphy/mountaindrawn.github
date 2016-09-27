/*!
 * Riverflow 0.1
 * by Patrick Lewis
 */

// Uses Node, AMD or browser globals to create a module.
(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jquery'));
    } else {
        // Browser globals (root is window)
        root.riverflow = factory(root.jQuery);
    }
}(this, function($) {

    function Riverflow(options) {
        this.init();
        // options
        this.options = $.extend({}, this.constructor.defaults);
        this.option(options);
    }

    Riverflow.defaults = {
        apiKey: '6c6069e831fb567b86c7d9b75c82624f',
        baseGraphURL: 'http://waterdata.usgs.gov/nwisweb/graph?agency_cd=USGS&parm_cd=00060',
        baseMapURL: 'http://maps.google.com/?q=',
        baseURL: 'http://waterservices.usgs.gov/nwis/iv/?format=json&period=P7D&sites=',
        flow0: 'Sorry but this river is bone dry. Try a spring fed river like the San Marcos til we get more rain.',
        flow1: 'The river is pretty much just a trickle right. Not much good for floating at the moment but a good rain should bring it up',
        flow2: 'It\'s barely moving but it should be floatable in kayaks or tubes. Be prepared to drag bottom in spots though.',
        flow3: 'This is a pretty leisurely flow but still fun. You shouldn\'t have any problems scraping bottom in canoes at this level',
        flow4: 'Now we\'re talking! The river is flowing pretty good but not too dangerous. If the graph shows a sharp increase over the past week it may still be rising.',
        flow5: 'The flow is moving now! Unless this is a large volume river like the Colorado or Rio Grande you can expect some really fast moving water.',
        flow6: 'DANGER! Possible death awaits! Unless this is a large volume river like the Colorado you may drown. Check with a local outfitter for more details on conditions before heading out.',
        graphPeriod: 7,
        params: '&parameterCd=00060' // default river
    };

    Riverflow.prototype.option = function(options) {
        $.extend(this.options, options);
    };

    Riverflow.prototype.init = function() {
        this.events();
    };

    Riverflow.prototype.events = function() {
    	$('#formRiver').on('change', this.getUsgsData);
    };

    Riverflow.prototype.formatRiverName = function(name) {
    	// parse the value (San Marcos River : Luling)
    	// to this (sanmarcos:luling)
    	var formatted = name;
    	formatted = formatted.toLowerCase();
    	formatted = formatted.replace(/ /g, "").trim(); // replace spaces
    	formatted = formatted.replace(/(\r\n|\n|\r)/gm, ""); // remove line breaks
    	formatted = formatted.replace(/\-(\S*)\-/g, ""); // exclude titles (i.e. --brazosriverbasin--)
        // console.log(formatted);

    	return formatted;
    };

    Riverflow.prototype.getUsgsData = function(river) {
    	var self = this;
        var siteName, latitude, longitude, totalCount,
        latestCfs, latestTime, mapURL;

    	// fetches usgs instant data, usgs graph service, and flickr
    	// check if routed here
    	if (typeof (river) === 'string') {
    	    var options = document.querySelectorAll('#selectRiver option');
    	    // set the selected option
    	    options.forEach(function(option, i) {
    	        if (riverflow.formatRiverName(option.textContent) === river) {
    	            option.selected = 'selected';
    	        }
    	    });

    	} else {
    	    // selected so update url
    	    var selected = document.querySelector('#selectRiver option:checked').textContent;
            // TODO: why is the riverflow constructor needed?
    	    selected = riverflow.formatRiverName(selected);
    	    // TODO: update the url but do not trigger route
    	    // app_router.navigate(selected, { trigger: false, replace: true });
    	}

    	// make sure the select option has a value
    	if (!$('#selectRiver').val()) {
    	    return false;
    	}

        // remove all existing data first
        // $(flowApp.config.conditions).empty();

        // display loading until the data is ready
        // flowApp.config.loading.classList.remove("hidden");
        // flowApp.config.bodyTag.classList.add("loading");

        var riverLocation = $('#selectRiver').val();

        var pipeURL = riverflow.options.baseURL +
            riverLocation +
            riverflow.options.params;

        console.log(pipeURL);

        $.getJSON(pipeURL, function(data) {})
            .done(function(data) {
                // check if any data is returned
                if (data.value.timeSeries.length === 0) {
                    // TODO:
                    // if no data is returned show a message instead of old data
                    // self.displayNoDataReturned();
                    console.log('no data...');
                } else {
                    $.each(data.value.timeSeries, function(i, item) {
                        // set the data variables for display
                        siteName = item.sourceInfo.siteName;
                        latitude = item.sourceInfo.geoLocation.geogLocation.latitude;
                        longitude = item.sourceInfo.geoLocation.geogLocation.longitude;
                        totalCount = item.values.count;
                        // set cfs value
                        latestCfs = item.values[0].value[0].value;
                        // set date
                        latestTime = item.values[0].value[0].dateTime;
                        // git array of values to chart
                        // NOTE: 7D data returns 2004 datapoints
                        //       see api to reduce # or filter out nth
                        // var graphData = item.values[0].value;
                        // self.displayChart(item.values[0].value);
                        // console.log(item.values[0].value);
                        console.log(latestCfs);
                    }); // END $.each

                    // get todays date and trim hours
                    var todaysDate = new Date();
                    todaysDate = todaysDate.toDateString();

                    // create latest cfs date object
                    var d = new Date(latestTime);
                    var timeDate = d.toDateString();
                    var timeHours = d.toLocaleTimeString();

                    // compare todays date with the latest returned time
                    // TODO: this logic is flawed, should return time and format from localStorage
                    // if (todaysDate === timeDate) {
                    //     timeDate = 'Today';
                    // }

                    latestTime = timeDate + ' at ' + timeHours;

                    // save the name,cfs and display
                    var recentInfo = '<div class="recentValue">' + latestCfs +
                        '<abbr class="cfs" title="cubic feet per second">cfs</abbr> <span class="name">' +
                        siteName + '</span><span class="latestTime"> ' +
                        latestTime + '</span>' + '</div>';

                    // TODO: latest info is disabled
                    //       fix ux and storage issue (does not delete)
                    // flowApp.saveLatestCfs(recentInfo);

                    // create map link
                    mapURL = riverflow.options.baseMapURL + latitude + ',+' + longitude;
                    // TODO: round decimal and show the flow conditions message
                    // self.displayConditions(parseInt(self.latestCfs, 10));
                    // TODO: display the data
                    // self.displayData();

                } // END check if any data is returned

                // debug - show all data
                console.log(data.value);
                document.getElementsByTagName('body')[0].className = '';

                // flowApp.config.loading.classList.add('hidden');

            })
            .fail(function(msg) {
                var statusText = msg.statusText;
                console.warn(statusText);
            }); // END get json

        return false; // prevent click
    };

    return new Riverflow();
}));
