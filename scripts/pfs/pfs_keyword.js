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
		vm.header = {name:'3'};
		vm.type = "0"
		if($stateParams.page){
			vm.page = $stateParams.page
		}else{
			vm.page = 1
		}
		if($stateParams.filter){
			vm.filter = $stateParams.filter
		}


		function fetchData(){
			httpService.getKeyRequest({status: 'waiting'}, function(result){
				vm.requestkeyWords = result
			}, function(e){
				console.log(e)
			})
		}

		 vm.addKeyWord = function(){
			if(!vm.word){
				toastr.error('请输入需要添加的关键词')
				return
			 }
			httpService.addKeyWord({word: vm.word, type: vm.type}, function(r){
				toastr.success('添加关键词成功')
				vm.word = undefined
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

		vm.deleteKeyWord = function(word){
			httpService.deleteKeyWord({word: word}, function(r){
				toastr.success('删除关键词成功')
				fetchData()
			}, function(e){
				toastr.error('删除关键词失败')
			})
		}

		vm.doFilter = function(){
			httpService.words({type: vm.type, keyword: vm.filter}, function(r){
				vm.words = r.keywordlist.filter(function(item){
					if(item.keyword != '<桂林4日游>' && item.keyword != '<桂林5日游>'){
						return item
					}
				})
				vm.number = r.allnum
			}, function(e){
				console.log(e)
			})
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

		vm.setType = function(t){
			vm.type = t
			vm.filter = ""
			httpService.words({type: t}, function(r){
				vm.words = r.keywordlist.filter(function(item){
					if(item.keyword != '<桂林4日游>' && item.keyword != '<桂林5日游>'){
						return item
					}
				})

				vm.number = r.allnum
			}, function(e){
				console.log(e)
			})
		}
		vm.app.ready(function(){
			fetchData()
			vm.setType("0")
		})

	}

})();