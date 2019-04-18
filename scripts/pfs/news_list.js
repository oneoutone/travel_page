(function() {
	'use strict';
	angular
		.module('app')
		.controller('newsListCtrl', newsListCtrl);
	newsListCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function newsListCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope
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
			data.sentiment = 4

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
			$state.go('app.news_list', {page: vm.bigCurrentPage, channel: vm.channel, type: vm.type})
		}

		vm.app.ready(function(){
			fetchData()
		})

	}

})();