(function() {
	'use strict';
	angular
		.module('app')
		.config(function(toastrConfig) {
			angular.extend(toastrConfig, {
				positionClass: 'toast-top-full-width',
				preventOpenDuplicates: true,
				timeOut: 1000
			});
		})
		.controller('pfsKeywordCtrl', pfsKeywordCtrl);
	pfsKeywordCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsKeywordCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope
		if($stateParams.page){
			vm.page = $stateParams.page
		}else{
			vm.page = 1
		}
		if($stateParams.filter){
			vm.filter = $stateParams.filter
		}


		function fetchData(){
			var data = {page: vm.page, size: 10}
			if(vm.filter){
				data.word = vm.filter
			}
			httpService.getKeyWordList(data,function(result){
				console.log(result)
				vm.keyWords = result
			}, function(e){
				console.log(r)
			})

			httpService.getKeyWordCount(function(r){
				console.log(r)
				vm.bigTotalItems = r.count
				vm.bigCurrentPage = vm.page
			}, function(e){
				console.log(e)
			})
		}

		 vm.addKeyWord = function(){
			httpService.addKeyWord({word: vm.word}, function(r){
				toastr.success('添加关键词成功')
				$('#myModal').modal('hide')
				fetchData()
			}, function(e){
				console.log(e)
				toastr.error('添加关键词失败')
			})
		}

		vm.updateKeyWord = function(item){
			var status = 'enabled'
			if(item.status == 'enabled'){
				status = 'disabled'
			}
			httpService.updateKeyWord({status: status, word: item.word}, function(r){
				toastr.success('更新关键词成功')
				fetchData()
			}, function(e){
				toastr.error('更新关键词失败')
			})
		}

		vm.deleteKeyWord = function(){
			httpService.deleteKeyWord({word: vm.deleteItem.word}, function(r){
				toastr.success('删除关键词成功')
				$('#delete').modal('hide')
				fetchData()
			}, function(e){
				toastr.error('删除关键词失败')
			})
		}

		vm.doFilter = function(){
			$state.go('app.pfs_keyword', {page: 1, filter: vm.filter})
		}

		vm.showDeleteModal = function(item){
			$('#delete').modal('show')
			vm.deleteItem = item
		}

		$scope.pageChanged = function() {
			if(vm.bigCurrentPage == vm.page){
				return
			}
			$state.go('app.pfs_keyword', {page: vm.bigCurrentPage, filter: vm.filter})
		};

		vm.app.ready(function(){
			fetchData()
		})

	}

})();