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
        params: '&parameterCd=00060', // default river
        siteName: '',
        latitude: '',
        longitude: '',
        totalCount: '',
        latest: '',
        latestCfs: '',
        latestTime: '',
        mapURL: '',
        riverLocation: ''
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
    	formatted = formatted.replace(/ /g, '').trim(); // replace spaces
    	formatted = formatted.replace(/(\r\n|\n|\r)/gm, ''); // remove line breaks
    	formatted = formatted.replace(/\-(\S*)\-/g, ''); // exclude titles (i.e. --brazosriverbasin--)

    	return formatted;
    };

    Riverflow.prototype.getUsgsData = function(river) {
        riverflow.options.riverLocation = $('#selectRiver').val();

        var usgsUrl = riverflow.options.baseURL +
            riverflow.options.riverLocation +
            riverflow.options.params;

    	// fetches usgs instant data, usgs graph service
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
    	if (!riverflow.options.riverLocation) {
    	    return false;
    	}

        // display loading until the data is ready
        document.body.classList.add('loading');

        $.getJSON(usgsUrl, function(data) {})
            .done(function(data) {
                // check if any data is returned
                if (data.value.timeSeries.length === 0) {
                    // TODO:
                    // if no data is returned show a message instead of old data
                    // self.displayNoDataReturned();
                    console.log('no data...');
                } else {
                    $.each(data.value.timeSeries, function(i, item) {
                        // console.log(item.values[0].value);
                        // set the data variables for display
                        riverflow.options.siteName = item.sourceInfo.siteName;
                        riverflow.options.latitude = item.sourceInfo.geoLocation.geogLocation.latitude;
                        riverflow.options.longitude = item.sourceInfo.geoLocation.geogLocation.longitude;
                        riverflow.options.totalCount = item.values.count;
                        riverflow.options.latest = item.values[0].value.reverse()[0];
                        // set cfs value
                        riverflow.options.latestCfs = riverflow.options.latest.value;
                        // set date
                        riverflow.options.latestTime = riverflow.options.latest.dateTime;
                    }); // END $.each

                    // create map link
                    riverflow.options.mapURL = riverflow.options.baseMapURL +
                        riverflow.options.latitude +
                        ',+' +
                        riverflow.options.longitude;
                    // round decimal and show the flow conditions message
                    riverflow.displayConditions(parseInt(riverflow.options.latestCfs, 10));
                    // display the data
                    riverflow.displayData();
                } // END check if any data is returned
            })
            .fail(function(msg) {
                var statusText = msg.statusText;
                console.warn(statusText);
            })
            .always(function() {
                document.body.classList.remove('loading');
                riverflow.displayGraph();
            }); // END get json
    };

    Riverflow.prototype.displayData = function() {
        // display tiles: siteName, flowRate, mapLinkLatLong
        var flowrate = document.querySelector('.flowrate');

        // mapLinkLatLong
        var mapLinkLatLong = '<a href="' + this.options.mapURL + '">' + 'View a Map' + '</a>';
        mapLinkLatLong += 'Latitude: ' + this.options.latitude + ' &nbsp; Longitude: ' + this.options.longitude;

        //flowrate
        var flowrateText = '<h2>' + this.options.latestCfs + '<abbr id="flowCfs" title="cubic feet per second">CFS</abbr>' + '</h2>';
        flowrateText += '<div class="map-link">' + mapLinkLatLong + '</div>';

        flowrate.innerHTML = flowrateText;
    };

    Riverflow.prototype.displayConditions = function(flowRate) {
        var conditionText = '';

        // check the range of the cfs and display the appropriate message
        if (flowRate === 0) {
            conditionText = this.options.flow0;
        } else if ((flowRate > 0) && (flowRate < 50)) {
            conditionText = this.options.flow1;
        } else if ((flowRate >= 50) && (flowRate < 100)) {
            conditionText = this.options.flow2;
        } else if ((flowRate >= 100) && (flowRate < 300)) {
            conditionText = this.options.flow3;
        } else if ((flowRate >= 300) && (flowRate < 600)) {
            conditionText = this.options.flow4;
        } else if ((flowRate >= 600) && (flowRate < 2000)) {
            conditionText = this.options.flow5;
        } else if (flowRate >= 2000) {
            conditionText = this.options.flow6;
        } else {
            console.error('no flow rate conditions met. flowRate = ' + flowRate);
        }

        document.querySelector('.conditions').textContent = conditionText;
    };

    Riverflow.prototype.displayGraph = function() {
        // display a graph of the flow
        var graphURL = this.options.baseGraphURL + '&site_no=' + this.options.riverLocation + '&period=' + this.options.graphPeriod;
        var graphImage = '<img src="' + graphURL + '"id="graph" alt="USGS Water-data graph">';

        document.querySelector('.graph-wrapper').innerHTML = graphImage;
    };

    return new Riverflow();
}));
