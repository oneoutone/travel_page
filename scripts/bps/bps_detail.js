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
        .controller('bpsDetailCtrl', bpsDetailCtrl);
    bpsDetailCtrl.$inject = ['$scope', 'httpService', '$state', 'toastr'];

    function bpsDetailCtrl($scope, httpService, $state, toastr) {
        var vm = $scope;

        vm.saveBidInfo = function(){
            if(!vm.bidInfo.keyWords){
                toastr.error('请输入行业关键词')
                return
            }
            httpService.upserBidsInfo(vm.bidInfo, function(bidInfo){
                toastr.success('更新优选信息成功')
            }, function(e){
                toastr.error('更新优选信息失败，请稍后再试')
            })
        }


        vm.app.ready(function() {
            httpService.getBidsInfo(function (r) {
                if (r.result) {
                    vm.bidInfo = r.result
                }
            }, function (err) {
                console.log(err)
            })
        })

    }

})();