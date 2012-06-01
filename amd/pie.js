require.config({
	baseUrl: "../",
	paths: {
		"jquery": "lib/jquery-1.7.1.min",
		"underscore": "lib/underscore-amd-min-1.3.2",
		"backbone": "lib/backbone-amd-min-0.9.2",
		"d3": "lib/d3-min-2.9.2",
		"backboneD3": "amd/backbone-d3",
		"backboneD3Pie": "amd/visualisations/pie"
	}
});
require([
	'jquery',
	'underscore',
	'backbone',
	'backboneD3',
	'backboneD3Pie'
], function($, _, Backbone, BackboneD3, BackboneD3Pie){
	var DataPoint = Backbone.Model.extend({
		initialize: function(value) {
			this.set(value);
		}
	});

	var DataSeries = BackboneD3.PlotCollection.extend({
		model : DataPoint,
		url : "data",
		plottype: "pie",
		fetch: function(){
			// No op
			console.log('fetching is a no op in this example');
		}
	});

	var series = new DataSeries();
	var plot = new BackboneD3Pie(series, {
		div:'#pie1',
		name: 'PLOT1',
		radius: 85,
		tooltip: true
	});

	series.reset([
		new DataPoint({id: 1, value: 2}),
		new DataPoint({id: 2, value: 1}),
		new DataPoint({id: 3, value: 1}),
		new DataPoint({id: 4, value: 2})
	]);
	var newValues = [1, 2, 2, 1];
	_.each(_.range(1,5), function(i, ii, l) {
		setTimeout(function() {
			var m = plot.collection.get(i);
			m.set({value: newValues[ii]});
		}, i * 1000);
	})

	var dynamicSeries = new DataSeries();
	var dynamicPlot = new BackboneD3Pie(dynamicSeries, {
		div:'#pie2',
		name: 'PLOT2',
		radius: 85
	});
	dynamicSeries.reset([
		new DataPoint({id: 1, value: 1}),
		new DataPoint({id: 2, value: 2})
	]);
	setTimeout(function() {
		dynamicSeries.add(new DataPoint({id: 3, value: 4}));
	}, 1000);
	setTimeout(function() {
		dynamicSeries.add(new DataPoint({id: 4, value: 2}));
	}, 2000);
	setTimeout(function() {
		dynamicSeries.remove(3);
	}, 3000);
	setTimeout(function() {
		dynamicSeries.add(new DataPoint({id: 5, value: 1}));
	}, 4000);

	var staticSeries = new DataSeries();
	var staticPlot = new BackboneD3Pie(staticSeries, {
		div:'#pie3',
		name: 'PLOT3',
		radius: 100,
		tooltip: true
	});
	staticSeries.reset([
		new DataPoint({id: 1, value: 5}),
		new DataPoint({id: 2, value: 13}),
		new DataPoint({id: 3, value: 1}),
		new DataPoint({id: 4, value: 8})
	]);

});
