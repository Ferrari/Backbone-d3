require.config({
	baseUrl: "../",
	paths: {
		"jquery": "lib/jquery-1.8.1.min",
		"underscore": "lib/underscore-amd-min-1.3.2",
		"backbone": "lib/backbone-amd-min-0.9.2",
		"d3": "lib/d3.v2.min",
		"backboneD3": "amd/backbone-d3",
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
  var series1 = new backboneD3Matrix.collection();
  var matrix = new backboneD3Matrix.view(series1, {
    div: '#matrix',
    cellColor: '#D73027',
    interval: 1,
    cellX: 10,
    cellY: 20
  });
  series1.add([
    {slot: '03:45:20', display:'test1'},
    {slot: '11:30:40', display:'111'},
    {slot: '17:40:30', display:'rfrf'},
    {slot: '23:00:10', display:'test2'},
  ]);
});
