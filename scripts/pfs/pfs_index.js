(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsIndexCtrl', pfsIndexCtrl);
	pfsIndexCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsIndexCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope

		//$scope.data = {name:'1'};

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
				negative.push([i+1, d[i].result.negative_num])
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
						borderWidth: 20,
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
		
		if($stateParams.channel){
			vm.channel = $stateParams.channel
		}else{
			vm.channel = 'all'
		}

		if($stateParams.type){
			vm.type = $stateParams.type
		}else{
			vm.type = 'all'
		}

		if($stateParams.page){
			vm.page = $stateParams.page
		}else{
			vm.page = 1
		}

		vm.setChannel = function(channel){
			vm.channel = channel
		}

		vm.setType = function(type){
			vm.type = type
		}

		function fetchData(){
			var data = {page: vm.page, size: 10}
			data.article_type = 4
			if(vm.channel == 'website'){
				data.article_type = 1
			}
			if(vm.channel == 'weibo'){
				data.article_type = 2
			}
			if(vm.channel == 'weixin'){
				data.article_type = 3
			}
			data.sentiment = 8

			if(vm.type == 'actvive'){
				data.sentiment = 1
			}
			if(vm.type == 'negtive'){
				data.sentiment = 2
			}
			if(vm.type == 'middle'){
				data.sentiment = 3
			}

			httpService.data_count(data,function(result){
				console.log(result)
				vm.bigTotalItems = result.size
				vm.bigCurrentPage = vm.page
			}, function(e){
				console.log(e)
			})

			httpService.data(data,function(result){
				console.log(result)
				vm.data = result.data
				for(var i=0; i<vm.data.length; i++){
					if(vm.data[i].result.content.length > 100){
						vm.data[i].result.desc = vm.data[i].result.content.substr(0, 100)+'...'
					}
				}
			}, function(e){
				console.log(e)
			})

		}

		vm.pageChanged = function(){
			if(vm.bigCurrentPage == vm.page){
				return
			}
			$state.go('app.pfs_index', {page: vm.bigCurrentPage, channel: vm.channel, type: vm.type})
		}

		vm.app.ready(function(){
			fetchData()
		})

	}

})();