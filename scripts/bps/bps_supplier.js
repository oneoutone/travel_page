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
        .controller('bpsSupplierCtrl', bpsSupplierCtrl);
    bpsSupplierCtrl.$inject = ['$scope', 'httpService', '$state', 'toastr'];

    function bpsSupplierCtrl($scope, httpService, $state, toastr) {
        var vm = $scope;

        vm.buyerClicked = function(){
            if(!vm.permissons.buyer){
                $state.go('app.bps_audit', {type: 'buyer'})
            }else if(vm.permissons.buyer.status == 'waiting'){
                return
            }else{
                vm.app.setting.bid_role = 'buyer'
                $state.go('app.bps_purchase')
            }
        }

        vm.supplierClicked = function(){
            if(!vm.permissons.supplier){
                $state.go('app.bps_audit', {type: 'supplier'})
            }else if(vm.permissons.supplier.status == 'waiting'){
                return
            }else{
                vm.app.setting.bid_role = 'supplier'
                $state.go('app.bps_supplier')
            }
        }

        vm.distributorClick = function(){
            if(!vm.permissons.distributor){
                $state.go('app.bps_audit', {type: 'distributor'})
            }else if(vm.permissons.buyer.status == 'waiting'){
                return
            }else{
                vm.app.setting.bid_role = 'distributor'
                $state.go('app.bps_distributor')
            }
        }

        vm.app.ready(function(){
            httpService.bidPermissions(function(r){
                console.log(r)
                vm.permissons = r
            }, function(e){
                console.log(e)
            })
        })
    }

})();