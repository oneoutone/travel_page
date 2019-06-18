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
		.controller('bpsAuditCtrl', bpsAuditCtrl);
	bpsAuditCtrl.$inject = ['$scope', 'toastr', 'httpService'];

	function bpsAuditCtrl($scope, toastr, httpService) {
		var vm = $scope;
		vm.step = 1

		vm.bidInfo = {}

		vm.saveCompanyInfo = function(){
			if(!vm.name){
				toastr.error('请输入公司名称')
				return
			}
			vm.step = 3
		}

		vm.saveBidInfo = function(){
			httpService.upserBidsInfo(vm.bidInfo, function(bidInfo){
				vm.step = 3
			}, function(e){
				console.log(e)
			})
		}

		vm.app.ready(function(){
			httpService.getBidsInfo(function(r){
				if(r.result){
					vm.bidInfo = r.result
					vm.step = 3
				}else{
					vm.step = 1
				}
			}, function(err){
				toastr.error('获取用户信息失败')
			})
		})
	}

})();