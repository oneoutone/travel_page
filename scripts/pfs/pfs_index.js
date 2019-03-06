(function() {
	'use strict';
	angular
		.module('app')
		.controller('pfsIndexCtrl', pfsIndexCtrl);
	pfsIndexCtrl.$inject = ['$scope', 'httpService'];

	function pfsIndexCtrl($scope, httpService) {
		var vm = $scope

		$scope.data = {name:'1'};

        vm.today_history = [{label:'网站：100', data: 100},{label:'微信： 200', data:200},{label:'微博： 30', data:30}]
        $.plot("#chart1",
            vm.today_history,
            {
                series: { pie: { show: true, innerRadius: 0, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
                legend: {backgroundColor: 'transparent'},
                colors: [vm.app.color.primary],
                grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#666' },
                tooltip: true,
                tooltipOpts: { content: '%s: %p%' }
            }).draw();
		// httpService.today_data(function(result){
		// 	console.log(result)
		// 	vm.today_history = [{label:'网站：'+result.website_num, data: result.website_num},{label:'微信： '+result.wechat_num, data:result.wechat_num},{label:'微博： '+result.weibo_num, data:result.weibo_num}]
		// 	$.plot("#chart1",
		// 		vm.today_history,
		// 		{
		// 			series: { pie: { show: true, innerRadius: 0, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
		// 			legend: {backgroundColor: 'transparent'},
		// 			colors: [vm.app.color.primary],
		// 			grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#666' },
		// 			tooltip: true,
		// 			tooltipOpts: { content: '%s: %p%' }
		// 		}).draw();
		// }, function(err){
		// 	console.log(err)
		// })


        	vm.all_history = [{label:'网站： 1234323', data: 1234323},{label:'微信： 5000', data:5000},{label:'微博： 1203', data:1203}]
        	$.plot("#chart2",
        		vm.all_history,
        		{
        			series: { pie: { show: true, innerRadius: 0, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
        			legend: {backgroundColor: 'transparent'},
        			colors: [vm.app.color.primary],
        			grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#666' },
        			tooltip: true,
        			tooltipOpts: { content: '%s: %p%' }
        		}).draw();
		// httpService.history_data(function(result){
		// 	console.log(result)
		// 	vm.all_history = [{label:'网站： '+result.history_website_num, data: result.history_website_num},{label:'微信： '+result.history_wechat_num, data:result.history_wechat_num},{label:'微博： '+result.history_weibo_num, data:result.history_weibo_num}]
		// 	$.plot("#chart2",
		// 		vm.all_history,
		// 		{
		// 			series: { pie: { show: true, innerRadius: 0, stroke: { width: 0 }, label: { show: true, threshold: 0.05 } } },
		// 			legend: {backgroundColor: 'transparent'},
		// 			colors: [vm.app.color.primary],
		// 			grid: { hoverable: true, clickable: true, borderWidth: 0, color: '#666' },
		// 			tooltip: true,
		// 			tooltipOpts: { content: '%s: %p%' }
		// 		}).draw();
		// }, function(err){
		// 	console.log(err)
		// })

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
		})

		httpService.data({
			page_num: 0,
			page_size: 5
		}, function(r){
			vm.news = r.data
		}, function(e){
			console.log(e)
		})

		httpService.weiboV(function(r){
			console.log(r)
			vm.weiboVs = r.data
		}, function(e){
			console.log(e)
		})

		httpService.weiboHot(function(r){
			console.log(r)
			vm.weiboHots = r.data
		}, function(e){
			console.log(e)
		})
	}

})();