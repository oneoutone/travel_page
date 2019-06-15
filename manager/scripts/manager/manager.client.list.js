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
        .controller('ManagerClientListCtrl', ManagerClientListCtrl);

    ManagerClientListCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function ManagerClientListCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;

        vm.statusList = ['全部', '正常', '禁用']

        vm.fetchData = function(){
            var status = '全部'
            if(vm.status == '正常'){
                status = 'normal'
            }
            if(vm.status == '禁用'){
                status = 'forbid'
            }
            console.log(111111111111111111)
            httpService.getAllCompanyList({filter: vm.filter, status: status, size: 10, page: vm.page, managerId: vm.app.setting.user1.id}, function(data){
                vm.list = data
            }, function(err){
                console.log(err)
            })

            httpService.getAllCompanyCount({filter: vm.filter, status: status, managerId: vm.app.setting.user1.id}, function(data){
                vm.bigTotalItems = data.count
                vm.bigCurrentPage = vm.page
            }, function(err){
                console.log(err)
            })
        }

        vm.updateStatus = function(item){
            var status = 'normal'
            if(item.status == 'normal'){
                status = 'forbid'
            }

            httpService.updateCompany({id: item.id, status: status}, function(r){
                toastr.success("更新状态成功")
                vm.fetchData()
            }, function(err){
                toastr.error("更新状态失败")
            })
        }


        vm.doFilter = function(){
            $state.go('app.clientListOfManager', {page: 1, filter: vm.filter, status: vm.status})
        }

        vm.openConfig= function(row){
            httpService.clientToken({clientId: row.adminId}, function(r){
                console.log(r)
                //window.open("http://hadupu.cn/admin/#/app/pfs_index1?accessToken="+r.token, '_blank')
                window.open("http://localhost:3000/admin/#/app/pfs_index1?accessToken="+r.token, '_blank')

            }, function(e){
                toastr.error('打开配置页面失败')
            })
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.clientListOfManager', {page: vm.bigCurrentPage, filter: vm.filter, status: vm.status})
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
