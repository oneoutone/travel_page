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
        .controller('ClientInfoCtrl', ClientInfoCtrl);

    ClientInfoCtrl.$inject = ['$scope', '$state', '$timeout', 'toastr', 'httpService', '$stateParams'];

    function ClientInfoCtrl($scope, $state, $timeout, toastr, httpService, $stateParams){
        var vm = $scope;
        vm.company = {}

        vm.save = function(){
            if(!vm.company.name){
                toastr.error("请输入客户名称")
                return
            }
            if(!vm.company.managerId){
                toastr.error("请选择客户经理")
                return
            }
            if(vm.company.id){
                httpService.updateCompany(vm.company, function(company){
                    toastr.success("更新信息客户成功")
                }, function(er){
                    toastr.error("新建客户信息失败，请稍后再试")
                })
            }else{
                if(!vm.company.adminUserName){
                    toastr.error("请输入管理员用户名")
                    return
                }
                if(!vm.company.adminPassword){
                    toastr.error("请输入管理员密码")
                    return
                }
                httpService.createCompany(vm.company, function(company){
                    toastr.success("新建客户成功")
                }, function(er){
                    toastr.error("新建客户失败，请稍后再试")
                })
            }
        }

        vm.app.ready(function(){
            if($stateParams.id){
                httpService.getCompanyById($stateParams.id, function(company){
                    vm.company = company
                    httpService.getRole_managers(function(managers){
                        vm.managers = managers
                        vm.company.managerId = vm.company.managerId +''
                    }, function(err){
                        console.log(err)
                    })
                }, function(err){
                    console.log(err)
                })
            }else{
                httpService.getRole_managers(function(managers){
                    vm.managers = managers
                }, function(err){
                    console.log(err)
                })
            }
        })



    }
})();
