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
        .controller('bpsPurchaseCtrl', bpsPurchaseCtrl);
    bpsPurchaseCtrl.$inject = ['$scope', 'httpService', '$state', 'toastr', '$stateParams'];

    function bpsPurchaseCtrl($scope, httpService, $state, toastr, $stateParams) {
        var vm = $scope;
        vm.purchase = {}
        if($stateParams.page){
            vm.page = $stateParams.page
        }else{
            vm.page = 1
        }

        function fetchData() {
            var data = {page: vm.page, size: 10, userId: vm.app.setting.userId, type: '1'}

            httpService.purchaseCount({userId: vm.app.setting.userId, type: '1'}, function (result) {
                vm.bigTotalItems = result.count
                vm.bigCurrentPage = vm.page
            }, function (e) {
                console.log(e)
            })

            httpService.purchaseList(data, function(r){
                vm.purchases = r
            }, function(err){
                console.log(err)
            })
        }

        vm.pageChanged = function(){
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.bps_purchase', {page: vm.bigCurrentPage})
        }

        vm.save = function(){
            if(!vm.purchase.name){
                toastr.error('请输入招标名称')
                return
            }
            if(!vm.purchase.id){
                vm.purchase.status = '已发布'
                vm.purchase.type = '1'
            }
            httpService.upsertPurchase(vm.purchase, function (r) {
                toastr.success('新建成功')
                $('#myModal').modal('hide')
                $('#stateChangeModal').modal('hide')
                fetchData()
            }, function(e){
                toastr.error('新建失败，请稍后再试')
            })
        }

        vm.showModal = function(item){
            if(!item){
                vm.purchase = {}
            }else{
                vm.purchase = item
            }
            $('#myModal').modal('show')
        }

        vm.showStateModal = function(item){
            if(!item){
                vm.purchase = {}
            }else{
                vm.purchase = item
            }
            $('#stateChangeModal').modal('show')
        }

        vm.app.ready(function() {
            fetchData()
        })

    }

})();