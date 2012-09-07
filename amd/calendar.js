require.config({
	baseUrl: "../",
	paths: {
		"jquery": "lib/jquery-1.7.1.min",
		"underscore": "lib/underscore-amd-min-1.3.2",
		"backbone": "lib/backbone-amd-min-0.9.2",
		"d3": "lib/d3-min-2.9.2",
		"backboneD3": "amd/backbone-d3",
		"backboneD3Calendar": "amd/visualisations/calendar",
		"backboneD3Matrix": "amd/visualisations/matrix",
	}
});
require([
	'jquery',
	'underscore',
	'backbone',
	'backboneD3',
  'backboneD3Matrix'
], function($, _, Backbone, BackboneD3, backboneD3Matrix){
  console.log(backboneD3Matrix);
  //var series1 = new BackboneD3Calendar();
  //var cal = new BackboneD3Calendar(series1, {div: '#calendar'});

  var series1 = new backboneD3Matrix.collection();
  series1.fetch();
  console.log(series1);
  var matrix = new backboneD3Matrix.view(series1, {div: '#matrix'});
  console.log(matrix);
});
