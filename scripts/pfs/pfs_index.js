(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsIndexCtrl', pfsIndexCtrl);
	pfsIndexCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsIndexCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope
		vm.header = {name:'1'};
		//$scope.data = {name:'1'};
		vm.request = {}
		var now = new Date();
		var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
		var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')

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
			fetchData()
		}

		vm.setType = function(type){
			vm.type = type
			fetchData()
		}

		function fetchData(){
			var data = {page: vm.page, size: 10}
			data.article_type = 4
			if(vm.channel == 'website'){
				data.article_type = 0
			}
			if(vm.channel == 'weibo'){
				data.article_type = 8
			}
			if(vm.channel == 'wechat'){
				data.article_type = 9
			}
			data.sentiment = 3

			// if(vm.type == 'active'){
			// 	data.sentiment = 1
			// }
			// if(vm.type == 'negtive'){
			// 	data.sentiment = 3
			// }
			// if(vm.type == 'middle'){
			// 	data.sentiment = 2
			// }

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
					if(!vm.data[i].result.content && vm.data[i].result.title){
						vm.data[i].result.desc = vm.data[i].result.title
					}
				}
			}, function(e){
				console.log(e)
			})

		}

		vm.pageChanged = function(){
			vm.page = vm.bigCurrentPage
			fetchData()
		}

		vm.goDetail = function(item){
			console.log(item)
			console.log(item.articleId)
			httpService.read({articleId: item.articleId}, function(r){
				console.log(r)
			},function(e){
				console.log(e)
			})
			$state.go('app.news_detail', {id: item.articleId})
		}

		vm.app.ready(function(){
			fetchData()
			httpService.getNotificationList(function(r){
				vm.notifications = r
				console.log(r)
			}, function(err){
				console.log(err)
			})
		})

	}

})();