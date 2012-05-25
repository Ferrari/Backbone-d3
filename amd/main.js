require.config({
	baseUrl: "../",
	paths: {
		"jquery": "lib/jquery-1.7.1.min",
		"underscore": "lib/underscore-amd-min-1.3.2",
		"backbone": "lib/backbone-amd-min-0.9.2",
		"d3": "lib/d3-min-2.9.2",
		"tipsy": "lib/jquery.tipsy",
		"backboneD3": "amd/backbone-d3",
		"backboneD3Line": "amd/visualisations/line"
	}
});
require([
	'jquery',
	'underscore',
	'backbone',
	'backboneD3',
	'backboneD3Line'
], function($, _, Backbone, BackboneD3, BackboneD3Line){
	var DataPoint = Backbone.Model.extend({
	  initialize: function (point) {
			this.set({
				x: point.x,
				y: point.y
			});
	  }
	});
	
	var DataPoints = Backbone.Collection.extend({
	  model: DataPoint,
	  url: "",
		fetch: function(){
			console.log('test');
		}
	});

	var series1 = new DataPoints();
	/*
	 * div: target area for Chart
	 * w, h: Width/Height of Chart graph
	 * domain: IMPORTANT! max/min value of data collection
	 */
	var test = [1, 3, 5, 7, 9, 4, 5, 8, 10, 15, 20, 23];
	var x_max = test.length;
	var y_max = _.max(test);
	var plot1 = new BackboneD3Line(series1, {
		div:'#line', 
		w: 800,
		h: 400,
		margin: 40,
		x_domain:[0, x_max], 
		y_domain:[0, y_max],
		tipsy: true
	});
	plot1.collection.reset([new DataPoint({x:0, y:0})]);

	var max = _.max(test);
	var total = [];
	var counter = 0;
	_.each(test, function(i, ii, l) {
		setTimeout(function() {
			var tmp = test[ii];
			var addPoint = new DataPoint({y:tmp, x: ii + 1});
			plot1.collection.add(addPoint);
		}, 1 + Math.random() * 1000);
	});
});
