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
	bpsAuditCtrl.$inject = ['$scope', 'toastr', 'httpService', '$stateParams'];

	function bpsAuditCtrl($scope, toastr, httpService, $stateParams) {
		var vm = $scope;
		vm.step = 1

		vm.bidInfo = {industry: '旅游'}
		if($stateParams.type){
			vm.type = $stateParams.type
		}else{
			$stateParams.type = 'buyer'
		}

		vm.saveCompany = function(){
			if(!vm.bidInfo.name){
				toastr.error('请输入公司名称')
				return
			}
			if(!vm.bidInfo.phone){
				toastr.error('请输入联系电话')
				return
			}
			if(!vm.bidInfo.contactPeople){
				toastr.error('请输入联系人')
				return
			}
			vm.step = 2
		}

		vm.saveBidInfo = function(){
			if(!vm.bidInfo.keyWords){
				toastr.error('请输入行业关键词')
				return
			}
			httpService.upserBidsInfo(vm.bidInfo, function(bidInfo){
				vm.step = 3
			}, function(e){
				console.log(e)
			})
		}

		vm.app.ready(function(){
			httpService.bidPermissions(function(permissions){
				vm.permissions = permissions
				httpService.getBidsInfo(function(r){
					if(r.result){
						vm.bidInfo = r.result
						if(permissions[vm.type]){
							vm.step = 3
						}else{
							if(vm.type =='buyer'){
								httpService.upsertBuyer(function(r){
									vm.step = 3
								}, function(e){
									console.log(e)
								})
							}else if(vm.type =='supplier'){
								httpService.upsertSupplier(function(r){
									vm.step = 3
								}, function(e){
									console.log(e)
								})
							}else if(vm.type =='distributor'){
								httpService.upsertDistributor(function(r){
									vm.step = 3
								}, function(e){
									console.log(e)
								})
							}
						}
					}else{
						vm.step = 1
					}
				}, function(err){
					toastr.error('获取用户信息失败')
				})
			}, function(e){
				console.log(e)
			})
		})
	}

})();