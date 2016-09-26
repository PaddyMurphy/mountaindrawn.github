/*!
 * Riverflow 0.1
 * by Patrick Lewis
 */

// Uses Node, AMD or browser globals to create a module.
(function (root, factory) {
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
}(this, function ($) {

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
    //this.enable();
    console.log('init');
  };

  return new Riverflow();
}));
