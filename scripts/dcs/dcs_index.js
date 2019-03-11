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
        .controller('requestListCtrl', requestListCtrl);
    requestListCtrl.$inject = ['$scope', 'httpService', '$state', 'toastr', '$stateParams'];

    function requestListCtrl($scope, httpService, $state, toastr, $stateParams) {

        var vm = $scope
        if($stateParams.page){
            vm.page = $stateParams.page
        }else{
            vm.page = 1
        }


        function fetchData(){
            var data = {page: vm.page, size: 10}
            httpService.getRequestList(data,function(result){
                console.log(result)
                vm.requests = result
            }, function(e){
                console.log(r)
            })

            httpService.getRequestCount(function(r){
                console.log(r)
                vm.bigTotalItems = r.count
                vm.bigCurrentPage = vm.page
            }, function(e){
                console.log(e)
            })
        }

        $scope.pageChanged = function() {
            if(vm.bigCurrentPage == vm.page){
                return
            }
            $state.go('app.dcs_index', {page: vm.bigCurrentPage})
        };

        vm.showDetail = function(item){
            vm.request = item
            if(item.email){
                vm.request.hasEmail = true
            }
            $('#myModal').modal('show')
        }
        vm.app.ready(function(){
            fetchData()
        })
    }

})();