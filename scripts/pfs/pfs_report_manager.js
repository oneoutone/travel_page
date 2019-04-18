(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsReportManagerCtrl', pfsReportManagerCtrl);
	pfsReportManagerCtrl.$inject = ['$scope', 'httpService'];

	function pfsReportManagerCtrl($scope, httpService) {
		$scope.data = {name:'6'};

		var now = new Date();
		var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
		var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
		httpService.emotion_date({start: start, end: end}, function(result){
			console.log(result)
			var d = result.data
			var ticket = []
			var positive = []
			var middle = []
			var negative = []
			var line = []
			for(var i=0; i<d.length; i++){
				ticket.push([i+1, d[i].result.endtime])
				positive.push([i+1, d[i].result.positive_num])
				middle.push([i+1, d[i].result.middle_num])
				negative.push([i+1, 0-d[i].result.negative_num])
				line.push([i+1, 10])
				$.plot("#emotion", [
					{
						data: positive,
						points: {show: true, radius: 2},
						splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
					},
					{
						data: middle,
						points: {show: true, radius: 2},
						splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
					},
					{
						data: negative,
						points: {show: true, radius: 2},
						splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
					},
					{
						data: line,
						points: {show: true, radius: 2},
						splines: {show: true, tension: 0.45, lineWidth: 2, fill: 0}
					}
				], {
					colors: ['#1b9af9', '#f5bc34', '#d94b4b'],
					series: {shadowSize: 3},
					legend: {backgroundColor: 'transparent'},
					xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
					yaxis: {show: true, font: {color: '#ccc'}},
					grid: {
						hoverable: true,
						clickable: true,
						borderWidth: 40,
						borderColor: 'rgba(255,255,255,0.5)',
						color: 'rgba(120,120,120,0.5)'
					},
					tooltip: true,
					tooltipOpts: {content: '%y.2', defaultTheme: false, shifts: {x: 0, y: -40}}
				}).draw();
			}
		}, function(err){
			console.log(err)
		});
	}

})();