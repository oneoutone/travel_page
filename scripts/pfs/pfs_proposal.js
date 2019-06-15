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
		.controller('pfsProposalCtrl', pfsProposalCtrl);
	pfsProposalCtrl.$inject = ['$scope', 'httpService', 'toastr', '$stateParams', '$state'];

	function pfsProposalCtrl($scope, httpService, toastr, $stateParams, $state) {
		var vm = $scope
		vm.header = {name:'7'};
		vm.add = function(){
			if(!vm.title){
				toastr.error('请输入建议标题')
				return
			}
			if(!vm.content){
				toastr.error('请输入建议描述')
				return
			}
			httpService.addAdvice({title: vm.title, content: vm.content}, function(r){
				toastr.success('提交建议成功')
				vm.title=undefined
				vm.content= undefined
			}, function(e){
				toastr.error('提交建议失败')
			})
		}

	}

})();