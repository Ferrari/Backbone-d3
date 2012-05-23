define([
	'jquery',
	'underscore',
	'backbone',
	'backboneD3'
], function($, _, Backbone, BackboneD3){
	var DataPoint = Backbone.Model.extend({
		initialize: function (point) {
			this.set({
				x: point.x,
				y: point.y
			});
		}
	});

	var DataPoints = BackboneD3.PlotCollection.extend({
		model: DataPoint,
		url: "",
		fetch: function(){
			console.log("no need in this project");
		}
	});
});
