require.config({
	baseUrl: "../",
	paths: {
		"jquery": "lib/jquery-1.8.1.min",
		"underscore": "lib/underscore-amd-min-1.3.2",
		"backbone": "lib/backbone-amd-min-0.9.2",
		"d3": "lib/d3.v2.min",
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
  //var series1 = new BackboneD3Calendar();
  //var cal = new BackboneD3Calendar(series1, {div: '#calendar'});

  var series1 = new backboneD3Matrix.collection();
  /*
  series1.fetch({
    success: function(collection, resp) {
      console.log('success');
      console.log(resp);
    },
    error: function(collection, resp) {
      console.log('error');
      console.log(resp);
    }
  });
  */
  var matrix = new backboneD3Matrix.view(series1, {div: '#matrix'});
  /*
  series1.add([
    {date:'2012-04-22', slot: '03:40', count: 23},
    {date:'2012-07-02', slot: '11:30', count: 13},
    {date:'2012-11-11', slot: '17:40', count: 7},
  ]);
  */
  series1.add([
    {slot: '03:45', display:'test1'},
    {slot: '11:30', display:'111'},
    {slot: '17:40', display:'rfrf'},
    {slot: '23:00', display:'test2'},
  ]);
});
