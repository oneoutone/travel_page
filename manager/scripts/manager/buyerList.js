(function() {
    'use strict';
    angular
        .module('app')
        .config(function(toastrConfig) {
            angular.extend(toastrConfig,
                {positionClass: 'toast-top-full-width',
                    preventOpenDuplicates: true,
                    timeOut: 2000
                });
        })
        .controller('BuyerListCtrl', BuyerListCtrl);

    BuyerListCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function BuyerListCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;

        vm.statusList = ['全部', '待审核', '正常']

        vm.fetchData = function(){
            var status = '全部'
            if(vm.status == '待审核'){
                status = 'waiting'
            }
            if(vm.status == '正常'){
                status = 'normal'
            }

            httpService.buyerList({filter: vm.filter, status: status, size: 10, page: vm.page}, function(data){
                vm.list = data
            }, function(err){
                console.log(err)
            })

            httpService.buyerCount({filter: vm.filter, status: status}, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.page
            }, function(err){
                console.log(err)
            })
        }

        vm.updateStatus = function(item){
            httpService.updateBuyer({id: item.buyerId, status: 'normal'}, function(r){
                toastr.success("更新状态成功")
                vm.fetchData()
            }, function(e){
                toastr.error("更新状态失败")
            })
        }

        vm.showDetail = function(item){
            vm.info = item
            $('#m-edit').modal('show')
        }


        vm.doFilter = function(){
            $state.go('app.buyerList', {page: 1, filter: vm.filter, status: vm.status})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.buyerList', {page: vm.bigCurrentPage, filter: vm.filter, status: vm.status})
        };

        vm.app.ready(function(){
            if($stateParams.filter){
                vm.filter = $stateParams.filter
            }else{
                vm.filter=''
            }
            if($stateParams.status){
                vm.status = $stateParams.status
            }else{
                vm.status = '全部'
            }
            if($stateParams.page){
                vm.page = $stateParams.page
            }else{
                vm.page = 1
            }
            vm.size = 10
            vm.fetchData()
        })
    }
})();
