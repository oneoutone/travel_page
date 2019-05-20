(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsReportManagerCtrl', pfsReportManagerCtrl);
	pfsReportManagerCtrl.$inject = ['$scope', 'httpService'];

	function pfsReportManagerCtrl($scope, httpService) {
		var vm = $scope
		vm.header = {name:'6'};
		vm.request = {}
		vm.show1 = true
		vm.show2 = false
		var now = new Date();
		var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
		var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
		vm.types = {
			daily: '日报',
			weekly: '周报',
			monthly: '月报',
			seasonly: '季报',
			yearly: '年报'
		}

		function euroFormatter(v, axis) {
			if(v >= 0){
				return v
			}
			return -v
		}

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
				positive.push([i+1, 0-d[i].result.positive_num])
				negative.push([i+1, d[i].result.negative_num])
				line.push([i+1, 50])
				$.plot("#emotion", [
					{
						data: positive,
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
					colors: ['#1b9af9', '#d94b4b', '#CD2626'],
					series: {shadowSize: 3},
					legend: {backgroundColor: 'transparent'},
					xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
					yaxis: {show: true, font: {color: '#ccc'} , tickFormatter: euroFormatter},
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

				$.plot("#emotion1", [
					{
						data: positive,
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
					colors: ['#1b9af9', '#d94b4b', '#CD2626'],
					series: {shadowSize: 3},
					legend: {backgroundColor: 'transparent'},
					xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
					yaxis: {show: true, font: {color: '#ccc'} , tickFormatter: euroFormatter},
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


		function fetchData(){
			if(!vm.state){
				vm.state = 'all'
			}
			if(!vm.page){
				vm.page = 1
			}
			console.log(start)
			var data = {page: vm.page, size: 10, type: vm.state}
			var c = {type: vm.state}
			if(vm.start){
				data.start = moment(vm.start).format('YYYY-MM-DD')+ " 00:00:00"
				c.start = moment(vm.start).format('YYYY-MM-DD')+ " 00:00:00"
			}
			if(vm.end){
				data.end = moment(vm.end).format('YYYY-MM-DD')+ " 00:00:00"
				c.end = moment(vm.end).format('YYYY-MM-DD')+ " 00:00:00"
			}
			httpService.getReportlist(data, function(result){
				vm.reports = result
			}, function(e){
				console.log(e)
			})

			httpService.getReportCount(c, function(r){
				vm.bigTotalItems = r.count
				vm.bigCurrentPage = vm.page
			}, function(e){
				console.log(e)
			})
		}

		vm.pageChanged = function(){
			vm.page = vm.bigCurrentPage
			fetchData()
		}

		vm.setState = function(v){
			httpService.reportData({type: v}, function(r){
				console.log(r)
				vm.all = r.all
				vm.danger = r.danger
				vm.middle = r.middle
				vm.neg = r.neg
				vm.pos = r.pos
				vm.read = r.read

				var d = r.detail
				var ticket = []
				var positive = []
				var middle = []
				var negative = []
				var line = []
				for(var i=0; i<d.length; i++) {
					ticket.push([i + 1, d[i].date])
					positive.push([i + 1, 0 - d[i].pos])
					negative.push([i + 1, d[i].neg])
					line.push([i + 1, 50])
				}
					$.plot("#emotion", [
						{
							data: positive,
							points: {show: true, radius: 2},
							splines: {show: true, lineWidth: 1, fill: 0}
						},
						{
							data: negative,
							points: {show: true, radius: 2},
							splines: {show: true, lineWidth:1, fill: 0}
						},
					], {
						colors: ['#1b9af9', '#d94b4b'],
						series: {shadowSize: 2},
						legend: {backgroundColor: 'transparent'},
						xaxis: {show: true, font: {color: '#ccc'}, position: 'bottom', ticks: ticket},
						yaxis: {show: true, font: {color: '#ccc'}},
						grid: {
							hoverable: true,
							borderWidth: 40,
							borderColor: 'rgba(255,255,255,0.5)',
							color: 'rgba(120,120,120,0.5)'
						},
						tooltip: true,
						tooltipOpts: {defaultTheme: false, shifts: {x: 0, y: -40}}
					}).draw()
				}, function(err){

				})
			vm.state = v
			vm.page = 1
			fetchData()
		}

		vm.doFilter = function(){
			console.log(vm.start)
			console.log(vm.end)
			vm.page = 1
			fetchData()
		}

		vm.app.ready(function(){
			fetchData()
		})
	}

})();