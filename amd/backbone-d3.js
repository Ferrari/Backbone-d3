define([
	'jquery', 
	'underscore',
	'backbone',
	'd3'
], function($, _, Backbone){
	var BackboneD3 = {
		PlotView: Backbone.View.extend({
			initialize: function(collection, settings) {
				_.bindAll(this);
				this.collection = collection;
				this.collection.bind('change', this.redraw);
				this.collection.bind('add', this.redraw);
				this.collection.bind('remove', this.redraw);
				this.collection.bind('reset', this.draw);

				this.settings = settings || {};
				var divname = this.settings.div || "#plot";
				this.div = d3.select(divname)
				// time taken in transitions
				this.duration = this.settings.duration || 500;
				this.maxDataPointsForDots = this.settings.maxDataPointsForDots || 50;
				this.transitionDuration = this.settings.transitionDuration || 1000;
				/*
				this.collection.fetch({
					success: function(points, resp){
						console.log(points);
						this.max = d3.max(_.max(points));
						console.log(this.max);
					},
					error: function(points, resp){
						console.log("Something wrong to fetch collection data");
					}
				});
				*/

				/* Chart display settings */
				this.w = (typeof(this.settings.w) == 'number') ? this.settings.w : 800;
				this.h = (typeof(this.settings.h) == 'number') ? this.settings.h : 600;
				this.margin = (typeof(this.settings.margin) == 'number') ? this.settings.margin : 0;

				// Chart size control
				this.x_domain = (this.settings.x_domain instanceof Array) ? this.settings.x_domain : [0, 1];
				this.y_domain = (this.settings.y_domain instanceof Array) ? this.settings.y_domain : [0, 1];
				this.x_range = (this.settings.x_range instanceof Array) ? this.settings.x_range : [0, this.w - this.margin * 2];
				this.y_range = (this.settings.y_range instanceof Array) ? this.settings.y_range : [this.h - this.margin * 2, 0];

				// Chart x-axis & y-axis info
				this.x_tickSize = (typeof(this.settings.x_tickSize) == 'number') ? this.settings.x_tickSize : (this.h - this.margin * 2);
				this.y_tickSize = (typeof(this.settings.y_tickSize) == 'number') ? this.settings.y_tickSize : (-this.w + this.margin * 2);

				this.x_tickPadding = (typeof(this.settings.x_tickPadding) == 'number') ? this.settings.x_tickPadding : 5;
				this.y_tickPadding = (typeof(this.settings.y_tickPadding) == 'number') ? this.settings.y_tickPadding : 5;

				this.x_ticks = (typeof(this.settings.x_ticks) == 'number') ? this.settings.x_ticks : 1;
				this.y_ticks = (typeof(this.settings.y_ticks) == 'number') ? this.settings.y_ticks : 1;

				console.log(this.settings);
			},
			plotdata: function() {
				var data = [];
				this.collection.forEach(function(datapoint) {
					data.push(datapoint.get('value'));
				})
				return data;
			},
			draw: function() {
				// Draw the plot
				if (this.plotdata().length > 0) {
					this.plot({
						newPlot: true
					});
					this.caption();
				}
			},
			redraw: function() {
				// transition the plot
				this.plot({
					newPlot: false
				});
			},
			plot: function() {
				if (console){	console.log("Not implemented in base class"); }
				return;
			},
			caption: function(){
				if (this.settings.caption || this.collection.caption){
					var caption = this.settings.caption || this.collection.caption;
					if (typeof Markdown == "object") {
						try {
							var converter = Markdown.getSanitizingConverter();
							caption = converter.makeHtml(caption);
						} catch (err) {
							// do nothing
							var pass = true;
						};
					}
					var captiondiv = $('<div/>', {class: "caption", html: caption});
					$(this.settings.div).append(captiondiv);
				}
			}
		}),
		PlotCollection: Backbone.Collection.extend({
			initialize: function(models, settings) {
				this.settings = settings || {};
				this.plottype = this.settings.plottype || this.plottype || "bar";
				this.caption = this.settings.caption || false;
				if (models) this.reset(models, {silent: true});
			}
		})
	}
	return BackboneD3;
});
