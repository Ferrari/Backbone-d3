define([
	'jquery',
	'underscore',
	'backbone',
	'backboneD3',
	'd3',
], function($, _, Backbone, BackboneD3){
	var BackboneD3Line = BackboneD3.PlotView.extend({
		initialize: function(collection, settings) {
			BackboneD3.PlotView.prototype.initialize.apply(this, [collection, settings]);

			this.w = settings.w || 200;
			this.h = settings.h || 200;
			this.size = settings.s || 12;
			console.log(settings);
			this.x_domain = (settings.x_domain instanceof Array) ? settings.x_domain : [0, 1];
			this.x_range = (settings.x_range instanceof Array) ? settings.x_range : [0, this.w];
			this.y_domain = (settings.y_domain instanceof Array) ? settings.y_domain : [0, 1];
			this.y_range = (settings.y_range instanceof Array) ? settings.y_range : [0, this.h];

		},
		plot: function(options){
			var w = this.w;
			var h = this.h;
			var x_domain = this.x_domain;
			var x_range = this.x_range;
			var y_domain = this.y_domain;
			var y_range = this.y_range;
			console.log(x_domain + "|" + x_range + "|" + y_domain + "|" + y_range);
			var data = this.plotdata();
			var interpolation = this.settings.interpolation || "linear";
			/*
			var x = d3.scale.linear()
			.domain([0, this.size])
			.range([10, w -10]);


			var y = d3.scale.linear()
			.domain([-1, 1])
			.rangeRound([10, h - 10]);
			*/
			var x = d3.scale.linear().domain(x_domain).range(x_range);
			var y = d3.scale.linear().domain(y_domain).range(y_range);

			// Draw axes & label

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

				chart.selectAll("path")
				// sort is needed to keep the line drawing left to right, other
				// wise goes a bit etcher sketch
				.data([_.sortBy(data, function (d) { return d.x;})])
				.attr("d", line);

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
