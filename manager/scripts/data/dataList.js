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
        .controller('DataListCtrl', DataListCtrl);

    DataListCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function DataListCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;

        vm.statusList = ['全部', '待确认', '已报价','运行中', '已停止']

        vm.fetchData = function(){

            httpService.getRequestAllList (vm.filter, function(data){
                vm.list = data
            }, function(err){
                console.log(err)
            })

            httpService.getRequestAllCount({name: vm.filter.name, status: vm.filter.status}, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.filter.page
            }, function(err){
                console.log(err)
            })
        }

        vm.updateKeyWord = function(){
            httpService.dataSourceUpdate({id: vm.data.id, words: vm.words}, function(){
                toastr.success('更新关键词成功')
                $('#myModal').modal('hide')
                vm.fetchData()
            }, function (err){
                toastr.error('更新关键词失败')
            })
        }

        vm.updateStatus = function(){
            httpService.dataSourceUpdate({id: vm.data.id, status: vm.data.status}, function(){
                toastr.success('更新状态成功')
                $('#myModal1').modal('hide')
                vm.fetchData()
            }, function (err){
                toastr.error('更新状态失败')
            })
        }


        vm.doFilter = function(){
            $state.go('app.dataList', {page: 1, name: vm.filter.name, status: vm.filter.status})
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.filter.index){
                return
            }
            $state.go('app.dataList', {page: vm.bigCurrentPage, name: vm.filter.name, status: vm.filter.status})
        };

        vm.showModal = function(item){
            vm.data = item
            vm.words = item.words
            $('#myModal').modal('show')
        }

        vm.showModal1 = function(item){
            vm.data = item
            $('#myModal1').modal('show')
        }

        vm.app.ready(function(){
            //name&status&saleStatus&start&end
            vm.filter = {}
            if($stateParams.name){
                vm.filter.name = $stateParams.name
            }
            if($stateParams.status){
                vm.filter.status = $stateParams.status
            }else{
                vm.filter.status = '全部'
            }
            if($stateParams.page){
                vm.filter.page = $stateParams.page
            }else{
                vm.filter.page = 1
            }
            vm.filter.size = 10
            vm.fetchData()
        })
    }
})();
