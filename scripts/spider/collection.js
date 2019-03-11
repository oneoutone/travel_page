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
        .controller('collectionCtrl', collectionCtrl);
    collectionCtrl.$inject = ['$scope', 'httpService', '$state', 'toastr'];

    function collectionCtrl($scope, httpService, $state, toastr) {

        var vm = $scope
        vm.data = {type: '一次性交货', message: 0};

        vm.addRequest = function(){
            if(!vm.data.jobName){
                toastr.error('请填写任务名称')
                return
            }
            if(!vm.data.source){
                toastr.error('请填写数据源信息')
                return
            }
            if(!vm.data.companyMobile){
                toastr.error('请填写联系电话号码')
                return
            }
            console.log($('#messgae').val())
            httpService.addRequest(vm.data, function(){
                toastr.success('提交成功，跳转列表页')
                $state.go('app.dcs_index')
            }, function(e){
                toastr.error('提失败')
            })
        }
    }

})();