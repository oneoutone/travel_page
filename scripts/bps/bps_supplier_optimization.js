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
        .controller('bpsSupplierOptimizationCtrl', bpsSupplierOptimizationCtrl);
    bpsSupplierOptimizationCtrl.$inject = ['$scope', 'httpService', '$state', 'toastr', '$stateParams'];

    function bpsSupplierOptimizationCtrl($scope, httpService, $state, toastr, $stateParams) {
        var vm = $scope;
        vm.purchase = {}
        vm.page = 1
        vm.filter = ''
        vm.state = 1
        vm.purchaseId = $stateParams.purchaseId

        vm.setState = function(state){
            if(vm.state == state){
                return
            }
            vm.page = 1
            vm.state = state
            fetchData()
        }

        function fetchData(){
            if(vm.state == 1 || vm.state == 4){
                var data = {page: vm.page, size: 10, filter: vm.filter}

                httpService.offerCount({filter: vm.filter}, function (result) {
                    vm.bigTotalItems = result.count
                    vm.bigCurrentPage = vm.page
                }, function (e) {
                    console.log(e)
                })

                httpService.offerList(data, function(r){
                    vm.offers = r
                    for(var i=0; i<vm.offers.length; i++){
                        fetchState(vm.offers[i])
                    }
                }, function(err){
                    console.log(err)
                })
            }else {
                var type = '已申请'
                if(vm.state == 2){
                    type = '已邀标'
                }
                var data = {page: vm.page, size: 10, filter: vm.filter, type: type, purchaseId: vm.purchaseId}
                httpService.applyCount({purchaseId: vm.purchaseId, type: type, filter: vm.filter}, function (result) {
                    vm.bigTotalItems = result.count
                    vm.bigCurrentPage = vm.page
                }, function (e) {
                    console.log(e)
                })

                httpService.applyList(data, function(r){
                    vm.offers = r
                }, function(err){
                    console.log(err)
                })
            }
        }

        function fetchState(item){
            httpService.getPurchaseApply({purchaseId: vm.purchaseId, bidInfoId:item.id}, function(re){
                item.state = re.result
            }, function(err){
                console.log(err)
            })
        }

        vm.pageChanged = function(){
            if(vm.bigCurrentPage == vm.page){
                return
            }
            vm.page = vm.bigCurrentPage
            fetchData()
        }

        vm.doFilter = function(){
            vm.page = 1
            fetchData()
        }

        vm.invite = function(item){
            httpService.upsertPurchaseApply({purchaseId: vm.purchaseId, bidInfoId: item.id, type: '已邀标'}, function(r){
                toastr.success('邀标成功')
                fetchData()
            }, function(e){
                toastr.error('邀标失败，请稍后再试')
            })
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

        vm.showDetail = function(item){
            vm.info = item
            $('#m-edit').modal('show')
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