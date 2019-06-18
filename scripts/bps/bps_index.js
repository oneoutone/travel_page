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
        .controller('bpsIndexCtrl', bpsIndexCtrl);
    bpsIndexCtrl.$inject = ['$scope', 'httpService', '$state', 'toastr'];

    function bpsIndexCtrl($scope, httpService, $state, toastr) {
        var vm = $scope;

        vm.buyerClicked = function(){
            if(!vm.permissons.buyer){
                $state.go('app.bps_audit', {type: 'buyer'})
            }else if(permissons.buyer.status == 'waiting'){
                return
            }else{
                $state.go('app.bps_purchase')
            }
        }

        vm.supplierClicker = function(){
            if(!vm.permissons.supplier){
                $state.go('app.bps_audit', {type: 'supplier'})
            }else if(permissons.supplier.status == 'waiting'){
                return
            }else{
                $state.go('app.bps_supplier')
            }
        }

        vm.distributorClick = function(){
            if(!vm.permissons.distributor){
                $state.go('app.bps_audit', {type: 'distributor'})
            }else if(permissons.buyer.status == 'waiting'){
                return
            }else{
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