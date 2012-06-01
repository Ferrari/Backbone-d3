define([
	'jquery',
	'underscore',
	'backbone',
	'backboneD3',
	'd3'
], function($, _, Backbone, BackboneD3){
	var BackboneD3Pie = BackboneD3.PlotView.extend({
		pieData: [],
		modelIds: [],
		layout: d3.layout.pie(),
		initialize: function(collection, settings) {
			BackboneD3.PlotView.prototype.initialize.apply(this, [collection, settings]);
			this.collection.unbind('add');
			this.collection.bind('add', this.add);
			this.collection.unbind('remove');
			this.collection.bind('remove', this.remove);

			this.m = 10;
			this.radius = settings.radius || 100;
			this.colorScale = d3.scale.category20c();
			this.arc = d3.svg.arc()
			.startAngle(function(d) { return d.startAngle; })
			.endAngle(function(d) { return d.endAngle; })
			.innerRadius(this.radius / 8)
			.outerRadius(this.radius);
		},
		addDeletedSegments: function(data) {
			_.each(this.deleted, function(d) {
				data.splice(d, 0, 0);
			});
			return data;
		},
		add: function(model) {
			this.pieData.push({
				data: model.get('value'),
				value: model.get('value'),
				startAngle: 2 * Math.PI,
				endAngle: 2 * Math.PI
			});
			this.modelIds.push(model.id);
			var data = this.addDeletedSegments(this.plotdata());
			this.div.selectAll("svg").remove();
			this.pieData = this.drawPie({pieData: this.pieData, data: data});
			this.redraw();
		},
		remove: function(model) {
			var segment = this.modelIds.indexOf(model.id);
			var data = _.map(this.pieData, function(d) { return d.value; });
			data[segment] = 0;
			this.pieData = this.updatePie({data: data});
			if (this.deleted) {
				this.deleted.push(segment);
			} else {
				this.deleted = [segment];
			}
		},
		drawPie: function(options) {
			var that = this;
			var pieData = options.pieData || this.layout(options.data);
			var svg = this.div.selectAll("svg")
												.data([options.data])
												.enter().append("svg:svg")
												.attr("width", (this.radius + this.m) * 2)
												.attr("height", (this.radius + this.m) * 2)
												.append("svg:g")
												.attr("transform", "translate(" + (this.radius + this.m) + "," + (this.radius + this.m) + ")");

			svg.selectAll("path")
				 .data(pieData)
				 .enter().append("svg:path")
				 .attr("d", this.arc)
				 .style("fill", function(d, i) {
				   return that.colorScale(i); 
				 });

			if (this.tooltip) {
				var params = {
					pieData: pieData,
					r: that.r,
					arc: that.arc
				};
				this.showTip(params);
			}
			return pieData;
		},
		updatePie: function(options) {
			var svg = this.div.selectAll("svg");
			var newPieData = this.layout(options.data);
			var that = this;
			_.each(newPieData, function(d, i, l) {
				d.oldStartAngle = that.pieData[i].startAngle;
				d.oldEndAngle = that.pieData[i].endAngle;
			});
			var pie = svg.selectAll("path");
			pie.data(newPieData);
			pie.transition()
				.duration(this.duration)
				.attrTween("d", function(a) {
					var i = d3.interpolate({
						startAngle: a.oldStartAngle, 
						endAngle: a.oldEndAngle
					}, a);
					return function(t) {
						return that.arc(i(t));
					};
				});

			if (this.tooltip) {
				var params = {
					pieData: newPieData,
					r: that.r,
					arc: that.arc
				};
				this.showTip(params);
			}
			return newPieData;
		},
		plot: function(options) {
			var data = this.addDeletedSegments(this.plotdata());
			if (options.newPlot) {
				this.pieData = this.drawPie({data: data});
				this.modelIds = this.collection.map(function(model) {
					return model.id;
				});
			} else {
				this.pieData = this.updatePie({data: data});
			}
		},
		showTip: function(options) {
			var that = this;
			var target = that.div.select("g");
			target.selectAll("text").remove();
			target.selectAll("text")
				.data(options.pieData)
				.enter().append("svg:text")
				.attr("transform", function(d) {
					d.innerRadius = 0;
					d.outerRadius = options.r;
					return "translate("+options.arc.centroid(d)+")";
				})
				.attr("text-anchor", "middle")
				.text(function(d, i) { return d.data });
		}
	})
	return BackboneD3Pie;
});
