define([
  'jquery',
  'underscore',
  'backbone',
  'backboneD3',
  'd3'
], function($, _, Backbone, BackboneD3){
  var View = BackboneD3.PlotView.extend({
    time: d3.time.format("%X"),
    day: d3.time.format("%w"),
    week: d3.time.format("%U"),
    percent: d3.format(".1%"),
    format: d3.time.format("%H:%M"),
    m: [19, 20, 20, 19],              // top right bottom left margin
    gw: 700,                          // width
    gh: 500,                          // height
    z: 20,                            // cell size
    cellX: 10,                           // cell x-size
    cellY: 20,                           // cell y-size
    interval: 5,                      // time interval of each slot
    cellColor: "#D73027",
    title: "",
    initialize: function(collection, settings) {
      BackboneD3.PlotView.prototype.initialize.apply(this, [collection, settings]);
    },
    plot: function(options) {
      var that = this,
          w = this.gw - this.m[1] - this.m[3],
          h = this.gh - this.m[0] - this.m[2];

      var color = d3.scale
                    .quantize()
                    .domain([0, 1])
                    .range(d3.range(9));

      var today = new Date(),
          tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000),
          today_date = today.getFullYear().toString() 
                     + (today.getMonth() + 1).toString() 
                     + today.getDate().toString(),
          tomorrow_date = tomorrow.getFullYear().toString() 
                        + (tomorrow.getMonth() + 1).toString() 
                        + tomorrow.getDate().toString();

      // Initial SVG
      var svg = this.div.selectAll("svg")
                        .data(d3.range(today_date, tomorrow_date))
                        .enter().append("svg:svg")
                        .attr("width", w + this.m[1] + this.m[3])
                        .attr("height", h + this.m[0] + this.m[2])
                        .attr("class", "RdYlGn") // Colour pallet.
                        .append("svg:g")
                        .attr("transform",
                              "translate(" + (this.m[3] + (w - this.cellX * (60/this.interval)) / 2) + "," + (this.m[0] + (h - this.cellY * 24) / 2) + ")");

      // Set title if user assign attribute 'title'
      if (this.title) {
        svg.append("svg:text")
           .attr("transform", "translate(-6," + this.cellX * 3.5 + ")rotate(-90)")
           .attr("text-anchor", "middle")
           .text(String);
      }

      var rect = svg.selectAll("rect.day")
                    .data(function(d) { return d3.time.minutes(today, tomorrow, that.interval); })
                    .enter().append("svg:rect")
                    .attr("class", "day")
                    .attr("width", this.cellX)
                    .attr("height", this.cellY)
                    .attr("x", function(d) { 
                      return (((new Date(d).getMinutes()/that.interval) + 1) * that.cellX);
                      //return that.week(d) * that.z; 
                    })
                    .attr("y", function(d) { 
                      return (new Date(d).getHours() * that.cellY);
                      //return that.day(d) * that.z; 
                    });

                    /*
      svg.selectAll("path.month")
         .data(function(d) { return d3.time.months(new Date(d, 0, 1), new Date(d + 1, 0, 1)); })
         .enter().append("svg:path")
         .attr("class", "month")
         .attr("d", that.monthPath);
         */

      var data = d3.nest()
                   .key(function(d) { return d.slot; })
                   .rollup(function(d) { return d[0].display; })
                   .map(this.plotdata());

      rect.attr("class", function(d) {
        return "day q" + color(data[that.format(d)]) + "-9";
      })
      .attr("style", function(d) {
        return (data[that.format(d)]) ? "fill:" + that.cellColor : '';
      })
      .append("svg:title")
      .text(function(d) {
        return (d = that.format(d)) + (d in data ? ": " + data[d] : "");
      });
    },
    plotdata: function(){
      var data = [];
      this.collection.forEach(function(datapoint) {
        data.push({slot:datapoint.get('slot'), display:datapoint.get('display')});
      });
      return data;
    }
    /*
    monthPath: function(t0) {
      var t1 = new Date(t0.getUTCFullYear(), t0.getUTCMonth() + 1, 0),
      d0 = +this.day(t0), w0 = +this.week(t0),
      d1 = +this.day(t1), w1 = +this.week(t1);
      return "M" + (w0 + 1) * this.z + "," + d0 * this.z
      + "H" + w0 * this.z + "V" + 7 * this.z
      + "H" + w1 * this.z + "V" + (d1 + 1) * this.z
      + "H" + (w1 + 1) * this.z + "V" + 0
      + "H" + (w0 + 1) * this.z + "Z";
    }
    */
  });

  var Model = Backbone.Model.extend({
    initialize: function(data) {
      this.set({
        slot: data.slot,
        count: data.count,
        display: data.display
      });
    }
  });

  var Collection = BackboneD3.PlotCollection.extend({
    model : Model,
		success: function( result, foo ) {
      var models = [];
      _.each( result, function( row ) {
       models.push( new Model(row.value) );
      });
      if ( models.length == 0 ) { models = null }
      return models;
    },
    error: function(result, resp) {
      console.log('error');
      console.log(result);
      console.log(rep);
    }
  });

  return {
    model: Model,
    collection: Collection,
    view: View
  }
});
