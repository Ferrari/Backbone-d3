define([
	'jquery',
	'underscore',
	'backbone',
	'backboneD3',
	'd3',
	'tipsy'
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

			var x = d3.scale.linear().domain(x_domain).range(x_range);
			var y = d3.scale.linear().domain(y_domain).range(y_range);

			// line
			var chart = null;
			var line = d3.svg.line()
			.x(function(d,i) { return x(d.x) })
			.y(function(d,i) { return y(d.y) })
			.interpolate(interpolation);

			if (options.newPlot) {
				chart = this.div.append("svg:svg")
												.attr("width", w)
												.attr("height", h)
												.attr("class", "viz")
												.append("svg:g")
												.attr("transform", "translate("+margin+","+margin+")");

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
				//chart = this.div.selectAll("svg");
				chart = this.div.select('svg').select('g');

				var circles = chart.selectAll("circle").data(data);

				circles.enter().insert("svg:circle", "circle")
				.attr("cx", function(d, i) { return x(d.x) })
				.attr("cy", function(d, i) { return y(d.y) })
				.attr("id", function(d) { return d.x + '-' + d.y })
				.attr("r", 0)
				.transition()
				.duration(this.duration)
				.attr("r", this.settings.pointsize || 3);

				chart.selectAll("path")
				// sort is needed to keep the line drawing left to right, other
				// wise goes a bit etcher sketch
				.data([_.sortBy(data, function (d) { return d.x;})])
				.attr("d", line);

			}

			// Draw axes & label
			if (this.x_tickSize != undefined && this.x_tickPadding != undefined && this.x_ticks != undefined) {
				xAxis = d3.svg.axis().scale(x).tickSize(this.x_tickSize).tickPadding(this.x_tickPadding).ticks(this.x_ticks);
				
				xAxisGroup = chart.select('.xTick');
				if (xAxisGroup[0] == '' || xAxisGroup[0] == null){
					xAxisGroup = chart.append('svg:g').attr('class', 'xTick').call(xAxis); 
				} else { 
					chart.select('.xTick').call(xAxis);
				}
			}
			if (this.y_tickSize != undefined && this.y_tickPadding != undefined && this.y_ticks != undefined) {
				yAxis = d3.svg.axis().scale(y).orient('left').tickSize(this.y_tickSize).tickPadding(this.y_tickPadding).ticks(this.y_ticks);
				
				yAxisGroup = chart.select('.yTick');
				if (yAxisGroup[0] == '' || yAxisGroup[0] == null){
					yAxisGroup = chart.append('svg:g').attr('class', 'yTick').call(yAxis); 
				} else { 
					chart.select('.yTick').call(yAxis) 
				};
			}

			// tipsy
			if (this.tooltip) {
				$('svg circle').tipsy({
					gravity: 'w',
					html: true,
					title: function(){
						var item = this.getAttribute('id').match(/(\d+)-(.*)/);
						if ((item instanceof Array) && item.length == 3) {
							return 'x:' + item[1] + '; y:' + item[2];
						} else {
							console.log("Can't get item detail");
							return "Can't get item detail";
						}
					}
				});
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
