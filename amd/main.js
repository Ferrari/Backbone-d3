require.config({
	baseUrl: "../",
	paths: {
		"jquery": "lib/jquery-1.7.1.min",
		"underscore": "lib/underscore-amd-min-1.3.2",
		"backbone": "lib/backbone-amd-min-0.9.2",
		"d3": "lib/d3-min-2.9.2",
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
	var plot1 = new BackboneD3Line(series1, {
		div:'#line', 
		x_domain:[0, 12], 
		x_range:[0, 800],
		y_domain:[0, 23],
		y_range:[300, 0]
	});
	plot1.collection.reset([new DataPoint({x:0, y:0})]);

	var test = [1, 3, 5, 7, 9, 4, 5, 8, 10, 15, 20, 23];
	var max = _.max(test);
	_.each(test, function(i, ii, l) {
		setTimeout(function() {
			var tmp = test[ii];
			var addPoint = new DataPoint({y:tmp, x: ii});
			plot1.collection.add(addPoint);
		}, 1 + Math.random() * 1000);
	});
});
