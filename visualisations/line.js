Backbone.d3.Canned['Line'] = {
  View: Backbone.d3.PlotView.extend({
    initialize: function(collection, settings) {
      Backbone.d3.PlotView.prototype.initialize.apply(this, [collection, settings]);

			this.x_domain = (settings.x_domain instanceof Array) ? settings.x_domain : [0, 20];
			this.x_range = (settings.x_range instanceof Array) ? settings.x_range : [10, 190];
			this.y_domain = (settings.y_domain instanceof Array) ? settings.y_domain : [-1, 1];
			this.y_range = (settings.y_range instanceof Array) ? settings.y_range : [10, 190];
    },
    plot: function(options){
			var x_domain = this.x_domain,
					x_range = this.x_range,
					y_domain = this.y_domain,
					y_range = this.y_range;

      var data = this.plotdata();
      var interpolation = this.settings.interpolation || "linear";
			console.log(x_domain + "|" + x_range);
			var x = d3.scale.linear().domain(x_domain).range(x_range);
			var y = d3.scale.linear().domain(y_domain).range(y_range);

      // line
      var chart = null;
      var line = d3.svg.line()
        .x(function(d,i) { return x(d.x) })
        .y(function(d,i) { return y(d.y) })
        .interpolate(interpolation);

      if (options.newPlot) {
        chart = this.div.append("svg:svg");
        chart.selectAll("circle")
          .data(data).enter().append("svg:circle")
          .attr("cx", function(d, i) { return x(d.x) })
          .attr("cy", function(d, i) { return y(d.y) })
          .attr("id", function(d) { return d.x + '-' + d.y })
          .attr("r", 0)
        .transition()
    		  .duration(this.duration)
    		    .attr("r", this.settings.pointsize || 3);

        chart.append("svg:path").attr("d", line(_.sortBy(data, function (d) { return d.x;})));

      } else {
        chart = this.div.selectAll("svg");
        var circles = chart.selectAll("circle").data(data);

        circles.enter().insert("svg:circle", "circle")
            .attr("cx", function(d, i) { return x(d.x) })
            .attr("cy", function(d, i) { return y(d.y) })
            .attr("id", function(d) { return d.x + '-' + d.y })
            .attr("r", 0)
          .transition()
  		      .duration(this.duration)
  		        .attr("r", this.settings.pointsize || 3);

        // TODO: transition to grown the line between points
        chart.selectAll("path")
          // sort is needed to keep the line drawing left to right, other
          // wise goes a bit etcher sketch
          .data([_.sortBy(data, function (d) { return d.x;})])
          .attr("d", line);

      }
      // TODO: label points
      // TODO: different shapes
      // TODO: support multiple datasets in one plot

    },
    plotdata: function(){
      var data = [];
      this.collection.forEach(function(datapoint) {
          data.push({x:datapoint.get('x'), y:datapoint.get('y')});
        }
      )
      // Needed for scolling plots
      if (data.length > this.size) {
        return _.last(data, this.size);
      } else {
        return data;
      }
    }
  })
}
