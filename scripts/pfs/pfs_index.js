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

		// var now = new Date();
		// var end = moment(now).startOf('hour').format('YYYY-MM-DD HH:mm:ss')
		// var start = moment(now).startOf('hour').subtract(12, 'hours').format('YYYY-MM-DD HH:mm:ss')
		// httpService.emotion_date({start: start, end: end}, function(result){
		// 	console.log(result)
		// }, function(err){
		// 	console.log(err)
		// })
	}

})();