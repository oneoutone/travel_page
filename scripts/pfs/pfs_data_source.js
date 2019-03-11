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
		.controller('pfsDataSourceCtrl', pfsDataSourceCtrl);
	pfsDataSourceCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsDataSourceCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope;
		vm.data = {name:'5'};

		vm.sourceChanged = function(){
			httpService.updateSpecifySource({specifySource: vm.custom}, function(){
				toastr.success('更新成功')
			}, function(e){
				console.log(e)
			})

		}

		if($stateParams.page){
			vm.page = $stateParams.page
		}else{
			vm.page = 1
		}

		vm.fetchSource = function(select){
			httpService.sources({website_url: vm.filter, pagenum: 1}, function(r){
				vm.urls = r.data
			}, function(e){
				console.log(e)
			})
		}


		function fetchData(){
			var data = {page: vm.page, size: 10}
			httpService.getDataSourceList(data,function(result){
				console.log(result)
				vm.sources = result
			}, function(e){
				console.log(e)
			})

			httpService.getDataSourceCount(function(r){
				vm.bigTotalItems = r.count
				vm.bigCurrentPage = vm.page
			}, function(e){
				console.log(e)
			})
		}

		vm.addSource = function(item){
			httpService.addDataSource({sourceId: item.result.websiteId, sourceName: item.result.website, sourceUrl: item.result.website_url}, function(r){
				toastr.success('添加数据源成功')
				fetchData()
			}, function(e){
				toastr.error(e.message)
				console.log(e)
			})
		}

		vm.showDeleteModal = function(item){
			vm.deleteItem = item
			$('#delete').modal('show')
		}

		vm.deleteDataSource = function(){
			httpService.deleteDataSourceSet({id: vm.deleteItem.id}, function(r){
				toastr.success('删除数据源成功')
				$('#delete').modal('hide')
				fetchData()
			}, function(e){
				toastr.error('删除数据源失败')
			})
		}


		vm.app.ready(function(){
			fetchData()
			vm.fetchSource()
			httpService.getProfile(function(user){
				vm.custom = user.specifySource
			}, function(e){
				console.log(e)
			})
		})
	}

})();