define([
	'jquery',
	'underscore',
	'backbone',
	'backboneD3',
	'd3'
], function($, _, Backbone, BackboneD3){
	var BackboneD3Line = BackboneD3.PlotView.extend({
		initialize: function(collection, settings) {
			BackboneD3.PlotView.prototype.initialize.apply(this, [collection, settings]);

			if (typeof(this.x_domain) == 'undefined' ||
					typeof(this.x_range) == 'undefined' ||
					typeof(this.y_domain) == 'undefined' ||
					typeof(this.y_range) == 'undefined') {
				console.log("Basic setting missing in line chart");
			}
		},
		plot: function(options){
			var w = this.w;
			var h= this.h;
			var x_domain = this.x_domain;
			var x_range = this.x_range;
			var y_domain = this.y_domain;
			var y_range = this.y_range;
			var margin = this.margin;
			var data = this.plotdata();
			var interpolation = this.settings.interpolation || "linear";
			var transitionDuration = 1000;
			var xAxisGroup = null,
					yAxisGroup = null;
      var x_type = this.x_type,
          y_type = this.y_type;

      // Set X, Y Axis type
      var x,y;
      if (this.x_type === 'time') {
        x = d3.time.scale().domain(x_domain).range(x_range);
      } else {
			  x = d3.scale.linear().domain(x_domain).range(x_range);
      }
      if (this.y_type === 'time') {
        y = d3.time.scale().domain(y_domain).range(y_range);
      } else {
			  y = d3.scale.linear().domain(y_domain).range(y_range);
      }

			// line
			var chart = null;
			var line = d3.svg.line()
			.x(function(d,i) { 
        if (x_type === 'time') {
          return x(new Date(d.x));
        } else {
          return x(d.x) 
        }
      })
			.y(function(d,i) { 
        if (y_type === 'time') {
          return y(new Date(d.y));
        } else {
          return y(d.y) 
        }
      })
			.interpolate(interpolation);

      // Start draw the chart graph, 
      // SVG layer is decide by the order of elements
			if (options.newPlot) {
        chart = this.div.append("svg:svg")
        .attr("width", w)
        .attr("height", h)
        .attr("class", "viz")
        .append("svg:g")
        .attr("transform", "translate("+margin+","+margin+")")
        .attr("class", "chart");

				chart.append("svg:path").attr("d", line(_.sortBy(data, function (d) { 
          if (x_type === 'time') {
            return (new Date(d.x));
          } else {
            return d.x;
          }
        })));

				chart.selectAll("circle")
				.data(data).enter().append("svg:circle")
				.attr("cx", function(d, i) { 
          if (x_type === 'time') {
            return x(new Date(d.x));
          } else {
            return x(d.x); 
          }
        })
				.attr("cy", function(d, i) { return y(d.y) })
				.attr("id", function(d) { return d.x + '-' + d.y })
				.attr("r", 0)
				.transition()
				.duration(this.duration)
				.attr("r", this.settings.pointsize || 3);

        chart.selectAll("text")
        .data(data).enter().append("text")
        .text(function(d, i) {
          return d.y;
        })
        .attr("x", function(d) {
          return x(new Date(d.x));
        })
        .attr("y", function(d) {
          var lift = (parseInt(d.y,10) + 2);
          return y(lift);
        })
        .attr("font-size", "11px");

			} else {
				//chart = this.div.selectAll("svg");
				chart = this.div.select('svg').select('.chart');

				chart.selectAll("path")
				// sort is needed to keep the line drawing left to right, other
				// wise goes a bit etcher sketch
				.data([_.sortBy(data, function (d) { 
          if (x_type === 'time') {
            return (new Date(d.x));
          } else {
            return d.x;
          }
        })])
				.attr("d", line);

        chart.selectAll("circle")
        .data(data).enter().insert("svg:circle", "circle")
				.attr("cx", function(d, i) { 
          if (x_type === 'time') {
            return x(new Date(d.x));
          } else {
            return x(d.x);
          }
        })
				.attr("cy", function(d, i) { return y(d.y) })
				.attr("id", function(d) { return d.x + '-' + d.y })
				.attr("r", 0)
				.transition()
				.duration(this.duration)
				.attr("r", this.settings.pointsize || 3);

        chart.selectAll("text")
        .data(data).enter().insert("svg:text", "text")
        .text(function(d, i) {
          return d.y;
        })
        .attr("x", function(d) {
          return x(new Date(d.x));
        })
        .attr("y", function(d) {
          var lift = (parseInt(d.y,10) + 2);
          return y(lift);
        })
        .attr("font-size", "11px");
			}

			// Draw axes & label
      chart = this.div.select("svg");
			if (this.x_tickSize != undefined && this.x_tickPadding != undefined && this.x_ticks != undefined && this.x_label !== false) {
        if (this.x_type === 'time') {
          xAxis = d3.svg.axis().scale(x).tickSize(this.x_tickSize).tickPadding(this.x_tickPadding).ticks(d3.time.months).tickFormat(d3.time.format("%b"));
        } else {
          xAxis = d3.svg.axis().scale(x).tickSize(this.x_tickSize).tickPadding(this.x_tickPadding).ticks(this.x_ticks);
        }
				
				xAxisGroup = chart.select('.xTick');
				if (xAxisGroup[0] == '' || xAxisGroup[0] == null){
					xAxisGroup = chart.append('svg:g')
          .attr('class', 'xTick')
          .attr('transform', "translate("+margin+","+margin+")")
          .call(xAxis); 

          chart.append('svg:rect')
          .attr("width", w)
          .attr("height", "40")
          .attr("fill", "#0f6f66")
          .attr("x", "0")
          .attr("y", "260")
          .attr("fill-opacity", "0.6");

				} else { 
					chart.select('.xTick').call(xAxis);
				}
			}
			if (this.y_tickSize != undefined && this.y_tickPadding != undefined && this.y_ticks != undefined && this.y_label !== false) {
        if (this.y_type === 'time') {
          yAxis = d3.svg.axis().scale(y).orient('left').tickSize(this.y_tickSize).tickPadding(this.y_tickPadding).ticks(d3.time.months).tickFormat(d3.time.format("%b"));
        } else {
          yAxis = d3.svg.axis().scale(y).orient('left').tickSize(this.y_tickSize).tickPadding(this.y_tickPadding).ticks(this.y_ticks);
        }
				
				yAxisGroup = chart.select('.yTick');
				if (yAxisGroup[0] == '' || yAxisGroup[0] == null){
					yAxisGroup = chart.append('svg:g')
          .attr('class', 'yTick')
          .attr('transform', "translate("+margin+","+margin+")")
          .call(yAxis); 
				} else { 
					chart.select('.yTick').call(yAxis) 
				};
			}

		},
		plotdata: function(){
			var data = [];
			this.collection.forEach(function(datapoint) {
				data.push({x:datapoint.get('x'), y:datapoint.get('y')});
			})
			// Needed for scolling plots
			if (data.length > this.size) {
				return _.last(data, this.size);
			} else {
				return data;
			}
		}
	});
	return BackboneD3Line;
});
