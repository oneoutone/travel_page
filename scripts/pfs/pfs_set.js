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
		.controller('pfsSetCtrl', pfsSetCtrl);
	pfsSetCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsSetCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope

		vm.set ={}
		if($stateParams.page){
			vm.page = $stateParams.page
		}else{
			vm.page = 1
		}

		vm.fetchSource = function(select){
			var url = ''
			if(select && select.search){
				url = select.search
			}
			httpService.sources({website_url: url, pagenum: 1}, function(r){
				vm.sources = r.data
			}, function(e){
				console.log(e)
			})
		}


		function fetchData(){
			var data = {page: vm.page, size: 10}
			httpService.getWarningSetList(data,function(result){
				console.log(result)
				vm.sets = result
			}, function(e){
				console.log(e)
			})

			httpService.getWarningSetCount(function(r){
				console.log(r)
				vm.bigTotalItems = r.count
				vm.bigCurrentPage = vm.page
			}, function(e){
				console.log(e)
			})
		}

		vm.addWarningSet = function(){
			if(vm.set.id){
				httpService.updateWarningSet(vm.set, function(r){
					toastr.success('更新报警条件成功')
					toastr.success('添加报警条件成功')
					$('#myModal').modal('hide')
					fetchData()
				}, function(e){
					toastr.error('更新报警条件失败')
				})
			}else{
				vm.set.sourceId = vm.set.url.result.seed_id+''
				vm.set.sourceName = vm.set.url.result.website
				vm.set.sourceUrl = vm.set.url.result.website_url
				vm.set.url = undefined
				httpService.addWarningSet(vm.set, function(r){
					toastr.success('添加报警条件成功')
					$('#myModal').modal('hide')
					fetchData()
				}, function(e){
					console.log(e)
					toastr.error('添加报警条件失败')
				})
			}

		}


		vm.deleteWarningSet = function(){
			httpService.deleteWarningSet({id: vm.deleteItem.id}, function(r){
				toastr.success('删除报警条件成功')
				$('#delete').modal('hide')
				fetchData()
			}, function(e){
				toastr.error('删除报警条件失败')
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
			$state.go('app.pfs_set', {page: vm.bigCurrentPage})
		};

		vm.showAdd = function(item){
			vm.set = {}
			if(item){
				vm.set = item
			}
			$('#myModal').modal('show')
		}

		vm.showDelete = function(item){
			vm.deleteItem = item
			$('#delete').modal('show')
		}

		vm.updateUserWarn = function(){
			console.log('changed')
			httpService.updateUserWarn({message_warn: vm.message_warn, email_warn: vm.email_warn, wechat_warn: vm.wechat_warn}, function(r){
				toastr.success('更新报警渠道成功')
			}, function(e){
				toastr.error('更新报警渠道失败')
			})
		}

		vm.app.ready(function(){
			fetchData()
			vm.fetchSource()
			httpService.getProfile(function(user){
				vm.message_warn = user.message_warn
				vm.wechat_warn = user.wechat_warn
				vm.email_warn = user.email_warn
			}, function(e){
				console.log(e)
			})
		})

	}

})();